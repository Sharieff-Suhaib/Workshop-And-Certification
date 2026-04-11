'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store/authStore';
import { authAPI } from '../lib/api/auth';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Call /oauth/logout
      await authAPI.logout();

      console.log('✅ Logout successful');

      logout();
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      logout();
      router.push('/auth/login');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  if (!user || !token) {
    return (
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Workshop
        </Link>
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Register
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
        Workshop
      </Link>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        {user.profileImage && (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
        )}

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="ml-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ▼
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Profile
              </Link>
              <hr />
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 disabled:opacity-50"
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}