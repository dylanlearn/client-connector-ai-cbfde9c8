
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCanvasRulersProps {
  width: number;
  height: number;
  zoom: number;
  panOffset: { x: number; y: number };
  rulerSize?: number;
  className?: string;
  showRulers?: boolean;
  onPositionClick?: (position: { x: number, y: number }, orientation: 'horizontal' | 'vertical') => void;
}

const EnhancedCanvasRulers: React.FC<EnhancedCanvasRulersProps> = ({
  width,
  height,
  zoom,
  panOffset,
  rulerSize = 20,
  className,
  showRulers = true,
  onPositionClick,
}) => {
  const horizontalRulerRef = useRef<HTMLCanvasElement>(null);
  const verticalRulerRef = useRef<HTMLCanvasElement>(null);
  const cornerRef = useRef<HTMLDivElement>(null);
  
  // Draw the rulers whenever dimensions or pan/zoom changes
  useEffect(() => {
    if (!showRulers) return;
    drawRulers();
  }, [width, height, zoom, panOffset, rulerSize, showRulers]);
  
  const drawRulers = () => {
    const hRuler = horizontalRulerRef.current;
    const vRuler = verticalRulerRef.current;
    
    if (!hRuler || !vRuler) return;
    
    // Set canvas dimensions accounting for device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    
    // Configure horizontal ruler
    hRuler.width = width * dpr;
    hRuler.height = rulerSize * dpr;
    hRuler.style.width = `${width}px`;
    hRuler.style.height = `${rulerSize}px`;
    
    // Configure vertical ruler
    vRuler.width = rulerSize * dpr;
    vRuler.height = height * dpr;
    vRuler.style.width = `${rulerSize}px`;
    vRuler.style.height = `${height}px`;
    
    // Get contexts and adjust for DPR
    const hCtx = hRuler.getContext('2d');
    const vCtx = vRuler.getContext('2d');
    
    if (!hCtx || !vCtx) return;
    
    hCtx.scale(dpr, dpr);
    vCtx.scale(dpr, dpr);
    
    // Clear previous drawings
    hCtx.clearRect(0, 0, width, rulerSize);
    vCtx.clearRect(0, 0, rulerSize, height);
    
    // Draw ruler backgrounds
    hCtx.fillStyle = '#f5f5f5';
    vCtx.fillStyle = '#f5f5f5';
    hCtx.fillRect(0, 0, width, rulerSize);
    vCtx.fillRect(0, 0, rulerSize, height);
    
    // Draw ruler borders
    hCtx.strokeStyle = '#888888';
    vCtx.strokeStyle = '#888888';
    hCtx.lineWidth = 1;
    vCtx.lineWidth = 1;
    
    hCtx.beginPath();
    hCtx.moveTo(0, rulerSize - 0.5);
    hCtx.lineTo(width, rulerSize - 0.5);
    hCtx.stroke();
    
    vCtx.beginPath();
    vCtx.moveTo(rulerSize - 0.5, 0);
    vCtx.lineTo(rulerSize - 0.5, height);
    vCtx.stroke();
    
    // Define spacing based on zoom
    const majorStep = calculateStepSize(zoom);
    const minorStep = majorStep / 5;
    
    // Draw horizontal markings
    hCtx.fillStyle = '#555555';
    hCtx.textAlign = 'center';
    hCtx.font = '9px sans-serif';
    
    // Apply pan offset to create scrolling effect
    const offsetX = panOffset.x;
    const actualOffsetX = offsetX % (majorStep * zoom);
    
    for (let i = -actualOffsetX; i <= width; i += minorStep * zoom) {
      const actualPosition = (i - offsetX) / zoom;
      const isMajor = Math.abs(actualPosition % majorStep) < 0.1;
      const tickHeight = isMajor ? 10 : 5;
      
      hCtx.beginPath();
      hCtx.moveTo(i, rulerSize);
      hCtx.lineTo(i, rulerSize - tickHeight);
      hCtx.stroke();
      
      if (isMajor) {
        hCtx.fillText(Math.round(actualPosition).toString(), i, rulerSize - 12);
      }
    }
    
    // Draw vertical markings
    vCtx.fillStyle = '#555555';
    vCtx.textAlign = 'right';
    vCtx.font = '9px sans-serif';
    
    // Apply pan offset to create scrolling effect
    const offsetY = panOffset.y;
    const actualOffsetY = offsetY % (majorStep * zoom);
    
    for (let i = -actualOffsetY; i <= height; i += minorStep * zoom) {
      const actualPosition = (i - offsetY) / zoom;
      const isMajor = Math.abs(actualPosition % majorStep) < 0.1;
      const tickWidth = isMajor ? 10 : 5;
      
      vCtx.beginPath();
      vCtx.moveTo(rulerSize, i);
      vCtx.lineTo(rulerSize - tickWidth, i);
      vCtx.stroke();
      
      if (isMajor) {
        vCtx.save();
        vCtx.translate(rulerSize - 12, i + 3);
        vCtx.rotate(-Math.PI / 2);
        vCtx.fillText(Math.round(actualPosition).toString(), 0, 0);
        vCtx.restore();
      }
    }
    
    // Draw mouse position indicators if available
    const mousePosition = { x: 0, y: 0 };
    
    if (mousePosition.x > 0 && mousePosition.y > 0) {
      // Horizontal indicator
      hCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      hCtx.fillRect(mousePosition.x, 0, 1, rulerSize);
      
      // Vertical indicator
      vCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      vCtx.fillRect(0, mousePosition.y, rulerSize, 1);
    }
  };
  
  // Calculate appropriate step size based on zoom level
  const calculateStepSize = (zoom: number): number => {
    if (zoom < 0.2) return 100;
    if (zoom < 0.5) return 50;
    if (zoom < 1) return 20;
    if (zoom < 2) return 10;
    if (zoom < 4) return 5;
    return 2;
  };
  
  const handleHorizontalRulerClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPositionClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panOffset.x / zoom;
    
    onPositionClick({ x, y: 0 }, 'horizontal');
  };
  
  const handleVerticalRulerClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPositionClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = (e.clientY - rect.top) / zoom - panOffset.y / zoom;
    
    onPositionClick({ x: 0, y }, 'vertical');
  };
  
  if (!showRulers) {
    return null;
  }
  
  return (
    <>
      {/* Corner intersection */}
      <div 
        ref={cornerRef}
        className={cn(
          "absolute top-0 left-0 bg-gray-100 border-r border-b z-20",
          className
        )}
        style={{ 
          width: rulerSize, 
          height: rulerSize 
        }}
      />
      
      {/* Horizontal ruler */}
      <canvas
        ref={horizontalRulerRef}
        className={cn(
          "absolute top-0 cursor-crosshair z-10", 
          className
        )}
        style={{ 
          left: rulerSize,
          height: rulerSize
        }}
        onClick={handleHorizontalRulerClick}
      />
      
      {/* Vertical ruler */}
      <canvas
        ref={verticalRulerRef}
        className={cn(
          "absolute left-0 cursor-crosshair z-10",
          className
        )}
        style={{ 
          top: rulerSize,
          width: rulerSize
        }}
        onClick={handleVerticalRulerClick}
      />
    </>
  );
};

export default EnhancedCanvasRulers;
