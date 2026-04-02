import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import StatCard from "../../components/StatCard";
import { useCustomerReportQuery } from "../../features/customers/useCustomerReportQuery";

export default function CustomerAnalytics() {
  const [filters, setFilters] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    granularity: 'day'
  });

  const { data, isLoading, isError } = useCustomerReportQuery(filters);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo khách hàng chuyên sâu"
        subtitle="Thống kê và phân tích dữ liệu khách hàng"
        breadcrumbs={[
          { label: "CRM", path: "/customers" },
          { label: "Khách hàng", path: "/customers" },
          { label: "Báo cáo chuyên sâu" },
        ]}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">
          Đã có lỗi xảy ra khi tải dữ liệu báo cáo.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Khách hàng mới"
              value={data?.newCustomersTimeseries?.totalNewCustomers || 0}
              trend={null}
            />
            <StatCard
              title="Khách hàng doanh thu cao nhất"
              value={data?.topRevenueCustomer ? data.topRevenueCustomer.customerName : "N/A"}
              description={data?.topRevenueCustomer ? formatCurrency(data.topRevenueCustomer.totalRevenue) : ""}
              trend={null}
            />
            <StatCard
              title="Khách hàng nợ nhiều nhất"
              value={data?.topDebtCustomer ? data.topDebtCustomer.customerName : "N/A"}
              description={data?.topDebtCustomer ? formatCurrency(data.topDebtCustomer.totalDebt) : ""}
              trend={null}
            />
          </div>

          <SectionCard title="Phân tích khách hàng mới">
            <div className="h-64 flex items-center justify-center bg-slate-50 border border-slate-200 rounded text-slate-400">
              {data?.newCustomersTimeseries?.items?.length > 0 ? (
                <div className="w-full h-full p-4 overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số KH mới</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.newCustomersTimeseries.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.label}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.newCustomers}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                "[Không có dữ liệu]"
              )}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}
