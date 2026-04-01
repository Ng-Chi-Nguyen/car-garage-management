import React from "react";
import { SettlementInvoice } from "../../features/finance/components/SettlementInvoice";
import { useSearchParams } from "react-router-dom";

export default function SettlementPrint() {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get("id");
  const id = rawId ? Number(rawId) : null;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">
          Quyết toán / In hóa đơn
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
            onClick={() => window.print()}
          >
            <span className="material-symbols-outlined text-sm">print</span>
            In PDF
          </button>
        </div>
      </div>

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
