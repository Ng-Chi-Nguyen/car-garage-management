import React, { useMemo, useState } from "react";
import { PageHeader } from "../../components/ui/page-header";
import { StateShell } from "../../components/ui/state-shell";
import { useAdminUsersQuery } from "../../features/adminUsers/useAdminUsersQuery.js";
import { useUpdateAdminUserMutation } from "../../features/adminUsers/useAdminUsersMutation.js";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const query = useAdminUsersQuery({ page: 1, limit: 20, search });
  const mutation = useUpdateAdminUserMutation();

  const users = useMemo(() => query.data ?? [], [query.data]);

  return (
    <div className="space-y-6">
      <PageHeader title="Quản lý nhân sự" description="Quản lý vai trò và trạng thái tài khoản nội bộ" />

      <input className="border rounded px-3 py-2 w-full max-w-md" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên, email, số điện thoại" />

      <StateShell query={query}>
        {() => (
          <div className="grid gap-4">
            {users.map((user) => (
              <div key={user.MaKH} className="border rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">{user.TenChuXe}</div>
                  <div className="text-sm text-slate-500">{user.Email || user.DienThoai}</div>
                  <div className="text-xs mt-1">{user.roleLabel} · {user.TrangThai}</div>
                </div>
                <button
                  className="px-4 py-2 rounded bg-primary text-white"
                  onClick={() => mutation.mutate({ id: user.MaKH, data: { ChucVu: user.ChucVu === "Admin" ? "NhanVien" : "Admin" } })}
                >
                  Đổi vai trò
                </button>
              </div>
            ))}
          </div>
        )}
      </StateShell>
    </div>
  );
}
