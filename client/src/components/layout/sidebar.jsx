export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="flex items-center gap-2 border-b border-slate-800 p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 font-bold">G</div>
        <span className="text-lg font-semibold">GaraFlow</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <div className="cursor-pointer rounded-md bg-blue-600 px-3 py-2">
          <span className="text-sm font-medium">Tổng quan</span>
        </div>
        <div className="cursor-pointer rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800">
          <span className="text-sm font-medium">Xưởng</span>
        </div>
      </nav>
    </div>
  );
}
