import { useMemo, useState } from 'react';

const vehicleTypes = ['Sedan', 'SUV / Crossover', 'Hatchback', 'Bán tải (Pickup)', 'MPV'];
const carBrands = ['Toyota', 'Honda', 'Mazda', 'Hyundai', 'Kia', 'Mercedes-Benz', 'BMW'];
const carModels = ['Camry', 'Vios', 'Corolla Cross', 'Fortuner'];
const quickConditions = ['Xước nhẹ', 'Móp méo', 'Hỏng đèn', 'Nứt kính', 'Bẩn nội thất'];

const initialForm = {
  phone: '',
  ownerName: '',
  address: '',
  licensePlate: '',
  vehicleType: 'Sedan',
  brand: 'Toyota',
  model: 'Camry',
  advisor: 'Nguyễn Văn A',
  note: '',
};

function formatDisplay(value, fallback = '-- Chưa nhập --') {
  return value?.trim() ? value : fallback;
}

function IntakeInput({ label, required, icon, placeholder, value, onChange }) {
  return (
    <label className="space-y-2">
      <div className="text-sm font-semibold text-on-surface">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-4 py-3 transition focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-surface-container-lowest">
        <span className="text-lg text-outline">{icon}</span>
        <input
          className="w-full border-0 bg-transparent text-sm text-on-surface outline-none placeholder:text-outline"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </label>
  );
}

