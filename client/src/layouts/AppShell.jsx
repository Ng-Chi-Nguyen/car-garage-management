import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/sidebar';
import { Topbar } from '../components/layout/topbar';

export function AppShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex h-screen min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children || <Outlet />}</main>
      </div>
    </div>
  );
}

export default AppShell;
