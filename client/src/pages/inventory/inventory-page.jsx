import React, { useState } from "react";
import { PageHeader } from "../../components/ui/page-header";
import { InventoryStats } from "../../features/inventory/components/InventoryStats";
import { InventoryList } from "../../features/inventory/components/InventoryList";
import { QuickImportModal } from "../../features/inventory/components/QuickImportModal";

export default function InventoryPage() {
  const [isQuickImportOpen, setIsQuickImportOpen] = useState(false);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quản lý Kho Vật tư"
        description="Theo dõi và quản lý tình trạng tồn kho vật tư, phụ tùng"
        actions={
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-semibold text-sm shadow-md hover:scale-[0.98] transition-transform duration-300">
              <span className="material-symbols-outlined">add</span>
              Thêm vật tư
            </button>
            <button 
              onClick={() => setIsQuickImportOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-primary border border-primary/10 rounded-xl font-semibold text-sm shadow-sm hover:bg-primary-fixed transition-colors"
            >
              <span className="material-symbols-outlined">input</span>
              Nhập kho nhanh
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-secondary border border-outline-variant/30 rounded-xl font-semibold text-sm shadow-sm hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">history_edu</span>
              Xem thẻ kho
            </button>
          </div>
        }
      />

      <InventoryStats />
      <InventoryList />

      {isQuickImportOpen && (
        <QuickImportModal onClose={() => setIsQuickImportOpen(false)} />
      )}
    </div>
  );
}