function IntakeSelect({ label, options, value, onChange }) {
  return (
    <label className="space-y-2">
      <div className="text-sm font-semibold text-on-surface">{label}</div>
      <div className="rounded-2xl bg-surface-container-low px-4 py-3 transition focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-surface-container-lowest">
        <select
          className="w-full bg-transparent text-sm text-on-surface outline-none appearance-none"
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
    <section className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/10 lg:p-7">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-high text-xl text-on-surface">
          {icon}
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-on-surface tracking-tight">{title}</h2>
          <p className="text-sm text-on-surface-variant font-medium">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function VehicleIntake() {
  const [form, setForm] = useState(initialForm);
  const [selectedConditions, setSelectedConditions] = useState(['Xước nhẹ']);

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date()),
    [],
  );

  const summaryVehicle = `${form.brand || '--'} ${form.model || '--'}`.trim();
  const summaryConditions = selectedConditions.length ? selectedConditions.join(', ') : 'Chưa có ghi chú hiện trạng nào được chọn hoặc nhập.';

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

  const resetForm = () => {
    setForm(initialForm);
    setSelectedConditions(['Xước nhẹ']);
  };

  return (
    <div className="min-h-full bg-surface px-4 py-6 text-on-surface lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/20">
          <div className="flex flex-col gap-5 border-b border-outline-variant/10 px-6 py-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Precision Engine</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-on-surface">Tiếp nhận xe mới</h1>
              </div>
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="inline-flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-2.5 text-sm font-medium text-on-surface-variant">
                  <span className="text-base">📅</span>
                  <span>{today}</span>
                </div>
                <div className="rounded-xl bg-error-container px-4 py-2.5 text-sm text-on-error-container flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                  <p className="font-bold">Hạn mức tiếp nhận:</p>
                  <p className="font-medium">Chỉ còn 03 lượt miễn phí hôm nay.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-container-low px-5 py-2.5 text-sm font-bold text-on-surface transition hover:bg-surface-container-high"
              >
                <span>↻</span>
                Làm mới
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-container-low px-5 py-2.5 text-sm font-bold text-on-surface transition hover:bg-surface-container-high"
              >
                <span>✕</span>
                Hủy
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition hover:shadow-md"
              >
                <span>💾</span>
                Lưu phiếu tiếp nhận
              </button>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)] lg:px-8 lg:py-8 bg-surface-container-lowest">
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
                    onChange={updateField('phone')}
                  />
                  <IntakeInput
                    label="Họ và tên"
                    required
                    icon="🪪"
                    placeholder="Nhập họ tên chủ xe"
                    value={form.ownerName}
                    onChange={updateField('ownerName')}
                  />
                </div>
                <div className="mt-4">
                  <IntakeInput
                    label="Địa chỉ thường trú"
                    icon="📍"
                    placeholder="Số nhà, phường/xã, quận/huyện..."
                    value={form.address}
                    onChange={updateField('address')}
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
                          onChange={updateField('licensePlate')}
                        />
                      </div>
                      <button
                        type="button"
                        className="inline-flex h-[48px] items-center justify-center gap-2 rounded-2xl bg-surface-container-high px-6 text-sm font-bold text-on-surface transition hover:bg-surface-container-highest"
                      >
                        <span>🔎</span>
                        Tra cứu
                      </button>
                    </div>
                  </div>

                  <IntakeSelect label="Loại xe" options={vehicleTypes} value={form.vehicleType} onChange={updateField('vehicleType')} />
                  <IntakeSelect label="Hãng xe" options={carBrands} value={form.brand} onChange={updateField('brand')} />
                  <div className="md:col-span-2">
                    <IntakeSelect label="Model / Dòng xe" options={carModels} value={form.model} onChange={updateField('model')} />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">Ghi chú tình trạng xe</h3>
                    <p className="mt-1 text-sm text-on-surface-variant font-medium">Chọn nhanh tình trạng</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickConditions.map((condition) => {
                      const active = selectedConditions.includes(condition);

                      return (
                        <button
                          key={condition}
                          type="button"
                          onClick={() => toggleCondition(condition)}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                            active
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                        >
                          <span>{active ? '☑' : '☐'}</span>
                          {condition}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-on-surface">Ghi chú thêm</span>
                    <textarea
                      rows={4}
                      value={form.note}
                      onChange={updateField('note')}
                      placeholder="Mô tả thêm hiện trạng xe hoặc yêu cầu ban đầu của khách hàng"
                      className="w-full rounded-2xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest"
                    />
                  </label>
                </div>
              </DetailCard>
            </div>

            <div className="space-y-6">
              <section className="overflow-hidden rounded-3xl bg-surface-container-high text-on-surface shadow-sm">
                <div className="flex items-center justify-between border-b border-outline-variant/10 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">Tóm tắt xác nhận</h2>
                    <p className="mt-1 text-sm font-medium text-on-surface-variant">Phiếu tiếp nhận được cập nhật trực tiếp.</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-surface-container-highest px-4 py-2 text-sm font-bold transition hover:bg-outline-variant/20"
                  >
                    <span>🖨</span>
                    In phiếu
                  </button>
                </div>

                <div className="space-y-6 px-6 py-6">
                  <div className="rounded-2xl bg-surface-container-lowest p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Phiếu tiếp nhận xe</p>
                    <p className="mt-1 text-lg font-black text-on-surface tracking-tight">ID: #PN-20240524-001</p>

                    <dl className="mt-5 space-y-4 text-sm">
                      <div className="flex items-start justify-between gap-4 border-b border-outline-variant/10 pb-3">
                        <dt className="text-on-surface-variant font-medium">Khách hàng</dt>
                        <dd className="text-right font-bold text-on-surface">{formatDisplay(form.ownerName)}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4 border-b border-outline-variant/10 pb-3">
                        <dt className="text-on-surface-variant font-medium">Điện thoại</dt>
                        <dd className="text-right font-bold text-on-surface">{formatDisplay(form.phone)}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4 border-b border-outline-variant/10 pb-3">
                        <dt className="text-on-surface-variant font-medium">Biển số</dt>
                        <dd className="text-right font-bold text-on-surface">{formatDisplay(form.licensePlate, '-- --')}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4 border-b border-outline-variant/10 pb-3">
                        <dt className="text-on-surface-variant font-medium">Phương tiện</dt>
                        <dd className="text-right font-bold text-on-surface">{summaryVehicle}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4 border-b border-outline-variant/10 pb-3">
                        <dt className="text-on-surface-variant font-medium">Trạng thái</dt>
                        <dd className="inline-flex rounded-md bg-secondary-container px-2 py-1 text-xs font-bold text-on-secondary-container">
                          Chờ xử lý
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-on-surface-variant font-medium">Cố vấn dịch vụ</dt>
                        <dd className="text-right font-bold text-on-surface">{form.advisor}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-2xl bg-surface-container-lowest p-5">
                    <p className="text-sm font-bold text-on-surface">Ghi chú nhanh</p>
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant font-medium">{summaryConditions}</p>
                    {form.note ? <p className="mt-2 text-sm leading-relaxed text-on-surface-variant font-medium">{form.note}</p> : null}
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant/50 bg-surface-container-lowest px-4 py-4 text-sm font-bold text-on-surface transition hover:bg-surface-container-low"
                  >
                    <span>📷</span>
                    Chụp ảnh hiện trạng
                  </button>
                </div>
              </section>

              <section className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/10">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-high text-xl text-on-surface">
                    🕘
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-on-surface tracking-tight">Lịch sử gần nhất</h2>
                    <p className="mt-1 text-sm text-on-surface-variant font-medium">Không tìm thấy dữ liệu cũ</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
