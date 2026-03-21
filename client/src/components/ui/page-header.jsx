import React from 'react';

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Garage Management System</p>
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-[2rem]">{title}</h2>
          {description && <p className="max-w-3xl text-sm font-medium leading-6 text-slate-500 md:text-[15px]">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 lg:justify-end">{actions}</div>}
    </div>
  );
}
