import { useMemo, useState } from 'react';

const receivableCustomers = [
  {
    plate: '51G-123.45',
    customer: 'Nguyễn Văn An',
    tier: 'Hạng Vàng',
    debt: 12500000,
    updatedAt: 'Hôm nay',
  },
  {
    plate: '60A-987.12',
    customer: 'Trần Thị Bích',
    tier: 'Hạng Bạc',
    debt: 3200000,
    updatedAt: '2 ngày trước',
  },
  {
    plate: '51K-555.21',
    customer: 'Garage Auto-X',
    tier: 'Đối tác',
    debt: 45000000,
    updatedAt: '15 ngày trước',
  },
];

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

function FinanceField({ label, icon, value, onChange, placeholder }) {
  return (
    <label className="space-y-2">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-slate-400 focus-within:shadow-md">
        <span className="text-lg text-slate-400">{icon}</span>
        <input
          className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}

function FinancePanel({ icon, title, description, children, className = '' }) {
  return (
    <section className={`rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.55)] ${className}`}>
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow-lg">
          {icon}
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description ? <p className="text-sm text-slate-500">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function Receivables() {
  const [customer, setCustomer] = useState('Nguyễn Văn An');
  const [licensePlate, setLicensePlate] = useState('51G-123.45');
  const [cashGiven, setCashGiven] = useState('13000000');
  const [note, setNote] = useState('');

  const currentDebt = 12500000;
  const collectedAmount = currentDebt;
  const cashGivenNumber = Number(cashGiven) || 0;
  const changeAmount = Math.max(cashGivenNumber - collectedAmount, 0);

  const totalDebtVehicles = receivableCustomers.length;
  const totalReceivable = useMemo(
    () => receivableCustomers.reduce((sum, item) => sum + item.debt, 0),
    [],
  );

  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-6 text-slate-900 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-5 border-b border-slate-200/80 px-6 py-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-medium text-slate-600">Tài chính</span>
                <span>›</span>
                <span>Phiếu thu tiền</span>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Precision Engine</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Thu tiền và Công nợ</h1>
                <p className="mt-2 text-sm text-slate-500">Tạo phiếu thu mới với xác nhận giao dịch và danh sách xe còn nợ.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Hủy thao tác
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
              >
                <span>💾</span>
                Lưu Phiếu thu
              </button>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] lg:px-8 lg:py-8">
            <div className="space-y-6">
              <FinancePanel icon="🧾" title="Thông tin Phiếu thu" description="Nhập thông tin khách hàng và số tiền thanh toán thực tế.">
                <div className="grid gap-4 md:grid-cols-2">
                  <FinanceField
                    label="Khách hàng"
                    icon="👤"
                    value={customer}
                    onChange={(event) => setCustomer(event.target.value)}
                    placeholder="Nhập tên khách hàng"
                  />
                  <FinanceField
                    label="Biển số xe"
                    icon="🚗"
                    value={licensePlate}
                    onChange={(event) => setLicensePlate(event.target.value)}
                    placeholder="51G-123.45"
                  />
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[26px] border border-rose-200 bg-rose-50 px-5 py-4">
                    <p className="text-sm text-rose-700">Nợ hiện tại</p>
                    <p className="mt-2 text-2xl font-semibold text-rose-950">{formatCurrency(currentDebt)}</p>
                  </div>
                  <label className="space-y-2 md:col-span-2">
                    <div className="text-sm font-semibold text-slate-700">Khách đưa</div>
                    <div className="flex items-center gap-3 rounded-[26px] border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm transition focus-within:border-slate-400 focus-within:bg-white focus-within:shadow-md">
                      <span className="text-sm font-semibold text-slate-400">₫</span>
                      <input
                        inputMode="numeric"
                        className="w-full border-0 bg-transparent text-lg font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                        value={cashGiven}
                        onChange={(event) => setCashGiven(event.target.value.replace(/\D/g, ''))}
                        placeholder="0"
                      />
                    </div>
                  </label>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[26px] border border-emerald-200 bg-emerald-50 px-5 py-4">
                    <p className="text-sm text-emerald-700">Thực thu</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-950">{formatCurrency(collectedAmount)}</p>
                  </div>
                  <div className="rounded-[26px] border border-sky-200 bg-sky-50 px-5 py-4">
                    <p className="text-sm text-sky-700">Tiền thối</p>
                    <p className="mt-2 text-2xl font-semibold text-sky-950">{formatCurrency(changeAmount)}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Ghi chú</span>
                    <textarea
                      rows={4}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Bổ sung mô tả cho giao dịch hoặc xác nhận đặc biệt"
                      className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                    />
                  </label>
                </div>

                <div className="mt-6 rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4">
                  <p className="text-sm font-semibold text-amber-900">Xác nhận giao dịch</p>
                  <p className="mt-2 text-sm leading-6 text-amber-800">Phiếu thu sẽ được hạch toán ngay vào doanh thu ngày hôm nay.</p>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
                  >
                    Xác nhận Thu tiền
                  </button>
                </div>
              </FinancePanel>

              <FinancePanel
                icon="👥"
                title="Danh sách xe còn nợ"
                description={`${totalDebtVehicles} xe đang có công nợ cần theo dõi. Tổng dư nợ ${formatCurrency(totalReceivable)}.`}
              >
                <div className="space-y-3">
                  {receivableCustomers.map((item) => (
                    <article
                      key={item.plate}
                      className="flex flex-col gap-4 rounded-[26px] border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-slate-300 hover:bg-white lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10">
                          {item.plate.split('-')[0]}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{item.customer}</h3>
                          <div className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            {item.tier}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 text-left lg:text-right">
                        <p className="text-xl font-semibold text-slate-950">{formatCurrency(item.debt)}</p>
                        <p className="text-sm text-slate-500">{item.updatedAt}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
                >
                  Xem tất cả danh sách nợ
                  <span>→</span>
                </button>
              </FinancePanel>
            </div>

            <div className="space-y-6">
              <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] p-6 text-white shadow-[0_36px_80px_-44px_rgba(15,23,42,0.9)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl text-white">
                    💼
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Tổng công nợ đang theo dõi</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(totalReceivable)}</p>
                    <p className="mt-2 text-sm text-slate-400">Cập nhật theo danh sách xe còn nợ trong ngày.</p>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.55)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-xl text-white shadow-lg shadow-emerald-700/20">
                    ✅
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-emerald-950">Xác nhận thu tiền?</h2>
                    <p className="mt-1 text-sm text-emerald-800">Kiểm tra kỹ thông tin trước khi xác nhận.</p>

                    <dl className="mt-5 space-y-4 text-sm text-emerald-950">
                      <div className="flex items-start justify-between gap-4 border-b border-emerald-200 pb-3">
                        <dt>Khách hàng</dt>
                        <dd className="text-right font-semibold">{customer || '--'}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4 border-b border-emerald-200 pb-3">
                        <dt>Biển số</dt>
                        <dd className="text-right font-semibold">{licensePlate || '--'}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt>Số tiền thu</dt>
                        <dd className="text-right font-semibold">{formatCurrency(collectedAmount)}</dd>
                      </div>
                    </dl>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-2xl border border-emerald-300 bg-white px-4 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
                      >
                        Quay lại
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
                      >
                        Xác nhận ngay
                      </button>
                    </div>
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
