// workshop-reg/src/components/auth/AdminAuthCallback.tsx

'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAdminAuthStore } from '../../lib/store/adminAuthStore';

export function AdminAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAdminData } = useAdminAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('Auth error:', error);
      router.push('/auth/admin-login?error=' + encodeURIComponent(error));
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));

        // Check if user has admin role
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'MODERATOR') {
          router.push(
            '/auth/admin-login?error=Insufficient+permissions.+Only+admins+can+access+this+portal.'
          );
          return;
        }

        console.log('✅ Admin authenticated:', user.email);
        console.log('📋 Role:', user.role);

        setAdminData(user, token);

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 500);
      } catch (error) {
        console.error('❌ Parse error:', error);
        router.push('/auth/admin-login?error=Invalid+authentication+data');
      }
    } else {
      console.error('❌ No auth data in URL');
      router.push('/auth/admin-login?error=No+authentication+data+received');
    }
  }, [searchParams, router, setAdminData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg font-semibold">
          Verifying admin credentials...
        </p>
        <p className="text-slate-400 mt-2">Please wait while we authenticate you</p>
      </div>
    </div>
  );
}