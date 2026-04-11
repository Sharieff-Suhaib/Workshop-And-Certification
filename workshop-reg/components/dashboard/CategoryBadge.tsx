const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  Technical:       { color: '#f472b6', bg: 'rgba(244,114,182,0.08)' },
  'Non-Technical': { color: '#e879f9', bg: 'rgba(232,121,249,0.08)' },
};

export function CategoryBadge({ category }: { category: string }) {
  const cfg = CATEGORY_COLORS[category] ?? { color: '#9ca3af', bg: 'rgba(156,163,175,0.08)' };
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {category}
    </span>
  );
}