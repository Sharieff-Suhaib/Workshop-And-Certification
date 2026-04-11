'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Workshops',
    href: '/dashboard/workshops',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: 'Certificates',
    href: '/dashboard/certificates',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="flex min-h-screen"
      style={{ background: '#0c0c0f', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-300 ease-in-out"
        style={{
          width: collapsed ? '72px' : '240px',
          background: '#111115',
          borderRight: '1px solid #1e1e24',
          minHeight: '100vh',
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div
          className="flex items-center gap-3 px-4 py-5"
          style={{ borderBottom: '1px solid #1e1e24', height: '64px' }}
        >
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #f472b6, #ec4899)',
              boxShadow: '0 0 16px rgba(244,114,182,0.35)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {!collapsed && (
            <div>
              <p className="text-white font-bold text-sm leading-tight">WorkShift</p>
              <p style={{ color: '#f472b6', fontSize: '10px', letterSpacing: '0.12em' }} className="uppercase font-medium">
                CTF Platform
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg transition-all duration-150"
                style={{
                  padding: collapsed ? '10px 14px' : '10px 12px',
                  color: active ? '#f472b6' : '#6b6b7a',
                  background: active ? 'rgba(244,114,182,0.08)' : 'transparent',
                  borderLeft: active ? '2px solid #f472b6' : '2px solid transparent',
                  fontWeight: active ? 600 : 400,
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: '12px', borderTop: '1px solid #1e1e24' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center rounded-lg transition-colors"
            style={{
              padding: '8px',
              color: '#4b4b58',
              background: 'transparent',
              border: '1px solid #1e1e24',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-8"
          style={{
            height: '64px',
            background: '#111115',
            borderBottom: '1px solid #1e1e24',
            flexShrink: 0,
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: '#3b3b46', fontSize: '13px' }}>Dashboard</span>
            {pathname !== '/dashboard' && (
              <>
                <span style={{ color: '#2a2a33' }}>/</span>
                <span style={{ color: '#e0e0e8', fontSize: '13px', textTransform: 'capitalize' }}>
                  {pathname.split('/').pop()}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button
              className="flex items-center justify-center rounded-lg relative"
              style={{
                width: '36px',
                height: '36px',
                background: '#18181f',
                border: '1px solid #1e1e24',
                color: '#6b6b7a',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span
                className="absolute top-1 right-1 rounded-full"
                style={{ width: '7px', height: '7px', background: '#ec4899' }}
              />
            </button>

            {/* Avatar */}
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer"
              style={{ background: '#18181f', border: '1px solid #1e1e24' }}
            >
              <div
                className="rounded-full flex items-center justify-center text-white font-bold"
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #f472b6, #ec4899)',
                  fontSize: '12px',
                }}
              >
                U
              </div>
              <span style={{ color: '#c0c0cc', fontSize: '13px', fontWeight: 500 }}>User</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ padding: '32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}