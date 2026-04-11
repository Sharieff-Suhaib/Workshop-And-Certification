'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/authStore';
import Navbar from '../../../components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    // Redirect if not authenticated
    if (!user || !token) {
      router.push('/auth/login');
    }
  }, [user, token, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Welcome, {user.name}! 👋</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Workshops</h2>
            <p className="text-gray-600">View and register for workshops</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Certificates</h2>
            <p className="text-gray-600">Download your certificates</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Profile</h2>
            <p className="text-gray-600">Update your profile information</p>
          </div>
        </div>
      </div>
    </>
  );
}