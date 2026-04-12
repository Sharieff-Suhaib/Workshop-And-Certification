// workshop-reg/src/components/admin/AdminHeader.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '../../lib/store/adminAuthStore';
import { getRoleLabel } from '../../lib/rbac';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAdminAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/admin-login');
  };

  if (!user) return null;

  const getRoleBadgeColor = () => {
    if (user.role === 'SUPER_ADMIN') {
      return {
        bg: 'bg-purple-900/20',
        border: 'border-purple-700',
        text: 'text-purple-400',
        icon: '👑',
      };
    }
    return {
      bg: 'bg-blue-900/20',
      border: 'border-blue-700',
      text: 'text-blue-400',
      icon: '📋',
    };
  };

  const badgeColor = getRoleBadgeColor();

  return (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700">
      {/* Left Section - Title */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-1">{title}</h1>
        {subtitle && (
          <p className="text-slate-400 text-sm md:text-base">{subtitle}</p>
        )}
      </div>

      {/* Right Section - User Info & Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-white font-semibold text-sm md:text-base">
              {user.name}
            </p>
            <p className={`text-xs md:text-sm font-semibold ${badgeColor.text}`}>
              {getRoleLabel(user.role)}
            </p>
          </div>

          {/* Profile Image */}
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${badgeColor.bg} border ${badgeColor.border}`}>
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                title={user.email}
              />
            ) : (
              <span className={`font-bold text-lg ${badgeColor.text}`}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-3 md:px-4 py-2 rounded-lg transition font-semibold text-xs md:text-sm flex items-center gap-2 whitespace-nowrap"
          title="Sign out of admin panel"
        >
          <span className="hidden sm:inline">🚪</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile User Info */}
      <div className="sm:hidden absolute top-20 right-4 bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs">
        <p className="text-white font-semibold">{user.name}</p>
        <p className={`${badgeColor.text}`}>{getRoleLabel(user.role)}</p>
      </div>
    </div>
  );
}