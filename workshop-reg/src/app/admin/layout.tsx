// workshop-reg/src/app/admin/layout.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '../../../lib/store/adminAuthStore';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';

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
      <div className="flex bg-slate-900 min-h-screen">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}