import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../features/auth/auth.api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: null, message: null });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus({
        type: "error",
        message: "Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.",
      });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Mật khẩu xác nhận không khớp." });
      return;
    }

    setStatus({ type: null, message: null });
    setLoading(true);

    try {
      await resetPassword({ token, newPassword, confirmPassword });
      setStatus({
        type: "success",
        message: "Mật khẩu đã được đặt lại thành công. Chuyển hướng đến đăng nhập...",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#f7f9fb] overflow-hidden relative">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm flex flex-col overflow-hidden relative z-10 p-8 lg:p-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0040a1] to-[#0056d2] rounded-2xl text-white shadow-lg mb-6">
            <span className="material-symbols-outlined text-3xl">password</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
            Đặt lại mật khẩu
          </h3>
          <p className="text-gray-500 text-sm">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {status.message && (
            <div
              className={`p-3 text-sm rounded-xl border ${
                status.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-100 border-red-300 text-red-700"
              }`}
            >
              {status.message}
            </div>
          )}

          {!token ? null : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 block" htmlFor="newPassword">
                  Mật khẩu mới
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0040a1] transition-colors">
                    lock
                  </span>
                  <input
                    className="w-full pl-12 pr-12 py-4 bg-[#f2f4f6] border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0040a1]/20 focus:bg-white transition-all outline-none"
                    id="newPassword"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading || status.type === "success"}
                    required
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || status.type === "success"}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 block" htmlFor="confirmPassword">
                  Xác nhận mật khẩu
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0040a1] transition-colors">
                    check_circle
                  </span>
                  <input
                    className="w-full pl-12 pr-12 py-4 bg-[#f2f4f6] border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0040a1]/20 focus:bg-white transition-all outline-none"
                    id="confirmPassword"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading || status.type === "success"}
                    required
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading || status.type === "success"}
                  >
                    <span className="material-symbols-outlined">
                      {showConfirmPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || status.type === "success"}
                className={`w-full py-4 bg-gradient-to-br from-[#0040a1] to-[#0056d2] text-white font-bold rounded-xl shadow-lg shadow-[#0040a1]/20 transition-all flex items-center justify-center gap-2 ${
                  loading || status.type === "success"
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:shadow-xl hover:scale-[1.01]"
                }`}
              >
                <span>{loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}</span>
                {!loading && <span className="material-symbols-outlined">save</span>}
              </button>
            </>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Nhớ mật khẩu?
            <Link className="font-bold text-[#0040a1] hover:underline ml-1" to="/login">
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#f7f9fb]">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#0040a1]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[100px]"></div>
      </div>
    </main>
  );
}
