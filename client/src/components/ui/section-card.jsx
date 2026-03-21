import React from 'react';

export function SectionCard({ title, action, children, className = '', noPadding = false }) {
  return (
    <section
      className={[
        'rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-1 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.28)] backdrop-blur-sm',
        className,
      ].join(' ')}
    >
      <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white/95">
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/85 px-6 py-4 md:px-7">
          {title && <h3 className="text-base font-semibold tracking-tight text-slate-900 md:text-lg">{title}</h3>}
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6 md:p-7'}>
        {children}
      </div>
      </div>
    </section>
  );
}
