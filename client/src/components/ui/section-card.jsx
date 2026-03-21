import React from 'react';

export function SectionCard({ title, action, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 flex items-center justify-between">
          {title && <h3 className="text-[1.125rem] font-semibold text-slate-900 tracking-tight">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6 pt-2">
        {children}
      </div>
    </div>
  );
}
