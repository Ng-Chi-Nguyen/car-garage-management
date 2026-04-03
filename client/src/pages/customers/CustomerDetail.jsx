import React from "react";
import { PageHeader } from "../../components/ui/page-header";
import { CustomerDetailView } from "../../features/customers/components/CustomerDetailView";

export default function CustomerDetail() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hồ sơ khách hàng"
        subtitle="Chi tiết thông tin và lịch sử dịch vụ"
        breadcrumbs={[
          { label: "CRM", path: "/customers" },
          { label: "Khách hàng" },
          { label: "Chi tiết" },
        ]}
      />

      <CustomerDetailView />
    </div>
  );
}
