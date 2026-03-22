import React from 'react';
import { useLocation } from 'react-router-dom';

export function Topbar() {
  const location = useLocation();
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Tổng quan';
    if (path.includes('workshop')) return 'Trạng thái xưởng';
    if (path.includes('intake')) return 'Tiếp nhận xe';
    if (path.includes('inventory')) return 'Kho vật tư';
    if (path.includes('finance')) return 'Tài chính';
    if (path.includes('customers')) return 'Khách hàng';
    if (path.includes('settings')) return 'Cài đặt';
    if (path.includes('activity')) return 'Nhật ký thao tác';
    return 'Dashboard';
  };

  return (
    <header className="h-[72px] bg-surface-container-lowest/85 backdrop-blur-[12px] flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-[1.125rem] font-semibold text-on-surface tracking-tight">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-[0.875rem] font-semibold text-on-surface group-hover:text-primary transition-colors">Admin User</p>
            <p className="text-[0.75rem] font-medium text-on-surface-variant">Quản trị viên</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-[0.875rem] group-hover:bg-primary group-hover:text-white transition-all">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
