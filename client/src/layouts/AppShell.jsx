import React from 'react';
import { Sidebar } from '../components/layout/sidebar';
import { Topbar } from '../components/layout/topbar';
import { Outlet } from 'react-router-dom';

export function AppShell({ children }) {
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-w-0 h-screen">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
