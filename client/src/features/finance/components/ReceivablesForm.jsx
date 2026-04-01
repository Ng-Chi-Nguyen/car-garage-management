import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { calculateReceivablesSummary } from "../finance.utils.js";
import { StateShell } from "../../../components/ui/state-shell";
import { useReceivablesQuery, useReceiptHistoryQuery } from "../useFinanceQuery";
import { useCreateReceivableMutation } from "../useFinanceMutation";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

function FinanceField({ label, icon, value, onChange, placeholder, readOnly }) {
  return (
    <label className="space-y-2">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <div className={`flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition ${!readOnly ? 'focus-within:border-slate-400 focus-within:shadow-md' : 'bg-slate-50 opacity-80'}`}>
        <span className="text-lg text-slate-400">{icon}</span>
        <input
          className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      </div>
    </label>
  );
}

function FinancePanel({ icon, title, description, children, className = "" }) {
  return (
    <section
      className={`rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.55)] ${className}`}
    >
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow-lg">
          {icon}
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description ? (
            <p className="text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function ReceiptHistoryPanel({ vehicleId }) {
  const { data, isLoading, isError } = useReceiptHistoryQuery({ vehicleId, limit: 5 });
  const history = data?.paymentReceipts || [];

  if (!vehicleId) return null;

  return (
    <FinancePanel
      icon="🕒"
      title="Lịch sử thu tiền"
      description="Các giao dịch thu tiền gần đây của xe này."
      className="mt-6"
    >
      <StateShell isLoading={isLoading} isError={isError} isEmpty={history.length === 0}>
        <div className="space-y-3">
          {history.map((receipt) => (
            <div key={receipt.MaPhieuThu} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Mã phiếu: #{receipt.MaPhieuThu}</p>
                <p className="text-xs text-slate-500">
                  {new Date(receipt.NgayThu).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600">+{formatCurrency(receipt.SoTienThu)}</p>
                {receipt.GhiChu && <p className="text-xs text-slate-500">{receipt.GhiChu}</p>}
              </div>
            </div>
          ))}
        </div>
      </StateShell>
    </FinancePanel>
  );
}

export function ReceivablesForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const q = searchParams.get("q") || "";
  const vehicleIdParam = searchParams.get("vehicleId");

  const { data, isLoading, isError, error } = useReceivablesQuery({ page, limit: 10, q, groupBy: "vehicle" });
  const receivableCustomers = useMemo(() => data?.items || [], [data?.items]);

  const createMutation = useCreateReceivableMutation();

  const selectedVehicle = useMemo(() => {
    if (!vehicleIdParam) return null;
    return receivableCustomers.find(v => v.vehicleId === Number(vehicleIdParam)) || null;
  }, [vehicleIdParam, receivableCustomers]);

  const handleSelectVehicle = (item) => {
    setSearchParams(prev => {
      if (!item) {
        prev.delete("vehicleId");
      } else {
        if (prev.get("vehicleId") === String(item.vehicleId)) {
          prev.delete("vehicleId");
        } else {
          prev.set("vehicleId", String(item.vehicleId));
        }
      }
      return prev;
    }, { replace: true });
  };

  const [cashGiven, setCashGiven] = useState("");
  const [note, setNote] = useState("");

  const currentDebt = selectedVehicle ? selectedVehicle.outstandingDebt : 0;
  const cashGivenNumber = Number(cashGiven) || 0;
  
  // Rule BR-01: Payment amount cannot exceed current debt.
  const collectedAmount = Math.min(cashGivenNumber, currentDebt);
  const changeAmount = Math.max(cashGivenNumber - collectedAmount, 0);

  const { totalDebtVehicles, totalReceivable } = useMemo(() => calculateReceivablesSummary(receivableCustomers), [receivableCustomers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVehicle) {
      toast.error("Vui lòng chọn xe để thu tiền");
      return;
    }
    if (cashGivenNumber <= 0) {
      toast.error("Số tiền thu phải lớn hơn 0");
      return;
    }

    const payload = {
      MaXe: Number(selectedVehicle.vehicleId),
      NgayThu: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      SoTienThu: collectedAmount,
      PhuongThucThu: "TienMat",
      TrangThai: "DaThu",
      GhiChu: note,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Tạo phiếu thu thành công");
        handleSelectVehicle(null);
        setCashGiven("");
        setNote("");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Lỗi khi tạo phiếu thu");
      }
    });
  };

  return (
    <StateShell
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={false}
    >
      <form id="receivables-form" onSubmit={handleSubmit} onReset={() => {
        handleSelectVehicle(null);
        setCashGiven("");
        setNote("");
      }} className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] lg:px-8 lg:py-8">
        <div className="space-y-6">
          <FinancePanel
            icon="🧾"
            title="Thông tin Phiếu thu"
            description="Chọn xe từ danh sách và nhập số tiền khách đưa."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FinanceField
                label="Khách hàng"
                icon="👤"
                value={selectedVehicle ? selectedVehicle.customerName || "Không xác định" : ""}
                readOnly
                placeholder="Chọn xe bên cạnh..."
              />
              <FinanceField
                label="Biển số xe"
                icon="🚗"
                value={selectedVehicle ? selectedVehicle.licensePlate : ""}
                readOnly
                placeholder="Chọn xe bên cạnh..."
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-[26px] border border-rose-200 bg-rose-50 px-5 py-4">
                <p className="text-sm text-rose-700">Nợ hiện tại</p>
                <p className="mt-2 text-2xl font-semibold text-rose-950">
                  {formatCurrency(currentDebt)}
                </p>
              </div>
              <label className="space-y-2 md:col-span-2">
                <div className="text-sm font-semibold text-slate-700">
                  Khách đưa
                </div>
                <div className="flex items-center gap-3 rounded-[26px] border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm transition focus-within:border-slate-400 focus-within:bg-white focus-within:shadow-md">
                  <span className="text-sm font-semibold text-slate-400">
                    ₫
                  </span>
                  <input
                    inputMode="numeric"
                    className="w-full border-0 bg-transparent text-lg font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    value={cashGiven}
                    onChange={(event) =>
                      setCashGiven(event.target.value.replace(/\D/g, ""))
                    }
                    placeholder="0"
                  />
                </div>
              </label>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[26px] border border-emerald-200 bg-emerald-50 px-5 py-4">
                <p className="text-sm text-emerald-700">Thực thu</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-950">
                  {formatCurrency(collectedAmount)}
                </p>
              </div>
              <div className="rounded-[26px] border border-sky-200 bg-sky-50 px-5 py-4">
                <p className="text-sm text-sky-700">Tiền thối</p>
                <p className="mt-2 text-2xl font-semibold text-sky-950">
                  {formatCurrency(changeAmount)}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Ghi chú
                </span>
                <textarea
                  rows={4}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Bổ sung mô tả cho giao dịch hoặc xác nhận đặc biệt"
                  className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                />
              </label>
            </div>

            <div className="mt-6 rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-900">
                Xác nhận giao dịch
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Phiếu thu sẽ được hạch toán ngay vào doanh thu ngày hôm nay.
              </p>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:opacity-50"
              >
                {createMutation.isPending ? "Đang xử lý..." : "Xác nhận Thu tiền"}
              </button>
            </div>
          </FinancePanel>

          {selectedVehicle && (
            <ReceiptHistoryPanel vehicleId={selectedVehicle.vehicleId} />
          )}

          <FinancePanel
            icon="👥"
            title="Danh sách xe còn nợ"
            description={`${totalDebtVehicles} xe đang có công nợ cần theo dõi.`}
          >
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm biển số, khách hàng... (Enter để tìm)"
                defaultValue={q}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setSearchParams(prev => {
                      if (e.target.value) prev.set('q', e.target.value);
                      else prev.delete('q');
                      prev.set('page', '1');
                      return prev;
                    });
                  }
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {receivableCustomers.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Không có xe nào đang nợ.</p>
              ) : null}
              {receivableCustomers.map((item) => (
                <article
                  key={item.vehicleId}
                  onClick={() => handleSelectVehicle(item)}
                  className={`flex flex-col gap-4 cursor-pointer rounded-[26px] border ${selectedVehicle?.vehicleId === item.vehicleId ? 'border-slate-900 bg-slate-100' : 'border-slate-200 bg-slate-50'} px-5 py-4 transition hover:border-slate-400 lg:flex-row lg:items-center lg:justify-between`}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10">
                      {typeof item.licensePlate === 'string' && item.licensePlate ? item.licensePlate.split('-')[0] : '--'}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {item.customerName || "Không xác định"}
                      </h3>
                      <div className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        {item.licensePlate}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-left lg:text-right">
                    <p className="text-xl font-semibold text-slate-950">
                      {formatCurrency(item.outstandingDebt)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </FinancePanel>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] p-6 text-white shadow-[0_36px_80px_-44px_rgba(15,23,42,0.9)]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl text-white">
                💼
              </div>
              <div>
                <p className="text-sm text-slate-300">
                  Tổng công nợ đang theo dõi
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {formatCurrency(totalReceivable)}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Cập nhật theo danh sách xe còn nợ trong ngày.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.55)]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-xl text-white shadow-lg shadow-emerald-700/20">
                ✅
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-emerald-950">
                  Xác nhận thu tiền?
                </h2>
                <p className="mt-1 text-sm text-emerald-800">
                  Kiểm tra kỹ thông tin trước khi xác nhận.
                </p>

                <dl className="mt-5 space-y-4 text-sm text-emerald-950">
                  <div className="flex items-start justify-between gap-4 border-b border-emerald-200 pb-3">
                    <dt>Khách hàng</dt>
                    <dd className="text-right font-semibold">
                      {selectedVehicle?.customerName || "--"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-emerald-200 pb-3">
                    <dt>Biển số</dt>
                    <dd className="text-right font-semibold">
                      {selectedVehicle?.licensePlate || "--"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt>Số tiền thu</dt>
                    <dd className="text-right font-semibold">
                      {formatCurrency(collectedAmount)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="reset"
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-emerald-300 bg-white px-4 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Đang xử lý..." : "Xác nhận ngay"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </form>
    </StateShell>
  );
}
