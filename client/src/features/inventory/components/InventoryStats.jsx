import React from "react";
import { StatCard } from "../../../components/ui/stat-card";

export function InventoryStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-3">
        <StatCard
          title="Tổng mặt hàng"
          value="1,284"
          icon="inventory"
          trend="+12% tháng này"
          trendUp={true}
        />
      </div>
      <div className="col-span-12 md:col-span-3">
        <StatCard
          title="Vật tư sắp hết"
          value="24"
          icon="warning"
          description="Cần nhập thêm ngay"
          valueColor="text-error"
        />
      </div>
      <div className="col-span-12 md:col-span-6 bg-surface-container-lowest p-6 rounded-3xl shadow-sm flex items-center justify-between gap-6 border border-border">
        <div className="flex-1">
          <p className="text-on-surface-variant text-xs font-semibold mb-1 uppercase tracking-tight">
            Giá trị kho hiện tại
          </p>
          <h3 className="text-3xl font-bold text-on-surface">
            4.820.500.000{" "}
            <span className="text-sm font-medium text-on-surface-variant">VNĐ</span>
          </h3>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-[10px] font-bold text-on-surface-variant">
                Phụ tùng: 70%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning"></span>
              <span className="text-[10px] font-bold text-on-surface-variant">
                Dầu nhớt: 20%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-surface-variant"></span>
              <span className="text-[10px] font-bold text-on-surface-variant">
                Khác: 10%
              </span>
            </div>
          </div>
        </div>
        <div className="w-32 h-20 bg-surface-container rounded-xl flex items-end p-2 gap-1">
          <div className="w-1/4 bg-primary-container h-[40%] rounded-sm"></div>
          <div className="w-1/4 bg-primary-fixed h-[60%] rounded-sm"></div>
          <div className="w-1/4 bg-primary/70 h-[90%] rounded-sm"></div>
          <div className="w-1/4 bg-primary h-[75%] rounded-sm"></div>
        </div>
      </div>
    </div>
  );
}
