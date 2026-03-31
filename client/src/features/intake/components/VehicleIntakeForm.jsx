import { useState } from "react";
import { useCreateIntakeMutation } from "../useIntakeMutation";

const vehicleTypes = [
  "Sedan",
  "SUV / Crossover",
  "Hatchback",
  "Bán tải (Pickup)",
  "MPV",
];
const carBrands = [
  "Toyota",
  "Honda",
  "Mazda",
  "Hyundai",
  "Kia",
  "Mercedes-Benz",
  "BMW",
];
const carModels = ["Camry", "Vios", "Corolla Cross", "Fortuner"];
const quickConditions = [
  "Xước nhẹ",
  "Móp méo",
  "Hỏng đèn",
  "Nứt kính",
  "Bẩn nội thất",
];

const initialForm = {
  phone: "",
  ownerName: "",
  address: "",
  licensePlate: "",
  vehicleType: "Sedan",
  brand: "Toyota",
  model: "Camry",
  advisor: "Nguyễn Văn A",
  note: "",
};

function formatDisplay(value, fallback = "-- Chưa nhập --") {
  return value?.trim() ? value : fallback;
}

function IntakeInput({ label, required, icon, placeholder, value, onChange }) {
  return (
    <label className="space-y-2">
      <div className="text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="text-amber-600"> *</span> : null}
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-slate-400 focus-within:shadow-md">
        <span className="text-lg text-slate-400">{icon}</span>
        <input
          type="text"
          className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </label>
  );
}

