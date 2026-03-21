import React from 'react';

export default function VehicleIntake() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Static stub for submission
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-600">Tiếp nhận xe mới</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-4">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
                <input type="text" className="w-full border rounded p-2" placeholder="Nhập tên" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input type="text" className="w-full border rounded p-2" placeholder="Nhập SĐT" />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-4">Thông tin xe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Biển số</label>
                <input type="text" className="w-full border rounded p-2" placeholder="VD: 51H-123.45" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hiệu xe</label>
                <input type="text" className="w-full border rounded p-2" placeholder="VD: Toyota" />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-4">Tóm tắt</h3>
            <div className="space-y-4">
              <p className="flex justify-between text-sm">
                <span className="text-gray-500">Ngày tiếp nhận</span>
                <span className="font-medium">24/05/2024</span>
              </p>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-700">
                Lưu phiếu tiếp nhận
              </button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
