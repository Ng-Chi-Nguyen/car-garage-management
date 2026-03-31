import React from "react";

export default function RepairOrder() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Lập phiếu sửa chữa</h2>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
          <span className="font-semibold">Biển số:</span>
          <span className="font-bold">51H-123.45</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Chi tiết vật tư & phụ tùng
            </h3>
            <button
              type="button"
              className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100"
            >
              + Thêm dòng mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
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
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      className="w-full border rounded p-1.5"
                      defaultValue="Lọc dầu động cơ"
                    />
                  </td>
                  <td className="px-4 py-3 w-24">
                    <input
                      type="number"
                      className="w-full border rounded p-1.5"
                      defaultValue="1"
                    />
                  </td>
                  <td className="px-4 py-3 w-32">
                    <input
                      type="number"
                      className="w-full border rounded p-1.5"
                      defaultValue="250000"
                    />
                  </td>
                  <td className="px-4 py-3 w-32">
                    <input
                      type="number"
                      className="w-full border rounded p-1.5"
                      defaultValue="50000"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    300.000 ₫
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      className="w-full border rounded p-1.5"
                      defaultValue="Nhớt máy Castrol"
                    />
                  </td>
                  <td className="px-4 py-3 w-24">
                    <input
                      type="number"
                      className="w-full border rounded p-1.5"
                      defaultValue="4"
                    />
                  </td>
                  <td className="px-4 py-3 w-32">
                    <input
                      type="number"
                      className="w-full border rounded p-1.5"
                      defaultValue="120000"
                    />
                  </td>
                  <td className="px-4 py-3 w-32">
                    <input
                      type="number"
                      className="w-full border rounded p-1.5"
                      defaultValue="0"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    480.000 ₫
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-semibold">
                  <td
                    colSpan="4"
                    className="px-4 py-3 text-right text-slate-600 rounded-l-lg"
                  >
                    Tổng cộng:
                  </td>
                  <td className="px-4 py-3 text-blue-600 rounded-r-lg">
                    780.000 ₫
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium"
          >
            Lưu nháp
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20"
          >
            Hoàn tất phiếu sửa chữa
          </button>
        </div>
      </form>
    </div>
  );
}
