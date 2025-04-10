
import { useState, useEffect, useCallback, useRef } from 'react';
import { fabric } from 'fabric';
import { wireframeRendererService } from '@/services/wireframe/wireframe-renderer-service';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useToast } from '@/hooks/use-toast';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';

export interface UseWireframeRendererOptions {
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  interactive?: boolean;
  canvasConfig?: Partial<WireframeCanvasConfig>;
  onSectionClick?: (sectionId: string, section: any) => void;
  onRenderComplete?: (canvas: fabric.Canvas) => void;
  onError?: (error: Error) => void;
}

export function useWireframeRenderer(options: UseWireframeRendererOptions = {}) {
  const {
    darkMode = false,
    deviceType = 'desktop',
    interactive = true,
    canvasConfig = {},
    onSectionClick,
    onRenderComplete,
    onError
  } = options;
  
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { toast } = useToast();
  
  const [lastRenderedData, setLastRenderedData] = useState<{
    wireframe: WireframeData | null;
    deviceType: string;
    darkMode: boolean;
  }>({
    wireframe: null,
    deviceType,
    darkMode
  });
  
  // Initialize Fabric.js canvas
  const initializeCanvas = useCallback((canvasElement: HTMLCanvasElement | null) => {
    if (!canvasElement) return null;
    
    // If we already have a canvas, dispose it first
    if (canvas) {
      canvas.dispose();
    }
    
    // Create new canvas
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      width: canvasConfig.width || 1200,
      height: canvasConfig.height || 800,
      backgroundColor: canvasConfig.backgroundColor || (darkMode ? '#1a1a1a' : '#ffffff'),
      selection: interactive,
      preserveObjectStacking: true
    });
    
    // Set up event handlers for section clicks
    if (interactive && onSectionClick) {
      fabricCanvas.on('mouse:down', (event) => {
        const target = event.target;
        
        if (target && target.data?.type === 'section') {
          onSectionClick(target.data.id, target.data.originalSection || {});
        }
      });
    }
    
    // Apply canvas configuration
    if (canvasConfig.zoom && canvasConfig.zoom !== 1) {
      fabricCanvas.setZoom(canvasConfig.zoom);
    }
    
    if (canvasConfig.panOffset && (canvasConfig.panOffset.x !== 0 || canvasConfig.panOffset.y !== 0)) {
      fabricCanvas.absolutePan(new fabric.Point(canvasConfig.panOffset.x, canvasConfig.panOffset.y));
    }
    
    setCanvas(fabricCanvas);
    return fabricCanvas;
  }, [canvas, canvasConfig, darkMode, interactive, onSectionClick]);
  
  // Function to render wireframe data to canvas
  const renderWireframe = useCallback((
    wireframe: WireframeData | null,
    canvas: fabric.Canvas | null,
    options: {
      deviceType?: 'desktop' | 'tablet' | 'mobile';
      darkMode?: boolean;
      renderGrid?: boolean;
    } = {}
  ) => {
    if (!wireframe || !canvas) return;
    
    try {
      setIsRendering(true);
      setError(null);
      
      // Store rendering configuration for re-rendering if needed
      setLastRenderedData({
        wireframe,
        deviceType: options.deviceType || deviceType,
        darkMode: options.darkMode !== undefined ? options.darkMode : darkMode
      });
      
      // Render the wireframe
      wireframeRendererService.renderWireframeToCanvas(canvas, wireframe, {
        deviceType: options.deviceType || deviceType,
        darkMode: options.darkMode !== undefined ? options.darkMode : darkMode,
        config: canvasConfig,
        interactive,
        renderGrid: options.renderGrid !== undefined ? options.renderGrid : canvasConfig.showGrid
      });
      
      // Call onRenderComplete callback if provided
      if (onRenderComplete) {
        onRenderComplete(canvas);
      }
    } catch (err) {
      console.error("Error rendering wireframe:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Show toast notification
      toast({
        title: "Rendering error",
        description: `Failed to render wireframe: ${err instanceof Error ? err.message : String(err)}`,
        variant: "destructive"
      });
      
      // Call onError callback if provided
      if (onError) {
        onError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      setIsRendering(false);
    }
  }, [canvasConfig, darkMode, deviceType, interactive, onRenderComplete, onError, toast]);
  
  // Re-render when device type or dark mode changes
  useEffect(() => {
    if (canvas && lastRenderedData.wireframe) {
      // Only re-render if these properties changed
      if (
        lastRenderedData.deviceType !== deviceType ||
        lastRenderedData.darkMode !== darkMode
      ) {
        renderWireframe(lastRenderedData.wireframe, canvas, {
          deviceType,
          darkMode
        });
      }
    }
  }, [canvas, darkMode, deviceType, lastRenderedData, renderWireframe]);
  
  // Cleanup function
  useEffect(() => {
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvas]);
  
  return {
    canvas,
    canvasRef,
    isRendering,
    error,
    initializeCanvas,
    renderWireframe,
    lastRenderedData
  };
}
