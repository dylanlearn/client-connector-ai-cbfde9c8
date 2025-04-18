
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';

export interface MinimapOptions {
  width: number;
  height: number;
  scale: number;
  borderColor: string;
  backgroundColor: string;
  viewportColor: string;
  viewportBorderColor: string;
  viewportBorderWidth: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  marginX: number;
  marginY: number;
  opacity: number;
  alwaysVisible: boolean;
  showOnHover: boolean;
}

export const DEFAULT_MINIMAP_OPTIONS: MinimapOptions = {
  width: 200,
  height: 150,
  scale: 0.1,
  borderColor: 'rgba(0, 0, 0, 0.2)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  viewportColor: 'rgba(33, 150, 243, 0.1)',
  viewportBorderColor: 'rgba(33, 150, 243, 0.8)',
  viewportBorderWidth: 1,
  position: 'bottom-right',
  marginX: 20,
  marginY: 20,
  opacity: 0.8,
  alwaysVisible: false,
  showOnHover: true
};

export interface CanvasMinimapProps {
  canvas: fabric.Canvas | null;
  options?: Partial<MinimapOptions>;
  onViewportMove?: (x: number, y: number) => void;
  className?: string;
}

const CanvasMinimap: React.FC<CanvasMinimapProps> = ({
  canvas,
  options: userOptions,
  onViewportMove,
  className
}) => {
  const options = { ...DEFAULT_MINIMAP_OPTIONS, ...userOptions };
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const minimapCanvasRef = useRef<fabric.StaticCanvas | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(options.alwaysVisible);
  const lastRenderRef = useRef<number>(0);

  // Initialize minimap
  useEffect(() => {
    if (!minimapRef.current) return;
    
    // Create static canvas for minimap
    const minimapCanvas = new fabric.StaticCanvas(minimapRef.current, {
      width: options.width,
      height: options.height,
      selection: false,
      renderOnAddRemove: false
    });
    
    minimapCanvasRef.current = minimapCanvas;
    
    // Position overlay based on the options
    const containerStyle = minimapRef.current.parentElement?.style;
    if (containerStyle) {
      if (options.position.includes('top')) {
        containerStyle.top = `${options.marginY}px`;
        containerStyle.bottom = 'auto';
      } else {
        containerStyle.top = 'auto';
        containerStyle.bottom = `${options.marginY}px`;
      }
      
      if (options.position.includes('left')) {
        containerStyle.left = `${options.marginX}px`;
        containerStyle.right = 'auto';
      } else {
        containerStyle.left = 'auto';
        containerStyle.right = `${options.marginX}px`;
      }
      
      containerStyle.opacity = options.alwaysVisible ? options.opacity.toString() : '0';
      containerStyle.width = `${options.width}px`;
      containerStyle.height = `${options.height}px`;
    }
    
    return () => {
      minimapCanvas.dispose();
    };
  }, [options]);

  // Update minimap when canvas changes
  useEffect(() => {
    if (!canvas || !minimapCanvasRef.current) return;
    
    const updateMinimap = () => {
      // Throttle updates to improve performance
      const now = Date.now();
      if (now - lastRenderRef.current < 100) return; // 10 FPS max
      lastRenderRef.current = now;
      
      const minimapCanvas = minimapCanvasRef.current;
      if (!minimapCanvas) return;
      
      // Clear minimap
      minimapCanvas.clear();
      
      // Calculate scale factor
      const scaleX = options.width / (canvas.width || 1);
      const scaleY = options.height / (canvas.height || 1);
      const scale = Math.min(scaleX, scaleY) * options.scale;
      
      // Clone and scale all objects from the main canvas
      canvas.getObjects().forEach(obj => {
        if (obj.data?.type === 'guide' || !obj.visible) return; // Skip guides and invisible objects
        
        obj.clone((clonedObj: fabric.Object) => {
          // Scale and position the cloned object
          clonedObj.scale(clonedObj.scaleX! * scale);
          
          if (clonedObj.left !== undefined) clonedObj.left *= scale;
          if (clonedObj.top !== undefined) clonedObj.top *= scale;
          if (clonedObj.width !== undefined && typeof clonedObj.width === 'number') clonedObj.width *= scale;
          if (clonedObj.height !== undefined && typeof clonedObj.height === 'number') clonedObj.height *= scale;
          
          clonedObj.selectable = false;
          clonedObj.evented = false;
          
          minimapCanvas.add(clonedObj);
        });
      });
      
      // Draw viewport rectangle
      const viewportTransform = canvas.viewportTransform;
      if (viewportTransform) {
        const zoom = canvas.getZoom();
        const panX = -viewportTransform[4] / zoom;
        const panY = -viewportTransform[5] / zoom;
        
        const viewportWidth = canvas.width! / zoom;
        const viewportHeight = canvas.height! / zoom;
        
        // Create viewport rectangle
        const viewport = new fabric.Rect({
          left: panX * scale,
          top: panY * scale,
          width: viewportWidth * scale,
          height: viewportHeight * scale,
          fill: options.viewportColor,
          stroke: options.viewportBorderColor,
          strokeWidth: options.viewportBorderWidth,
          selectable: false,
          evented: false,
          data: { type: 'viewport' }
        });
        
        minimapCanvas.add(viewport);
      }
      
      minimapCanvas.renderAll();
    };
    
    // Set up event listeners for canvas changes
    const handleCanvasChange = () => {
      updateMinimap();
    };
    
    canvas.on('object:added', handleCanvasChange);
    canvas.on('object:removed', handleCanvasChange);
    canvas.on('object:modified', handleCanvasChange);
    canvas.on('object:moved', handleCanvasChange);
    canvas.on('object:scaled', handleCanvasChange);
    canvas.on('zoom:changed', handleCanvasChange);
    canvas.on('viewport:translate', handleCanvasChange);
    canvas.on('after:render', handleCanvasChange);
    
    // Initial render
    updateMinimap();
    
    return () => {
      canvas.off('object:added', handleCanvasChange);
      canvas.off('object:removed', handleCanvasChange);
      canvas.off('object:modified', handleCanvasChange);
      canvas.off('object:moved', handleCanvasChange);
      canvas.off('object:scaled', handleCanvasChange);
      canvas.off('zoom:changed', handleCanvasChange);
      canvas.off('viewport:translate', handleCanvasChange);
      canvas.off('after:render', handleCanvasChange);
    };
  }, [canvas, options]);

  // Handle minimap interactions
  useEffect(() => {
    if (!minimapRef.current || !canvas) return;
    
    const minimapElement = minimapRef.current;
    
    const getMinimapCoords = (e: MouseEvent): { x: number, y: number } => {
      const rect = minimapElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    };
    
    const handleMinimapMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      
      // Calculate the position on the main canvas
      const { x, y } = getMinimapCoords(e);
      
      // Calculate scale factor
      const scaleX = options.width / (canvas.width || 1);
      const scaleY = options.height / (canvas.height || 1);
      const scale = Math.min(scaleX, scaleY) * options.scale;
      
      // Convert to main canvas coordinates
      const mainX = x / scale;
      const mainY = y / scale;
      
      // Move viewport to center on this point
      if (onViewportMove) {
        onViewportMove(mainX, mainY);
      } else {
        // Default behavior: pan the canvas
        const zoom = canvas.getZoom();
        const targetX = -mainX * zoom + canvas.width! / 2;
        const targetY = -mainY * zoom + canvas.height! / 2;
        
        canvas.absolutePan(new fabric.Point(-targetX, -targetY));
        canvas.requestRenderAll();
        
        // Trigger custom event
        canvas.fire('viewport:translate');
      }
    };
    
    const handleMinimapMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      // Same logic as mousedown
      const { x, y } = getMinimapCoords(e);
      
      // Calculate scale factor
      const scaleX = options.width / (canvas.width || 1);
      const scaleY = options.height / (canvas.height || 1);
      const scale = Math.min(scaleX, scaleY) * options.scale;
      
      // Convert to main canvas coordinates
      const mainX = x / scale;
      const mainY = y / scale;
      
      // Move viewport to center on this point
      if (onViewportMove) {
        onViewportMove(mainX, mainY);
      } else {
        // Default behavior: pan the canvas
        const zoom = canvas.getZoom();
        const targetX = -mainX * zoom + canvas.width! / 2;
        const targetY = -mainY * zoom + canvas.height! / 2;
        
        canvas.absolutePan(new fabric.Point(-targetX, -targetY));
        canvas.requestRenderAll();
        
        // Trigger custom event
        canvas.fire('viewport:translate');
      }
    };
    
    const handleMinimapMouseUp = () => {
      isDraggingRef.current = false;
    };
    
    const handleMouseEnter = () => {
      if (options.showOnHover) {
        setIsVisible(true);
      }
    };
    
    const handleMouseLeave = () => {
      if (options.showOnHover && !options.alwaysVisible) {
        setIsVisible(false);
      }
    };
    
    minimapElement.addEventListener('mousedown', handleMinimapMouseDown);
    minimapElement.addEventListener('mousemove', handleMinimapMouseMove);
    minimapElement.addEventListener('mouseup', handleMinimapMouseUp);
    minimapElement.addEventListener('mouseleave', handleMinimapMouseUp);
    
    if (options.showOnHover) {
      minimapElement.parentElement?.addEventListener('mouseenter', handleMouseEnter);
      minimapElement.parentElement?.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      minimapElement.removeEventListener('mousedown', handleMinimapMouseDown);
      minimapElement.removeEventListener('mousemove', handleMinimapMouseMove);
      minimapElement.removeEventListener('mouseup', handleMinimapMouseUp);
      minimapElement.removeEventListener('mouseleave', handleMinimapMouseUp);
      
      if (options.showOnHover) {
        minimapElement.parentElement?.removeEventListener('mouseenter', handleMouseEnter);
        minimapElement.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [canvas, options, onViewportMove]);

  return (
    <div 
      className={cn(
        "canvas-minimap-container absolute z-10 border overflow-hidden transition-opacity duration-200",
        className,
        {
          "opacity-0": !isVisible && !options.alwaysVisible,
          "opacity-80": isVisible || options.alwaysVisible
        }
      )}
      style={{
        width: `${options.width}px`,
        height: `${options.height}px`,
        backgroundColor: options.backgroundColor,
        borderColor: options.borderColor
      }}
    >
      <canvas 
        ref={minimapRef} 
        width={options.width} 
        height={options.height}
        className="canvas-minimap"
      />
    </div>
  );
};

export default CanvasMinimap;
