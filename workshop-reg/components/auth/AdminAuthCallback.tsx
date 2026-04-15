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
  <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
    {/* Subtle Ambient Glow to match dashboard depth */}
    <div className="absolute top-1/3 -left-20 w-96 h-96 bg-pink-600/5 rounded-full blur-[120px]" />
    <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-pink-900/10 rounded-full blur-[120px]" />

    {/* Structured Admin Auth Card */}
    <div className="relative z-10 w-full max-w-md p-12 bg-[#121214] border border-white/5 rounded-2xl shadow-2xl">
      
      {/* Top Accent Line - matching the dashboard's pink highlights */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-600" />

      <div className="text-center">
        {/* Custom Pink Spinner */}
        <div className="relative w-14 h-14 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-pink-500/10" />
          <div className="absolute inset-0 rounded-full border-t-2 border-pink-500 animate-spin" />
        </div>

        <h2 className="text-white text-xl font-semibold tracking-tight">
          Verifying admin credentials...
        </h2>
        
        <p className="text-zinc-500 mt-3 text-sm leading-relaxed">
          Please wait while we authenticate your <br />
          <span className="text-pink-500/80 font-medium">Secure Administrative Session</span>
        </p>

        {/* Subtle Branding Link to the CTF project */}
        <div className="mt-10 flex items-center justify-center gap-2 opacity-40">
           <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
           <span className="text-[10px] text-white uppercase tracking-[0.2em] font-bold">
             TechOps SD Task
           </span>
           <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
        </div>
      </div>
    </div>
  </div>
);
}