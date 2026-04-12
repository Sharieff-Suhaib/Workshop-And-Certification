// workshop-reg/src/app/admin/dashboard/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '../../../../lib/store/adminAuthStore';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAdminAuthStore();

  useEffect(() => {
    if (!token || !user) {
      router.push('/auth/admin-login');
      return;
    }
  }, [token, user, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/auth/admin-login');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="rounded-2xl border border-slate-700 bg-slate-800 px-10 py-12 text-center shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">
          Admin Area
        </p>
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-3 text-slate-400">Welcome back, {user.name}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}