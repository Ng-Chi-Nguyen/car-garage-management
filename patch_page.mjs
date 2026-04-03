import fs from 'fs';

let content = fs.readFileSync('client/src/pages/admin/AdminUsersPage.jsx', 'utf8');
content = content.replace(
`  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border mb-4">
        <h2 className="text-primary font-bold text-lg">Quản lý Nhân viên</h2>
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
            value={queryParams.search}
            onChange={handleSearchChange}
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
                roleFilter={queryParams.role}
                setRoleFilter={handleRoleChange}
                statusFilter={queryParams.status}
                setStatusFilter={handleStatusChange}
              />
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
  );`,
`  return (
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
  );`
);
fs.writeFileSync('client/src/pages/admin/AdminUsersPage.jsx', content);
