import React from 'react';

export default function PaymentsPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Phiếu thu tiền</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Thông tin thu tiền</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Tên chủ xe</label>
              <input type="text" className="w-full border rounded-lg p-2" defaultValue="Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Biển số</label>
              <input type="text" className="w-full border rounded-lg p-2 bg-slate-50 text-slate-500" defaultValue="51H-123.45" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Số tiền thu (VNĐ)</label>
              <input type="number" className="w-full border rounded-lg p-2 font-semibold text-blue-600" defaultValue="780000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Lý do thu</label>
              <textarea className="w-full border rounded-lg p-2 h-24" defaultValue="Thanh toán chi phí sửa chữa phiếu #QT-2024-001"></textarea>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Tóm tắt công nợ</h3>
            <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Tổng nợ cũ:</span>
                <span className="font-semibold text-slate-800">0 ₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Phát sinh mới:</span>
                <span className="font-semibold text-slate-800">780.000 ₫</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-slate-600">Thanh toán lần này:</span>
                <span className="font-bold text-green-600">-780.000 ₫</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 mt-2 text-base">
                <span className="font-semibold text-slate-800">Nợ còn lại:</span>
                <span className="font-bold text-blue-600">0 ₫</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium">
              Hủy
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold">
              Lưu phiếu thu
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
