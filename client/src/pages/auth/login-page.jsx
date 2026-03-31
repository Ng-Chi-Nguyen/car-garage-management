import React from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <main className="grid grid-cols-12 grid-rows-1 lg:grid-rows-1 h-screen gap-6 p-6 bg-[#f7f9fb] overflow-hidden relative">
      {/* Left Column: Branding & Visuals (Bento Style) */}
      <section className="hidden lg:grid col-span-12 lg:col-span-7 grid-cols-2 grid-rows-2 gap-6 relative z-10">
        {/* Hero Brand Card */}
        <div className="col-span-2 row-span-1 bg-[#dae2ff] rounded-xl p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0040a1] to-[#0056d2] rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined text-3xl">
                  precision_manufacturing
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[#0040a1]">
                Precision Engine
              </h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-[#0040a1] max-w-md">
              Hệ thống quản lý Garage chuyên nghiệp
            </h2>
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {/* Dummy avatars */}
              <div className="w-10 h-10 rounded-full border-2 border-[#dae2ff] bg-gray-300"></div>
              <div className="w-10 h-10 rounded-full border-2 border-[#dae2ff] bg-gray-400"></div>
              <div className="w-10 h-10 rounded-full border-2 border-[#dae2ff] bg-gray-500"></div>
            </div>
            <p className="text-sm font-medium text-[#3a485b]">
              Hơn 500+ Garage đang vận hành
            </p>
          </div>
          {/* Abstract Background Detail */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#0040a1]/10 blur-3xl"></div>
        </div>

        {/* Metric Card 1 */}
        <div className="col-span-1 row-span-1 bg-[#f2f4f6] rounded-xl p-6 flex flex-col justify-between border-0">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-white rounded-lg text-[#0040a1]">
              <span className="material-symbols-outlined">analytics</span>
            </span>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">98.5%</div>
            <div className="text-sm text-gray-500 font-medium">
              Hiệu suất vận hành
            </div>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="col-span-1 row-span-1 bg-[#d5e3fc] rounded-xl p-6 flex flex-col justify-between border-0">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-white rounded-lg text-[#515f74]">
              <span className="material-symbols-outlined">speed</span>
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#0d1c2e]">0.5s</div>
            <div className="text-sm text-[#3a485b] font-medium">
              Tốc độ xử lý dữ liệu
            </div>
          </div>
        </div>
      </section>

      {/* Right Column: Login Form (Bento Style) */}
      <section className="col-span-12 lg:col-span-5 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden relative z-10">
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Chào mừng trở lại
            </h3>
            <p className="text-gray-500">
              Vui lòng nhập thông tin đăng nhập của bạn
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Input Email/Username */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-500 block"
                htmlFor="username"
              >
                Email hoặc Tên đăng nhập
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0040a1] transition-colors">
                  person
                </span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-[#f2f4f6] border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0040a1]/20 focus:bg-white transition-all outline-none"
                  id="username"
                  placeholder="nguyen.van@precision.vn"
                  type="text"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label
                  className="text-sm font-semibold text-gray-500 block"
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <a
                  className="text-xs font-bold text-[#0040a1] hover:underline"
                  href="#"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0040a1] transition-colors">
                  lock
                </span>
                <input
                  className="w-full pl-12 pr-12 py-4 bg-[#f2f4f6] border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0040a1]/20 focus:bg-white transition-all outline-none"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                  type="button"
                >
                  <span className="material-symbols-outlined">
                    visibility_off
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input
                className="w-5 h-5 rounded border-gray-300 text-[#0040a1] focus:ring-[#0040a1]"
                id="remember"
                type="checkbox"
              />
              <label
                className="text-sm font-medium text-gray-500 select-none"
                htmlFor="remember"
              >
                Ghi nhớ đăng nhập trên thiết bị này
              </label>
            </div>

            {/* Submit Button */}
            <Link
              to="/dashboard"
              className="w-full py-4 bg-gradient-to-br from-[#0040a1] to-[#0056d2] text-white font-bold rounded-xl shadow-lg shadow-[#0040a1]/20 hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <span>Đăng nhập hệ thống</span>
              <span className="material-symbols-outlined">login</span>
            </Link>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Bạn gặp sự cố kỹ thuật?
              <a
                className="font-bold text-[#0040a1] hover:underline ml-1"
                href="#"
              >
                Liên hệ hỗ trợ
              </a>
            </p>
          </div>
        </div>

        {/* Footer Decorative Element */}
        <div className="h-2 bg-gradient-to-br from-[#0040a1] to-[#0056d2] w-full"></div>
      </section>

      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#f7f9fb]">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#0040a1]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[100px]"></div>
      </div>
    </main>
  );
}
