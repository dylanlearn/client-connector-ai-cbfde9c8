
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ResourceData {
  name: string;
  [key: string]: string | number;
}

interface ResourceUtilizationChartProps {
  resources: ResourceData[];
  height?: number;
  width?: number;
}

export const ResourceUtilizationChart = ({
  resources,
  height = 300,
  width
}: ResourceUtilizationChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !resources.length) return;

    // Destroy existing chart if any
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Extract labels (project names) and resource types
    const labels = resources.map(r => r.name);
    
    // Get all keys except 'name' to use as resource types
    const resourceTypes = Object.keys(resources[0])
      .filter(key => key !== 'name');

    // Prepare datasets
    const datasets = resourceTypes.map((type, index) => {
      // Generate distinct colors
      const colors = [
        'rgba(54, 162, 235, 0.5)', // blue
        'rgba(255, 99, 132, 0.5)', // red
        'rgba(75, 192, 192, 0.5)', // green
        'rgba(255, 206, 86, 0.5)'  // yellow
      ];

      return {
        label: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize resource type
        data: resources.map(r => r[type] as number),
        backgroundColor: colors[index % colors.length]
      };
    });

    // Create stacked bar chart
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true,
            max: 100
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw}%`;
              }
            }
          }
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [resources]);

  return (
    <div style={{ height, width: width || '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
