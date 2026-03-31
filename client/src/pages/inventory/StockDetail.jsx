import React from "react";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";

export default function StockDetail() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Thẻ kho chi tiết: Lọc nhớt Innova"
        subtitle="Chi tiết xuất nhập tồn kho"
        breadcrumbs={[
          { label: "Kho", path: "/inventory" },
          { label: "Quản lý kho", path: "/inventory" },
          { label: "Thẻ kho" },
        ]}
      />

      <SectionCard title="Thông tin vật tư">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="block text-sm text-slate-500 mb-1">Mã vật tư</span>
            <span className="block font-medium text-slate-900">VT-0012</span>
          </div>
          <div>
            <span className="block text-sm text-slate-500 mb-1">
              Tên vật tư
            </span>
            <span className="block font-medium text-slate-900">
              Lọc nhớt Innova
            </span>
          </div>
          <div>
            <span className="block text-sm text-slate-500 mb-1">
              Đơn vị tính
            </span>
            <span className="block font-medium text-slate-900">Cái</span>
          </div>
          <div>
            <span className="block text-sm text-slate-500 mb-1">
              Tồn kho hiện tại
            </span>
            <span className="block font-medium text-slate-900">45</span>
          </div>
          <div>
            <span className="block text-sm text-slate-500 mb-1">
              Giá nhập chuẩn
            </span>
            <span className="block font-medium text-slate-900">120,000 đ</span>
          </div>
          <div>
            <span className="block text-sm text-slate-500 mb-1">
              Giá bán chuẩn
            </span>
            <span className="block font-medium text-slate-900">150,000 đ</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Lịch sử giao dịch">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tồn cuối
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  2026-03-21
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  Xuất
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  -2
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  45
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  Sửa chữa xe 51A-123.45
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  2026-03-20
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  Nhập
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +50
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  47
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  Nhập hàng NCC A
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
