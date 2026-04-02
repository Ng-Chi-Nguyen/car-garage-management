import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStorage } from "../../features/auth/auth.storage";
import { parseAccessTokenRole } from "../../features/auth/auth.session";
import { useTopbarGlobalSearch } from "../../features/search/useTopbarGlobalSearch";

const roleLabelMap = {
  Admin: "Quản trị viên",
  NhanVien: "Nhân viên",
};

export function Topbar() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [openSearchResults, setOpenSearchResults] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

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

  const { data: searchResults = [], isFetching: isSearchLoading } = useTopbarGlobalSearch(debouncedSearchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpenMenu(false);
      }

      if (!searchRef.current?.contains(event.target)) {
        setOpenSearchResults(false);
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

  const handleSearchSelect = (link) => {
    setOpenSearchResults(false);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    navigate(link);
  };

  const showSearchResults = openSearchResults && searchTerm.trim().length >= 2;

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 px-6 py-4 backdrop-blur-xl md:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          ref={searchRef}
          className="relative flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 shadow-sm lg:min-w-[360px]"
        >
          <span className="material-symbols-outlined text-slate-400">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setOpenSearchResults(true);
            }}
            onFocus={() => setOpenSearchResults(true)}
            placeholder="Tìm kiếm khách hàng, biển số, lệnh sửa..."
            className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
          />

          {showSearchResults ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {isSearchLoading ? (
                <p className="px-3 py-2 text-sm text-slate-500">Đang tìm kiếm...</p>
              ) : searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSearchSelect(item.link);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.subtitle}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {item.type}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-slate-500">Không tìm thấy kết quả phù hợp.</p>
              )}
            </div>
          ) : null}
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
