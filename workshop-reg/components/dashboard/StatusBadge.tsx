const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  Registered: { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  dot: '#60a5fa', label: 'Registered' },
  Attended:   { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', dot: '#a78bfa', label: 'Attended'   },
  Certified:  { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  dot: '#34d399', label: 'Certified'  },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Registered;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span
        className="rounded-full"
        style={{ width: '5px', height: '5px', background: cfg.dot, flexShrink: 0 }}
      />
      {cfg.label}
    </span>
  );
}
