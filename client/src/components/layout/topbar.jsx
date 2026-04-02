import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStorage } from "../../features/auth/auth.storage";
import { parseAccessTokenRole } from "../../features/auth/auth.session";

const roleLabelMap = {
  Admin: "Quản trị viên",
  NhanVien: "Nhân viên",
};

export function Topbar() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const token = authStorage.getToken();
  const storedUser = authStorage.getUser();

  const role = storedUser?.ChucVu || parseAccessTokenRole(token);
  const displayName = storedUser?.TenChuXe || storedUser?.Email || "Người dùng";
  const roleLabel = roleLabelMap[role] || role || "Nội bộ";

  const initials = useMemo(() => {
    if (!displayName) return "U";
    const words = displayName.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  }, [displayName]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    authStorage.clearSession();
    setOpenMenu(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 px-6 py-4 backdrop-blur-xl md:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 shadow-sm lg:min-w-[360px]">
          <span className="material-symbols-outlined text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng, biển số, lệnh sửa..."
            className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            readOnly
          />
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu((prev) => !prev)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3 py-2 shadow-sm transition-colors hover:border-slate-300"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {displayName}
                </p>
                <p className="text-xs font-medium text-slate-400">
                  {roleLabel}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-blue-500/25">
                {initials}
              </div>
            </button>

            {openMenu ? (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>
                  Đăng xuất
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
