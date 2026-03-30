import React, { useState } from 'react';
import { SectionCard } from '../../../components/ui/section-card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { buildMixedChartConfig, buildLineChartConfig } from '../dashboard.chartConfig.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
  LineController,
  BarController,
);

export function DashboardTrendChart({ trendSeries }) {
  const [chartType, setChartType] = useState('mixed'); // 'mixed' or 'line'

  if (!trendSeries || !trendSeries.dates || trendSeries.dates.length === 0) {
    return (
      <SectionCard title="Biểu đồ doanh thu">
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          Chưa có dữ liệu doanh thu
        </div>
      </SectionCard>
    );
  }

  const chartConfig = chartType === 'mixed' 
    ? buildMixedChartConfig(trendSeries) 
    : buildLineChartConfig(trendSeries);

  return (
    <SectionCard 
      title="Biểu đồ doanh thu"
      action={
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              chartType === 'mixed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setChartType('mixed')}
          >
            Cột
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              chartType === 'line' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setChartType('line')}
          >
            Đường
          </button>
        </div>
      }
    >
      <div className="h-64 w-full pt-4">
        <Chart
          key={chartType}
          redraw
          type={chartConfig.type}
          data={chartConfig.data}
          options={chartConfig.options}
        />
      </div>
    </SectionCard>
  );
}
