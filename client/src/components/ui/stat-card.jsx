import React from 'react';

export function StatCard({ label, value, trend, icon }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.875rem] font-medium text-slate-500 tracking-wide">{label}</p>
          <p className="text-[2.75rem] font-bold text-slate-900 mt-2 leading-none tracking-tight">{value}</p>
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      {trend && (
        <div className={`mt-4 text-[0.75rem] font-medium px-2 py-1 rounded-md inline-block ${trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );
}
