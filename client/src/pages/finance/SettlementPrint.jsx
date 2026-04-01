import React from "react";
import { SettlementInvoice } from "../../features/finance/components/SettlementInvoice";
import { useSearchParams, Link } from "react-router-dom";

export default function SettlementPrint() {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get("id");
  
  const isMissing = rawId === null || rawId.trim() === '';
  const isInvalid = Number.isNaN(Number(rawId)) || Number(rawId) <= 0;
  const hasError = isMissing || isInvalid;
  const id = hasError ? null : Number(rawId);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">
          Quyết toán / In hóa đơn
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            onClick={() => window.print()}
            disabled={hasError}
          >
            <span className="material-symbols-outlined text-sm">print</span>
            In PDF
          </button>
        </div>
      </div>

      {!hasError ? (
        <SettlementInvoice id={id} />
      ) : (
        <div className="text-center text-slate-500 py-8 space-y-4">
          <p>Vui lòng chọn một phiếu sửa chữa hợp lệ để in</p>
          <Link
            to="/finance/receivables"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại Thu tiền
          </Link>
        </div>
      )}
    </div>
  );
}
