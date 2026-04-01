import React from "react";
import { useSettlementQuery } from "../useFinanceQuery";
import { useCreateReceivableMutation } from "../useFinanceMutation";
import { StateShell } from "../../../components/ui/state-shell";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function SettlementInvoice({ id }) {
  const { isLoading, isError, error, data } = useSettlementQuery(id);
  const createPayment = useCreateReceivableMutation();
  const navigate = useNavigate();

  if (isLoading || isError || !data) {
    return (
      <StateShell isLoading={isLoading} isError={isError} error={error} isEmpty={!data} />
    );
  }

  // Calculate parts and labor totals
  const totalParts = data.ChiTietSuaChua?.reduce((acc, item) => acc + (Number(item.SoLuong) * Number(item.DonGiaVatTu)), 0) || 0;
  const totalLabor = data.ChiTietSuaChua?.reduce((acc, item) => acc + (Number(item.SoLuong) * Number(item.DonGiaTienCong)), 0) || 0;
  const grandTotal = Number(data.TongTien) || (totalParts + totalLabor);
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
      <form onSubmit={handleConfirm} className="bg-white p-8 rounded-2xl shadow-[0_24px_60px_-48px_rgba(15,23,42,0.35)] block">
        <div className="text-center mb-8 pb-6 relative after:absolute after:inset-x-24 after:bottom-0 after:h-px after:bg-slate-100/80">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-800">
            Hóa Đơn Sửa Chữa
          </h1>
          <p className="text-slate-500 mt-2">Mã phiếu: #QT-{new Date(data.NgaySC || new Date()).getFullYear()}-{String(data.MaPhieuSC).padStart(3, '0')}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">
              Thông tin khách hàng
            </h4>
            <p>Tên: {data.Xe?.KhachHang?.TenChuXe || "Không rõ"}</p>
            <p>SĐT: {data.Xe?.KhachHang?.DienThoai || "Không rõ"}</p>
            <p>Ngày in: {invoiceDate}</p>
          </div>
          <div className="text-right">
            <h4 className="font-semibold text-slate-700 mb-2">Thông tin xe</h4>
            <p>Biển số: {data.Xe?.BienSo || "Không rõ"}</p>
            <p>Hiệu xe: {data.Xe?.HieuXe?.TenHieuXe || "Không rõ"}</p>
          </div>
        </div>

        <table className="w-full text-left text-sm mb-8 border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="py-3 font-semibold text-slate-600">Nội dung</th>
              <th className="py-3 font-semibold text-slate-600 text-center">
                SL
              </th>
              <th className="py-3 font-semibold text-slate-600 text-right">
                Đơn giá
              </th>
              <th className="py-3 font-semibold text-slate-600 text-right">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {data.ChiTietSuaChua?.length > 0 ? data.ChiTietSuaChua.map((item) => {
              const rowPartsTotal = Number(item.SoLuong) * Number(item.DonGiaVatTu);
              const rowLaborTotal = Number(item.SoLuong) * Number(item.DonGiaTienCong);
              
              // Only render if there's actual content
              const renderRows = [];
              if (item.VatTu && rowPartsTotal > 0) {
                renderRows.push(
                  <tr key={`${item.MaCTSC}-vattu`}>
                    <td className="py-3">{item.VatTu.TenVatTu}</td>
                    <td className="py-3 text-center">{item.SoLuong}</td>
                    <td className="py-3 text-right">{Number(item.DonGiaVatTu).toLocaleString("vi-VN")}</td>
                    <td className="py-3 text-right">{rowPartsTotal.toLocaleString("vi-VN")}</td>
                  </tr>
                );
              }
              if (item.TienCong && rowLaborTotal > 0) {
                renderRows.push(
                  <tr key={`${item.MaCTSC}-tiencong`}>
                    <td className="py-3">{item.TienCong.NoiDung}</td>
                    <td className="py-3 text-center">{item.SoLuong}</td>
                    <td className="py-3 text-right">{Number(item.DonGiaTienCong).toLocaleString("vi-VN")}</td>
                    <td className="py-3 text-right">{rowLaborTotal.toLocaleString("vi-VN")}</td>
                  </tr>
                );
              }
              return renderRows;
            }) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-slate-500">Chưa có chi tiết sửa chữa</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between font-semibold">
              <span>Tổng tiền vật tư:</span>
              <span>{totalParts.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Tổng tiền công:</span>
              <span>{totalLabor.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-slate-100/80">
              <span>Tổng cộng:</span>
              <span>{grandTotal.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-700">
              <span>Thực thu:</span>
              <span>{settlementAmount.toLocaleString("vi-VN")} ₫</span>
            </div>
            {isOverCollect ? (
              <p className="text-right text-xs text-amber-700">Số thu đã được giới hạn theo công nợ còn lại.</p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={createPayment.isPending}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-8 py-3 font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:opacity-50"
          >
            {createPayment.isPending ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </div>
      </form>
    </StateShell>
  );
}
