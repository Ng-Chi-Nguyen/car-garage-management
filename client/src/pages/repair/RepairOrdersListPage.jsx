import React from "react";
import { PageHeader } from "../../components/ui/page-header";
import { RepairOrdersList } from "../../features/repair-orders/components/RepairOrdersList";

export default function RepairOrdersListPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Quản lý sửa chữa" 
        description="Quản lý danh sách các phiếu sửa chữa của garage"
      />
      <RepairOrdersList />
    </div>
  );
}