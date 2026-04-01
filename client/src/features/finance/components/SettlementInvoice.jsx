import React from "react";
import { useSettlementQuery } from "../useFinanceQuery";
import { useCreateReceivableMutation } from "../useFinanceMutation";
import { StateShell } from "../../../components/ui/state-shell";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const toNumber = (value) => Number(value ?? 0);

export function SettlementInvoice({ id }) {
  const { isLoading, isError, error, data } = useSettlementQuery(id);
  const createPayment = useCreateReceivableMutation();
  const navigate = useNavigate();

  if (isLoading || isError) {
    return (
      <StateShell isLoading={isLoading} isError={isError} error={error} />
    );
  }

  if (!data) {
    return (
      <StateShell>
        <div className="rounded-xl bg-[var(--color-surface-container-low)] p-6 text-[0.875rem] text-[var(--color-on-surface-variant)]">
          Không tìm thấy dữ liệu hóa đơn.
        </div>
      </StateShell>
    );
  }

  const lineItems = data.ChiTietSuaChua?.map((item) => {
    const partsTotal = toNumber(item.SoLuong) * toNumber(item.DonGiaVatTu);
    const laborTotal = toNumber(item.SoLuong) * toNumber(item.DonGiaTienCong);
    return {
      item,
      partsTotal,
      laborTotal,
      lineTotal: partsTotal + laborTotal,
    };
  }) || [];
  const totalParts = lineItems.reduce((acc, item) => acc + item.partsTotal, 0);
  const totalLabor = lineItems.reduce((acc, item) => acc + item.laborTotal, 0);
  const grandTotal = lineItems.reduce((acc, item) => acc + item.lineTotal, 0) || toNumber(data.TongTien);
  const remainingDebtCandidates = [data.NoConLai, data.CongNoConLai, data.SoTienConLai];
  const firstDefinedDebt = remainingDebtCandidates.find(v => v !== null && v !== undefined);
  const remainingDebt = firstDefinedDebt !== undefined ? Number(firstDefinedDebt) : grandTotal;
  const settlementAmount = Math.min(grandTotal, Math.max(remainingDebt, 0));
  const isOverCollect = settlementAmount < grandTotal;
  const invoiceDate = data.NgaySC ? new Date(data.NgaySC).toLocaleDateString("vi-VN") : new Date().toLocaleDateString("vi-VN");

  const handleConfirm = (e) => {
    e.preventDefault();
    createPayment.mutate(
        {
          MaXe: Number(data.MaXe),
          NgayThu: new Date().toISOString(),
          SoTienThu: Number(settlementAmount),
          PhuongThucThu: "TienMat",
          TrangThai: "DaThu",
        },
      {
        onSuccess: () => {
          toast.success("Tạo phiếu thu thành công!");
          navigate("/finance/receivables");
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || "Lỗi khi tạo phiếu thu");
        },
      }
    );
  };

  return (
    <StateShell isLoading={isLoading} isError={isError} error={error}>
      <form onSubmit={handleConfirm} className="bg-[var(--color-surface-container-lowest)] p-8 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,64,161,0.04),0_10px_15px_-3px_rgba(0,64,161,0.06)] block">
        <div className="text-center mb-10 pb-8 relative after:absolute after:inset-x-24 after:bottom-0 after:h-px after:bg-[var(--color-outline-variant)]">
          <h1 className="text-[1.5rem] font-semibold uppercase tracking-wider text-[var(--color-on-surface)]">
            Hóa Đơn Sửa Chữa
          </h1>
          <p className="text-[0.875rem] text-[var(--color-on-surface-variant)] mt-2">Mã phiếu: #QT-{new Date(data.NgaySC || new Date()).getFullYear()}-{String(data.MaPhieuSC).padStart(3, '0')}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10 text-[0.875rem]">
          <div className="space-y-2">
            <h4 className="font-semibold text-[var(--color-on-surface)] uppercase tracking-wider text-[0.75rem] mb-3">
              Thông tin khách hàng
            </h4>
            <p className="text-[var(--color-on-surface-variant)]"><span className="text-[var(--color-on-surface)] font-medium">Tên:</span> {data.Xe?.KhachHang?.TenChuXe || "Không rõ"}</p>
            <p className="text-[var(--color-on-surface-variant)]"><span className="text-[var(--color-on-surface)] font-medium">SĐT:</span> {data.Xe?.KhachHang?.DienThoai || "Không rõ"}</p>
            <p className="text-[var(--color-on-surface-variant)]"><span className="text-[var(--color-on-surface)] font-medium">Ngày in:</span> {invoiceDate}</p>
          </div>
          <div className="text-right space-y-2">
            <h4 className="font-semibold text-[var(--color-on-surface)] uppercase tracking-wider text-[0.75rem] mb-3">Thông tin xe</h4>
            <p className="text-[var(--color-on-surface-variant)]"><span className="text-[var(--color-on-surface)] font-medium">Biển số:</span> {data.Xe?.BienSo || "Không rõ"}</p>
            <p className="text-[var(--color-on-surface-variant)]"><span className="text-[var(--color-on-surface)] font-medium">Hiệu xe:</span> {data.Xe?.HieuXe?.TenHieuXe || "Không rõ"}</p>
          </div>
        </div>

        <table className="w-full text-left text-[0.875rem] mb-10">
          <thead>
            <tr>
              <th className="py-4 font-semibold text-[0.75rem] text-[var(--color-on-surface-variant)] uppercase tracking-wider">Nội dung</th>
              <th className="py-4 font-semibold text-[0.75rem] text-[var(--color-on-surface-variant)] uppercase tracking-wider text-center">
                SL
              </th>
              <th className="py-4 font-semibold text-[0.75rem] text-[var(--color-on-surface-variant)] uppercase tracking-wider text-right">
                Đơn giá
              </th>
              <th className="py-4 font-semibold text-[0.75rem] text-[var(--color-on-surface-variant)] uppercase tracking-wider text-right">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent hover:[&>tr]:bg-[var(--color-surface-container-low)]">
            {lineItems.length > 0 ? lineItems.map(({ item, partsTotal, laborTotal, lineTotal }) => {
              const renderRows = [];
              if (item.VatTu && partsTotal > 0) {
                renderRows.push(
                  <tr key={`${item.MaCTSC}-vattu`} className="transition-colors">
                    <td className="py-4 px-2 text-[var(--color-on-surface)]">{item.VatTu.TenVatTu}</td>
                    <td className="py-4 px-2 text-center text-[var(--color-on-surface-variant)]">{item.SoLuong}</td>
                    <td className="py-4 px-2 text-right text-[var(--color-on-surface-variant)]">{Number(item.DonGiaVatTu).toLocaleString("vi-VN")}</td>
                    <td className="py-4 px-2 text-right font-medium text-[var(--color-on-surface)]">{partsTotal.toLocaleString("vi-VN")}</td>
                  </tr>
                );
              }
              if (item.TienCong && laborTotal > 0) {
                renderRows.push(
                  <tr key={`${item.MaCTSC}-tiencong`} className="transition-colors">
                    <td className="py-4 px-2 text-[var(--color-on-surface)]">{item.TienCong.NoiDung}</td>
                    <td className="py-4 px-2 text-center text-[var(--color-on-surface-variant)]">{item.SoLuong}</td>
                    <td className="py-4 px-2 text-right text-[var(--color-on-surface-variant)]">{Number(item.DonGiaTienCong).toLocaleString("vi-VN")}</td>
                    <td className="py-4 px-2 text-right font-medium text-[var(--color-on-surface)]">{laborTotal.toLocaleString("vi-VN")}</td>
                  </tr>
                );
              }
              if (renderRows.length > 0) {
                renderRows.push(
                  <tr key={`${item.MaCTSC}-total`} className="bg-[var(--color-surface-container)]">
                    <td className="py-3 px-2 font-semibold text-[0.75rem] uppercase tracking-wider text-[var(--color-on-surface-variant)]" colSpan="3">Tổng dòng</td>
                    <td className="py-3 px-2 text-right font-semibold text-[var(--color-on-surface)]">{lineTotal.toLocaleString("vi-VN")}</td>
                  </tr>
                );
              }
              return renderRows;
            }) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-[var(--color-on-surface-variant)]">Chưa có chi tiết sửa chữa</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end mb-10">
          <div className="w-72 space-y-4 text-[0.875rem]">
            <div className="flex justify-between text-[var(--color-on-surface-variant)]">
              <span>Tổng tiền vật tư:</span>
              <span className="font-medium text-[var(--color-on-surface)]">{totalParts.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between text-[var(--color-on-surface-variant)]">
              <span>Tổng tiền công:</span>
              <span className="font-medium text-[var(--color-on-surface)]">{totalLabor.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between text-[1.125rem] font-bold text-[var(--color-on-surface)] pt-4 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[var(--color-outline-variant)]">
              <span>Tổng cộng:</span>
              <span>{grandTotal.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between font-semibold text-[var(--color-primary)] bg-[var(--color-primary-container)] px-4 py-3 rounded-xl mt-4">
              <span>Thực thu:</span>
              <span>{settlementAmount.toLocaleString("vi-VN")} ₫</span>
            </div>
            {isOverCollect ? (
              <p className="text-right text-[0.75rem] text-[var(--color-on-surface-variant)]">Số thu đã được giới hạn theo công nợ còn lại.</p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end pt-6 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[var(--color-outline-variant)]">
          <button
            type="submit"
            disabled={createPayment.isPending}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] px-8 py-3 text-[0.875rem] font-semibold text-white transition hover:opacity-90 disabled:opacity-50 shadow-[0_4px_6px_-1px_rgba(0,64,161,0.04)]"
          >
            {createPayment.isPending ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </div>
      </form>
    </StateShell>
  );
}
