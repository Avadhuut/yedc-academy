"use client";
import API_BASE_URL from "@/config/api";
import React, { useEffect, useState } from "react";
import { getBlueprintDetails } from "@/utils/blueprint";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import {
  Clock,
  Shield,
  Star,
  Users,
  CheckCircle,
  Lock,
  Play,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  AlertTriangle,
  Award,
  Coins,
  Percent,
  Calendar,
  Layers,
  FileText,
  FileSpreadsheet,
  MapPin,
  HelpCircle,
} from "lucide-react";

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

// getBlueprintDetails helper is imported from "@/utils/blueprint"

const DEFAULT_COURSES_MAP: Record<number, CourseDetails> = {
  1: {
    id: 1,
    title: "Café Startup & Operations Masterclass",
    subtitle: "Master commercial espresso bars, menu planning, equipment sizing, and layout configuration.",
    description: "Learn how to launch and scale a profitable cafe business in India. This program covers commercial espresso machine selection, raw bean procurement, pricing formulas, interior layout planning, staff SOPs, and marketing strategies.",
    price: 2999,
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    language: "English / Hindi",
    level: "BEGINNER",
    duration: "6 Weeks",
    category: { name: "Cafe" },
    instructor: { name: "Dr. Anirudh Sharma", bio: "15+ years experience in scaling F&B ventures across India.", experience: "15+ Years", profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80" },
    sections: [
      {
        id: 101,
        title: "Module 1: Concept Validation & Capital Sizing",
        displayOrder: 1,
        lessons: [
          { id: 1001, title: "Market Sizing & Customer Demographics", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", pdfUrl: null, duration: 15, previewEnabled: true, displayOrder: 1 },
          { id: 1002, title: "Menu Engineering & Cost Per Cup Calculation", videoUrl: null, pdfUrl: null, duration: 20, previewEnabled: false, displayOrder: 2 }
        ]
      },
      {
        id: 102,
        title: "Module 2: Machinery Procurement & Vendor Contracting",
        displayOrder: 2,
        lessons: [
          { id: 1003, title: "Selecting Espresso Machines & Grinders", videoUrl: null, pdfUrl: null, duration: 25, previewEnabled: false, displayOrder: 1 }
        ]
      }
    ]
  },
  2: {
    id: 2,
    title: "Commercial Bakery & Pastry Venture",
    subtitle: "Learn commercial deck oven setup, bulk baking ingredient sourcing, and cake packaging.",
    description: "Step-by-step masterclass to launch an artisanal bakery or commercial pastry kitchen. Covers oven selection, batch costing, recipe scaling, shelf-life extension, packaging design, and distributor partnerships.",
    price: 3499,
    thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    language: "English / Hindi",
    level: "INTERMEDIATE",
    duration: "4 Weeks",
    category: { name: "Bakery" },
    instructor: { name: "Sneha Iyer", bio: "Founder of The Crumb Factory, scaling commercial bakery brands.", experience: "10+ Years", profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" },
    sections: [
      {
        id: 201,
        title: "Module 1: Commercial Baking Equipment & Kitchen Layout",
        displayOrder: 1,
        lessons: [
          { id: 2001, title: "Selecting Deck Ovens & Spiral Mixers", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", pdfUrl: null, duration: 18, previewEnabled: true, displayOrder: 1 }
        ]
      }
    ]
  },
  3: {
    id: 3,
    title: "Restaurant & QSR Business Model",
    subtitle: "Build scalable fast-casual & fine-dine restaurant models with low food-waste SOPs.",
    description: "Comprehensive training on setting up Quick Service Restaurants (QSR) or casual dining venues. Learn inventory management, POS integrations, staff recruitment, FSSAI compliance, and food cost control.",
    price: 3999,
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    language: "English / Hindi",
    level: "ADVANCED",
    duration: "8 Weeks",
    category: { name: "Restaurant" },
    instructor: { name: "Dr. Anirudh Sharma", bio: "F&B Strategist & Restaurant Advisor.", experience: "15+ Years", profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80" },
    sections: [
      {
        id: 301,
        title: "Module 1: Kitchen Operations & Food Waste Reduction",
        displayOrder: 1,
        lessons: [
          { id: 3001, title: "Standard Operating Procedures for Kitchen Staff", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", pdfUrl: null, duration: 22, previewEnabled: true, displayOrder: 1 }
        ]
      }
    ]
  },
  4: {
    id: 4,
    title: "Packaged Snacks & Namkeen Business",
    subtitle: "Setup commercial frying, roasting, nitrogen pouch packaging, and distributor channels.",
    description: "Everything you need to launch a packaged snacks brand. Learn batch recipe formulation, nitrogen flush packaging machinery, distributor margin structuring, and retail placement.",
    price: 2499,
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    language: "English / Hindi",
    level: "BEGINNER",
    duration: "3 Weeks",
    category: { name: "Snacks Business" },
    instructor: { name: "Priya Nair", bio: "Growth marketing & FMCG retail specialist.", experience: "12+ Years", profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" },
    sections: [
      {
        id: 401,
        title: "Module 1: Packaging Machinery & Distributor Setup",
        displayOrder: 1,
        lessons: [
          { id: 4001, title: "Selecting Nitrogen Pouch Packaging Machines", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", pdfUrl: null, duration: 16, previewEnabled: true, displayOrder: 1 }
        ]
      }
    ]
  },
  5: {
    id: 5,
    title: "Cloud Kitchen & Delivery Brand Scale",
    subtitle: "Low-overhead multi-brand delivery kitchen setup, Zomato/Swiggy algorithm optimization.",
    description: "Launch a delivery-only cloud kitchen brand with low capital overhead. Master aggregator algorithm rankings, packaging heat retention, dark kitchen space optimization, and virtual brand creation.",
    price: 2799,
    thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
    language: "English / Hindi",
    level: "INTERMEDIATE",
    duration: "3 Weeks",
    category: { name: "Cloud Kitchen" },
    instructor: { name: "Priya Nair", bio: "VP Growth Marketing.", experience: "12+ Years", profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" },
    sections: [
      {
        id: 501,
        title: "Module 1: Swiggy & Zomato Ranking Framework",
        displayOrder: 1,
        lessons: [
          { id: 5001, title: "Optimizing Delivery Radius & Ad Bidding", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", pdfUrl: null, duration: 20, previewEnabled: true, displayOrder: 1 }
        ]
      }
    ]
  },
  6: {
    id: 6,
    title: "Food Processing & Sauce Manufacturing",
    subtitle: "Commercial recipe scaling, shelf-life stabilization, industrial mixers, and FSSAI licensing.",
    description: "Scale from small batches to commercial food processing production. Master pH stabilization, thermal pasteurization, industrial mixers, state/central FSSAI licensing, and bulk B2B distribution.",
    price: 3999,
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    language: "English / Hindi",
    level: "ADVANCED",
    duration: "8 Weeks",
    category: { name: "Food Processing" },
    instructor: { name: "Dr. Anirudh Sharma", bio: "Food Processing & Quality Compliance Expert.", experience: "15+ Years", profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80" },
    sections: [
      {
        id: 601,
        title: "Module 1: Industrial Machinery & Shelf Life Extension",
        displayOrder: 1,
        lessons: [
          { id: 6001, title: "Pasteurization & Preservative Calculations", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", pdfUrl: null, duration: 25, previewEnabled: true, displayOrder: 1 }
        ]
      }
    ]
  },
  7: {
    id: 7,
    title: "Dry Fruits Processing & Export Packaging",
    subtitle: "Sourcing premium nuts, vacuum sealing, gift packaging, and B2B wholesale distribution.",
    description: "Build a premium dry fruits roasting, grading, and packaging venture. Learn direct farm/importer sourcing, vacuum pouch sealing, festival gift box customization, and wholesale margin structure.",
    price: 3199,
    thumbnail: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80",
    language: "English / Hindi",
    level: "INTERMEDIATE",
    duration: "4 Weeks",
    category: { name: "Dry Fruits" },
    instructor: { name: "Aditya Roy", bio: "Supply chain & trading operator.", experience: "8+ Years", profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" },
    sections: [
      {
        id: 701,
        title: "Module 1: Sourcing & Vacuum Packaging",
        displayOrder: 1,
        lessons: [
          { id: 7001, title: "Grading Almonds, Cashews & Walnuts", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", pdfUrl: null, duration: 15, previewEnabled: true, displayOrder: 1 }
        ]
      }
    ]
  },
  8: {
    id: 8,
    title: "Digital Marketing & Client Acquisition",
    subtitle: "Customer acquisition funnels, local Google My Business SEO, and high-ticket client retainers.",
    description: "Launch a digital marketing agency specialized in acquiring retail & food business clients. Covers Meta ad setup, local SEO campaigns, client pitch decks, retainer contracts, and agency scaling.",
    price: 1999,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    language: "English / Hindi",
    level: "BEGINNER",
    duration: "2 Weeks",
    category: { name: "Digital Marketing" },
    instructor: { name: "Priya Nair", bio: "Former VP Growth Marketing.", experience: "12+ Years", profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" },
    sections: [
      {
        id: 801,
        title: "Module 1: Meta Ads & Local Client Acquisition",
        displayOrder: 1,
        lessons: [
          { id: 8001, title: "High-Converting Ad Campaigns for Local Businesses", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", pdfUrl: null, duration: 18, previewEnabled: true, displayOrder: 1 }
        ]
      }
    ]
  }
};

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const { user, token } = useAuth();
  const router = useRouter();

  const fallbackCourse = DEFAULT_COURSES_MAP[Number(params.id)] || DEFAULT_COURSES_MAP[1];
  const [course, setCourse] = useState<CourseDetails | null>(fallbackCourse);
  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>(() => {
    if (fallbackCourse.sections && fallbackCourse.sections.length > 0) {
      return { [fallbackCourse.sections[0].id]: true };
    }
    return {};
  });

  // Preview video modal state
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Checkout modal states
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Interactive Mock Payment Gateway Modal States
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockPaymentMethod, setMockPaymentMethod] = useState("UPI");
  const [currentOrderData, setCurrentOrderData] = useState<{ orderId: string; amount: number } | null>(null);
  const [mockVerifying, setMockVerifying] = useState(false);
  const [mockModalError, setMockModalError] = useState("");

  // Review states
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    fetch(`${API_BASE_URL}/courses/${params.id}`, { headers, signal: controller.signal })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "SUCCESS" && result.data) {
          setCourse(result.data);
          if (result.data.sections && result.data.sections.length > 0) {
            setOpenSections({ [result.data.sections[0].id]: true });
          }
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeoutId));
  }, [params.id, token]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/courses/${params.id}/reviews`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "SUCCESS" && Array.isArray(result.data)) {
          setReviews(result.data);
          if (user) {
            const mine = result.data.find((r: ReviewData) => r.studentName === user.fullName);
            if (mine) {
              setMyRating(mine.rating);
              setMyComment(mine.comment || "");
              setReviewSuccess(true);
            }
          }
        }
      })
      .catch(() => {});
  }, [params.id, user]);

  const toggleSection = (sectionId: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleEnrollSubmit = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");
    setCheckoutSuccess(false);

    try {
      // 1. Create order on the backend
      const orderRes = await fetch(`${API_BASE_URL}/payments/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: course?.id })
      });
      const orderResult = await orderRes.json();

      if (orderResult.status !== "SUCCESS" || !orderResult.data) {
        throw new Error(orderResult.message || "Failed to create payment order.");
      }

      const { orderId, amount, currency, keyId, mockMode } = orderResult.data;

      // 2. Open interactive Mock Payment Gateway Modal if in mock mode or Razorpay is missing
      if (mockMode || keyId === "rzp_test_mockKeyId" || !(window as any).Razorpay) {
        setCurrentOrderData({ orderId, amount: amount / 100 });
        setMockModalError("");
        setShowMockModal(true);
        setCheckoutLoading(false);
        return;
      }

      // 3. Configure Razorpay options for live gateway
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "YEDC Academy",
        description: `Enrollment for ${course?.title}`,
        image: "/logo.png",
        order_id: orderId,
        handler: async function (response: any) {
          setCheckoutLoading(true);
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });
            const verifyResult = await verifyRes.json();

            if (verifyResult.status === "SUCCESS") {
              setCheckoutSuccess(true);
              setTransactionId(response.razorpay_payment_id);
              setCourse((prev) => prev ? { ...prev, enrolled: true } : null);
            } else {
              setCheckoutError(verifyResult.message || "Payment signature verification failed.");
            }
          } catch (err) {
            setCheckoutError("Connection to payment verification server failed.");
          } finally {
            setCheckoutLoading(false);
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || ""
        },
        theme: {
          color: "#855B00"
        },
        modal: {
          ondismiss: function () {
            setCheckoutLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setCheckoutError(err.message || "An error occurred during checkout.");
      setCheckoutLoading(false);
    }
  };

  const handleCompleteMockPayment = async () => {
    if (!currentOrderData) return;
    setMockVerifying(true);
    setMockModalError("");

    try {
      const mockPaymentId = "pay_mock_" + Math.random().toString(36).substring(2, 15).toUpperCase();
      const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpayOrderId: currentOrderData.orderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: "mock_signature"
        })
      });
      const verifyResult = await verifyRes.json();

      if (verifyResult.status === "SUCCESS") {
        setCheckoutSuccess(true);
        setTransactionId(mockPaymentId);
        setCourse((prev) => prev ? { ...prev, enrolled: true } : null);
        setShowMockModal(false);
      } else {
        setMockModalError(verifyResult.message || "Mock payment verification failed.");
      }
    } catch (err) {
      setMockModalError("Failed to connect to verification server.");
    } finally {
      setMockVerifying(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (myRating === 0) {
      setReviewError("Please choose a rating score.");
      return;
    }
    setReviewSubmitting(true);
    setReviewError("");

    try {
      const res = await fetch(`${API_BASE_URL}/courses/${params.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating: myRating, comment: myComment })
      });
      const result = await res.json();
      if (result.status === "SUCCESS") {
        setReviewSuccess(true);
        // Add locally
        const newReview: ReviewData = {
          id: Date.now(),
          accountId: user?.id || 0,
          studentName: user?.fullName || "You",
          rating: myRating,
          comment: myComment,
          createdAt: new Date().toISOString()
        };
        setReviews((prev) => [newReview, ...prev.filter((r) => r.studentName !== user?.fullName)]);
      } else {
        setReviewError(result.message || "Failed to submit review.");
      }
    } catch (err) {
      setReviewError("Connection failure while submitting review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col font-sans pt-24">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-background flex flex-col font-sans pt-24">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-gold animate-bounce" />
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">Blueprint Not Found</h2>
          <Link href="/courses">
            <PrimaryButton>Back to Catalog</PrimaryButton>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const bp = getBlueprintDetails(course.title);

  return (
    <main className="min-h-screen bg-background text-[#0F172A] flex flex-col font-sans pt-16">
      <Navbar />

      {/* Course Hero Banner */}
      <section className="relative bg-white border-b border-[#E5E7EB] pt-6 pb-8 md:pt-8 md:pb-10 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gold-ambient pointer-events-none" />
        <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-8 space-y-5 text-left">
            {course.enrolled && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[18px] p-3.5 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold shadow-xs animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>🎉 You own this business program! You have full lifetime access.</span>
                </div>
                <Link href={`/courses/${course.id}/learn`} className="shrink-0 w-full sm:w-auto">
                  <PrimaryButton className="h-9 px-4 text-xs font-black w-full">Start Learning Blueprint ▶</PrimaryButton>
                </Link>
              </div>
            )}

            <span className="inline-flex items-center py-1.5 px-3.5 rounded-full text-[10px] font-extrabold bg-gold/10 text-gold border border-gold/20 uppercase tracking-widest font-heading">
              {course.category.name.replace("Course", "Business")}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] leading-tight font-heading">
              {bp.blueprintTitle}
            </h1>
            <p className="text-base text-slate-600 font-semibold max-w-xl">
              {course.subtitle}
            </p>

            {/* Metrics quick view */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-semibold text-[#334155]">
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-[16px] hover:border-gold/30 hover:bg-white hover:shadow-premium-hover hover:-translate-y-0.5 transition-premium">
                <Coins className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Capital</p>
                  <p className="font-bold text-[#0F172A]">{bp.investment}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-[16px] hover:border-gold/30 hover:bg-white hover:shadow-premium-hover hover:-translate-y-0.5 transition-premium">
                <Percent className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Profit Margin</p>
                  <p className="font-bold text-[#0F172A]">{bp.margin}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-[16px] hover:border-gold/30 hover:bg-white hover:shadow-premium-hover hover:-translate-y-0.5 transition-premium">
                <Calendar className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Launch Time</p>
                  <p className="font-bold text-[#0F172A]">{bp.launchTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-[16px] hover:border-gold/30 hover:bg-white hover:shadow-premium-hover hover:-translate-y-0.5 transition-premium">
                <Clock className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Duration</p>
                  <p className="font-bold text-[#0F172A]">{course.duration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky pricing card */}
          <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm hover:shadow-premium-hover hover:border-gold/25 transition-premium flex flex-col items-center">
            <div className="w-full aspect-video rounded-[24px] bg-slate-100 overflow-hidden mb-4 border border-slate-200 relative">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            </div>

            {/* Error or Success Notice Banners */}
            {checkoutSuccess && (
              <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3.5 rounded-[16px] mb-4 font-bold text-center animate-fade-in-up">
                🎉 Enrollment Successful! You now have full access to this blueprint.
              </div>
            )}

            {checkoutError && (
              <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-[16px] mb-4 font-bold text-center flex items-center justify-between gap-2 animate-fade-in-up">
                <span className="flex-1 text-left">{checkoutError}</span>
                <button onClick={() => setCheckoutError("")} className="text-red-400 hover:text-red-600 font-black cursor-pointer">✕</button>
              </div>
            )}
            <div className="text-3xl font-extrabold text-[#0F172A] mb-1">
              {course.enrolled ? "Unlocked" : `₹${course.price}`}
            </div>
            <p className="text-xs text-slate-500 mb-5 font-semibold">
              {course.enrolled ? "Lifetime Access Active" : "One-time payment • Lifetime access"}
            </p>
            {course.enrolled ? (
              <Link href={`/courses/${course.id}/learn`} className="w-full">
                <PrimaryButton className="w-full font-black shadow-md">Start Learning Blueprint ▶</PrimaryButton>
              </Link>
            ) : user ? (
              <PrimaryButton onClick={handleEnrollSubmit} loading={checkoutLoading} className="w-full">
                Enroll Now
              </PrimaryButton>
            ) : (
              <Link href={`/login?redirect=/courses/${course.id}`} className="w-full">
                <PrimaryButton className="w-full">Enroll Now</PrimaryButton>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Details Sections */}
      <section className="max-w-screen-xl w-full mx-auto px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 flex-1">
        
        {/* Core Info & Syllabus (left) */}
        <div className="lg:col-span-8 space-y-[80px]">
          
          {/* Business Overview parameters */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-[#0F172A] font-heading">Business Program Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 border border-slate-100 bg-white rounded-[24px] shadow-sm space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Required Equipment</h4>
                <ul className="text-xs text-slate-500 font-semibold space-y-1.5 list-disc pl-4">
                  {bp.equipment.map((eq, idx) => (
                    <li key={idx}>{eq}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 border border-slate-100 bg-white rounded-[24px] shadow-sm space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Required Licenses</h4>
                <ul className="text-xs text-slate-500 font-semibold space-y-1.5 list-disc pl-4">
                  {bp.licenses.map((lic, idx) => (
                    <li key={idx}>{lic}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-5 border border-slate-100 bg-white rounded-[24px] shadow-sm">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Vendor & Supply Chain Support</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                {bp.support} Every entrepreneur gains access to our pre-vetted contractor lists for fabrication, packaging, and raw ingredients.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-[#0F172A] font-heading">Program Details</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-semibold">
              {course.description}
            </p>
          </div>

          {/* Course Curriculum (Sections & Lessons) */}
          {course.sections && course.sections.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] font-heading">Course Curriculum & Modules</h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {course.sections.length} {course.sections.length === 1 ? "Module" : "Modules"} • {course.sections.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0)} Lessons
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allOpen = course.sections.every(sec => openSections[sec.id]);
                    const nextState: Record<number, boolean> = {};
                    course.sections.forEach(sec => {
                      nextState[sec.id] = !allOpen;
                    });
                    setOpenSections(nextState);
                  }}
                  className="text-xs font-bold text-gold hover:text-gold-light transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  {course.sections.every(sec => openSections[sec.id]) ? "Collapse All Modules" : "Expand All Modules"}
                </button>
              </div>

              <div className="space-y-4">
                {course.sections.map((section, secIdx) => {
                  const isOpen = !!openSections[section.id];
                  return (
                    <div
                      key={section.id}
                      className="bg-white border border-[#E5E7EB] rounded-[24px] overflow-hidden shadow-sm transition-all duration-200"
                    >
                      {/* Section Header Accordion */}
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSections((prev) => ({
                            ...prev,
                            [section.id]: !prev[section.id],
                          }))
                        }
                        className="w-full p-5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 text-left transition-colors cursor-pointer border-b border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 text-gold flex items-center justify-center text-xs font-black shrink-0 font-heading">
                            {secIdx + 1}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-[#0F172A] font-heading">
                              {section.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                              {section.lessons?.length || 0} {(section.lessons?.length || 0) === 1 ? "Lesson" : "Lessons"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Section Lessons List */}
                      {isOpen && section.lessons && (
                        <div className="divide-y divide-slate-100">
                          {section.lessons.map((lesson, lesIdx) => (
                            <div
                              key={lesson.id}
                              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors gap-4"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                {lesson.previewEnabled ? (
                                  <Play className="w-4 h-4 text-gold shrink-0" />
                                ) : course.enrolled ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-[#0F172A] truncate">
                                    {lesIdx + 1}. {lesson.title}
                                  </h4>
                                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mt-1">
                                    {lesson.duration > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-gold" /> {lesson.duration} mins
                                      </span>
                                    )}
                                    {lesson.pdfUrl && (
                                      <span className="flex items-center gap-1 text-slate-500">
                                        <FileText className="w-3 h-3 text-gold" /> PDF Included
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Lesson Action (Preview or Learn) */}
                              <div className="shrink-0">
                                {lesson.previewEnabled && lesson.videoUrl ? (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewVideoUrl(lesson.videoUrl)}
                                    className="py-1.5 px-3.5 rounded-full text-[10px] font-black bg-gold/10 text-gold hover:bg-gold hover:text-white border border-gold/20 transition-all flex items-center gap-1 cursor-pointer font-heading"
                                  >
                                    <Play className="w-3 h-3 fill-current" /> Preview Video
                                  </button>
                                ) : course.enrolled ? (
                                  <Link
                                    href={`/courses/${course.id}/learn`}
                                    className="py-1.5 px-3.5 rounded-full text-[10px] font-black bg-slate-100 text-[#0F172A] hover:bg-slate-200 transition-colors block font-heading"
                                  >
                                    Watch Lesson
                                  </Link>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 font-heading">
                                    <Lock className="w-3 h-3" /> Locked
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}



          {/* Success Story block */}
          <div className="bg-slate-50 border border-[#E5E7EB] p-8 rounded-[24px] space-y-6">
            <h3 className="text-base font-black text-[#0F172A] font-heading uppercase tracking-wide">Featured YEDC Success Case</h3>
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
              <span className="px-3 py-1 rounded-[16px] bg-red-100 text-red-700 border border-red-200">
                Before: {bp.story.before}
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1 rounded-[16px] bg-green-100 text-green-700 border border-green-200">
                After: {bp.story.after}
              </span>
            </div>
            <p className="text-xs italic text-slate-600 leading-relaxed font-semibold">
              "{bp.story.text}"
            </p>
            <div className="flex justify-between items-center border-t border-slate-200/60 pt-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full relative overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                  <img src={bp.story.image} alt={bp.story.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0F172A]">{bp.story.name}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{bp.story.business}</p>
                  <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-0.5 mt-0.5"><MapPin className="w-2.5 h-2.5" /> {bp.story.location}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Revenue</span>
                <span className="text-xs font-black text-green-600 block">{bp.story.revenue}</span>
              </div>
            </div>
          </div>

          {/* Certificate Mockup */}
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 space-y-4">
            <h3 className="text-base font-black text-[#0F172A] font-heading">Earn Your Completion Certificate</h3>
            <p className="text-xs text-slate-500 font-semibold">
              Pass the module audits to claim your landscape certificate. This serves as a credential for partners & vendors.
            </p>
            <div className="aspect-[16/10] max-w-lg mx-auto bg-slate-100 rounded-[24px] overflow-hidden border border-slate-200 relative p-2 shadow-inner">
              <img 
                src="/certificate_mockup.png" 
                alt="Completion Certificate Mockup" 
                className="w-full h-full object-cover rounded-[16px] shadow-md border border-slate-200/80" 
              />
            </div>
          </div>

          {/* Reviews section */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-[#0F172A] font-heading">Entrepreneur Reviews</h2>

            {/* Leave a review form (Enrolled only) */}
            {course.enrolled && (
              <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A] font-heading">Share Your Feedback</h3>
                {reviewSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs py-2 px-3 rounded-[16px] font-bold">
                    Feedback saved successfully!
                  </div>
                )}
                {reviewError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs py-2 px-3 rounded-[16px] font-bold">
                    {reviewError}
                  </div>
                )}
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-2">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => { setMyRating(star); setReviewSuccess(false); }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-lg focus:outline-none transition-colors"
                      >
                        <span className={(hoverRating || myRating) >= star ? "text-gold" : "text-slate-200"}>★</span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={myComment}
                    onChange={(e) => { setMyComment(e.target.value); setReviewSuccess(false); }}
                    placeholder="Describe your launch experience and training quality..."
                    className="w-full p-4 rounded-[16px] bg-slate-50 border border-slate-200 hover:border-gold/30 focus:border-gold text-[#0F172A] placeholder-slate-400 text-xs focus:outline-none transition-all duration-200 resize-none font-medium"
                  />
                  <PrimaryButton type="submit" loading={reviewSubmitting} className="h-10 text-xs px-5">
                    Submit Review
                  </PrimaryButton>
                </form>
              </div>
            )}

            {/* List reviews */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black text-[#0F172A]">{rev.studentName}</h4>
                        <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 block">Verified Graduate</span>
                      </div>
                      <div className="flex gap-0.5 text-xs text-gold">
                        {"★".repeat(rev.rating) + "☆".repeat(5 - rev.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">No reviews submitted yet for this launch blueprint.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info (right) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mentor Profile details */}
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] overflow-hidden relative bg-slate-200 border border-slate-300">
                <img src={course.instructor.profileImage} alt={course.instructor.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0F172A] leading-snug">{course.instructor.name}</h4>
                <p className="text-[9px] text-gold font-extrabold uppercase tracking-wider mt-0.5">{course.instructor.experience}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              {course.instructor.bio}
            </p>
          </div>
        </div>
      </section>

      {/* Preview video modal overlay */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 rounded-[24px] max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-[#0F172A] p-2 hover:bg-slate-50 rounded-xl cursor-pointer"
            >
              Close ✕
            </button>
            <h3 className="text-base font-black text-[#0F172A] mb-4 font-heading">Module Lesson Preview</h3>
            <div className="aspect-video w-full rounded-[16px] overflow-hidden bg-black border border-slate-200 relative select-none" onContextMenu={(e) => e.preventDefault()}>
              <div className="absolute top-3 right-3 pointer-events-none z-10 bg-[#0F172A]/70 backdrop-blur-xs text-white/70 text-[10px] font-mono px-2.5 py-1 rounded-md border border-white/10">
                🔒 Protected • YEDC Academy
              </div>
              <video
                src={previewVideoUrl || "/videos/sample.mp4"}
                controls
                autoPlay
                playsInline
                preload="metadata"
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onError={(e) => {
                  const videoEl = e.currentTarget;
                  if (!videoEl.dataset.fallbackTried) {
                    videoEl.dataset.fallbackTried = "true";
                    videoEl.src = "/videos/sample.mp4";
                    videoEl.load();
                    videoEl.play().catch(() => {});
                  }
                }}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Mock Payment Gateway Modal */}
      {showMockModal && currentOrderData && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[28px] max-w-md w-full p-6 shadow-2xl space-y-5 relative animate-fade-in-up">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-[#0F172A]">Mock Payment Gateway</h3>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    TEST ENVIRONMENT ACTIVE
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowMockModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Error inside modal */}
            {mockModalError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-[12px] font-bold">
                {mockModalError}
              </div>
            )}

            {/* Order Details summary */}
            <div className="bg-slate-50 border border-slate-100 rounded-[18px] p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-semibold">Program:</span>
                <span className="font-bold text-[#0F172A] truncate max-w-[200px]">{course.title}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-semibold">Order ID:</span>
                <span className="font-mono text-[11px] font-bold text-slate-700">{currentOrderData.orderId}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-600 font-bold">Amount Payable:</span>
                <span className="text-base font-black text-[#0F172A]">₹{currentOrderData.amount}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600">Select Mock Payment Method:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "UPI", label: "UPI Instant" },
                  { id: "CARD", label: "Test Card" },
                  { id: "NETBANKING", label: "NetBanking" }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setMockPaymentMethod(pm.id)}
                    className={`py-2 px-3 rounded-[12px] text-xs font-bold border transition-all cursor-pointer ${
                      mockPaymentMethod === pm.id
                        ? "bg-gold text-[#0F172A] border-transparent shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pay Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCompleteMockPayment}
                disabled={mockVerifying}
                className="w-full h-12 rounded-full bg-gold hover:bg-gold-light text-[#0F172A] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {mockVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin" />
                    <span>Verifying Payment...</span>
                  </>
                ) : (
                  <span>Pay ₹{currentOrderData.amount} (Complete Test Payment)</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
