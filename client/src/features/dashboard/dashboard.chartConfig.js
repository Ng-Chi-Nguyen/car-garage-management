/**
 * Chart.js configuration builders for the dashboard.
 * Designed to be deterministic and pure, with no global state.
 */

// Design System Colors
const COLORS = {
  primary: '#0040a1',
  primaryContainer: '#0056d2', // Used for gradients but we'll use it as solid for line/bar if needed
  primarySoft: 'rgba(0, 64, 161, 0.15)', // 15% opacity
  secondary: '#515f74',
  surfaceContainerLow: '#f2f4f6',
  onSurface: '#191c1e',
  onSurfaceVariant: '#44474e',
  outlineVariant: 'rgba(195, 198, 214, 0.15)', // 15% opacity ghost border
  gridLine: 'rgba(195, 198, 214, 0.15)',
};

const commonTooltipOptions = {
  backgroundColor: '#ffffff',
  titleColor: COLORS.onSurface,
  bodyColor: COLORS.onSurface,
  borderColor: COLORS.outlineVariant,
  borderWidth: 1,
  padding: 12,
  cornerRadius: 8, // md (0.75rem ~ 12px, but 8px is good for tooltip)
  displayColors: false,
  callbacks: {
    label: function (context) {
      let label = context.dataset.label || '';
      if (label) {
        label += ': ';
      }
      if (context.parsed.y !== null) {
        label += context.parsed.y.toLocaleString('vi-VN') + ' đ';
      } else if (context.raw !== null) {
        label += context.raw.toLocaleString('vi-VN') + ' đ';
      }
      return label;
    }
  }
};

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: commonTooltipOptions,
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: COLORS.onSurfaceVariant,
        font: {
          family: "'Be Vietnam Pro', sans-serif",
          size: 11, // label-md
        }
      }
    },
    y: {
      grid: {
        color: COLORS.gridLine,
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: COLORS.onSurfaceVariant,
        font: {
          family: "'Be Vietnam Pro', sans-serif",
          size: 11,
        },
        callback: function(value) {
          if (value === 0) return '0 đ';
          if (value >= 1000000) {
            return (value / 1000000) + 'M đ';
          }
          if (value >= 1000) {
            return (value / 1000) + 'K đ';
          }
          return value.toLocaleString('vi-VN') + ' đ';
        }
      }
    }
  }
};

/**
 * Builds a mixed chart configuration (Bar for revenue, Line for trend).
 * @param {Object} trendSeries - The series data { dates: string[], revenues: number[] }
 * @returns {Object} Chart.js configuration object
 */
export function buildMixedChartConfig(trendSeries) {
  const dates = trendSeries?.dates || [];
  const revenues = trendSeries?.revenues || [];

  return {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [
        {
          type: 'line',
          label: 'Xu hướng',
          data: revenues,
          borderColor: COLORS.secondary,
          backgroundColor: COLORS.secondary,
          borderWidth: 2,
          tension: 0.4, // Smooth curve
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
        },
        {
          type: 'bar',
          label: 'Doanh thu',
          data: revenues,
          backgroundColor: COLORS.primary,
          hoverBackgroundColor: COLORS.primaryContainer,
          borderRadius: 4, // sm rounding
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        }
      ]
    },
    options: {
      ...commonOptions,
    }
  };
}

/**
 * Builds a line/area chart configuration.
 * @param {Object} trendSeries - The series data { dates: string[], revenues: number[] }
 * @returns {Object} Chart.js configuration object
 */
export function buildLineChartConfig(trendSeries) {
  const dates = trendSeries?.dates || [];
  const revenues = trendSeries?.revenues || [];

  return {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Doanh thu',
          data: revenues,
          borderColor: COLORS.primary,
          backgroundColor: COLORS.primarySoft,
          borderWidth: 2,
          tension: 0.4, // Smooth curve
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: true,
        }
      ]
    },
    options: {
      ...commonOptions,
    }
  };
}
