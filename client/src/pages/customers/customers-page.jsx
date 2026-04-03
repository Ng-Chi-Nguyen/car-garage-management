import React, { useState } from "react";
import { PageHeader } from "../../components/ui/page-header";
import { CustomersStats } from "../../features/customers/components/CustomersStats";
import { CustomersList } from "../../features/customers/components/CustomersList";
import { AddCustomerModal } from "../../features/customers/components/AddCustomerModal";

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 relative">
      <PageHeader
        title="Danh sách Khách hàng"
        description="Theo dõi và quản lý thông tin khách hàng thân thiết"
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">
              person_add
            </span>
            <span>Thêm khách hàng mới</span>
          </button>
        }
      />

      <CustomersStats />
      <CustomersList />

      {isModalOpen && (
        <AddCustomerModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
