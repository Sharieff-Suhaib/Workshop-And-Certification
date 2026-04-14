'use client';

import { useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Certificate {
  id: string;
  workshopTitle: string;
  category: 'Technical' | 'Non-Technical';
  issuedDate: string;
  certificateId: string;
  userName: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: '1',
    workshopTitle: 'Full-Stack Development with Next.js',
    category: 'Technical',
    issuedDate: '2026-04-05',
    certificateId: 'CERT-2026-0041',
    userName: 'Kulasekaran S',
  },
  {
    id: '2',
    workshopTitle: 'DevOps & CI/CD Pipelines',
    category: 'Technical',
    issuedDate: '2026-03-28',
    certificateId: 'CERT-2026-0029',
    userName: 'Kulasekaran S',
  },
  {
    id: '3',
    workshopTitle: 'Machine Learning Fundamentals',
    category: 'Technical',
    issuedDate: '2026-03-10',
    certificateId: 'CERT-2026-0018',
    userName: 'Kulasekaran S',
  },
  {
    id: '4',
    workshopTitle: 'Public Speaking & Presentation',
    category: 'Non-Technical',
    issuedDate: '2026-02-22',
    certificateId: 'CERT-2026-0011',
    userName: 'Kulasekaran S',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ── Sub-components ─────────────────────────────────────────────────────────────

/** The printable / visual certificate card that sits inside the modal */
function CertificatePreview({ cert }: { cert: Certificate }) {
  return (
    <div
      id={`cert-preview-${cert.id}`}
      style={{
        width: '680px',
        background: '#0c0c0f',
        border: '1px solid #1e1e24',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Top gradient bar */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #f472b6, #ec4899, #a78bfa)' }} />

      {/* Decorative corner marks */}
      {[
        { top: 16, left: 16 },
        { top: 16, right: 16 },
        { bottom: 16, left: 16 },
        { bottom: 16, right: 16 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '18px',
            height: '18px',
            ...pos,
            borderTop:    i < 2 ? '1.5px solid #2a2a33' : 'none',
            borderBottom: i >= 2 ? '1.5px solid #2a2a33' : 'none',
            borderLeft:   i % 2 === 0 ? '1.5px solid #2a2a33' : 'none',
            borderRight:  i % 2 === 1 ? '1.5px solid #2a2a33' : 'none',
          }}
        />
      ))}

      <div style={{ padding: '44px 56px 40px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
          {/* Logo mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #f472b6, #ec4899)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(244,114,182,0.35)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '13px', lineHeight: 1 }}>WorkShift</p>
              <p style={{ color: '#f472b6', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>CTF Platform</p>
            </div>
          </div>
          {/* Cert ID badge */}
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#4b4b58',
              background: '#18181f',
              border: '1px solid #1e1e24',
              borderRadius: '6px',
              padding: '4px 10px',
            }}
          >
            {cert.certificateId}
          </span>
        </div>

        {/* Main certificate body */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          {/* Medal icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>

          <p style={{ color: '#4b4b58', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Certificate of Completion
          </p>
          <p style={{ color: '#6b6b7a', fontSize: '13px', marginBottom: '6px' }}>This is to certify that</p>
          <h2
            style={{
              color: 'white',
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              margin: '0 0 6px',
              background: 'linear-gradient(90deg, #f0f0f5, #c0c0cc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {cert.userName}
          </h2>
          <p style={{ color: '#6b6b7a', fontSize: '13px', marginBottom: '18px' }}>
            has successfully completed the workshop
          </p>
          <div
            style={{
              display: 'inline-block',
              background: '#18181f',
              border: '1px solid #2a2a33',
              borderRadius: '10px',
              padding: '12px 28px',
              marginBottom: '20px',
            }}
          >
            <p style={{ color: '#e0e0e8', fontSize: '16px', fontWeight: 600, margin: 0 }}>{cert.workshopTitle}</p>
          </div>
          <p style={{ color: '#4b4b58', fontSize: '12px' }}>
            Issued on{' '}
            <span style={{ color: '#6b6b7a' }}>{fmtDate(cert.issuedDate)}</span>
          </p>
        </div>

        {/* Divider with dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: '#1e1e24' }} />
          <div style={{ display: 'flex', gap: '4px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: i === 1 ? '#f472b6' : '#2a2a33' }} />
            ))}
          </div>
          <div style={{ flex: 1, height: '1px', background: '#1e1e24' }} />
        </div>

        {/* Footer meta row */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#3b3b46', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Category</p>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '4px',
                background: cert.category === 'Technical' ? 'rgba(96,165,250,0.1)' : 'rgba(167,139,250,0.1)',
                color: cert.category === 'Technical' ? '#60a5fa' : '#a78bfa',
                border: cert.category === 'Technical' ? '1px solid rgba(96,165,250,0.2)' : '1px solid rgba(167,139,250,0.2)',
              }}
            >
              {cert.category}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#3b3b46', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Verified by</p>
            <p style={{ color: '#6b6b7a', fontSize: '12px', fontWeight: 600 }}>WorkShift · CEG Tech Forum</p>
          </div>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #1e1e24, transparent)' }} />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function CertificatesPage() {
  const [search, setSearch]         = useState('');
  const [categoryFilter, setCategory] = useState<'All' | 'Technical' | 'Non-Technical'>('All');
  const [selected, setSelected]     = useState<Certificate | null>(null);
  const [emailSent, setEmailSent]   = useState<string | null>(null);

  // Filter logic
  const visible = MOCK_CERTIFICATES.filter((c) => {
    const matchSearch   = c.workshopTitle.toLowerCase().includes(search.toLowerCase()) ||
                          c.certificateId.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchSearch && matchCategory;
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

  function handleEmail(cert: Certificate) {
    // TODO: wire to actual email API / Supabase edge function
    setEmailSent(cert.id);
    setTimeout(() => setEmailSent(null), 2500);
  }

  return (
    <div className="flex flex-col gap-8">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: '24px', letterSpacing: '-0.02em' }}>
            My Certificates
          </h1>
          <p style={{ color: '#6b6b7a', fontSize: '14px', marginTop: '4px' }}>
            {MOCK_CERTIFICATES.length} certificate{MOCK_CERTIFICATES.length !== 1 && 's'} earned
          </p>
        </div>

        {/* Summary badge */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}
        >
          <div
            style={{
              width: '36px', height: '36px',
              background: 'rgba(52,211,153,0.1)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>
          <div>
            <p style={{ color: '#34d399', fontWeight: 700, fontSize: '20px', lineHeight: 1 }}>{MOCK_CERTIFICATES.length}</p>
            <p style={{ color: '#4b4b58', fontSize: '11px', marginTop: '2px' }}>Total earned</p>
          </div>
        </div>
      </div>

      {/* ── Filters + Search ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1" style={{ minWidth: '220px', maxWidth: '320px' }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4b4b58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by title or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: '#18181f',
              border: '1px solid #1e1e24',
              borderRadius: '8px',
              padding: '8px 12px 8px 36px',
              color: '#e0e0e8',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        <span style={{ color: '#4b4b58', fontSize: '12px' }}>Category:</span>
        {(['All', 'Technical', 'Non-Technical'] as const).map((c) => (
          <button key={c} style={filterBtn(categoryFilter === c)} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {/* ── Certificate Grid ── */}
      {visible.length === 0 ? (
        <div
          className="rounded-xl flex flex-col items-center justify-center py-24"
          style={{ border: '1px solid #1e1e24', background: '#111115' }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a2a33" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
          <p style={{ color: '#3b3b46', marginTop: '16px', fontSize: '14px' }}>No certificates found</p>
          <p style={{ color: '#2a2a33', fontSize: '12px', marginTop: '4px' }}>Try adjusting the search or filter</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {visible.map((cert) => (
            <CertCard
              key={cert.id}
              cert={cert}
              emailSent={emailSent === cert.id}
              onPreview={() => setSelected(cert)}
              onEmail={() => handleEmail(cert)}
            />
          ))}
        </div>
      )}

      {/* ── Preview Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={() => setSelected(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 items-center">
            <CertificatePreview cert={selected} />

            {/* Modal action bar */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 text-sm font-medium rounded-lg px-5 py-2.5"
                style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download / Print
              </button>
              <button
                onClick={() => { handleEmail(selected); }}
                className="flex items-center gap-2 text-sm font-medium rounded-lg px-5 py-2.5"
                style={{ background: '#18181f', color: '#6b6b7a', border: '1px solid #1e1e24' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                Send via Email
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-2 text-sm font-medium rounded-lg px-4 py-2.5"
                style={{ background: '#18181f', color: '#4b4b58', border: '1px solid #1e1e24' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Certificate Card ───────────────────────────────────────────────────────────
function CertCard({
  cert,
  emailSent,
  onPreview,
  onEmail,
}: {
  cert: Certificate;
  emailSent: boolean;
  onPreview: () => void;
  onEmail: () => void;
}) {
  return (
    <div
      className="rounded-xl flex flex-col gap-4 relative overflow-hidden"
      style={{
        background: '#111115',
        border: '1px solid #1e1e24',
        padding: '20px',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2a2a33')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1e1e24')}
    >
      {/* Top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #34d399, #10b981)' }} />

      {/* Card header row */}
      <div className="flex items-start justify-between">
        <div
          style={{
            width: '40px', height: '40px',
            background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.15)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>

        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#4b4b58',
            background: '#0c0c0f',
            border: '1px solid #1e1e24',
            borderRadius: '5px',
            padding: '3px 8px',
          }}
        >
          {cert.certificateId}
        </span>
      </div>

      {/* Title + meta */}
      <div className="flex flex-col gap-1">
        <p style={{ color: '#e0e0e8', fontWeight: 600, fontSize: '14px', lineHeight: '1.4' }}>{cert.workshopTitle}</p>
        <p style={{ color: '#4b4b58', fontSize: '12px' }}>
          Issued on <span style={{ color: '#6b6b7a' }}>{fmtShort(cert.issuedDate)}</span>
        </p>
        <div style={{ marginTop: '4px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '4px',
              background: cert.category === 'Technical' ? 'rgba(96,165,250,0.1)' : 'rgba(167,139,250,0.1)',
              color: cert.category === 'Technical' ? '#60a5fa' : '#a78bfa',
              border: cert.category === 'Technical' ? '1px solid rgba(96,165,250,0.2)' : '1px solid rgba(167,139,250,0.2)',
            }}
          >
            {cert.category}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#1a1a20' }} />

      {/* Recipient row */}
      <div className="flex items-center gap-2">
        <div
          style={{
            width: '24px', height: '24px',
            background: 'linear-gradient(135deg, #f472b6, #ec4899)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 700, color: 'white',
          }}
        >
          {cert.userName.charAt(0)}
        </div>
        <span style={{ color: '#6b6b7a', fontSize: '12px' }}>{cert.userName}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onPreview}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg py-2"
          style={{
            background: 'rgba(244,114,182,0.08)',
            color: '#f472b6',
            border: '1px solid rgba(244,114,182,0.2)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
          View
        </button>
        <button
          onClick={onPreview}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg py-2"
          style={{
            background: 'rgba(52,211,153,0.08)',
            color: '#34d399',
            border: '1px solid rgba(52,211,153,0.2)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
        <button
          onClick={onEmail}
          className="flex items-center justify-center rounded-lg"
          style={{
            width: '34px', height: '34px',
            background: emailSent ? 'rgba(52,211,153,0.1)' : '#18181f',
            border: emailSent ? '1px solid rgba(52,211,153,0.3)' : '1px solid #1e1e24',
            color: emailSent ? '#34d399' : '#6b6b7a',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          title="Send via email"
        >
          {emailSent ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}