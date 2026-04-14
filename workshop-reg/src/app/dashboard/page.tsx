'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/authStore';
import { StatCard } from '../../../components/dashboard/StatCard';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import { CategoryBadge } from '../../../components/dashboard/CategoryBadge';

const MOCK_WORKSHOPS = [
  { id: '1', title: 'Full-Stack Development with Next.js', category: 'Technical',     date: '2026-04-05', time: '10:00 AM', status: 'Certified',  certificateId: 'CERT-2026-0041' },
  { id: '2', title: 'UI/UX Design Fundamentals',          category: 'Non-Technical', date: '2026-04-10', time: '2:00 PM',  status: 'Attended',   certificateId: null },
  { id: '3', title: 'Cloud Architecture on Azure',        category: 'Technical',     date: '2026-04-18', time: '11:00 AM', status: 'Registered', certificateId: null },
  { id: '4', title: 'Leadership & Team Dynamics',         category: 'Non-Technical', date: '2026-04-22', time: '3:00 PM',  status: 'Registered', certificateId: null },
  { id: '5', title: 'DevOps & CI/CD Pipelines',          category: 'Technical',     date: '2026-03-28', time: '9:00 AM',  status: 'Certified',  certificateId: 'CERT-2026-0029' },
];

// Derives initials from a full name — "Kula Sekaran" → "KS"
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [statusFilter,   setStatusFilter]   = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab,      setActiveTab]      = useState<'workshops' | 'certificates'>('workshops');

  useEffect(() => {
    if (!user || !token) {
      router.push('/auth/login');
    }
  }, [user, token, router]);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    router.push('/auth/login');
  };

  if (!user || !token) return null;

  const certified  = MOCK_WORKSHOPS.filter((w) => w.status === 'Certified');
  const attended   = MOCK_WORKSHOPS.filter((w) => w.status === 'Attended').length;
  const registered = MOCK_WORKSHOPS.filter((w) => w.status === 'Registered').length;

  const filtered = MOCK_WORKSHOPS.filter((w) => {
    const matchStatus   = statusFilter   === 'All' || w.status   === statusFilter;
    const matchCategory = categoryFilter === 'All' || w.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  const filterBtn = (active: boolean): React.CSSProperties => ({
    padding: '5px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    border:     active ? '1px solid #ec4899' : '1px solid #1e1e24',
    background: active ? 'rgba(236,72,153,0.1)' : '#18181f',
    color:      active ? '#f472b6' : '#6b6b7a',
    cursor: 'pointer',
    transition: 'all 0.15s',
  });

  const initials = getInitials(user.name);

  return (
    <div className="flex flex-col gap-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: '24px', letterSpacing: '-0.02em' }}>
            Welcome back, {user.name} 👋
          </h1>
          <p style={{ color: '#6b6b7a', fontSize: '14px', marginTop: '4px' }}>
            Here&apos;s what&apos;s happening with your workshops
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* ── User Profile Card ── */}
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-2.5"
            style={{ background: '#111115', border: '1px solid #1e1e24' }}
          >
            {/* Avatar — profile picture if available, else initials */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="rounded-full object-cover flex-shrink-0"
                style={{ width: '38px', height: '38px' }}
              />
            ) : (
              <div
                className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
                style={{
                  width: '38px',
                  height: '38px',
                  background: 'linear-gradient(135deg, #f472b6, #ec4899)',
                  color: 'white',
                  fontSize: '13px',
                  boxShadow: '0 0 14px rgba(244,114,182,0.25)',
                }}
              >
                {initials}
              </div>
            )}

            {/* Name + Email */}
            <div className="flex flex-col" style={{ lineHeight: 1 }}>
              <span className="font-semibold" style={{ color: '#e0e0e8', fontSize: '13px' }}>
                {user.name}
              </span>
              <span style={{ color: '#4b4b58', fontSize: '11px', marginTop: '3px' }}>
                {user.email}
              </span>
            </div>
          </div>

          {/* ── Logout Button ── */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 rounded-lg font-medium text-sm px-4 py-2"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* ── Logout Confirmation Modal ── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-lg p-6" style={{ background: '#1a1a2e', border: '1px solid #ec4899', maxWidth: '400px', width: '90%' }}>
            <h2 className="text-lg font-bold text-white mb-2">Sign Out</h2>
            <p style={{ color: '#6b6b7a', marginBottom: '20px' }}>
              Are you sure you want to sign out? You&apos;ll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-lg font-medium py-2 px-4"
                style={{ background: '#18181f', color: '#6b6b7a', border: '1px solid #1e1e24' }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-lg font-medium py-2 px-4"
                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: 'none' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard label="Total Registered" value={MOCK_WORKSHOPS.length} accent="#f472b6" sub="Across all workshops"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
        />
        <StatCard label="Attended" value={attended} accent="#a78bfa" sub="Workshops completed"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
        />
        <StatCard label="Upcoming" value={registered} accent="#60a5fa" sub="Slots confirmed"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
        />
        <StatCard label="Certificates" value={certified.length} accent="#34d399" sub="Ready to download"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>}
        />
      </div>

      {/* ── Tabs + Filters ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-lg p-1 gap-1" style={{ background: '#111115', border: '1px solid #1e1e24' }}>
            {(['workshops', 'certificates'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-all"
                style={activeTab === tab
                  ? { background: '#1e1e24', color: '#f0f0f5' }
                  : { background: 'transparent', color: '#6b6b7a' }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'workshops' && (
            <div className="flex items-center gap-2">
              <span style={{ color: '#4b4b58', fontSize: '12px' }}>Status:</span>
              {['All', 'Registered', 'Attended', 'Certified'].map((s) => (
                <button key={s} style={filterBtn(statusFilter === s)} onClick={() => setStatusFilter(s)}>{s}</button>
              ))}
              <span style={{ color: '#2a2a33', margin: '0 4px' }}>|</span>
              <span style={{ color: '#4b4b58', fontSize: '12px' }}>Category:</span>
              {['All', 'Technical', 'Non-Technical'].map((c) => (
                <button key={c} style={filterBtn(categoryFilter === c)} onClick={() => setCategoryFilter(c)}>{c}</button>
              ))}
            </div>
          )}
        </div>

        {/* ── Workshop Table ── */}
        {activeTab === 'workshops' && (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e1e24' }}>
            <div
              className="grid text-xs font-semibold uppercase tracking-wider px-5 py-3"
              style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', background: '#0e0e12', color: '#4b4b58', borderBottom: '1px solid #1e1e24' }}
            >
              <span>Workshop</span><span>Category</span><span>Date & Time</span><span>Status</span><span />
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16" style={{ background: '#111115' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2a2a33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p style={{ color: '#3b3b46', marginTop: '12px', fontSize: '14px' }}>No workshops match your filters</p>
              </div>
            ) : (
              filtered.map((w, i) => (
                <div
                  key={w.id}
                  className="grid items-center px-5 py-4 transition-colors hover:bg-white/[0.02]"
                  style={{
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
                    background: i % 2 === 0 ? '#111115' : '#0f0f13',
                    borderBottom: i < filtered.length - 1 ? '1px solid #1a1a20' : 'none',
                  }}
                >
                  <span className="font-medium text-sm" style={{ color: '#e0e0e8' }}>{w.title}</span>
                  <span><CategoryBadge category={w.category} /></span>
                  <span style={{ color: '#6b6b7a', fontSize: '13px' }}>
                    {new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    <br />
                    <span style={{ fontSize: '11px', color: '#3b3b46' }}>{w.time}</span>
                  </span>
                  <span><StatusBadge status={w.status} /></span>
                  <button
                    className="text-xs rounded-md px-3 py-1.5 font-medium"
                    style={{ background: '#18181f', border: '1px solid #1e1e24', color: '#6b6b7a' }}
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Certificates Grid ── */}
        {activeTab === 'certificates' && (
          <div>
            {certified.length === 0 ? (
              <div className="rounded-xl flex flex-col items-center justify-center py-20" style={{ border: '1px solid #1e1e24', background: '#111115' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a2a33" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
                <p style={{ color: '#3b3b46', marginTop: '16px', fontSize: '14px' }}>No certificates yet</p>
                <p style={{ color: '#2a2a33', fontSize: '12px', marginTop: '4px' }}>Attend workshops to earn certificates</p>
              </div>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
                {certified.map((w) => (
                  <div key={w.id} className="rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden" style={{ background: '#111115', border: '1px solid #1e1e24' }}>
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #34d399, #10b981)' }} />
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg flex items-center justify-center" style={{ width: '40px', height: '40px', background: 'rgba(52,211,153,0.08)', color: '#34d399' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                      </div>
                      <span className="text-xs font-mono rounded px-2 py-1" style={{ background: '#0c0c0f', color: '#4b4b58', border: '1px solid #1e1e24' }}>
                        {w.certificateId}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#e0e0e8' }}>{w.title}</p>
                      <p style={{ color: '#4b4b58', fontSize: '12px', marginTop: '4px' }}>
                        Issued on {new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-1" style={{ borderTop: '1px solid #1a1a20' }}>
                      <button className="flex-1 flex items-center justify-center gap-2 text-xs font-medium rounded-lg py-2" style={{ background: 'rgba(52,211,153,0.08)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 text-xs font-medium rounded-lg py-2" style={{ background: '#18181f', color: '#6b6b7a', border: '1px solid #1e1e24' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                        </svg>
                        Email
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}