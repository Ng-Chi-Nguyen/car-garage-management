import React from "react";
import { useSettlementQuery } from "../useFinanceQuery";
import { StateShell } from "../../../components/ui/state-shell";

export function SettlementInvoice({ id = "1" }) {
  const { isLoading, isError, error } = useSettlementQuery(id);

  return (
    <StateShell isLoading={isLoading} isError={isError} error={error}>
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center mb-8 border-b pb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-800">
            Hóa Đơn Sửa Chữa
          </h1>
          <p className="text-slate-500 mt-2">Mã phiếu: #QT-2024-001</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">
              Thông tin khách hàng
            </h4>
            <p>Tên: Nguyễn Văn A</p>
            <p>SĐT: 0909.123.456</p>
            <p>Ngày in: 24/05/2024</p>
          </div>
          <div className="text-right">
            <h4 className="font-semibold text-slate-700 mb-2">Thông tin xe</h4>
            <p>Biển số: 51H-123.45</p>
            <p>Hiệu xe: Toyota Vios</p>
          </div>
        </div>

        <table className="w-full text-left text-sm mb-8 border-t border-b">
          <thead className="border-b">
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
          <tbody className="divide-y divide-slate-50">
            <tr>
              <td className="py-3">Lọc dầu động cơ</td>
              <td className="py-3 text-center">1</td>
              <td className="py-3 text-right">250.000</td>
              <td className="py-3 text-right">250.000</td>
            </tr>
            <tr>
              <td className="py-3">Tiền công (thay lọc dầu)</td>
              <td className="py-3 text-center">1</td>
              <td className="py-3 text-right">50.000</td>
              <td className="py-3 text-right">50.000</td>
            </tr>
            <tr>
              <td className="py-3">Nhớt máy Castrol</td>
              <td className="py-3 text-center">4</td>
              <td className="py-3 text-right">120.000</td>
              <td className="py-3 text-right">480.000</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between font-semibold">
              <span>Tổng tiền vật tư:</span>
              <span>730.000 ₫</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Tổng tiền công:</span>
              <span>50.000 ₫</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[color:var(--color-primary)] pt-2 border-t">
              <span>Tổng cộng:</span>
              <span>780.000 ₫</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] font-bold hover:opacity-90"
          >
            Xác nhận thanh toán
          </button>
        </div>
      </section>
    </StateShell>
  );
}
