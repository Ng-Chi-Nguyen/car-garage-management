import React from 'react';
import { Sidebar } from '../components/layout/sidebar';
import { Topbar } from '../components/layout/topbar';
import { Outlet, Navigate } from 'react-router-dom';
import { authStorage } from '../features/auth/auth.storage';
import { parseAccessTokenRole } from '../features/auth/auth.session';

const ALLOWED_ROLES = ['Admin', 'NhanVien'];

export function AppShell({ children }) {
  const token = authStorage.getToken();
  const role = parseAccessTokenRole(token);
  const isAllowed = token && role && ALLOWED_ROLES.includes(role);

  if (!isAllowed) {
    authStorage.clearToken();
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.55),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(165,243,252,0.38),_transparent_22%),linear-gradient(180deg,_#f8fbff_0%,_#eef4fb_46%,_#f8fafc_100%)] text-slate-900">
      <Sidebar />
      <div className="ml-72 flex h-screen min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-7xl">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