function IntakeSelect({ label, options, value, onChange }) {
  return (
    <label className="space-y-2">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-slate-400 focus-within:shadow-md">
        <select
          className="w-full bg-transparent text-sm text-slate-900 outline-none"
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function DetailCard({ icon, title, description, children }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.55)] lg:p-7">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow-lg">
          {icon}
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function VehicleIntakeForm({ onSuccess, onCancel, variant = "page" }) {
  const [form, setForm] = useState(initialForm);
  const [selectedConditions, setSelectedConditions] = useState(["Xước nhẹ"]);
  const mutation = useCreateIntakeMutation();

  const summaryVehicle = `${form.brand || "--"} ${form.model || "--"}`.trim();
  const summaryConditions = selectedConditions.length
    ? selectedConditions.join(", ")
    : "Chưa có ghi chú hiện trạng nào được chọn hoặc nhập.";

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const toggleCondition = (condition) => {
    setSelectedConditions((current) =>
      current.includes(condition)
        ? current.filter((item) => item !== condition)
        : [...current, condition],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(
      { ...form, conditions: selectedConditions },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  if (variant === "modal") {
    return (
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            1. Thông tin chung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Biển số xe *
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                placeholder="Nhập biển số"
                value={form.licensePlate}
                onChange={updateField("licensePlate")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Tên khách hàng
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                placeholder="Nhập tên"
                value={form.ownerName}
                onChange={updateField("ownerName")}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            2. Tình trạng tiếp nhận
          </h3>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">
              Mô tả tình trạng xe
            </label>
            <textarea
              className="w-full border rounded-lg p-2 h-24"
              placeholder="Ghi chú các hư hỏng hoặc yêu cầu của khách hàng..."
              value={form.note}
              onChange={updateField("note")}
            ></textarea>
          </div>
        </section>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Đang xử lý..." : "Xác nhận lập phiếu"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)] lg:px-8 lg:py-8">
        <div className="space-y-6">
          <DetailCard
            icon="👤"
            title="Thông tin chủ xe"
            description="Tra cứu hoặc thêm mới thông tin khách hàng"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <IntakeInput
                label="Số điện thoại"
                required
                icon="📞"
                placeholder="Nhập số điện thoại khách hàng"
                value={form.phone}
                onChange={updateField("phone")}
              />
              <IntakeInput
                label="Họ và tên"
                required
                icon="🪪"
                placeholder="Nhập họ tên chủ xe"
                value={form.ownerName}
                onChange={updateField("ownerName")}
              />
            </div>
            <div className="mt-4">
              <IntakeInput
                label="Địa chỉ thường trú"
                icon="📍"
                placeholder="Số nhà, phường/xã, quận/huyện..."
                value={form.address}
                onChange={updateField("address")}
              />
            </div>
          </DetailCard>

          <DetailCard
            icon="🚗"
            title="Thông tin xe"
            description="Chi tiết phương tiện và hiện trạng tiếp nhận"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div className="flex-1">
                    <IntakeInput
                      label="Biển số"
                      required
                      icon="🔖"
                      placeholder="51G-123.45"
                      value={form.licensePlate}
                      onChange={updateField("licensePlate")}
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-[50px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    <span>🔎</span>
                    Tra cứu xe
                  </button>
                </div>
              </div>

              <IntakeSelect
                label="Loại xe"
                options={vehicleTypes}
                value={form.vehicleType}
                onChange={updateField("vehicleType")}
              />
              <IntakeSelect
                label="Hãng xe"
                options={carBrands}
                value={form.brand}
                onChange={updateField("brand")}
              />
              <div className="md:col-span-2">
                <IntakeSelect
                  label="Model / Dòng xe"
                  options={carModels}
                  value={form.model}
                  onChange={updateField("model")}
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">
                  Ghi chú tình trạng xe
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Chọn nhanh tình trạng
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {quickConditions.map((condition) => {
                  const active = selectedConditions.includes(condition);

                  return (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => toggleCondition(condition)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <span>{active ? "☑" : "☐"}</span>
                      {condition}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Ghi chú thêm
                </span>
                <textarea
                  rows={4}
                  value={form.note}
                  onChange={updateField("note")}
                  placeholder="Mô tả thêm hiện trạng xe hoặc yêu cầu ban đầu của khách hàng"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                />
              </label>
            </div>
          </DetailCard>
        </div>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-white shadow-[0_36px_80px_-44px_rgba(15,23,42,0.9)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold">Tóm tắt xác nhận</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Phiếu tiếp nhận được cập nhật trực tiếp từ thông tin bạn
                  nhập.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                <span>🖨</span>
                In phiếu
              </button>
            </div>

            <div className="space-y-6 px-6 py-6">
              <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Phiếu tiếp nhận xe
                </p>
                <p className="mt-2 text-lg font-semibold">
                  ID: #PN-20240524-001
                </p>

                <dl className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                    <dt className="text-slate-400">Khách hàng</dt>
                    <dd className="text-right font-medium text-white">
                      {formatDisplay(form.ownerName)}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                    <dt className="text-slate-400">Điện thoại</dt>
                    <dd className="text-right font-medium text-white">
                      {formatDisplay(form.phone)}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                    <dt className="text-slate-400">Biển số</dt>
                    <dd className="text-right font-medium text-white">
                      {formatDisplay(form.licensePlate, "-- --")}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                    <dt className="text-slate-400">Phương tiện</dt>
                    <dd className="text-right font-medium text-white">
                      {summaryVehicle}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                    <dt className="text-slate-400">Trạng thái tiếp nhận</dt>
                    <dd className="inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                      Chờ xử lý
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-slate-400">Cố vấn dịch vụ</dt>
                    <dd className="text-right font-medium text-white">
                      {form.advisor}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">
                  Ghi chú nhanh
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {summaryConditions}
                </p>
                {form.note ? (
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {form.note}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-[24px] border border-dashed border-white/20 bg-white/5 px-4 py-4 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                <span>📷</span>
                Chụp ảnh hiện trạng
              </button>
              
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-[24px] bg-emerald-600 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {mutation.isPending ? "Đang lưu..." : "Lưu phiếu tiếp nhận"}
              </button>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.55)]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-700">
                🕘
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Lịch sử gần nhất
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Không tìm thấy dữ liệu cũ
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
