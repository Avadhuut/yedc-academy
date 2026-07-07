'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, token, logout, updateUser } = useAuth();
  const router = useRouter();

  // Profile fields state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password fields state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  // Check auth
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setProfileImage(user.profileImage || '');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setProfileLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phone, profileImage: profileImage || null }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile.');
      }

      updateUser(result.data);
      setProfileMessage('Profile updated successfully!');
    } catch (err: any) {
      setProfileError(err.message || 'An error occurred while updating profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');
    setPasswordLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update password.');
      }

      setPasswordMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'An error occurred while changing password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-neutral-200 relative overflow-hidden flex flex-col">
      {/* Decorative blurred blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="z-10 bg-neutral-950/80 backdrop-blur border-b border-neutral-900/80 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-base shadow-lg shadow-indigo-600/35">Y</span>
          YEDC Academy
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{user.fullName}</p>
            <p className="text-xs text-neutral-500">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8 z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <aside className="md:col-span-1 space-y-2">
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 mb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 mx-auto flex items-center justify-center text-xl font-bold text-white shadow-md shadow-indigo-600/10 mb-3">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-semibold text-white text-sm">{user.fullName}</h3>
            <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
              {user.role}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Edit Profile
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
              activeTab === 'password'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-9 4a2 2 0 012-2m-2 4h.01M17 21a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2z" />
            </svg>
            Change Password
          </button>
        </aside>

        {/* Tab content panel */}
        <section className="md:col-span-3">
          <div className="bg-neutral-900/40 backdrop-blur border border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/35">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Account Settings</h2>
                <p className="text-xs text-neutral-500 mb-6">Manage your public information and profile attributes</p>

                {profileMessage && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs py-3 px-4 rounded-lg mb-6">
                    {profileMessage}
                  </div>
                )}
                {profileError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-lg mb-6">
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Email (Static)</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 rounded-lg bg-neutral-950/40 border border-neutral-900 text-neutral-500 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 99999 99999"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Profile Image URL</label>
                    <input
                      type="text"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="py-3 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {profileLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Security</h2>
                <p className="text-xs text-neutral-500 mb-6">Update your account credentials</p>

                {passwordMessage && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs py-3 px-4 rounded-lg mb-6">
                    {passwordMessage}
                  </div>
                )}
                {passwordError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-lg mb-6">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Current Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="py-3 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
