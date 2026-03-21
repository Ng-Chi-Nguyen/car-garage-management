import React from 'react';

export function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed top-0 left-0">
      <div className="p-4 flex items-center gap-2 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center font-bold">G</div>
        <span className="font-semibold text-lg">GaraFlow</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Placeholder navigation items */}
        <div className="px-3 py-2 bg-blue-600 rounded-md cursor-pointer">
          <span className="font-medium text-sm">Tổng quan</span>
        </div>
        <div className="px-3 py-2 hover:bg-slate-800 text-slate-300 rounded-md cursor-pointer">
          <span className="font-medium text-sm">Xưởng</span>
        </div>
      </nav>
    </div>
  );
}
