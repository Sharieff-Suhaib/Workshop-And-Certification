'use client';

import { useAuthStore } from '../../../lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';

export default function DashboardPage() {
  const { user, logout, token } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create mock user if no user exists
  const currentUser = user || {
    id: 'mock-user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'USER',
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, {currentUser.name}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to explore workshops and earn certificates?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Registered</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Attended</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Certificates</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
              </div>
              <div className="text-4xl">🎖️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Progress</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">0%</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <p className="text-gray-600 text-sm">Full Name</p>
                <p className="text-lg font-semibold text-gray-800">{currentUser.name}</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <p className="text-gray-600 text-sm">Email Address</p>
                <p className="text-lg font-semibold text-gray-800">{currentUser.email}</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <p className="text-gray-600 text-sm">Role</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">{currentUser.role}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Account Status</p>
                <p className="text-lg font-semibold text-green-600">✅ Active</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition">
                Browse Workshops
              </button>
              <button className="w-full border-2 border-white text-white font-bold py-3 rounded-lg hover:bg-white/10 transition">
                View My Certificates
              </button>
              <button className="w-full border-2 border-white text-white font-bold py-3 rounded-lg hover:bg-white/10 transition">
                Download Progress Report
              </button>
            </div>
          </div>
        </div>

        {/* Workshops Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Registered Workshops</h2>
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-600">No workshops registered yet</p>
            <p className="text-gray-500 text-sm mt-1">Browse and register for workshops to get started</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
          <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}