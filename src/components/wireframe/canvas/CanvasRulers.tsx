
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CanvasRulersProps {
  width: number;
  height: number;
  zoom: number;
  panOffset: { x: number; y: number };
  rulerSize?: number;
  className?: string;
  rulerColor?: string;
  showMarkings?: boolean;
  markingType?: 'pixels' | 'percentage' | 'both';
  onPositionClick?: (position: { x: number, y: number }) => void;
}

const CanvasRulers: React.FC<CanvasRulersProps> = ({
  width,
  height,
  zoom,
  panOffset,
  rulerSize = 20,
  className,
  rulerColor = '#888888',
  showMarkings = true,
  markingType = 'pixels',
  onPositionClick,
}) => {
  const horizontalRulerRef = useRef<HTMLCanvasElement>(null);
  const verticalRulerRef = useRef<HTMLCanvasElement>(null);
  const cornerRef = useRef<HTMLDivElement>(null);
  
  // Draw the rulers whenever dimensions or pan/zoom changes
  useEffect(() => {
    drawRulers();
  }, [width, height, zoom, panOffset, rulerSize, rulerColor, showMarkings, markingType]);
  
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
    hCtx.strokeStyle = rulerColor;
    vCtx.strokeStyle = rulerColor;
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
    
    if (showMarkings) {
      // Define spacing based on zoom
      const majorStep = calculateStepSize(zoom);
      const minorStep = majorStep / 5;
      
      // Draw horizontal markings
      hCtx.fillStyle = rulerColor;
      hCtx.textAlign = 'center';
      hCtx.font = '9px sans-serif';
      
      // Apply pan offset to create scrolling effect
      const offsetX = panOffset.x % (majorStep * zoom);
      
      for (let i = -offsetX; i < width; i += minorStep * zoom) {
        const isMajor = Math.abs((i + offsetX) % (majorStep * zoom)) < 0.1;
        const tickHeight = isMajor ? 10 : 5;
        
        hCtx.beginPath();
        hCtx.moveTo(i, rulerSize);
        hCtx.lineTo(i, rulerSize - tickHeight);
        hCtx.stroke();
        
        if (isMajor && markingType !== 'percentage') {
          // Calculate the actual pixel position
          const actualPos = Math.round((i - panOffset.x) / zoom);
          hCtx.fillText(actualPos.toString(), i, rulerSize - 12);
        }
      }
      
      // Draw vertical markings
      vCtx.fillStyle = rulerColor;
      vCtx.textAlign = 'right';
      vCtx.font = '9px sans-serif';
      
      // Apply pan offset to create scrolling effect
      const offsetY = panOffset.y % (majorStep * zoom);
      
      for (let i = -offsetY; i < height; i += minorStep * zoom) {
        const isMajor = Math.abs((i + offsetY) % (majorStep * zoom)) < 0.1;
        const tickWidth = isMajor ? 10 : 5;
        
        vCtx.beginPath();
        vCtx.moveTo(rulerSize, i);
        vCtx.lineTo(rulerSize - tickWidth, i);
        vCtx.stroke();
        
        if (isMajor && markingType !== 'percentage') {
          // Calculate the actual pixel position
          const actualPos = Math.round((i - panOffset.y) / zoom);
          vCtx.save();
          vCtx.translate(rulerSize - 12, i);
          vCtx.rotate(-Math.PI / 2);
          vCtx.fillText(actualPos.toString(), 0, 0);
          vCtx.restore();
        }
      }
    }
  };
  
  // Calculate appropriate step size based on zoom level
  const calculateStepSize = (zoom: number): number => {
    const baseStep = 100; // pixels
    if (zoom < 0.2) return baseStep * 5;
    if (zoom < 0.5) return baseStep * 2;
    if (zoom > 2) return baseStep / 2;
    if (zoom > 4) return baseStep / 5;
    return baseStep;
  };
  
  const handleHorizontalRulerClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPositionClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panOffset.x / zoom;
    
    onPositionClick({ x, y: 0 });
  };
  
  const handleVerticalRulerClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPositionClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = (e.clientY - rect.top) / zoom - panOffset.y / zoom;
    
    onPositionClick({ x: 0, y });
  };
  
  return (
    <>
      {/* Corner intersection */}
      <div 
        ref={cornerRef}
        className={cn(
          "absolute top-0 left-0 bg-gray-100 border-r border-b border-gray-300 z-10",
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
          "absolute top-0 left-0 cursor-crosshair z-10", 
          className
        )}
        style={{ 
          marginLeft: rulerSize,
          height: rulerSize
        }}
        onClick={handleHorizontalRulerClick}
      />
      
      {/* Vertical ruler */}
      <canvas
        ref={verticalRulerRef}
        className={cn(
          "absolute top-0 left-0 cursor-crosshair z-10",
          className
        )}
        style={{ 
          marginTop: rulerSize,
          width: rulerSize
        }}
        onClick={handleVerticalRulerClick}
      />
    </>
  );
};

export default CanvasRulers;
