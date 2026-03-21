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
    <div className="w-64 bg-white/85 backdrop-blur-[12px] text-[#191c1e] flex flex-col h-screen fixed top-0 left-0 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-[#0040a1] to-[#0056d2] rounded-lg flex items-center justify-center font-bold text-white shadow-sm">G</div>
        <span className="font-semibold text-lg tracking-tight">GMS Enterprise</span>
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-6 py-2.5 transition-all relative ${
                isActive
                  ? 'text-[#0040a1] font-semibold'
                  : 'text-gray-600 hover:text-gray-900 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-[#0040a1] rounded-r-full" />
                )}
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 pb-6">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-sm">Đăng xuất</span>
        </NavLink>
      </div>
    </div>
  );
}
