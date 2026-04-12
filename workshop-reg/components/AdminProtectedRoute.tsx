// workshop-reg/src/components/auth/ProtectedRoute.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '../lib/store/adminAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Array<'SUPER_ADMIN' | 'MODERATOR'>;
}

export function ProtectedRoute({
  children,
  requiredRoles = ['SUPER_ADMIN', 'MODERATOR'],
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAdminAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !token || !user) {
      router.push('/auth/admin-login');
      return;
    }

    if (!requiredRoles.includes(user.role as 'SUPER_ADMIN' | 'MODERATOR')) {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, token, user, requiredRoles, router]);

  if (!isAuthenticated || !token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!requiredRoles.includes(user.role as 'SUPER_ADMIN' | 'MODERATOR')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold mb-4">
            ❌ Access Denied
          </p>
          <p className="text-slate-400 mb-6">
            You don't have permission to access this page
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}