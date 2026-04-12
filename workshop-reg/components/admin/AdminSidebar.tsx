// workshop-reg/src/components/admin/AdminSidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuthStore } from '../../lib/store/adminAuthStore';
import { hasPermission, getRoleLabel } from '../../lib/rbac';

interface MenuItem {
  label: string;
  icon: string;
  href: string;
  requiredPermission: { resource: any; action: any };
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuthStore();

  if (!user) return null;

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: '📊',
      href: '/admin/dashboard',
      requiredPermission: { resource: 'workshops', action: 'read' },
    },
    {
      label: 'Workshops',
      icon: '📚',
      href: '/admin/workshops',
      requiredPermission: { resource: 'workshops', action: 'read' },
    },
    {
      label: 'Participants',
      icon: '👥',
      href: '/admin/participants',
      requiredPermission: { resource: 'participants', action: 'read' },
    },
    {
      label: 'Certificates',
      icon: '🏆',
      href: '/admin/certificates',
      requiredPermission: { resource: 'certificates', action: 'read' },
    },
    {
      label: 'Reports',
      icon: '📈',
      href: '/admin/reports',
      requiredPermission: { resource: 'reports', action: 'read' },
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    hasPermission(
      user.role,
      item.requiredPermission.resource,
      item.requiredPermission.action
    )
  );

  const handleLogout = () => {
    logout();
    router.push('/auth/admin-login');
  };

  return (
    <div className="w-64 bg-slate-800 min-h-screen p-6 fixed left-0 top-0 border-r border-slate-700">
      {/* Logo */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-500">🔐 Admin</h2>
        <p className="text-slate-400 text-sm">Workshop Management</p>
      </div>

      {/* User Info */}
      <div className="bg-slate-700/50 rounded-lg p-4 mb-6 border border-slate-600">
        <div className="flex items-center gap-3 mb-3">
          {user.profileImage && (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {user.name}
            </p>
            <p className="text-blue-400 text-xs font-semibold">
              {getRoleLabel(user.role)}
            </p>
          </div>
        </div>
        <p className="text-slate-400 text-xs truncate">{user.email}</p>
      </div>

      {/* Role Badge */}
      <div
        className={`mb-6 px-3 py-2 rounded-lg text-xs font-semibold text-center ${
          user.role === 'SUPER_ADMIN'
            ? 'bg-purple-900/30 text-purple-400 border border-purple-700'
            : 'bg-blue-900/30 text-blue-400 border border-blue-700'
        }`}
      >
        {user.role === 'SUPER_ADMIN' ? '👑 Super Admin' : '📋 Moderator'}
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        {visibleMenuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Permissions Info */}
      <div className="bg-slate-700/30 rounded-lg p-3 mb-6 border border-slate-600">
        <p className="text-slate-400 text-xs font-semibold mb-2">
          📌 Your Permissions
        </p>
        <div className="space-y-1 text-xs text-slate-400">
          <p>
            {user.role === 'SUPER_ADMIN'
              ? '✓ Full access to all features'
              : '✓ Can manage workshops & participants'}
          </p>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition border border-red-700 flex items-center justify-center gap-2"
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6 text-center">
        <p className="text-slate-600 text-xs">© 2026 Workshop System</p>
      </div>
    </div>
  );
}