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
  icon,
  description,
  valueColor = 'text-slate-950',
}) {
  const displayLabel = label ?? title;
  const displayIcon = resolveIcon(icon);
  const hasNumericTrend = typeof trend === 'number' && Number.isFinite(trend);
  const trendIsPositive = hasNumericTrend
    ? trend > 0
    : typeof trendUp === 'boolean'
      ? trendUp
      : String(trend ?? '').trim().startsWith('+');
  const trendText = hasNumericTrend
    ? `${trend > 0 ? '+' : ''}${trend}%`
    : (typeof trend === 'string' ? trend : description);

  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.3)] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          {displayLabel && <p className="text-sm font-semibold tracking-tight text-slate-500">{displayLabel}</p>}
          <div className="space-y-1.5">
            <p className={`text-3xl font-bold tracking-tight ${valueColor}`}>{value}</p>
            {description && <p className="text-sm font-medium leading-5 text-slate-400">{description}</p>}
          </div>
        </div>
        {displayIcon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-inner shadow-white/70">
            {displayIcon}
          </div>
        )}
      </div>
      {trendText && (
        <div className={`mt-5 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${trendIsPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          <span className="material-symbols-outlined text-sm">{trendIsPositive ? 'trending_up' : 'trending_down'}</span>
          <span>{trendText}</span>
        </div>
      )}
    </article>
  );
}
