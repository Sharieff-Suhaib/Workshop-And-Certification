export function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
  sub?: string;
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden"
      style={{ background: '#111115', border: '1px solid #1e1e24' }}
    >
      <div
        className="absolute -top-6 -right-6 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ width: '80px', height: '80px', background: accent }}
      />
      <div className="flex items-center justify-between">
        <span style={{ color: '#6b6b7a', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
          {label}
        </span>
        <div
          className="rounded-lg flex items-center justify-center"
          style={{ width: '36px', height: '36px', background: `${accent}18`, color: accent }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="text-white font-bold" style={{ fontSize: '28px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </p>
        {sub && <p style={{ color: '#4b4b58', fontSize: '12px', marginTop: '4px' }}>{sub}</p>}
      </div>
    </div>
  );
}
