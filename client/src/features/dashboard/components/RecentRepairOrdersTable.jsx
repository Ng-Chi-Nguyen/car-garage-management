import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionCard } from '../../../components/ui/section-card';
import { handleViewAllRecentOrders } from '../dashboard.interactions';

export function RecentRepairOrdersTable({ orders, isLoading, isError }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <SectionCard title="Danh sách xe mới tiếp nhận" className="lg:col-span-2">
        <div className="p-8 text-center text-slate-500">Đang tải danh sách...</div>
      </SectionCard>
    );
  }

  if (isError) {
    return (
      <SectionCard title="Danh sách xe mới tiếp nhận" className="lg:col-span-2">
        <div className="p-8 text-center text-red-500">Lỗi khi tải danh sách.</div>
      </SectionCard>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <SectionCard title="Danh sách xe mới tiếp nhận" className="lg:col-span-2">
        <div className="p-8 text-center text-slate-500">Chưa có dữ liệu.</div>
      </SectionCard>
    );
  }

  const formatTime = (dateString) => {
    try {
      const d = new Date(dateString);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} - ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  return (
    <SectionCard 
      title="Danh sách xe mới tiếp nhận" 
      className="lg:col-span-2" 
      action={
        <button 
          className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
          onClick={() => handleViewAllRecentOrders(navigate)}
        >
          Xem tất cả
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-slate-100">
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biển số</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hiệu xe</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chủ xe</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-3 text-sm font-bold text-slate-900">{order.licensePlate}</td>
                <td className="py-3 text-sm text-slate-500">{order.vehicleModel}</td>
                <td className="py-3 text-sm text-slate-700">{order.customerName}</td>
                <td className="py-3 text-sm text-slate-500 text-right">
                  {order.createdAt ? formatTime(order.createdAt) : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
