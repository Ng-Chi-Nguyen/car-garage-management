import React from 'react';

const STATUS_COLORS = {
  success: 'bg-green-500/15 text-green-700',
  warning: 'bg-yellow-500/15 text-yellow-700',
  danger: 'bg-red-500/15 text-red-700',
  info: 'bg-blue-500/15 text-blue-700',
  default: 'bg-gray-500/15 text-gray-700'
};

export function StatusBadge({ status = 'default', children }) {
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS.default;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium inline-flex items-center justify-center ${colorClass}`}>
      {children}
    </span>
  );
}
