import React from 'react';
import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const navItems = [
    { name: 'Tổng quan', path: '/dashboard', icon: 'dashboard' },
    { name: 'Trạng thái xưởng', path: '/workshop', icon: 'build' },
    { name: 'Tiếp nhận xe', path: '/intake', icon: 'directions_car' },
    { name: 'Phiếu sửa chữa', path: '/repair-orders?page=1', icon: 'receipt_long' },
    { name: 'Kho vật tư', path: '/inventory', icon: 'inventory_2' },
    { name: 'Tài chính', path: '/finance/receivables', icon: 'payments' },
    { name: 'Khách hàng', path: '/customers', icon: 'people' },
    { name: 'Cài đặt', path: '/settings', icon: 'settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed top-0 left-0">
      <div className="p-4 flex items-center gap-2 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center font-bold">G</div>
        <span className="font-semibold text-lg">GMS Enterprise</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="font-medium text-sm">Đăng xuất</span>
        </NavLink>
      </div>
    </div>
  );
}
