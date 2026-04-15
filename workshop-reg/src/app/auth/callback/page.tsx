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

          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 500);
        } else {
          // Regular user callback
          console.log('✅ Regular user auth data stored');
          setToken(token);
          setUser(user);

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
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      {/* Subtle Pink Ambient Glows */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-pink-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-pink-900/10 rounded-full blur-[120px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md p-10 bg-[#121214] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">

        {/* Gradient top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-600" />

        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-pink-500/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-pink-500 animate-spin" />
          </div>

          <h2 className="text-white text-xl font-medium tracking-tight mb-2">
            Completing your login...
          </h2>

          <p className="text-zinc-500 text-sm text-center">
            Preparing your WorkShift dashboard
          </p>
        </div>

        {/* Bottom detail */}
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
            CEG Tech Forum
          </span>
        </div>
      </div>
    </div>
  );
}