import React from 'react';

export default function IntakeModalPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Lập phiếu tiếp nhận mới</h2>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              1. Thông tin chung
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Biển số xe *</label>
                <input type="text" className="w-full border rounded-lg p-2" placeholder="Nhập biển số" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Tên khách hàng</label>
                <input type="text" className="w-full border rounded-lg p-2" placeholder="Nhập tên" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              2. Tình trạng tiếp nhận
            </h3>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Mô tả tình trạng xe</label>
              <textarea className="w-full border rounded-lg p-2 h-24" placeholder="Ghi chú các hư hỏng hoặc yêu cầu của khách hàng..."></textarea>
            </div>
          </section>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-auto">
            <button type="button" className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50">
              Hủy bỏ
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700">
              Xác nhận lập phiếu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
