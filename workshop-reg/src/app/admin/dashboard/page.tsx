// workshop-reg/src/app/admin/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '../../../../lib/store/adminAuthStore';
import { AdminHeader } from '../../../../components/admin/AdminHeader';
import { StatCard } from '../../../../components/admin/StatCard';
import { RoleGuard } from '../../../../components/auth/RoleGaurd';
import { hasPermission } from '../../../../lib/rbac';
import api from '../../../../lib/api';

interface DashboardStats {
  totalWorkshops: number;
  totalParticipants: number;
  attendedCount: number;
  certificatesIssued: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token } = useAdminAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user) {
      router.push('/auth/admin-login');
      return;
    }

    // Check permissions
    if (!hasPermission(user.role, 'workshops', 'read')) {
      router.push('/dashboard');
      return;
    }

    fetchStats();
  }, [token, user, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/stats');

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user.name}! (${user.role})`}
      />

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Workshops"
            value={stats.totalWorkshops}
            icon="📚"
            color="blue"
          />
          <StatCard
            label="Total Participants"
            value={stats.totalParticipants}
            icon="👥"
            color="green"
          />
          <StatCard
            label="Attended"
            value={stats.attendedCount}
            icon="✓"
            color="purple"
          />
          <StatCard
            label="Certificates Issued"
            value={stats.certificatesIssued}
            icon="🏆"
            color="yellow"
          />
        </div>
      ) : null}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workshops - All admins can access */}
        <RoleGuard requiredRoles={['SUPER_ADMIN', 'MODERATOR']}>
          <button
            onClick={() => router.push('/admin/workshops')}
            className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 px-6 rounded-lg transition flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
          >
            <span className="text-3xl">📚</span>
            <div className="text-left">
              <p className="text-sm opacity-90">Manage</p>
              <p className="text-lg font-bold">Workshops</p>
            </div>
          </button>
        </RoleGuard>

        {/* Participants - All admins can access */}
        <RoleGuard requiredRoles={['SUPER_ADMIN', 'MODERATOR']}>
          <button
            onClick={() => router.push('/admin/participants')}
            className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-6 px-6 rounded-lg transition flex items-center justify-center gap-3 shadow-lg shadow-green-600/20"
          >
            <span className="text-3xl">👥</span>
            <div className="text-left">
              <p className="text-sm opacity-90">Manage</p>
              <p className="text-lg font-bold">Participants</p>
            </div>
          </button>
        </RoleGuard>

        {/* Certificates - All admins can access */}
        <RoleGuard requiredRoles={['SUPER_ADMIN', 'MODERATOR']}>
          <button
            onClick={() => router.push('/admin/certificates')}
            className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-6 px-6 rounded-lg transition flex items-center justify-center gap-3 shadow-lg shadow-purple-600/20"
          >
            <span className="text-3xl">🏆</span>
            <div className="text-left">
              <p className="text-sm opacity-90">Manage</p>
              <p className="text-lg font-bold">Certificates</p>
            </div>
          </button>
        </RoleGuard>

        {/* Reports - Only Super Admin */}
        <RoleGuard requiredRoles={['SUPER_ADMIN']}>
          <button
            onClick={() => router.push('/admin/reports')}
            className="bg-gradient-to-br from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold py-6 px-6 rounded-lg transition flex items-center justify-center gap-3 shadow-lg shadow-yellow-600/20"
          >
            <span className="text-3xl">📊</span>
            <div className="text-left">
              <p className="text-sm opacity-90">View</p>
              <p className="text-lg font-bold">Reports</p>
            </div>
          </button>
        </RoleGuard>
      </div>

      {/* Role Information */}
      <div className="mt-12 bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          📋 Your Role & Permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-2">Current Role</p>
            <p className="text-white font-bold text-lg">
              {user.role === 'SUPER_ADMIN' ? '👑 Super Admin' : '📋 Moderator'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-2">
              Workshop Access
            </p>
            <p className="text-green-400 font-bold">
              {hasPermission(user.role, 'workshops', 'create')
                ? '✓ Full Access'
                : '✓ View Only'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-2">
              Certificate Access
            </p>
            <p className="text-green-400 font-bold">
              {hasPermission(user.role, 'certificates', 'create')
                ? '✓ Can Generate'
                : '✓ View Only'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}