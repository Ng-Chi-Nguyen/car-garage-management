import React, { useMemo } from "react";
import { StatCard } from "../../../components/ui/stat-card";
import { useInventoryReportQuery } from "../../reports/reports.hooks";

export function InventoryStats() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const params = useMemo(() => ({
    from: startOfMonth.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0],
  }), [startOfMonth, today]);

  const { data, isLoading } = useInventoryReportQuery(params);

  const partCount = data?.currentInventoryValue?.partCount || 0;
  const lowStockCount = data?.lowStockParts?.length || 0;
  const totalValue = data?.currentInventoryValue?.totalValue || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-3">
        <StatCard
          title="Tổng mặt hàng"
          value={isLoading ? "..." : partCount.toLocaleString('vi-VN')}
          icon="inventory"
          trend=""
          trendUp={true}
        />
      </div>
      <div className="col-span-12 md:col-span-3">
        <StatCard
          title="Vật tư sắp hết"
          value={isLoading ? "..." : lowStockCount.toLocaleString('vi-VN')}
          icon="warning"
          description={lowStockCount > 0 ? "Cần nhập thêm ngay" : "Tồn kho an toàn"}
          valueColor={lowStockCount > 0 ? "text-error" : "text-success"}
        />
      </div>
      <div className="col-span-12 md:col-span-6 bg-surface-container-lowest p-6 rounded-3xl shadow-sm flex flex-col justify-center gap-2 border border-border">
        <p className="text-on-surface-variant text-xs font-semibold mb-1 uppercase tracking-tight">
          Giá trị kho hiện tại
        </p>
        <h3 className="text-3xl font-bold text-on-surface">
          {isLoading ? "..." : totalValue.toLocaleString('vi-VN')}{" "}
          <span className="text-sm font-medium text-on-surface-variant">VNĐ</span>
        </h3>
      </div>
    </div>
  );
}
