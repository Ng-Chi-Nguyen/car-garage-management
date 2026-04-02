import React from "react";
import { PageHeader } from "../../components/ui/page-header";
import { RepairOrderForm } from "../../features/repair-orders/components/RepairOrderForm";

export default function RepairOrder() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Lập phiếu sửa chữa" 
      />
      <RepairOrderForm />
    </div>
  );
}
