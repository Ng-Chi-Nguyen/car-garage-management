import { useReceiptHistoryQuery } from "../useFinanceQuery";
import { StateShell } from "../../../components/ui/state-shell";
import { DataTable } from "../../../components/ui/data-table";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

const columns = [
  {
    header: "Mã phiếu",
    accessor: "MaPhieuThu",
    cell: (row) => <span className="font-medium">#{row.MaPhieuThu}</span>,
  },
  {
    header: "Ngày thu",
    accessor: "NgayThu",
    cell: (row) => new Date(row.NgayThu).toLocaleDateString("vi-VN"),
  },
  {
    header: "Số tiền",
    accessor: "SoTienThu",
    cell: (row) => (
      <span className="font-semibold text-emerald-600">
        {formatCurrency(row.SoTienThu)}
      </span>
    ),
  },
];

export function ReceiptHistorySection({ vehicleId, licensePlate }) {
  const { data, isLoading, isError, error } = useReceiptHistoryQuery(vehicleId, {
    limit: 5,
  });

  if (!vehicleId) {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="flex h-32 items-center justify-center text-sm text-slate-500">
          Chọn một xe bên dưới để xem lịch sử thu tiền.
        </div>
      </section>
    );
  }

  const receipts = data?.paymentReceipts || [];

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.55)]">
      <div className="mb-5 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">
            Lịch sử thu tiền
          </h2>
          <p className="text-sm text-slate-500">
            5 giao dịch gần nhất của xe <span className="font-medium text-slate-700">{licensePlate}</span>
          </p>
        </div>
      </div>
      <StateShell
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={receipts.length === 0}
        emptyMessage="Chưa có lịch sử thu tiền nào."
      >
        <DataTable columns={columns} data={receipts} />
      </StateShell>
    </section>
  );
}
