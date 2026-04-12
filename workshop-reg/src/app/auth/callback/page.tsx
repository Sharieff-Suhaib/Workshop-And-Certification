// workshop-reg/src/app/auth/callback/page.tsx

'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../lib/store/authStore';
import { useAdminAuthStore } from '../../../../lib/store/adminAuthStore';

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const { setAdminData } = useAdminAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const isAdmin = searchParams.get('admin') === 'true';

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));

        console.log('✅ Storing auth data...');
        console.log('📦 Token:', token.substring(0, 20) + '...');
        console.log('👤 User:', user.email);
        console.log('🔐 Role:', user.role);
        console.log('🔑 Is Admin:', isAdmin);

        if (isAdmin) {
          // Admin callback - validate role
          if (user.role !== 'SUPER_ADMIN' && user.role !== 'MODERATOR') {
            console.error('❌ User is not an admin');
            router.push(
              '/auth/admin-login?error=Insufficient+permissions.+Only+admins+can+access+this+portal.'
            );
            return;
          }

          console.log('✅ Admin auth data stored');
          setAdminData(user, token);

          // Redirect to admin dashboard
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 500);
        } else {
          // Regular user callback
          console.log('✅ Regular user auth data stored');
          setToken(token);
          setUser(user);

          // Redirect to dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 500);
        }
      } catch (error) {
        console.error('❌ Parse error:', error);
        const redirectPath = isAdmin ? '/auth/admin-login' : '/auth/login';
        router.push(`${redirectPath}?error=Invalid+data`);
      }
    } else {
      console.error('❌ No auth data in URL');
      const redirectPath = isAdmin ? '/auth/admin-login' : '/auth/login';
      router.push(`${redirectPath}?error=No+auth+data`);
    }
  }, [searchParams, router, setUser, setToken, setAdminData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
        <p className="text-white text-lg font-semibold">Completing your login...</p>
        <p className="text-blue-100 text-sm mt-2">Please wait while we authenticate you</p>
      </div>
    </div>
  );
}