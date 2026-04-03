import fs from 'fs';

let content = fs.readFileSync('client/src/features/adminUsers/components/AdminUsersTable.jsx', 'utf8');
content = content.replace(
`export function AdminUsersTable({ users }) {`,
`export function AdminUsersTable({ users, pagination, goNext, goPrev, goToPage }) {`
);

content = content.replace(
`  return (
    <div className="bg-white overflow-x-auto rounded-b-xl border border-t-0">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b">
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mã NV</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Họ tên</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tên đăng nhập</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.MaKH} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-xs font-semibold text-primary">PE-{String(user.MaKH).padStart(3, "0")}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">{user.TenChuXe}</span>
                  <span className="text-[10px] text-slate-500">{user.Email || user.DienThoai}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-slate-700">{user.DienThoai}</td>
              <td className="px-6 py-4">
                <span className={\`px-2.5 py-1 rounded-full text-[10px] font-bold \${user.ChucVu === "Admin" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-700"}\`}>
                  {user.roleLabel}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <span className={\`w-2 h-2 rounded-full \${user.TrangThai === "HoatDong" ? "bg-green-500" : "bg-red-500"}\`}></span>
                  <span className="text-xs text-slate-700 font-medium">
                    {user.TrangThai === "HoatDong" ? "Hoạt động" : user.TrangThai === "BiKhoa" ? "Bị khóa" : "Đã xóa"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleRole(user)}
                    className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                    title="Đổi vai trò"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={\`p-1.5 rounded-lg transition-colors \${user.TrangThai === "HoatDong" ? "hover:bg-red-100 text-red-600" : "hover:bg-green-100 text-green-600"}\`}
                    title={user.TrangThai === "HoatDong" ? "Khóa" : "Mở khóa"}
                  >
                    <span className="material-symbols-outlined text-sm">{user.TrangThai === "HoatDong" ? "lock" : "lock_open"}</span>
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-slate-300 cursor-not-allowed"
                    title="Reset mật khẩu (Chưa hỗ trợ)"
                    disabled
                  >
                    <span className="material-symbols-outlined text-sm">key</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500">
                Không tìm thấy nhân viên nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );`,
`  return (
    <div className="bg-surface overflow-x-auto flex flex-col">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant">
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Mã NV</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Họ tên</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Tên đăng nhập</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Vai trò</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Lần HĐ cuối</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {users.map((user) => (
            <tr key={user.MaKH} className="hover:bg-surface-container-low transition-colors">
              <td className="px-6 py-4 text-xs font-semibold text-primary">PE-{String(user.MaKH).padStart(3, "0")}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-on-surface">{user.TenChuXe}</span>
                  <span className="text-[10px] text-on-surface-variant">{user.Email || user.DienThoai}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-on-surface-variant font-medium">{user.DienThoai}</td>
              <td className="px-6 py-4">
                <span className={\`px-2.5 py-1 rounded-md text-[10px] font-bold \${user.ChucVu === "Admin" ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface-variant"}\`}>
                  {user.roleLabel}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-on-surface-variant font-medium">—</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <span className={\`w-2 h-2 rounded-full \${user.TrangThai === "HoatDong" ? "bg-green-500" : "bg-error"}\`}></span>
                  <span className="text-xs text-on-surface font-medium">
                    {user.TrangThai === "HoatDong" ? "Hoạt động" : user.TrangThai === "BiKhoa" ? "Bị khóa" : "Đã xóa"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleRole(user)}
                    className="p-1.5 rounded-lg hover:bg-surface-container-highest text-on-surface-variant transition-colors"
                    title="Đổi vai trò"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={\`p-1.5 rounded-lg transition-colors \${user.TrangThai === "HoatDong" ? "hover:bg-error-container text-error" : "hover:bg-green-100 text-green-700"}\`}
                    title={user.TrangThai === "HoatDong" ? "Khóa" : "Mở khóa"}
                  >
                    <span className="material-symbols-outlined text-[18px]">{user.TrangThai === "HoatDong" ? "lock" : "lock_open"}</span>
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-outline cursor-not-allowed"
                    title="Reset mật khẩu (Chưa hỗ trợ)"
                    disabled
                  >
                    <span className="material-symbols-outlined text-[18px]">key</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-sm text-on-surface-variant">
                Không tìm thấy nhân viên nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between bg-surface mt-auto">
          <div className="text-sm text-on-surface-variant">
            Trang <span className="font-medium text-on-surface">{pagination.page}</span> / <span className="font-medium text-on-surface">{Math.ceil(pagination.total / pagination.limit) || 1}</span> 
            <span className="mx-2">•</span>
            Tổng <span className="font-medium text-on-surface">{pagination.total}</span> nhân viên
          </div>
          <div className="flex gap-2">
            <button
              onClick={goPrev}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Trang trước"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              onClick={goNext}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="p-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Trang sau"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );`
);

fs.writeFileSync('client/src/features/adminUsers/components/AdminUsersTable.jsx', content);
