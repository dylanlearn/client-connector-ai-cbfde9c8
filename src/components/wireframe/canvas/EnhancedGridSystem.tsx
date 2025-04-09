
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type GridType = 'lines' | 'dots' | 'columns';

export interface EnhancedGridSystemProps {
  canvasWidth: number;
  canvasHeight: number;
  gridSize: number;
  gridType: GridType;
  guidelines?: Array<{
    position: number;
    orientation: 'horizontal' | 'vertical';
    type: 'center' | 'edge' | 'distribution';
  }>;
  darkMode?: boolean;
  visible?: boolean;
  columns?: number;
  gutter?: number;
  className?: string;
  breakpoints?: Array<{
    name: string; 
    width: number;
    color?: string;
  }>;
  showBreakpoints?: boolean;
}

const EnhancedGridSystem: React.FC<EnhancedGridSystemProps> = ({
  canvasWidth,
  canvasHeight,
  gridSize,
  gridType,
  guidelines = [],
  darkMode = false,
  visible = true,
  columns = 12,
  gutter = 24,
  className,
  breakpoints = [
    { name: 'sm', width: 640, color: '#9333ea' },
    { name: 'md', width: 768, color: '#2563eb' },
    { name: 'lg', width: 1024, color: '#059669' },
    { name: 'xl', width: 1280, color: '#d97706' },
    { name: '2xl', width: 1536, color: '#dc2626' }
  ],
  showBreakpoints = true
}) => {
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const guidelinesCanvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the grid
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas || !visible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Set grid styles
    ctx.strokeStyle = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;

    if (gridType === 'dots') {
      // Draw dots
      for (let x = 0; x <= canvasWidth; x += gridSize) {
        for (let y = 0; y <= canvasHeight; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (gridType === 'lines') {
      // Draw lines
      for (let x = 0; x <= canvasWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }

      for (let y = 0; y <= canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      }
    } else if (gridType === 'columns') {
      // Draw column layout
      const availableWidth = canvasWidth;
      const totalGutterWidth = gutter * (columns - 1);
      const columnWidth = (availableWidth - totalGutterWidth) / columns;
      
      // Draw columns
      let currentX = 0;
      
      for (let i = 0; i < columns; i++) {
        // Draw column background
        ctx.fillStyle = darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
        ctx.fillRect(currentX, 0, columnWidth, canvasHeight);
        
        // Draw column borders
        ctx.strokeStyle = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(currentX, 0);
        ctx.lineTo(currentX, canvasHeight);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(currentX + columnWidth, 0);
        ctx.lineTo(currentX + columnWidth, canvasHeight);
        ctx.stroke();
        
        // Move to next column
        currentX += columnWidth + gutter;
      }
    }
    
    // Draw breakpoints if enabled
    if (showBreakpoints) {
      breakpoints.forEach(breakpoint => {
        if (breakpoint.width > canvasWidth) return;
        
        ctx.strokeStyle = breakpoint.color || '#2563eb';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(breakpoint.width, 0);
        ctx.lineTo(breakpoint.width, canvasHeight);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Add breakpoint label
        ctx.font = '10px Arial';
        ctx.fillStyle = breakpoint.color || '#2563eb';
        ctx.fillText(breakpoint.name, breakpoint.width + 5, 15);
      });
    }

  }, [canvasWidth, canvasHeight, gridSize, gridType, visible, darkMode, columns, gutter, breakpoints, showBreakpoints]);

  // Draw the guidelines
  useEffect(() => {
    const canvas = guidelinesCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw guidelines
    guidelines.forEach(guideline => {
      // Set style based on guideline type
      if (guideline.type === 'center') {
        ctx.strokeStyle = '#3b82f6'; // Blue for center alignment
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 3]);
      } else if (guideline.type === 'edge') {
        ctx.strokeStyle = '#10b981'; // Green for edge alignment
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
      } else { // 'distribution'
        ctx.strokeStyle = '#8b5cf6'; // Purple for distribution
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
      }

      ctx.beginPath();
      
      if (guideline.orientation === 'horizontal') {
        ctx.moveTo(0, guideline.position);
        ctx.lineTo(canvasWidth, guideline.position);
      } else {
        ctx.moveTo(guideline.position, 0);
        ctx.lineTo(guideline.position, canvasHeight);
      }
      
      ctx.stroke();
      
      // Reset line dash
      ctx.setLineDash([]);
    });

  }, [canvasWidth, canvasHeight, guidelines]);

  if (!visible) return null;

  return (
    <div className={cn("enhanced-grid-system absolute top-0 left-0 w-full h-full pointer-events-none", className)}>
      {/* Grid canvas */}
      <canvas
        ref={gridCanvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      
      {/* Guidelines canvas */}
      <canvas
        ref={guidelinesCanvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default EnhancedGridSystem;
