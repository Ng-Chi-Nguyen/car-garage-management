import React from 'react';
import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const navItems = [
    { name: 'Tổng quan', path: '/dashboard', icon: 'dashboard' },
    { name: 'Trạng thái xưởng', path: '/workshop', icon: 'build' },
    { name: 'Tiếp nhận xe', path: '/intake', icon: 'directions_car' },
    { name: 'Kho vật tư', path: '/inventory', icon: 'inventory_2' },
    { name: 'Tài chính', path: '/finance/receivables', icon: 'payments' },
    { name: 'Khách hàng', path: '/customers', icon: 'people' },
    { name: 'Cài đặt', path: '/settings', icon: 'settings' },
  ];

  return (
    <div className="w-64 bg-surface-container-lowest/85 backdrop-blur-[12px] text-on-surface flex flex-col h-screen fixed top-0 left-0 border-r border-outline-variant/10 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-primary/20">G</div>
        <span className="font-semibold text-lg tracking-tight">GMS Enterprise</span>
      </div>
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-2.5 transition-all relative ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant font-medium hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
                <span className="material-symbols-outlined text-[1.25rem]">{item.icon}</span>
                <span className="text-[0.875rem]">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant font-medium hover:text-error hover:bg-error/5 rounded-lg transition-all"
        >
          <span className="material-symbols-outlined text-[1.25rem]">logout</span>
          <span className="text-[0.875rem]">Đăng xuất</span>
        </NavLink>
      </div>
    </div>
  );
}
