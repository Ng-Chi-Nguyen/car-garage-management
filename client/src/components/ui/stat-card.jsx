import React from 'react';

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
  const displayLabel = title ?? label;
  const trendIsPositive = typeof trendUp === 'boolean' ? trendUp : typeof trend === 'number' ? trend > 0 : String(trend ?? '').trim().startsWith('+');

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
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-inner shadow-white/70">
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
          </div>
        )}
      </div>
      {trend && (
        <div className={`mt-5 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${trendIsPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          <span className="material-symbols-outlined text-sm">{trendIsPositive ? 'trending_up' : 'trending_down'}</span>
          <span>{trend}</span>
        </div>
      )}
    </article>
  );
}
