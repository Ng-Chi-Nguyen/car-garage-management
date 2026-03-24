import React from 'react';
import PageHeader from '../../components/PageHeader';
import SectionCard from '../../components/SectionCard';

export default function CustomerDetail() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Hồ sơ khách hàng: Nguyễn Văn A" 
        subtitle="Chi tiết thông tin và lịch sử dịch vụ"
        breadcrumbs={[
          { label: 'CRM', path: '/customers' },
          { label: 'Khách hàng', path: '/customers' },
          { label: 'Chi tiết' }
        ]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Thông tin cá nhân">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Mã KH</span>
              <span className="font-medium text-slate-900">KH001</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Họ tên</span>
              <span className="font-medium text-slate-900">Nguyễn Văn A</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Số điện thoại</span>
              <span className="font-medium text-slate-900">0901234567</span>
            </div>
          </div>
        </SectionCard>
        
        <SectionCard title="Danh sách xe">
          <div className="space-y-4">
             <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Biển số</span>
              <span className="font-medium text-slate-900">51A-123.45</span>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Lịch sử dịch vụ">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Biển số</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">2026-03-21</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">51A-123.45</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Bảo dưỡng định kỳ</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">1,500,000 đ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
