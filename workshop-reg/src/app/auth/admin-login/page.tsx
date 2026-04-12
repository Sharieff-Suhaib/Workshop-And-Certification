// workshop-reg/src/app/auth/admin-login/page.tsx

'use client';

import { useAdminAuthStore } from '../../../../lib/store/adminAuthStore';
import { useSearchParams } from 'next/navigation';
import { AdminLoginForm } from '../../../../components/auth/AdminLoginForm';

export default function AdminLoginPage() {
  const { logout } = useAdminAuthStore();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleResetSession = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 max-w-md mx-auto">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-400 text-sm font-semibold">⚠️ Error</p>
            <p className="text-red-300 text-xs mt-1">
              {decodeURIComponent(error)}
            </p>
            <button
              type="button"
              onClick={handleResetSession}
              className="mt-3 text-xs text-blue-300 hover:text-blue-200"
            >
              Clear admin session and try again
            </button>
          </div>
        </div>
      )}

      <AdminLoginForm />

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}