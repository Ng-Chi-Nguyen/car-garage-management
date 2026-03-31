import React from "react";
import { SettlementInvoice } from "../../features/finance/components/SettlementInvoice";

export default function SettlementPrint() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

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
          >
            <span className="material-symbols-outlined text-sm">print</span>
            In PDF
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <SettlementInvoice id="1" />
      </form>
    </div>
  );
}
