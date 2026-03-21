import { Outlet } from 'react-router-dom';

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">GMS Enterprise</h1>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-2">
            {/* Sidebar navigation will go here */}
            <div className="text-sm text-gray-500">Navigation Menu Placeholder</div>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
