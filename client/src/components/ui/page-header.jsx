import React from 'react';

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h2 className="text-[1.5rem] font-bold text-on-surface tracking-tight leading-tight">{title}</h2>
        {description && <p className="text-[0.875rem] text-on-surface-variant mt-1.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
