'use client';
import API_BASE_URL from '@/config/api';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Lesson {
  id: number;
  title: string;
  videoUrl: string | null;
  pdfUrl: string | null;
  duration: number;
  previewEnabled: boolean;
  displayOrder: number;
}

interface Section {
  id: number;
  title: string;
  displayOrder: number;
  lessons: Lesson[];
}

interface CourseDetails {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  thumbnail: string;
  language: string;
  level: string;
  duration: string;
  category: { name: string };
  instructor: { name: string; bio: string; experience: string; profileImage: string };
  sections: Section[];
  enrolled?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

interface ReviewData {
  id: number;
  accountId: number;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const { user, token } = useAuth();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  
  // Preview video modal state
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Checkout modal states
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD'>('UPI');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Review states
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`${API_BASE_URL}/courses/${params.id}`, { headers })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && result.data) {
          setCourse(result.data);
          // Open first section by default
          if (result.data.sections && result.data.sections.length > 0) {
            setOpenSections({ [result.data.sections[0].id]: true });
          }
        }
      })
      .catch((err) => console.error('Failed to load course details', err))
      .finally(() => setLoading(false));
  }, [params.id, token]);

  // Load reviews separately (public)
  useEffect(() => {
    fetch(`${API_BASE_URL}/courses/${params.id}/reviews`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && Array.isArray(result.data)) {
          setReviews(result.data);
          // Pre-fill my review if already submitted
          if (user) {
            const mine = result.data.find((r: ReviewData) => r.studentName === user.fullName);
            if (mine) { setMyRating(mine.rating); setMyComment(mine.comment || ''); setReviewSuccess(true); }
          }
        }
      })
      .catch(() => {});
  }, [params.id, user]);

  // Load Razorpay Script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleEnrollSubmit = async () => {
    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      // 1. Create order on the backend
      const orderRes = await fetch(`${API_BASE_URL}/payments/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: course?.id })
      });
      const orderResult = await orderRes.json();

      if (orderResult.status !== 'SUCCESS' || !orderResult.data) {
        throw new Error(orderResult.message || 'Failed to create payment order.');
      }

      const { orderId, amount, currency, keyId, mockMode } = orderResult.data;

      // 2. Configure Razorpay checkout options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'YEDC Academy',
        description: `Enrollment for ${course?.title}`,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=60&h=60',
        order_id: orderId,
        handler: async function (response: any) {
          setCheckoutLoading(true);
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });
            const verifyResult = await verifyRes.json();

            if (verifyResult.status === 'SUCCESS') {
              setCheckoutSuccess(true);
              setTransactionId(response.razorpay_payment_id);
              setCourse((prev) => prev ? { ...prev, enrolled: true } : null);
            } else {
              setCheckoutError(verifyResult.message || 'Payment signature verification failed.');
            }
          } catch (err) {
            setCheckoutError('Connection to payment verification server failed.');
          } finally {
            setCheckoutLoading(false);
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#4f46e5'
        },
        modal: {
          ondismiss: function () {
            setCheckoutLoading(false);
          }
        }
      };

      // 3. Direct bypass for local mock key setups
      if (mockMode && (keyId === 'rzp_test_mockKeyId' || !(window as any).Razorpay)) {
        console.log('Mock Mode Direct Verification Bypass Active');
        const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            razorpayOrderId: orderId,
            razorpayPaymentId: 'pay_mock_' + Math.random().toString(36).substring(2, 15).toUpperCase(),
            razorpaySignature: 'mock_signature'
          })
        });
        const verifyResult = await verifyRes.json();

        if (verifyResult.status === 'SUCCESS') {
          setCheckoutSuccess(true);
          setTransactionId('pay_mock_direct');
          setCourse((prev) => prev ? { ...prev, enrolled: true } : null);
        } else {
          setCheckoutError(verifyResult.message || 'Mock verification bypass failed.');
        }
        setCheckoutLoading(false);
        return;
      }

      // Check if Razorpay SDK is loaded
      if (!(window as any).Razorpay) {
        throw new Error('Payment gateway failed to initialize. Please check your internet connection.');
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setCheckoutError(err.message || 'An error occurred during checkout.');
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">Course not found</h2>
        <p className="text-sm text-neutral-500 mb-6">The course you are looking for does not exist or has been archived.</p>
        <Link href="/courses" className="px-6 py-3 bg-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-all">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const toggleSection = (sectionId: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-neutral-200 relative overflow-hidden flex flex-col">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Global Header */}
      <header className="z-10 bg-neutral-950/60 backdrop-blur-md border-b border-neutral-900/60 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-base shadow-lg shadow-indigo-600/35">Y</span>
          YEDC Academy
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/courses" className="hover:text-white transition-colors">Explore Courses</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          {user && user.role === 'ADMIN' && (
            <Link href="/admin/courses" className="text-indigo-400 hover:text-indigo-350 transition-colors font-semibold">Admin Panel</Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/profile" className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/10">
              Dashboard ({user.fullName.split(' ')[0]})
            </Link>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-all">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Course Hero Banner */}
      <section className="z-10 bg-neutral-950/40 border-b border-neutral-900/80 py-12 px-6">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <span className="inline-flex items-center py-1 px-2.5 rounded text-[10px] font-bold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
              {course.category.name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {course.title}
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 font-medium">
              {course.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 font-semibold pt-2">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {course.duration} Duration
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                {course.level} Level
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 7.31 16.5 3 18" /></svg>
                {course.language} Audio
              </span>
              {(course.reviewCount ?? 0) > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  {'★'.repeat(Math.round(course.averageRating ?? 0))}{'☆'.repeat(5 - Math.round(course.averageRating ?? 0))}
                  <span className="text-neutral-400 text-[10px] font-bold ml-0.5">
                    {(course.averageRating ?? 0).toFixed(1)} ({course.reviewCount} reviews)
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className="md:col-span-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/40 text-center flex flex-col items-center">
            <div className="w-full aspect-video rounded-xl bg-neutral-950 overflow-hidden mb-5">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            </div>
            <div className="text-3xl font-extrabold text-white mb-2">₹{course.price}</div>
            <p className="text-xs text-neutral-500 mb-5 font-semibold">One-time payment • Lifetime access</p>
            {course.enrolled ? (
              <Link
                href={`/courses/${course.id}/learn`}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-green-600/25 border border-green-500/30 transition-all block text-center cursor-pointer font-sans"
              >
                Go to Course
              </Link>
            ) : user ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/25 border border-indigo-500/30 transition-all cursor-pointer font-sans"
              >
                Enroll Now
              </button>
            ) : (
              <Link
                href={`/login?redirect=/courses/${course.id}`}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/25 border border-indigo-500/30 transition-all block text-center font-sans"
              >
                Enroll Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Details Sections */}
      <section className="z-10 max-w-5xl w-full mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Core Info & Syllabus (left) */}
        <div className="md:col-span-2 space-y-10">
          {/* About */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">About this Course</h2>
            <p className="text-sm text-neutral-400 leading-relaxed font-medium">
              {course.description}
            </p>
          </div>

          {/* Curriculum */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Course Curriculum</h2>
            <p className="text-xs text-neutral-500 mb-6">Explore the sections and preview available lessons</p>

            <div className="space-y-3">
              {course.sections.map((section) => (
                <div key={section.id} className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/20">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-5 py-4 flex justify-between items-center bg-neutral-900/40 hover:bg-neutral-900/60 transition-colors text-left"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">
                        Section {section.displayOrder}
                      </span>
                      <h4 className="text-sm font-bold text-white">{section.title}</h4>
                    </div>
                    <svg
                      className={`w-5 h-5 text-neutral-500 transform transition-transform ${openSections[section.id] ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openSections[section.id] && (
                    <div className="border-t border-neutral-900/60 divide-y divide-neutral-900/60 bg-neutral-950/50">
                      {section.lessons.map((lesson) => (
                        <div key={lesson.id} className="px-5 py-3.5 flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            {lesson.previewEnabled ? (
                              <button
                                onClick={() => setPreviewVideoUrl(lesson.videoUrl)}
                                className="w-6 h-6 rounded-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 flex items-center justify-center cursor-pointer transition-colors"
                              >
                                <svg className="w-3 h-3 fill-indigo-400 pl-0.5" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </button>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-neutral-900 text-neutral-600 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-neutral-200">{lesson.title}</p>
                              <span className="text-[10px] text-neutral-500 font-medium">Duration: {formatDuration(lesson.duration)}</span>
                            </div>
                          </div>
                          {lesson.previewEnabled && (
                            <button
                              onClick={() => setPreviewVideoUrl(lesson.videoUrl)}
                              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Watch Preview
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructor panel (right) */}
        <div className="md:col-span-1">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 shadow-lg shadow-black/10">
            <h3 className="text-base font-bold text-white mb-4">Your Instructor</h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={course.instructor.profileImage}
                alt={course.instructor.name}
                className="w-14 h-14 rounded-full object-cover border border-neutral-800"
              />
              <div>
                <h4 className="font-bold text-white text-sm">{course.instructor.name}</h4>
                <p className="text-[10px] text-neutral-500 font-semibold">{course.instructor.experience}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
              {course.instructor.bio}
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="z-10 max-w-5xl w-full mx-auto px-6 pb-16">
        <div className="space-y-6">

          {/* Section header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">Student Reviews</h2>
              <p className="text-xs text-neutral-500 mt-0.5 font-semibold">
                {reviews.length > 0
                  ? `${reviews.length} review${reviews.length > 1 ? 's' : ''} · Avg ${
                      (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
                    } ★`
                  : 'Be the first to review this course'}
              </p>
            </div>
          </div>

          {/* Write a review — enrolled students only */}
          {course.enrolled && (
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-white">
                {reviewSuccess ? '✏️ Update Your Review' : '✍️ Write a Review'}
              </h3>

              {/* Star picker */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setMyRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                  >
                    <span className={(hoverRating || myRating) >= star ? 'text-yellow-400' : 'text-neutral-700'}>
                      ★
                    </span>
                  </button>
                ))}
                <span className="text-xs text-neutral-500 ml-2 font-semibold">
                  {myRating > 0 ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][myRating] : 'Tap to rate'}
                </span>
              </div>

              {/* Comment textarea */}
              <textarea
                rows={3}
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
                placeholder="Share your experience with this course..."
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500/60 resize-none transition-all"
              />

              {reviewError && (
                <p className="text-xs text-red-400 font-semibold">{reviewError}</p>
              )}

              <div className="flex gap-3">
                <button
                  disabled={reviewSubmitting || myRating === 0}
                  onClick={async () => {
                    if (!token || myRating === 0) return;
                    setReviewSubmitting(true);
                    setReviewError('');
                    try {
                      const res = await fetch(`${API_BASE_URL}/courses/${params.id}/reviews`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ rating: myRating, comment: myComment }),
                      });
                      const result = await res.json();
                      if (result.status === 'SUCCESS') {
                        setReviewSuccess(true);
                        const refreshed = await fetch(`${API_BASE_URL}/courses/${params.id}/reviews`);
                        const refreshedData = await refreshed.json();
                        if (refreshedData.status === 'SUCCESS') setReviews(refreshedData.data);
                      } else {
                        setReviewError(result.message || 'Failed to submit review.');
                      }
                    } catch {
                      setReviewError('Connection error. Please try again.');
                    } finally {
                      setReviewSubmitting(false);
                    }
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-indigo-600/20 border border-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                >
                  {reviewSubmitting ? (
                    <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" />
                  ) : reviewSuccess ? 'Update Review' : 'Submit Review'}
                </button>

                {reviewSuccess && (
                  <button
                    onClick={async () => {
                      if (!token) return;
                      try {
                        await fetch(`${API_BASE_URL}/courses/${params.id}/reviews/mine`, {
                          method: 'DELETE',
                          headers: { 'Authorization': `Bearer ${token}` },
                        });
                        setMyRating(0); setMyComment(''); setReviewSuccess(false);
                        const refreshed = await fetch(`${API_BASE_URL}/courses/${params.id}/reviews`);
                        const data = await refreshed.json();
                        if (data.status === 'SUCCESS') setReviews(data.data);
                      } catch { /* ignore */ }
                    }}
                    className="px-4 py-2.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Delete Review
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Reviews list */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-sm font-extrabold text-indigo-400">
                        {review.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{review.studentName}</p>
                        <p className="text-[10px] text-neutral-500 font-semibold">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= review.rating ? 'text-yellow-400 text-sm' : 'text-neutral-700 text-sm'}>★</span>
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-neutral-400 leading-relaxed font-medium">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500 font-semibold text-sm">
              No reviews yet. {course.enrolled ? 'Be the first to share your experience!' : 'Enroll to leave a review.'}
            </div>
          )}

        </div>
      </section>

      {/* Video Modal Overlay */}
      {previewVideoUrl && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">Lesson Preview</h3>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-neutral-500 hover:text-white transition-colors font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="aspect-video bg-black">
              {/* Using standard HTML5 video tag to play preview video */}
              <video
                src={previewVideoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-8 px-6 mt-auto">
        <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-neutral-600 font-medium">
            © 2026 Young Entrepreneur Development Centre. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-neutral-500 font-semibold">
            <Link href="/about" className="hover:text-neutral-400 transition-colors">Philosophy</Link>
            <Link href="/contact" className="hover:text-neutral-400 transition-colors">Support</Link>
          </div>
        </div>
      </footer>

      {/* Checkout Modal Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative p-6 space-y-6">
            {!checkoutSuccess ? (
              <>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1.5 font-sans">Review Checkout</h3>
                  <p className="text-xs text-neutral-400 font-medium">Unlock lifetime access to this entrepreneurship masterclass.</p>
                </div>

                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900/60 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-white leading-snug">{course.title}</p>
                      <p className="text-xs text-neutral-500 mt-1 font-semibold">By {course.instructor.name}</p>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 py-0.5 px-2 rounded">
                      {course.level}
                    </span>
                  </div>
                  <div className="border-t border-neutral-900 pt-3 flex justify-between items-center text-sm font-bold text-white">
                    <span>Total Amount</span>
                    <span>₹{course.price}</span>
                  </div>
                </div>

                {checkoutError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2.5 px-3 rounded-lg font-medium">
                    {checkoutError}
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Select Mock Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-3.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        paymentMethod === 'UPI'
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      📱 Mock UPI
                    </button>
                    <button
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-3.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        paymentMethod === 'CARD'
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      💳 Mock Card
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setShowCheckout(false); setCheckoutError(''); }}
                    disabled={checkoutLoading}
                    className="flex-1 py-3 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEnrollSubmit}
                    disabled={checkoutLoading}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-md shadow-indigo-600/25 border border-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Pay & Enroll'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-green-400 text-3xl shadow-xl shadow-green-500/5">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 font-sans">Payment Successful!</h3>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto font-medium leading-relaxed">
                    You have successfully enrolled in <strong className="text-neutral-200">{course.title}</strong>.
                  </p>
                </div>

                <div className="w-full bg-neutral-950 border border-neutral-900 rounded-xl p-4 space-y-2 text-[10px] font-medium text-neutral-500 text-left">
                  <div className="flex justify-between">
                    <span>Receipt No:</span>
                    <span className="font-semibold text-neutral-300">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-semibold text-neutral-300">₹{course.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Status:</span>
                    <span className="font-semibold text-green-400 uppercase">UNLOCKED</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowCheckout(false);
                    setCheckoutSuccess(false);
                    window.location.href = `/courses/${course.id}/learn`;
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer border border-indigo-500/30 text-center block shadow-lg shadow-indigo-600/20"
                >
                  Start Learning Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
