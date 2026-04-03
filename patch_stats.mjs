import fs from 'fs';

let content = fs.readFileSync('client/src/features/adminUsers/components/AdminUsersStats.jsx', 'utf8');
content = content.replace(
`    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl border flex flex-col gap-4 relative overflow-hidden group">
        <div className="flex justify-between items-start z-10">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="material-symbols-outlined text-blue-700">groups</span>
          </div>
        </div>
        <div className="z-10">
          <span className="text-sm text-slate-500 font-medium block">Tổng số nhân viên</span>
          <span className="text-4xl font-bold text-slate-900 mt-1">{total}</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border flex flex-col gap-4 relative overflow-hidden group">
        <div className="flex justify-between items-start z-10">
          <div className="p-2 bg-green-100 rounded-lg">
            <span className="material-symbols-outlined text-green-700">task_alt</span>
          </div>
        </div>
        <div className="z-10">
          <span className="text-sm text-slate-500 font-medium block">Đang hoạt động</span>
          <span className="text-4xl font-bold text-slate-900 mt-1">{active}</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border flex flex-col gap-4 relative overflow-hidden group">
        <div className="flex justify-between items-start z-10">
          <div className="p-2 bg-orange-100 rounded-lg">
            <span className="material-symbols-outlined text-orange-700">admin_panel_settings</span>
          </div>
        </div>
        <div className="z-10">
          <span className="text-sm text-slate-500 font-medium block">Vai trò Admin</span>
          <span className="text-4xl font-bold text-slate-900 mt-1">{admins}</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border flex flex-col gap-4 relative overflow-hidden group">
        <div className="flex justify-between items-start z-10">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="material-symbols-outlined text-blue-700">engineering</span>
          </div>
        </div>
        <div className="z-10">
          <span className="text-sm text-slate-500 font-medium block">Kỹ thuật viên</span>
          <span className="text-4xl font-bold text-slate-900 mt-1">{techs}</span>
        </div>
      </div>
    </div>`,
`    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-container text-on-primary-container rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-[28px] leading-none">groups</span>
          </div>
          <div>
            <span className="text-sm text-on-surface-variant font-medium block">Tổng nhân viên</span>
            <span className="text-3xl font-bold text-on-surface leading-tight mt-1">{total}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-700 rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-[28px] leading-none">task_alt</span>
          </div>
          <div>
            <span className="text-sm text-on-surface-variant font-medium block">Đang hoạt động</span>
            <span className="text-3xl font-bold text-on-surface leading-tight mt-1">{active}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-700 rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-[28px] leading-none">admin_panel_settings</span>
          </div>
          <div>
            <span className="text-sm text-on-surface-variant font-medium block">Quản trị viên</span>
            <span className="text-3xl font-bold text-on-surface leading-tight mt-1">{admins}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-[28px] leading-none">engineering</span>
          </div>
          <div>
            <span className="text-sm text-on-surface-variant font-medium block">Kỹ thuật viên</span>
            <span className="text-3xl font-bold text-on-surface leading-tight mt-1">{techs}</span>
          </div>
        </div>
      </div>
    </div>`
);
fs.writeFileSync('client/src/features/adminUsers/components/AdminUsersStats.jsx', content);
