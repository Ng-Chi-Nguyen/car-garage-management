import React from 'react';
import { NavLink } from 'react-router-dom';
import { authStorage } from '../../features/auth/auth.storage';

export function Sidebar() {
  const navItems = [
    { name: 'Tổng quan', path: '/dashboard', icon: 'dashboard' },
    { name: 'Trạng thái xưởng', path: '/workshop', icon: 'build' },
    { name: 'Tiếp nhận xe', path: '/intake', icon: 'directions_car' },
    { name: 'Phiếu sửa chữa', path: '/repair-orders?page=1', icon: 'receipt_long' },
    { name: 'Kho vật tư', path: '/inventory', icon: 'inventory_2' },
    { name: 'Tài chính', path: '/finance/receivables', icon: 'payments' },
    { name: 'Khách hàng', path: '/customers', icon: 'people' },
    { name: 'Thống kê KH', path: '/customers/analytics', icon: 'analytics' },
    { name: 'Báo cáo doanh thu', path: '/reports/revenue', icon: 'bar_chart' },
    { name: 'Báo cáo công nợ', path: '/reports/finance-debt', icon: 'account_balance' },
    { name: 'Báo cáo tồn kho', path: '/reports/inventory', icon: 'inventory' },
    { name: 'Báo cáo sửa chữa', path: '/reports/repair', icon: 'handyman' },
    { name: 'Nhân viên', path: '/admin/users', icon: 'manage_accounts' },
    { name: 'Cài đặt', path: '/settings', icon: 'settings' },
    { name: 'Lịch sử HĐ', path: '/settings/activity-log', icon: 'history' },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    authStorage.clearSession();
    // Use hard reload for robust state clearing without needing queryClient.clear()
    window.location.replace('/login');
  };

  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 text-slate-800 flex flex-col h-screen fixed top-0 left-0">
      <div className="p-4 flex flex-col gap-1 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white">PE</div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">Precision Engine</span>
        </div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider pl-10">Quản lý Garage</span>
      </div>
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 transition-all border-l-4 ${
                isActive
                  ? 'bg-blue-50 border-blue-600 text-blue-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`
            }
          >
            <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400">support_agent</span>
          <span className="font-medium text-sm">Hỗ trợ</span>
        </a>
        <a
          href="/login"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-medium text-sm">Đăng xuất</span>
        </a>
      </div>
    </div>
  );
}
