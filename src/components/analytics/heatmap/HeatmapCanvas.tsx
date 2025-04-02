
import { useRef, useEffect } from 'react';
import { HeatmapDataPoint } from '@/types/analytics';

interface HeatmapCanvasProps {
  isLoading: boolean;
  displayMode: 'clicks' | 'hover' | 'scrolls' | 'movements' | 'attention';
  heatmapData: {
    clicks: HeatmapDataPoint[];
    hover: HeatmapDataPoint[];
    scrolls: HeatmapDataPoint[];
    movements: HeatmapDataPoint[];
    attention: HeatmapDataPoint[];
  };
  viewType: 'heatmap' | 'map' | 'timeline';
}

const HeatmapCanvas = ({ isLoading, displayMode, heatmapData, viewType }: HeatmapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || isLoading || viewType !== 'heatmap') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvasContainerRef.current) {
      const containerWidth = canvasContainerRef.current.clientWidth;
      canvas.width = containerWidth;
      canvas.height = Math.round(containerWidth * 0.6);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dataPoints = heatmapData[displayMode];
    if (!dataPoints || dataPoints.length === 0) {
      drawEmptyState(ctx, canvas);
      return;
    }

    const maxValue = Math.max(...dataPoints.map(p => p.value));

    dataPoints.forEach(point => {
      const scaledX = (point.x / 1200) * canvas.width;
      const scaledY = (point.y / 800) * canvas.height;

      const value = Math.min(1, point.value / maxValue);
      const radius = 10 + (value * 40);
      
      let color;
      if (displayMode === 'clicks') {
        color = getRedGradient(value);
      } else if (displayMode === 'hover') {
        color = getBlueGradient(value);
      } else if (displayMode === 'scrolls') {
        color = getGreenGradient(value);
      } else if (displayMode === 'movements') {
        color = getYellowGradient(value);
      } else {
        color = getPurpleGradient(value);
      }

      const gradient = ctx.createRadialGradient(
        scaledX, scaledY, 0,
        scaledX, scaledY, radius
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(scaledX, scaledY, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [heatmapData, displayMode, isLoading, viewType]);

  const getRedGradient = (value: number) => {
    return `rgba(255, 0, 0, ${0.3 + (value * 0.5)})`;
  };

  const getBlueGradient = (value: number) => {
    return `rgba(0, 0, 255, ${0.2 + (value * 0.4)})`;
  };

  const getGreenGradient = (value: number) => {
    return `rgba(0, 128, 0, ${0.2 + (value * 0.4)})`;
  };

  const getYellowGradient = (value: number) => {
    return `rgba(255, 215, 0, ${0.2 + (value * 0.4)})`;
  };

  const getPurpleGradient = (value: number) => {
    return `rgba(128, 0, 128, ${0.2 + (value * 0.5)})`;
  };

  const drawEmptyState = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#888888';
    ctx.textAlign = 'center';
    ctx.fillText('No interaction data available for this view', canvas.width / 2, canvas.height / 2);
    ctx.font = '14px Arial';
    ctx.fillText('Interact with your application to collect data', canvas.width / 2, canvas.height / 2 + 30);
  };

  return (
    <div ref={canvasContainerRef} className="w-full">
      <canvas 
        ref={canvasRef} 
        className="w-full aspect-video"
      />
    </div>
  );
};

export default HeatmapCanvas;
