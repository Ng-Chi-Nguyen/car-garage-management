import React from 'react';
import { PageHeader } from '../../components/ui/page-header';

export default function WorkshopStatusPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Trạng thái Xưởng" 
        description="Quản lý và theo dõi tiến độ sửa chữa xe trong xưởng"
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-surface-container-low p-5 rounded-xl border-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Chờ</span>
            <span className="material-symbols-outlined text-secondary opacity-50">schedule</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl text-on-surface font-bold">05</h3>
            <div className="text-xs text-secondary font-medium bg-secondary/10 px-2 py-1 rounded">Xe mới</div>
          </div>
        </div>
        <div className="bg-surface-container-low p-5 rounded-xl border-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-tertiary uppercase tracking-wider">Chẩn đoán</span>
            <span className="material-symbols-outlined text-tertiary opacity-50">biotech</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl text-on-surface font-bold">03</h3>
            <div className="text-xs text-tertiary font-medium bg-tertiary/10 px-2 py-1 rounded">Đang check</div>
          </div>
        </div>
        <div className="bg-surface-container-low p-5 rounded-xl border-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Đang sửa</span>
            <span className="material-symbols-outlined text-primary opacity-50">handyman</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl text-on-surface font-bold">08</h3>
            <div className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">Cầu nâng 1-8</div>
          </div>
        </div>
        <div className="bg-surface-container-low p-5 rounded-xl border-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-error uppercase tracking-wider">Chờ T.Toán</span>
            <span className="material-symbols-outlined text-error opacity-50">payments</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl text-on-surface font-bold">04</h3>
            <div className="text-xs text-error font-medium bg-error/10 px-2 py-1 rounded">Xong việc</div>
          </div>
        </div>
        <div className="bg-primary-container p-5 rounded-xl border-none text-white shadow-lg shadow-primary-container/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-on-primary-container uppercase tracking-wider">Đã bàn giao</span>
            <span className="material-symbols-outlined text-on-primary-container" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl text-on-primary-container font-bold">12</h3>
            <div className="text-xs font-medium bg-white/20 text-on-primary-container px-2 py-1 rounded">Hôm nay</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-on-surface">Danh sách xe trong xưởng</h3>
          <div className="flex gap-2">
            <button className="bg-surface-container-high px-4 py-2 rounded-lg text-sm font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Lọc trạng thái
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest p-6 rounded-xl group hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-2xl font-black text-on-surface tracking-tight">30A-123.45</h4>
                <p className="text-sm font-medium text-on-surface-variant">Toyota Camry 2022</p>
              </div>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">VIP</span>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">Chủ xe:</span>
                <span className="font-semibold">Trần Anh Tuấn</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">Kỹ thuật viên:</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-[10px] font-bold">LH</div>
                  <span className="font-semibold">Lê Văn Hùng</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-primary/10 text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Đang sửa
              </span>
              <button className="text-primary-container font-bold text-xs hover:underline">Chi tiết</button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest p-6 rounded-xl group hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-2xl font-black text-on-surface tracking-tight">51G-999.88</h4>
                <p className="text-sm font-medium text-on-surface-variant">Mercedes E300</p>
              </div>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">VIP</span>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">Chủ xe:</span>
                <span className="font-semibold">Nguyễn Thị Mai</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">Kỹ thuật viên:</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-[10px] font-bold">ĐN</div>
                  <span className="font-semibold">Đỗ Hoàng Nam</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-tertiary/10 text-tertiary">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                Chẩn đoán
              </span>
              <button className="text-primary-container font-bold text-xs hover:underline">Chi tiết</button>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-surface-container-lowest p-6 rounded-xl group hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-2xl font-black text-on-surface tracking-tight">29C-556.78</h4>
                <p className="text-sm font-medium text-on-surface-variant">Ford Ranger XLS</p>
              </div>
              <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Thân thiết</span>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">Chủ xe:</span>
                <span className="font-semibold">Phạm Minh Đức</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">Kỹ thuật viên:</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-[10px] font-bold">NB</div>
                  <span className="font-semibold">Nguyễn Văn Ba</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-secondary/10 text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Chờ
              </span>
              <button className="text-primary-container font-bold text-xs hover:underline">Chi tiết</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}