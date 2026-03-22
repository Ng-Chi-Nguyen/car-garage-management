import React from 'react';

const ICON_MAP = {
  package: 'inventory_2',
  warning: 'warning',
  users: 'group',
  user: 'person',
  tool: 'build',
  tools: 'build',
  car: 'directions_car',
  money: 'payments',
  dollar: 'payments',
  chart: 'monitoring',
};

function resolveIcon(icon) {
  if (!icon) return null;
  if (typeof icon !== 'string') return icon;

  const normalized = icon.trim();
  const mapped = ICON_MAP[normalized.toLowerCase()] ?? normalized;

  return <span className="material-symbols-outlined" aria-hidden="true">{mapped}</span>;
}

export function StatCard({
  label,
  title,
  value,
  trend,
  trendUp,
  description,
  valueColor,
  icon,
}) {
  const displayLabel = label ?? title;
  const displayIcon = resolveIcon(icon);
  const hasNumericTrend = typeof trend === 'number' && Number.isFinite(trend);
  const trendIsPositive = hasNumericTrend ? trend > 0 : Boolean(trendUp);
  const trendText = hasNumericTrend
    ? `${trend > 0 ? '+' : ''}${trend}%`
    : (typeof trend === 'string' ? trend : description);

  return (
    <div className="bg-white rounded-[1.5rem] p-6">
      <div className="flex items-center justify-between">
        <div>
          {displayLabel && <p className="text-[0.875rem] font-medium text-slate-500 tracking-wide">{displayLabel}</p>}
          <p className={`text-[2.75rem] font-bold mt-2 leading-none tracking-tight ${valueColor ?? 'text-slate-900'}`}>{value}</p>
        </div>
        {displayIcon && <div className="text-slate-400">{displayIcon}</div>}
      </div>
      {trendText && (
        <div className={`mt-4 text-[0.75rem] font-medium px-2 py-1 rounded-md inline-block ${trendIsPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {trendText}
        </div>
      )}
    </div>
  );
}
