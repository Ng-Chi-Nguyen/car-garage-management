import React from 'react';

export function StateShell({ children, className = '' }) {
  return (
    <div className={`flex min-h-[300px] w-full flex-col items-center justify-center rounded-xl border border-slate-200/60 bg-slate-50/50 p-8 text-center ${className}`}>
      {children}
    </div>
  );
}
