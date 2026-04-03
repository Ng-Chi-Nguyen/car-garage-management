import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { StateShell } from "../../components/ui/state-shell";
import { useAdminUsersQuery } from "../../features/adminUsers/useAdminUsersQuery.js";
import { AdminUsersHeader } from "../../features/adminUsers/components/AdminUsersHeader.jsx";
import { AdminUsersStats } from "../../features/adminUsers/components/AdminUsersStats.jsx";
import { AdminUsersFilters } from "../../features/adminUsers/components/AdminUsersFilters.jsx";
import { AdminUsersTable } from "../../features/adminUsers/components/AdminUsersTable.jsx";
import { parseAdminUsersQuery, buildAdminUsersQuery } from "../../features/adminUsers/adminUsers.query.js";

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = parseAdminUsersQuery(searchParams);

  const query = useAdminUsersQuery({ 
    page: queryParams.page, 
    limit: queryParams.limit, 
    search: queryParams.search 
  });

  const users = useMemo(() => query.data?.users ?? [], [query.data]);
  const pagination = useMemo(() => query.data?.pagination ?? { page: 1, limit: 10, total: 0 }, [query.data]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (queryParams.role && user.ChucVu !== queryParams.role) return false;
      if (queryParams.status && user.TrangThai !== queryParams.status) return false;
      return true;
    });
  }, [users, queryParams.role, queryParams.status]);

  const updateParams = (newParams) => {
    const updated = { ...queryParams, ...newParams };
    setSearchParams(buildAdminUsersQuery(updated));
  };

  const handleSearchChange = (e) => updateParams({ search: e.target.value, page: 1 });
  const handleRoleChange = (role) => updateParams({ role, page: 1 });
  const handleStatusChange = (status) => updateParams({ status, page: 1 });

  const goNext = () => {
    if (pagination.page * pagination.limit < pagination.total) {
      updateParams({ page: pagination.page + 1 });
    }
  };

  const goPrev = () => {
    if (pagination.page > 1) {
      updateParams({ page: pagination.page - 1 });
    }
  };

  const goToPage = (page) => {
    updateParams({ page });
  };

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-[1600px] mx-auto">
      <AdminUsersHeader />
      <StateShell query={query}>
        {() => (
          <>
            <AdminUsersStats users={users} />
            <div className="bg-surface rounded-2xl overflow-hidden border border-outline-variant shadow-sm flex flex-col">
              <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface">
                <AdminUsersFilters
                  roleFilter={queryParams.role}
                  setRoleFilter={handleRoleChange}
                  statusFilter={queryParams.status}
                  setStatusFilter={handleStatusChange}
                />
                <div className="relative w-full sm:max-w-md">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant text-on-surface"
                    value={queryParams.search}
                    onChange={handleSearchChange}
                    placeholder="Tìm kiếm nhân viên..."
                  />
                </div>
              </div>
              <AdminUsersTable 
                users={filteredUsers} 
                pagination={pagination}
                goNext={goNext}
                goPrev={goPrev}
                goToPage={goToPage}
              />
            </div>
          </>
        )}
      </StateShell>
    </div>
  );
}
