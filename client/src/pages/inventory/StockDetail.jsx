import React from "react";
import { PageHeader } from "../../components/ui/page-header";
import { StockDetailView } from "../../features/inventory/components/StockDetailView";

export default function StockDetail() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Thẻ kho chi tiết"
        subtitle="Chi tiết xuất nhập tồn kho"
        breadcrumbs={[
          { label: "Kho", path: "/inventory" },
          { label: "Quản lý kho", path: "/inventory" },
          { label: "Thẻ kho" },
        ]}
      />

      <StockDetailView />
    </div>
  );
}
