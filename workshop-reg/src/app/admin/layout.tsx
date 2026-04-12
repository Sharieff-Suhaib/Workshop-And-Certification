// workshop-reg/src/app/admin/layout.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '../../../lib/store/adminAuthStore';
import { ProtectedRoute } from '../../../components/AdminProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAdminAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !token || !user) {
      router.push('/auth/admin-login');
      return;
    }

    if (user.role !== 'SUPER_ADMIN' && user.role !== 'MODERATOR') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, token, user, router]);

  if (!isAuthenticated || !token || !user) {
    return null;
  }

  return (
    <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'MODERATOR']}>
      <div className="min-h-screen bg-slate-900 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">{children}</div>
      </div>
    </ProtectedRoute>
  );
}