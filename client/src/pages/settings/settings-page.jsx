import React from "react";
import { PageHeader } from "../../components/ui/page-header";
import { SystemParameters } from "../../features/settings/components/SystemParameters";
import { ServicePricesTable } from "../../features/settings/components/ServicePricesTable";
import { CarBrandsManagement } from "../../features/settings/components/CarBrandsManagement";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Cấu hình hệ thống"
        description="Quản lý các tham số vận hành cốt lõi của Gara"
      />

      <div className="bg-error-container/30 border-l-4 border-error p-4 rounded-xl flex items-start gap-3">
        <span className="material-symbols-outlined text-error">warning</span>
        <div>
          <h4 className="text-on-error-container font-semibold text-sm">
            Cảnh báo vận hành
          </h4>
          <p className="text-on-error-container/80 text-xs mt-0.5">
            Việc thay đổi cấu hình hệ thống sẽ tác động trực tiếp đến quy trình
            vận hành thực tế tại xưởng. Vui lòng kiểm tra kỹ trước khi lưu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <SystemParameters />
        </div>

        <div className="md:col-span-8">
          <ServicePricesTable />
        </div>

        <div className="md:col-span-12">
          <CarBrandsManagement />
        </div>
      </div>
    </div>
  );
}
