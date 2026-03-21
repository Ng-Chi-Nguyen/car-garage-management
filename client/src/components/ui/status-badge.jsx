import React from 'react';

const STATUS_COLORS = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  default: 'bg-gray-100 text-gray-800'
};

export function StatusBadge({ status = 'default', children }) {
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS.default;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {children}
    </span>
  );
}
