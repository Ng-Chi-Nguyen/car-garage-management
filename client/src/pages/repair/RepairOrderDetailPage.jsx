import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/ui/page-header";
import { RepairOrderDetail } from "../../features/repair-orders/components/RepairOrderDetail";

export default function RepairOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/repair-orders")}
          className="p-2 hover:bg-slate-100 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <PageHeader 
          title={`Chi tiết Phiếu Sửa Chữa #${id}`}
          description="Thông tin chi tiết và danh sách công việc/vật tư"
        />
      </div>
      <RepairOrderDetail id={id} />
    </div>
  );
}
