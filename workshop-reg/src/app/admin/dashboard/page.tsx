// workshop-reg/src/app/admin/page.tsx
'use client';

import { useAdminAuthStore } from '../../../../lib/store/adminAuthStore';

export default function AdminPage() {
  const { user, token } = useAdminAuthStore();

  if (!token || !user) {
    return null;
  }

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to your admin dashboard</p>
      </div>
    </div>
  );
}