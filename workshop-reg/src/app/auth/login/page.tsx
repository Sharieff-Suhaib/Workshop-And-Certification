'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../../../lib/store/authStore';
import { useRouter } from 'next/navigation';
import LoginForm from '../../../../components/auth/LoginForm';

export default function LoginPage() {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <LoginForm />;
}