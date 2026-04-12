// workshop-reg/src/components/auth/AdminLoginForm.tsx

'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function AdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = `${API_BASE}/oauth/google/admin`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-400">
            Sign in with your admin account to access the dashboard
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 disabled:bg-slate-300 text-slate-900 font-semibold py-3 px-4 rounded-lg transition mb-6"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-slate-400">
              Admin OAuth Sign-In
            </span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
          <p className="text-blue-400 text-sm font-semibold mb-2">
            ℹ️ Admin Access Only
          </p>
          <p className="text-blue-300 text-sm">
            Only users with Super Admin or Moderator roles can access the admin
            portal. Contact your administrator if you need access.
          </p>
        </div>

        {/* Role Information */}
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex items-start gap-2">
            <span className="text-lg">🔑</span>
            <div>
              <p className="font-semibold text-slate-300 mb-1">Super Admin</p>
              <p>Full access to all features and settings</p>
            </div>
          </div>
          <div className="flex items-start gap-2 pt-2 border-t border-slate-700">
            <span className="text-lg">📋</span>
            <div>
              <p className="font-semibold text-slate-300 mb-1">Moderator</p>
              <p>Can manage workshops, participants, and certificates</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 pt-6 border-t border-slate-700 text-center">
          <p className="text-slate-400 text-sm mb-2">Not an admin?</p>
          <a
            href="/auth/login"
            className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition"
          >
            Sign in as regular user →
          </a>
        </div>
      </div>
    </div>
  );
}