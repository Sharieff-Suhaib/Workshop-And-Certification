// workshop-reg/src/components/admin/StatCard.tsx

'use client';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'pink' | 'cyan';
  trend?: number;
  subtitle?: string;
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-900/20',
    border: 'border-blue-700',
    text: 'text-blue-400',
    accent: 'text-blue-500',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-blue-400',
  },
  green: {
    bg: 'bg-green-900/20',
    border: 'border-green-700',
    text: 'text-green-400',
    accent: 'text-green-500',
    gradientFrom: 'from-green-600',
    gradientTo: 'to-green-400',
  },
  purple: {
    bg: 'bg-purple-900/20',
    border: 'border-purple-700',
    text: 'text-purple-400',
    accent: 'text-purple-500',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-purple-400',
  },
  yellow: {
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-700',
    text: 'text-yellow-400',
    accent: 'text-yellow-500',
    gradientFrom: 'from-yellow-600',
    gradientTo: 'to-yellow-400',
  },
  red: {
    bg: 'bg-red-900/20',
    border: 'border-red-700',
    text: 'text-red-400',
    accent: 'text-red-500',
    gradientFrom: 'from-red-600',
    gradientTo: 'to-red-400',
  },
  pink: {
    bg: 'bg-pink-900/20',
    border: 'border-pink-700',
    text: 'text-pink-400',
    accent: 'text-pink-500',
    gradientFrom: 'from-pink-600',
    gradientTo: 'to-pink-400',
  },
  cyan: {
    bg: 'bg-cyan-900/20',
    border: 'border-cyan-700',
    text: 'text-cyan-400',
    accent: 'text-cyan-500',
    gradientFrom: 'from-cyan-600',
    gradientTo: 'to-cyan-400',
  },
};

export function StatCard({
  label,
  value,
  icon,
  color,
  trend,
  subtitle,
  onClick,
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div
      onClick={onClick}
      className={`${colors.bg} border ${colors.border} rounded-lg p-6 transition-all hover:border-opacity-100 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-slate-900/50' : ''
      }`}
    >
      {/* Header with Icon */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <span className="text-3xl">{icon}</span>
      </div>

      {/* Main Value */}
      <div className="mb-3">
        <p className="text-4xl md:text-5xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-slate-400 text-xs md:text-sm mb-3">{subtitle}</p>
      )}

      {/* Trend or Additional Info */}
      {trend !== undefined && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-700">
          <span
            className={`text-xs font-semibold ${
              trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-slate-400'
            }`}
          >
            {trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️'} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-slate-500">from last month</span>
        </div>
      )}

      {/* Click Indicator */}
      {onClick && (
        <div className="mt-4 flex items-center gap-2 text-slate-400 hover:text-slate-300 transition text-xs">
          <span>View details</span>
          <span>→</span>
        </div>
      )}
    </div>
  );
}

// Export variations for quick usage
export function StatCardSkeleton() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-24 mb-4"></div>
      <div className="h-10 bg-slate-700 rounded w-32 mb-3"></div>
      <div className="h-3 bg-slate-700 rounded w-20"></div>
    </div>
  );
}

// Multiple skeleton cards
export function StatCardSkeletonGroup({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}