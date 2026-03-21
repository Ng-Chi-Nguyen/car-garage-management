import React from 'react';

export function Topbar() {
  return (
    <header className="h-16 bg-white/85 backdrop-blur-[12px] flex items-center justify-between px-6 sticky top-0 z-10 transition-all">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs placeholder */}
        <h1 className="text-xl font-semibold text-[#191c1e] tracking-tight">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#0040a1] font-medium shadow-sm">
          A
        </div>
      </div>
    </header>
  );
}
