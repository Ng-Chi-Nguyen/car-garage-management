import React from 'react';
import { SectionCard } from '../../../components/ui/section-card';
import { computeTrendChartHeights } from '../dashboard.interactions.js';

export function DashboardTrendChart({ trendSeries }) {
  if (!trendSeries || !trendSeries.dates || trendSeries.dates.length === 0) {
    return (
      <SectionCard title="Biểu đồ doanh thu">
        <div className="h-32 flex items-center justify-center text-slate-400 text-sm">
          Chưa có dữ liệu doanh thu
        </div>
      </SectionCard>
    );
  }

  const { dates, revenues } = trendSeries;
  const heights = computeTrendChartHeights(revenues);

  return (
    <SectionCard title="Biểu đồ doanh thu">
      <div className="h-32 w-full flex items-end gap-2 pt-4">
        {dates.map((date, index) => {
          const rev = revenues[index];
          const heightPercent = heights[index];
          return (
            <div key={date} className="flex-1 flex flex-col justify-end group relative h-full">
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10">
                {date}: {rev.toLocaleString('vi-VN')} đ
              </div>
              <div 
                className="bg-blue-500 hover:bg-blue-600 rounded-t-sm transition-all duration-300 w-full"
                style={{ height: `${heightPercent}%` }}
              ></div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-400">
        <span>{dates[0]}</span>
        <span>{dates[dates.length - 1]}</span>
      </div>
    </SectionCard>
  );
}
