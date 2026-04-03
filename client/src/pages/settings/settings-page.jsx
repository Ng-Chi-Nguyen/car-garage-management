import React from "react";
import { PageHeader } from "../../components/ui/page-header";
import { ServicePricesTable } from "../../features/settings/components/ServicePricesTable";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Cài đặt tiền công"
        description="Quản lý CRUD danh mục tiền công sửa chữa"
      />

      <div className="grid grid-cols-1 gap-6">
        <div>
          <ServicePricesTable />
        </div>
      </div>
    </div>
  );
}
