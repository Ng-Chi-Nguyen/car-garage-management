import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <main className="grid grid-cols-12 grid-rows-1 lg:grid-rows-1 h-screen gap-6 p-6 bg-surface overflow-hidden relative">
      <section className="hidden lg:grid col-span-12 lg:col-span-7 grid-cols-2 grid-rows-2 gap-6 relative z-10">
        <div className="col-span-2 row-span-1 bg-primary-container rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-3xl">precision_manufacturing</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-primary">Precision Engine</h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-on-primary-container max-w-md">
              Hệ thống quản lý Garage chuyên nghiệp
            </h2>
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-surface-container-highest"></div>
              <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-surface-container-high"></div>
              <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-surface-container"></div>
            </div>
            <p className="text-sm font-semibold text-on-primary-container/80">Hơn 500+ Garage đang vận hành</p>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
        </div>

        <div className="col-span-1 row-span-1 bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between border-0">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-surface rounded-lg text-primary shadow-sm">
              <span className="material-symbols-outlined">analytics</span>
            </span>
            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-on-surface">98.5%</div>
            <div className="text-sm text-on-surface-variant font-medium">Hiệu suất vận hành</div>
          </div>
        </div>

        <div className="col-span-1 row-span-1 bg-secondary-container rounded-2xl p-6 flex flex-col justify-between border-0">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-surface rounded-lg text-secondary shadow-sm">
              <span className="material-symbols-outlined">speed</span>
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-on-secondary-container">0.5s</div>
            <div className="text-sm text-on-secondary-container/80 font-medium">Tốc độ xử lý dữ liệu</div>
          </div>
        </div>
      </section>

      <section className="col-span-12 lg:col-span-5 bg-surface-container-lowest rounded-2xl shadow-sm flex flex-col overflow-hidden relative z-10 border border-surface-container/50">
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Chào mừng trở lại</h3>
            <p className="text-on-surface-variant">Vui lòng nhập thông tin đăng nhập của bạn</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant block" htmlFor="username">Email hoặc Tên đăng nhập</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">person</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-0 rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
                  id="username" 
                  placeholder="nguyen.van@precision.vn" 
                  type="text"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-on-surface-variant block" htmlFor="password">Mật khẩu</label>
                <a className="text-xs font-bold text-primary hover:underline" href="#">Quên mật khẩu?</a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-0 rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface" type="button">
                  <span className="material-symbols-outlined">visibility_off</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20" id="remember" type="checkbox" />
              <label className="text-sm font-medium text-on-surface-variant select-none" htmlFor="remember">Ghi nhớ đăng nhập trên thiết bị này</label>
            </div>

            <Link 
              to="/dashboard"
              className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Đăng nhập hệ thống</span>
              <span className="material-symbols-outlined">login</span>
            </Link>
          </form>

          <div className="mt-12 pt-8 border-t border-surface-container text-center">
            <p className="text-sm text-on-surface-variant">Bạn gặp sự cố kỹ thuật? 
              <a className="font-bold text-primary hover:underline ml-1" href="#">Liên hệ hỗ trợ</a>
            </p>
          </div>
        </div>

        <div className="h-2 bg-primary w-full"></div>
      </section>

      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-surface">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>
    </main>
  );
}
