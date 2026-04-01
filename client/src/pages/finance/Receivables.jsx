import { PageHeader } from "../../components/ui/page-header";
import { ReceivablesForm } from "../../features/finance/components/ReceivablesForm";

export default function Receivables() {
  const actions = (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
      <button
        type="reset"
        form="receivables-form"
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] ring-1 ring-inset ring-slate-200/70 transition hover:bg-slate-50 hover:ring-slate-300/70"
      >
        Hủy thao tác
      </button>
      <button
        type="submit"
        form="receivables-form"
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
      >
        <span>💾</span>
        Lưu Phiếu thu
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thu tiền và Công nợ"
        description="Tạo phiếu thu mới với xác nhận giao dịch và danh sách xe còn nợ."
        actions={actions}
      />
      <section className="overflow-hidden rounded-[30px] bg-white shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] ring-1 ring-inset ring-slate-200/70">
        <ReceivablesForm />
      </section>
    </div>
  );
}
