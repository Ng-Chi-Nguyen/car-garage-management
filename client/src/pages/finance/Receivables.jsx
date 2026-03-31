import { PageHeader } from "../../components/ui/page-header";
import { ReceivablesForm } from "../../features/finance/components/ReceivablesForm";

export default function Receivables() {
  const actions = (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        Hủy thao tác
      </button>
      <button
        type="button"
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
      <section className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
        <ReceivablesForm />
      </section>
    </div>
  );
}
