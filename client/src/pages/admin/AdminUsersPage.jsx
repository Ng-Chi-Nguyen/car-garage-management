import React, { useMemo, useState } from "react";
import { StateShell } from "../../components/ui/state-shell";
import { useAdminUsersQuery } from "../../features/adminUsers/useAdminUsersQuery.js";
import { AdminUsersHeader } from "../../features/adminUsers/components/AdminUsersHeader.jsx";
import { AdminUsersStats } from "../../features/adminUsers/components/AdminUsersStats.jsx";
import { AdminUsersFilters } from "../../features/adminUsers/components/AdminUsersFilters.jsx";
import { AdminUsersTable } from "../../features/adminUsers/components/AdminUsersTable.jsx";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const query = useAdminUsersQuery({ page: 1, limit: 100, search });

  const users = useMemo(() => query.data ?? [], [query.data]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (roleFilter && user.ChucVu !== roleFilter) return false;
      if (statusFilter && user.TrangThai !== statusFilter) return false;
      return true;
    });
  }, [users, roleFilter, statusFilter]);

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border mb-4">
        <h2 className="text-primary font-bold text-lg">Quản lý Nhân viên</h2>
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm nhân viên..."
          />
        </div>
      </div>

      <AdminUsersHeader />
      <StateShell query={query}>
        {() => (
          <>
            <AdminUsersStats users={users} />
            <div className="bg-slate-50 rounded-xl p-1 overflow-hidden border">
              <AdminUsersFilters
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
              <AdminUsersTable users={filteredUsers} />
            </div>
          </>
        )}
      </StateShell>
    </div>
  );
}
