
import React, { useRef, useEffect, useCallback } from 'react';
import { useHighPerformanceCanvas } from '@/hooks/canvas/use-high-performance-canvas';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Gauge, Zap } from 'lucide-react';

export interface HighPerformanceCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  showPerformanceStats?: boolean;
  autoOptimize?: boolean;
  devicePixelRatio?: number;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
}

const HighPerformanceCanvas: React.FC<HighPerformanceCanvasProps> = ({
  width = 1200,
  height = 800,
  className,
  showPerformanceStats = false,
  autoOptimize = true,
  devicePixelRatio,
  onCanvasReady
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const {
    canvasRef,
    canvas,
    performanceMetrics,
    optimizeCanvas,
    cleanupResources
  } = useHighPerformanceCanvas({
    width,
    height,
    optimizationOptions: {
      enableLayerCaching: true,
      enableIncrementalRendering: true,
      enableHardwareAcceleration: true,
      autoOptimize,
      devicePixelRatio: devicePixelRatio || (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)
    },
    memoryOptions: {
      memoryOptions: {
        enableObjectPooling: true,
        enableGarbageCollection: true,
        enableResourceMonitoring: true
      }
    }
  });

  // Notify when canvas is ready
  useEffect(() => {
    if (canvas && onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [canvas, onCanvasReady]);

  // Periodically optimize canvas and clean up resources
  useEffect(() => {
    if (!canvas || !autoOptimize) return;
    
    const optimizeInterval = setInterval(() => {
      optimizeCanvas();
    }, 5000);
    
    const cleanupInterval = setInterval(() => {
      cleanupResources();
    }, 30000);
    
    return () => {
      clearInterval(optimizeInterval);
      clearInterval(cleanupInterval);
    };
  }, [canvas, optimizeCanvas, cleanupResources, autoOptimize]);

  // Function to format performance metric values nicely
  const formatMetricValue = useCallback((value: number, unit: string, precision: number = 1) => {
    return `${value.toFixed(precision)}${unit}`;
  }, []);
  
  // Memorize performance metrics
  const renderingMetrics = performanceMetrics?.rendering;
  const memoryMetrics = performanceMetrics?.memory;
  
  // Calculate performance indicator colors
  const getPerformanceColor = useCallback((fps: number) => {
    if (fps >= 55) return 'bg-green-500';
    if (fps >= 30) return 'bg-amber-500';
    return 'bg-red-500';
  }, []);
  
  const getMemoryColor = useCallback((usage: number) => {
    if (usage < 50) return 'bg-green-500';
    if (usage < 100) return 'bg-amber-500';
    return 'bg-red-500';
  }, []);
  
  // Schedule stats update to reduce re-renders
  useEffect(() => {
    if (statsTimeout.current) {
      clearTimeout(statsTimeout.current);
    }
    
    if (showPerformanceStats) {
      statsTimeout.current = setTimeout(() => {
        // Force re-render for stats update
        if (containerRef.current) {
          containerRef.current.classList.toggle('stats-update');
          containerRef.current.classList.toggle('stats-update');
        }
      }, 1000);
    }
    
    return () => {
      if (statsTimeout.current) {
        clearTimeout(statsTimeout.current);
      }
    };
  }, [showPerformanceStats, performanceMetrics]);

  return (
    <div 
      ref={containerRef}
      className={cn("high-performance-canvas-container relative", className)}
      style={{ width, height }}
    >
      <canvas 
        ref={canvasRef}
        width={width}
        height={height}
        className="high-performance-canvas"
        style={{ 
          width: '100%', 
          height: '100%', 
          touchAction: 'none'
        }}
      />
      
      {!canvas && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-[400px] w-[600px]" />
            <p className="text-sm text-muted-foreground">Canvas loading...</p>
          </div>
        </div>
      )}
      
      {showPerformanceStats && canvas && (
        <div className="absolute top-2 right-2 flex flex-col gap-1 bg-background/80 p-2 rounded-md text-xs border shadow-sm">
          <div className="flex items-center gap-2 font-mono">
            <Zap className="h-3 w-3" />
            <span>FPS:</span>
            <Badge 
              variant="outline" 
              className={cn("min-w-[40px] text-center text-white", 
                getPerformanceColor(renderingMetrics?.frameRate || 0)
              )}
            >
              {formatMetricValue(renderingMetrics?.frameRate || 0, '', 0)}
            </Badge>
            
            <span>Render:</span>
            <Badge variant="outline">
              {formatMetricValue(renderingMetrics?.renderTime || 0, 'ms')}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 font-mono">
            <Gauge className="h-3 w-3" />
            <span>Mem:</span>
            <Badge 
              variant="outline"
              className={cn("min-w-[50px] text-center text-white",
                getMemoryColor(memoryMetrics?.estimatedMemoryUsage || 0)
              )}
            >
              {formatMetricValue(memoryMetrics?.estimatedMemoryUsage || 0, 'MB', 0)}
            </Badge>
            
            <span>Objs:</span>
            <Badge variant="outline">
              {memoryMetrics?.objectCount || 0}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighPerformanceCanvas;
