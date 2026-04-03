import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/ui/page-header";
import { VehicleIntakeForm } from "../../features/intake/components/VehicleIntakeForm";

export default function VehicleIntake() {
  const navigate = useNavigate();
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  const actions = (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <span>↻</span>
        Làm mới
      </button>
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <span>✕</span>
        Hủy
      </button>
    </div>
  );

  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-6 text-slate-900 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="Tiếp nhận xe mới"
          description={
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center mt-2">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="text-base">📅</span>
                <span>{today}</span>
              </div>
            </div>
          }
          actions={actions}
        />
        <section className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
          <VehicleIntakeForm variant="page" onSuccess={() => navigate("/workshop")} />
        </section>
      </div>
    </div>
  );
}
