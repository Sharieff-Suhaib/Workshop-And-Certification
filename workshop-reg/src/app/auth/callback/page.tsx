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
        
        // Store token and user
        setToken(token);
        setUser(user);

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Error parsing callback:', error);
        router.push('/auth/login?error=Authentication failed');
      }
    } else {
      router.push('/auth/login?error=No authentication data');
    }
  }, [searchParams, router, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
        <p className="text-white text-lg font-semibold">Completing your login...</p>
      </div>
    </div>
  );
}