import React from "react";
import { StatCard } from "../../../components/ui/stat-card";
import { useCustomerStatsQuery } from "../useCustomerStatsQuery";

export function CustomersStats() {
  const { data: stats = {}, isLoading } = useCustomerStatsQuery();

  if (isLoading) return <div>Loading stats...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Tổng khách hàng"
        value={stats.totalCustomers?.toLocaleString() || "0"}
        icon="group"
        description="Khách hàng có lịch sử giao dịch"
      />
      <StatCard
        title="Khách hàng VIP"
        value={stats.vipCustomers?.toLocaleString() || "0"}
        icon="workspace_premium"
        description={`Chiếm ${stats.totalCustomers ? ((stats.vipCustomers / stats.totalCustomers) * 100).toFixed(1) : 0}% tổng số`}
      />
      <StatCard
        title="Tổng công nợ"
        value={stats.totalOutstandingDebt || "0 ₫"}
        icon="account_balance_wallet"
        valueColor="text-error"
      />
      <StatCard
        title="Lượt sửa chữa/Tháng"
        value={stats.monthlyRepairOrders?.toLocaleString() || "0"}
        icon="speed"
      />
    </div>
  );
}
