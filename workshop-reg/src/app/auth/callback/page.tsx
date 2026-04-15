'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../lib/store/authStore';

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));

        console.log('✅ Storing auth data...');

        // Store in Zustand (will auto-persist to localStorage)
        setToken(token);
        setUser(user);

        console.log('✅ Auth data stored');
        console.log('📦 Token:', token.substring(0, 20) + '...');
        console.log('👤 User:', user.email);

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } catch (error) {
        console.error('❌ Parse error:', error);
        router.push('/auth/login?error=Invalid data');
      }
    } else {
      console.error('❌ No auth data in URL');
      router.push('/auth/login?error=No auth data');
    }
  }, [searchParams, router, setUser, setToken]);

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
    {/* Subtle Pink Ambient Glows to match dashboard style */}
    <div className="absolute top-1/4 -left-10 w-72 h-72 bg-pink-600/10 rounded-full blur-[120px]" />
    <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-pink-900/10 rounded-full blur-[120px]" />

    {/* Defined Rectangular Card Container */}
    <div className="relative z-10 w-full max-w-md p-10 bg-[#121214] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
      
      {/* Decorative Gradient Bar (Matching dashboard accent color) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-600" />

      <div className="flex flex-col items-center">
        {/* Modern Pink Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-pink-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-pink-500 animate-spin" />
        </div>

        {/* Text content matching your login flow */}
        <h2 className="text-white text-xl font-medium tracking-tight mb-2">
          Completing your login...
        </h2>
        
        <p className="text-zinc-500 text-sm text-center">
          Preparing your WorkShift dashboard
        </p>
      </div>

      {/* Subtle bottom detail to match the dashboard's structured look */}
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
        <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          CEG Tech Forum 
        </span>
      </div>
    </div>
  </div>
);
}