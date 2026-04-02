import React from "react";
import { SettlementInvoice } from "../../features/finance/components/SettlementInvoice";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../../components/ui/page-header";

export default function SettlementPrint() {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get("id");
  const id = rawId ? Number(rawId) : null;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
      <PageHeader
        title="Quyết toán / In hóa đơn"
        description="Thanh toán phiếu sửa chữa và xuất biên lai"
        actions={
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-700 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] ring-1 ring-inset ring-slate-200/70 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 active:scale-[0.98]"
            onClick={() => window.print()}
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            In PDF
          </button>
        }
      />

      {id && !isNaN(id) ? (
        <SettlementInvoice id={id} />
      ) : (
        <div className="text-center text-slate-500 py-8">
          Vui lòng chọn một phiếu sửa chữa hợp lệ để in
        </div>
      )}
    </div>
  );
}
