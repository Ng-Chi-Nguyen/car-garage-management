import React from 'react';

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
