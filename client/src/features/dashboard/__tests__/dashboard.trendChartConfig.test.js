import { describe, it } from 'node:test';
import assert from 'node:assert';
import { buildMixedChartConfig, buildLineChartConfig } from '../dashboard.chartConfig.js';

describe('dashboard.chartConfig', () => {
  const mockTrendSeries = {
    dates: ['01/01', '02/01', '03/01'],
    revenues: [1000000, 2000000, 1500000]
  };

  describe('buildMixedChartConfig', () => {
    it('should assert labels and dataset lengths remain aligned', () => {
      const config = buildMixedChartConfig(mockTrendSeries);
      
      assert.strictEqual(config.data.labels.length, mockTrendSeries.dates.length);
      assert.strictEqual(config.data.datasets[0].data.length, mockTrendSeries.revenues.length);
      assert.strictEqual(config.data.datasets[1].data.length, mockTrendSeries.revenues.length);
    });

    it('should format tooltip value as VND string', () => {
      const config = buildMixedChartConfig(mockTrendSeries);
      
      const tooltipCallback = config.options.plugins.tooltip.callbacks.label;
      const context = { 
        dataset: { label: 'Doanh thu' },
        raw: 1500000,
        parsed: { y: 1500000 }
      };
      
      const formatted = tooltipCallback(context);
      assert.ok(formatted.includes('1.500.000') || formatted.includes('1,500,000'));
      assert.ok(formatted.includes('đ') || formatted.includes('VND'));
    });

    it('should handle empty series correctly', () => {
      const config = buildMixedChartConfig({ dates: [], revenues: [] });
      assert.strictEqual(config.data.labels.length, 0);
      assert.strictEqual(config.data.datasets[0].data.length, 0);
    });
  });

  describe('buildLineChartConfig', () => {
    it('should assert labels and dataset lengths remain aligned', () => {
      const config = buildLineChartConfig(mockTrendSeries);
      
      assert.strictEqual(config.data.labels.length, mockTrendSeries.dates.length);
      assert.strictEqual(config.data.datasets[0].data.length, mockTrendSeries.revenues.length);
    });

    it('should format tooltip value as VND string', () => {
      const config = buildLineChartConfig(mockTrendSeries);
      
      const tooltipCallback = config.options.plugins.tooltip.callbacks.label;
      const context = { 
        dataset: { label: 'Doanh thu' },
        raw: 2500000,
        parsed: { y: 2500000 }
      };
      
      const formatted = tooltipCallback(context);
      assert.ok(formatted.includes('2.500.000') || formatted.includes('2,500,000'));
      assert.ok(formatted.includes('đ') || formatted.includes('VND'));
    });
  });
});
