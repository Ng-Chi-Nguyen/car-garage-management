import React from "react";
import { StatCard } from "../../../components/ui/stat-card";

export function CustomersStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Tổng khách hàng"
        value="1,284"
        icon="group"
        trend="+12%"
        trendUp={true}
        description="Khách hàng có lịch sử giao dịch"
      />
      <StatCard
        title="Khách hàng VIP"
        value="42"
        icon="workspace_premium"
        description="Chiếm 3.2% tổng số"
      />
      <StatCard
        title="Tổng công nợ"
        value="152.4M"
        icon="account_balance_wallet"
        description="Cần thu hồi từ 18 khách"
        valueColor="text-error"
      />
      <StatCard
        title="Lượt sửa chữa/Tháng"
        value="312"
        icon="speed"
        description="Trung bình 10.4 lượt/ngày"
      />
    </div>
  );
}
