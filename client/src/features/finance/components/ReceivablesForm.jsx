import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { buildFinanceSummaryQueryRange } from "../finance.utils.js";
import { applyReceivablesSearchParams } from "../receivablesSearchParams.js";
import { SectionCard } from "../../../components/ui/section-card";
import { StateShell } from "../../../components/ui/state-shell";
import { useReceivablesQuery, useReceiptHistoryQuery, useFinanceSummary } from "../useFinanceQuery";
import { useCreateReceivableMutation } from "../useFinanceMutation";
import { fetchVehicleDebt } from "../finance.api.js";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

function FinanceField({ label, value, onChange, placeholder, readOnly }) {
  return (
    <label className="space-y-1.5">
      <div className="text-[0.75rem] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider">{label}</div>
      <div className={`flex items-center gap-3 rounded-xl bg-[var(--color-surface-container-lowest)] px-4 py-3 transition ring-1 ring-inset ring-[var(--color-outline-variant)] ${!readOnly ? 'focus-within:ring-[var(--color-primary)] focus-within:ring-opacity-30' : 'opacity-80'}`}>
        <input
          className="w-full border-0 bg-transparent text-[0.875rem] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)]"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      </div>
    </label>
  );
}

function FinancePanel({ title, description, children, className = "" }) {
  return (
    <SectionCard className={`bg-[var(--color-surface-container-low)] shadow-none ${className}`} noPadding>
      <div className="p-6 md:p-8">
        <div className="mb-6 space-y-1.5">
          <h2 className="text-[1.125rem] font-semibold text-[var(--color-on-surface)]">{title}</h2>
          {description ? (
            <p className="text-[0.875rem] text-[var(--color-on-surface-variant)]">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </SectionCard>
  );
}

function PrintableReceipt({ data }) {
  if (!data) return null;
  const { receiptId, paymentDate, vehicle, cashGiven, collectedAmount, changeAmount, note } = data;

  return (
    <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:p-8 print:z-50 text-black">
      <div className="max-w-md mx-auto font-sans">
        <div className="text-center mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold uppercase">Phiếu Thu Tiền</h1>
          <p className="text-sm text-gray-500 mt-1">Mã phiếu: #{receiptId}</p>
          <p className="text-sm text-gray-500">Ngày thu: {new Date(paymentDate).toLocaleDateString("vi-VN")}</p>
        </div>

        <div className="space-y-3 mb-6 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Khách hàng:</span>
            <span className="font-semibold">{vehicle.customerName || "Khách lẻ"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Điện thoại:</span>
            <span className="font-semibold">{vehicle.phoneNumber || "--"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Biển số xe:</span>
            <span className="font-semibold">{vehicle.licensePlate}</span>
          </div>
          {note && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-600 whitespace-nowrap">Ghi chú:</span>
              <span className="font-semibold text-right">{note}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-300 pt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Khách đưa:</span>
            <span>{formatCurrency(cashGiven)}</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Thực thu:</span>
            <span>{formatCurrency(collectedAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tiền thối:</span>
            <span>{formatCurrency(changeAmount)}</span>
          </div>
        </div>

        <div className="mt-12 flex justify-between text-center text-sm">
          <div>
            <p className="font-semibold mb-16">Người nộp tiền</p>
            <p className="text-gray-500 italic">(Ký, ghi rõ họ tên)</p>
          </div>
          <div>
            <p className="font-semibold mb-16">Người thu tiền</p>
            <p className="text-gray-500 italic">(Ký, ghi rõ họ tên)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReceiptHistoryPanel({ vehicleId }) {
  const { data, isLoading, isError } = useReceiptHistoryQuery({ vehicleId, limit: 5, status: "DaThu" });
  const history = data?.paymentReceipts || [];

  if (!vehicleId) return null;

  return (
    <FinancePanel
      title="Lịch sử thu tiền"
      description="Các giao dịch đã thu gần đây của xe này."
      className="mt-6"
    >
      <StateShell isLoading={isLoading} isError={isError}>
        {history.length === 0 ? (
          <p className="rounded-xl bg-[var(--color-surface)] px-4 py-3 text-[0.875rem] text-[var(--color-on-surface-variant)]">
            Hiện chưa có lịch sử thu tiền cho xe này.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((receipt) => (
              <div key={receipt.MaPhieuThu} className="flex items-center justify-between rounded-xl bg-[var(--color-surface-container-lowest)] px-4 py-3 ring-1 ring-inset ring-[var(--color-outline-variant)]">
                <div>
                  <p className="text-[0.875rem] font-semibold text-[var(--color-on-surface)]">Mã phiếu: #{receipt.MaPhieuThu}</p>
                  <p className="text-[0.75rem] text-[var(--color-on-surface-variant)]">
                    {new Date(receipt.NgayThu).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[0.875rem] font-semibold text-[var(--color-primary)]">+{formatCurrency(receipt.SoTienThu)}</p>
                  {receipt.GhiChu && <p className="text-[0.75rem] text-[var(--color-on-surface-variant)]">{receipt.GhiChu}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </StateShell>
    </FinancePanel>
  );
}

export function ReceivablesForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const search = searchParams.get("search") || searchParams.get("q") || "";
  const vehicleIdParam = searchParams.get("vehicleId");

  const [localQ, setLocalQ] = useState(search);

  useEffect(() => {
    setLocalQ(search);
  }, [search]);

  const { data, isLoading, isError, error } = useReceivablesQuery({ page, limit: 10, search, groupBy: "vehicle" });
  const receivableCustomers = useMemo(() => data?.items || [], [data?.items]);
  const pagination = data?.pagination;

  const summaryParams = useMemo(() => buildFinanceSummaryQueryRange(), []);
  const { data: summaryData } = useFinanceSummary(summaryParams);

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
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [lastReceiptData, setLastReceiptData] = useState(null);
  const [isCheckingDebt, setIsCheckingDebt] = useState(false);

  const currentDebt = selectedVehicle ? selectedVehicle.outstandingDebt : 0;
  const cashGivenNumber = Number(cashGiven) || 0;

  const collectedAmount = Math.min(cashGivenNumber, currentDebt);
  const changeAmount = Math.max(cashGivenNumber - collectedAmount, 0);
  const isOverpaid = cashGivenNumber > currentDebt;
  const isInvalid = !selectedVehicle || cashGivenNumber <= 0;

  const totalDebtVehicles = pagination?.totalItems || 0;
  const totalReceivable = summaryData?.totalOutstandingDebt || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) {
      toast.error("Vui lòng chọn xe để thu tiền");
      return;
    }
    if (cashGivenNumber <= 0) {
      toast.error("Số tiền thu phải lớn hơn 0");
      return;
    }

    try {
      setIsCheckingDebt(true);
      const latestDebt = await fetchVehicleDebt(selectedVehicle.vehicleId);
      
      const normalizedLatestDebt = Number(latestDebt) || 0;
      const actualCollectedAmount = Math.min(cashGivenNumber, normalizedLatestDebt);

      if (actualCollectedAmount <= 0) {
        toast.error("Xe không còn nợ để thu thêm.");
        return;
      }

      const payload = {
        MaXe: Number(selectedVehicle.vehicleId),
        NgayThu: paymentDate,
        SoTienThu: Number(actualCollectedAmount),
        PhuongThucThu: "TienMat",
        TrangThai: "DaThu",
        GhiChu: note,
      };

      createMutation.mutate(payload, {
        onSuccess: (data) => {
          toast.success("Tạo phiếu thu thành công");
          setLastReceiptData({
            receiptId: data?.MaPhieuThu ?? data?.paymentReceipt?.MaPhieuThu ?? null,
            vehicle: selectedVehicle,
            cashGiven: cashGivenNumber,
            collectedAmount: actualCollectedAmount,
            changeAmount: Math.max(cashGivenNumber - actualCollectedAmount, 0),
            note: note,
            paymentDate: paymentDate,
          });
          handleSelectVehicle(null);
          setCashGiven("");
          setNote("");
        },
        onError: (err) => {
          const msg = err.response?.data?.message || err.message || "Lỗi khi tạo phiếu thu";
          const details = err.response?.data?.details;
          const errorCode = err.response?.data?.errorCode;

          const detailsText =
            typeof details === "string"
              ? details
              : details && typeof details === "object"
                ? Object.entries(details)
                    .map(([key, value]) => `${key}: ${String(value)}`)
                    .join(" | ")
                : "";

          const finalMessage = [msg, errorCode ? `[${errorCode}]` : null, detailsText || null]
            .filter(Boolean)
            .join(" ");

          if (details) {
            toast.error(finalMessage);
          } else {
            toast.error(errorCode ? `${msg} [${errorCode}]` : msg);
          }
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Không thể kiểm tra công nợ mới nhất. Vui lòng thử lại.");
    } finally {
      setIsCheckingDebt(false);
    }
  };

  return (
    <>
      <div className="print:hidden">
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
            setPaymentDate(new Date().toISOString().split("T")[0]);
            setLastReceiptData(null);
          }} className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
            <div className="space-y-8">
              <FinancePanel
                title="Thông tin Phiếu thu"
                description="Chọn xe từ danh sách và nhập số tiền khách đưa."
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <FinanceField
                    label="Khách hàng"
                    value={selectedVehicle ? `${selectedVehicle.customerName || "Không xác định"}${selectedVehicle.phoneNumber ? ` - ${selectedVehicle.phoneNumber}` : ""}` : ""}
                    readOnly
                    placeholder="Chọn xe bên cạnh..."
                  />
                  <FinanceField
                    label="Biển số xe"
                    value={selectedVehicle ? selectedVehicle.licensePlate : ""}
                    readOnly
                    placeholder="Chọn xe bên cạnh..."
                  />
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  <div className="rounded-xl bg-[var(--color-surface-container-highest)] px-5 py-4">
                    <p className="text-[0.75rem] uppercase tracking-wider text-[var(--color-on-surface-variant)]">Nợ hiện tại</p>
                    <p className="mt-2 text-[1.5rem] font-bold text-[var(--color-on-surface)]">
                      {formatCurrency(currentDebt)}
                    </p>
                  </div>
                  <label className="space-y-1.5 md:col-span-2">
                    <div className="text-[0.75rem] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)]">Ngày thu</div>
                    <input
                      type="date"
                      className="w-full rounded-xl bg-[var(--color-surface-container-lowest)] px-4 py-4 text-[1.125rem] font-semibold text-[var(--color-on-surface)] ring-1 ring-inset ring-[var(--color-outline-variant)] outline-none transition focus:ring-[var(--color-primary)] focus:ring-opacity-30"
                      value={paymentDate}
                      onChange={(event) => setPaymentDate(event.target.value)}
                    />
                  </label>
                  <label className="space-y-1.5 md:col-span-2">
                    <div className="text-[0.75rem] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                      Khách đưa
                    </div>
                    <div className={`flex items-center gap-3 rounded-xl bg-[var(--color-surface-container-lowest)] px-4 py-4 ring-1 ring-inset transition ${isOverpaid ? 'ring-[var(--color-primary)] focus-within:ring-[var(--color-primary)]' : 'ring-[var(--color-outline-variant)] focus-within:ring-[var(--color-primary)] focus-within:ring-opacity-30'}`}>
                      <span className="text-[0.875rem] font-semibold text-[var(--color-on-surface-variant)]">
                        ₫
                      </span>
                      <input
                        inputMode="numeric"
                        className="w-full border-0 bg-transparent text-[1.125rem] font-semibold text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)]"
                        value={cashGiven}
                        onChange={(event) =>
                          setCashGiven(event.target.value.replace(/\D/g, ""))
                        }
                        placeholder="0"
                      />
                    </div>
                    {isOverpaid && (
                      <p className="mt-1.5 text-[0.75rem] text-[var(--color-primary)]">
                        Số tiền khách đưa vượt nợ hiện tại. Hệ thống sẽ tự tính tiền thối.
                      </p>
                    )}
                  </label>
                </div>

                {lastReceiptData?.receiptId ? (
                  <div className="mt-8 flex items-center justify-between rounded-xl bg-[var(--color-surface-container)] px-4 py-3">
                    <p className="text-[0.875rem] font-semibold text-[var(--color-on-surface)]">Đã tạo phiếu thu thành công.</p>
                    <button type="button" className="rounded-xl bg-[var(--color-surface-container-highest)] px-4 py-2 text-[0.875rem] font-semibold text-[var(--color-on-surface)] transition hover:bg-[var(--color-outline-variant)]" onClick={() => window.print()}>
                      In phiếu
                    </button>
                  </div>
                ) : null}

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl bg-[var(--color-surface-container)] px-5 py-4">
                    <p className="text-[0.75rem] uppercase tracking-wider text-[var(--color-on-surface-variant)]">Thực thu</p>
                    <p className="mt-2 text-[1.5rem] font-bold text-[var(--color-on-surface)]">
                      {formatCurrency(collectedAmount)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--color-surface)] px-5 py-4">
                    <p className="text-[0.75rem] uppercase tracking-wider text-[var(--color-on-surface-variant)]">Tiền thối</p>
                    <p className="mt-2 text-[1.5rem] font-bold text-[var(--color-on-surface)]">
                      {formatCurrency(changeAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="space-y-1.5">
                    <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                      Ghi chú
                    </span>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Bổ sung mô tả cho giao dịch..."
                      className="w-full rounded-xl bg-[var(--color-surface-container-lowest)] px-4 py-3 text-[0.875rem] text-[var(--color-on-surface)] outline-none transition placeholder:text-[var(--color-outline)] ring-1 ring-inset ring-[var(--color-outline-variant)] focus:ring-[var(--color-primary)] focus:ring-opacity-30"
                    />
                  </label>
                </div>

                <div className="mt-8 rounded-xl bg-[var(--color-surface-container-highest)] px-6 py-5">
                  <p className="text-[0.875rem] font-semibold text-[var(--color-on-surface)]">
                    Xác nhận giao dịch
                  </p>
                  <p className="mt-2 text-[0.875rem] leading-6 text-[var(--color-on-surface-variant)]">
                    Phiếu thu sẽ được hạch toán ngay vào doanh thu ngày hôm nay.
                  </p>
                  <button
                    type="submit"
                    disabled={isInvalid || createMutation.isPending || isCheckingDebt}
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] px-6 py-3 text-[0.875rem] font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createMutation.isPending || isCheckingDebt ? "Đang xử lý..." : "Xác nhận Thu tiền"}
                  </button>
                </div>
              </FinancePanel>

              {selectedVehicle && (
                <ReceiptHistoryPanel vehicleId={selectedVehicle.vehicleId} />
              )}
            </div>

            <div className="space-y-8">
              <section className="rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] p-8 text-white shadow-[0_10px_15px_-3px_rgba(0,64,161,0.06)]">
                <div className="flex items-start gap-4">
                  <div>
                    <p className="text-[0.875rem] opacity-80 uppercase tracking-wider">
                      Tổng công nợ đang theo dõi
                    </p>
                    <p className="mt-2 text-[2.75rem] font-bold">
                      {formatCurrency(totalReceivable)}
                    </p>
                  </div>
                </div>
              </section>

              <FinancePanel
                title="Danh sách xe còn nợ"
                description={`${totalDebtVehicles} xe đang có công nợ cần theo dõi.`}
              >
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Tìm biển số, khách hàng..."
                    value={localQ}
                    onChange={(e) => setLocalQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        setSearchParams(prev => applyReceivablesSearchParams(prev, localQ));
                      }
                    }}
                    className="w-full rounded-xl bg-[var(--color-surface-container-lowest)] px-4 py-3 text-[0.875rem] outline-none transition ring-1 ring-inset ring-[var(--color-outline-variant)] focus:ring-[var(--color-primary)] focus:ring-opacity-30"
                  />
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {receivableCustomers.length === 0 ? (
                    <p className="text-[0.875rem] text-[var(--color-on-surface-variant)] text-center py-4">Không có xe nào đang nợ.</p>
                  ) : null}
                  {receivableCustomers.map((item) => (
                    <article
                      key={item.vehicleId}
                      onClick={() => handleSelectVehicle(item)}
                      className={`flex flex-col gap-4 cursor-pointer rounded-xl px-5 py-4 transition lg:flex-row lg:items-center lg:justify-between ${selectedVehicle?.vehicleId === item.vehicleId ? 'bg-[var(--color-surface-container-highest)]' : 'bg-[var(--color-surface-container-lowest)] ring-1 ring-inset ring-[var(--color-outline-variant)] hover:bg-[var(--color-surface)]'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-[var(--color-surface)] px-4 py-3 text-[0.875rem] font-semibold text-[var(--color-on-surface)]">
                          {item.licensePlate.split("-")[0]}
                        </div>
                        <div>
                          <h3 className="text-[1rem] font-semibold text-[var(--color-on-surface)]">
                            {item.customerName || "Không xác định"}
                            {item.phoneNumber ? <span className="ml-2 text-[0.875rem] font-normal text-[var(--color-on-surface-variant)]">{item.phoneNumber}</span> : null}
                          </h3>
                          <div className="mt-1.5 text-[0.75rem] font-medium text-[var(--color-on-surface-variant)]">
                            {item.licensePlate}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 text-left lg:text-right">
                        <p className="text-[1.125rem] font-bold text-[var(--color-on-surface)]">
                          {formatCurrency(item.outstandingDebt)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between pt-6 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[var(--color-outline-variant)]">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setSearchParams(prev => { prev.set('page', String(page - 1)); prev.delete('vehicleId'); return prev; })}
                      className="rounded-xl px-4 py-2 text-[0.875rem] font-semibold text-[var(--color-on-surface)] transition hover:bg-[var(--color-surface-container)] disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <span className="text-[0.875rem] text-[var(--color-on-surface-variant)]">
                      Trang {page} / {pagination.totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= pagination.totalPages}
                      onClick={() => setSearchParams(prev => { prev.set('page', String(page + 1)); prev.delete('vehicleId'); return prev; })}
                      className="rounded-xl px-4 py-2 text-[0.875rem] font-semibold text-[var(--color-on-surface)] transition hover:bg-[var(--color-surface-container)] disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </FinancePanel>
            </div>
          </form>
        </StateShell>
      </div>
      <PrintableReceipt data={lastReceiptData} />
    </>
  );
}
