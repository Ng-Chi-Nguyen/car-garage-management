import React from 'react';

export function SectionCard({ title, action, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl ${className}`}>
      {(title || action) && (
        <div className="px-6 pt-6 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
