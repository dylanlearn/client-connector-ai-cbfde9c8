
import { useEffect, useRef } from 'react';
import { Chart, registerables, ChartTypeRegistry } from 'chart.js';
import { Dataset } from '@/types/analytics';

Chart.register(...registerables);

interface AnalyticsChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  labels: string[];
  datasets: Dataset[];
  height?: number;
  width?: number;
}

export const AnalyticsChart = ({ type, labels, datasets, height = 300, width }: AnalyticsChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart if any
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Cast datasets to any to avoid TypeScript errors with Chart.js complex types
    chartRef.current = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets: datasets as any
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
      }
    });

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [type, labels, datasets]);

  return (
    <div style={{ height, width: width || '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
