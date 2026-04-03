import fs from 'fs';

let content = fs.readFileSync('client/src/features/adminUsers/components/AdminUsersFilters.jsx', 'utf8');
content = content.replace(
`export function AdminUsersFilters({ roleFilter, setRoleFilter, statusFilter, setStatusFilter }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b rounded-t-xl">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Lọc theo:</span>
        <select
          className="bg-slate-50 border border-slate-200 text-xs rounded-lg py-1.5 px-3 focus:ring-1 focus:ring-primary/30"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="Admin">Admin</option>
          <option value="NhanVien">Kỹ thuật viên / Nhân viên</option>
          <option value="KhachHang">Khách hàng</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <select
          className="bg-slate-50 border border-slate-200 text-xs rounded-lg py-1.5 px-3 focus:ring-1 focus:ring-primary/30"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Trạng thái: Tất cả</option>
          <option value="HoatDong">Hoạt động</option>
          <option value="BiKhoa">Bị khóa</option>
        </select>
      </div>
    </div>
  );
}`,
`export function AdminUsersFilters({ roleFilter, setRoleFilter, statusFilter, setStatusFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">filter_list</span>
        <span className="text-sm font-medium text-on-surface-variant">Lọc:</span>
      </div>
      <div className="flex gap-2">
        <select
          className="bg-surface-container-low border border-outline-variant text-sm text-on-surface rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2344474E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[position:right_10px_center] bg-no-repeat"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="Admin">Admin</option>
          <option value="NhanVien">Nhân viên / Kỹ thuật</option>
          <option value="KhachHang">Khách hàng</option>
        </select>
        <select
          className="bg-surface-container-low border border-outline-variant text-sm text-on-surface rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2344474E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[position:right_10px_center] bg-no-repeat"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Trạng thái (Tất cả)</option>
          <option value="HoatDong">Hoạt động</option>
          <option value="BiKhoa">Bị khóa</option>
        </select>
      </div>
    </div>
  );
}`
);
fs.writeFileSync('client/src/features/adminUsers/components/AdminUsersFilters.jsx', content);
