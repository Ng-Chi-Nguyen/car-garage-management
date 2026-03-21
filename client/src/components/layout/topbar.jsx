import React from 'react';

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 px-6 py-4 backdrop-blur-xl md:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 shadow-sm lg:min-w-[360px]">
          <span className="material-symbols-outlined text-slate-400">search</span>
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng, biển số, lệnh sửa..."
            className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            readOnly
          />
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <div className="flex items-center gap-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-900">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-900">
              <span className="material-symbols-outlined text-[20px]">forum</span>
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">Anh Minh</p>
              <p className="text-xs font-medium text-slate-400">Quản lý vận hành</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-blue-500/25">
              AM
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
