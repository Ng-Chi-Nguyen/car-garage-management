import React from "react";
import { SectionCard } from "../../../components/ui/section-card";

export function RepairOrderForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SectionCard title="Chi tiết vật tư & phụ tùng">
        <div className="flex justify-end mb-4 -mt-10">
          <button
            type="button"
            className="text-sm bg-secondary/10 text-secondary px-3 py-1.5 rounded-lg font-medium hover:bg-secondary/20"
          >
            + Thêm dòng mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium rounded-l-lg">
                  Tên vật tư / Phụ tùng
                </th>
                <th className="px-4 py-3 font-medium">Số lượng</th>
                <th className="px-4 py-3 font-medium">Đơn giá</th>
                <th className="px-4 py-3 font-medium">Tiền công</th>
                <th className="px-4 py-3 font-medium rounded-r-lg">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                    defaultValue="Lọc dầu động cơ"
                  />
                </td>
                <td className="px-4 py-3 w-24">
                  <input
                    type="number"
                    className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                    defaultValue="1"
                  />
                </td>
                <td className="px-4 py-3 w-32">
                  <input
                    type="number"
                    className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                    defaultValue="250000"
                  />
                </td>
                <td className="px-4 py-3 w-32">
                  <input
                    type="number"
                    className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                    defaultValue="50000"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  300.000 ₫
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                    defaultValue="Nhớt máy Castrol"
                  />
                </td>
                <td className="px-4 py-3 w-24">
                  <input
                    type="number"
                    className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                    defaultValue="4"
                  />
                </td>
                <td className="px-4 py-3 w-32">
                  <input
                    type="number"
                    className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                    defaultValue="120000"
                  />
                </td>
                <td className="px-4 py-3 w-32">
                  <input
                    type="number"
                    className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                    defaultValue="0"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  480.000 ₫
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-muted font-semibold">
                <td
                  colSpan="4"
                  className="px-4 py-3 text-right text-muted-foreground rounded-l-lg"
                >
                  Tổng cộng:
                </td>
                <td className="px-4 py-3 text-primary rounded-r-lg">
                  780.000 ₫
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted"
        >
          Lưu nháp
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary/90"
        >
          Hoàn tất phiếu sửa chữa
        </button>
      </div>
    </form>
  );
}