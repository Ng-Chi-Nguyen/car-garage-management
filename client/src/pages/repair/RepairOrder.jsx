import React from "react";
import { PageHeader } from "../../components/ui/page-header";
import { RepairOrderForm } from "../../features/repair-orders/components/RepairOrderForm";

export default function RepairOrder() {
  const actions = (
    <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
      <span className="font-semibold">Biển số:</span>
      <span className="font-bold">51H-123.45</span>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Lập phiếu sửa chữa" 
        actions={actions}
      />

      <RepairOrderForm />
    </div>
  );
}