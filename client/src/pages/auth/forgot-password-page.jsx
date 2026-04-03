import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../features/auth/auth.api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: null, message: null });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: null });
    setLoading(true);

    try {
      await forgotPassword(email);
      setStatus({
        type: "success",
        message: "Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.",
      });
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
            <span className="material-symbols-outlined text-3xl">lock_reset</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
            Quên mật khẩu
          </h3>
          <p className="text-gray-500 text-sm">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
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
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 block" htmlFor="email">
              Email
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0040a1] transition-colors">
                mail
              </span>
              <input
                className="w-full pl-12 pr-4 py-4 bg-[#f2f4f6] border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0040a1]/20 focus:bg-white transition-all outline-none"
                id="email"
                placeholder="nguyen.van@precision.vn"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || status.type === "success"}
                required
              />
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
            <span>{loading ? "Đang gửi..." : "Gửi yêu cầu"}</span>
            {!loading && <span className="material-symbols-outlined">send</span>}
          </button>
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
