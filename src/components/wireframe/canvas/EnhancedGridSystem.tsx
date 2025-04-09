
import React, { useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { GridConfig, GridBreakpoint as GridConfigBreakpoint, calculateColumnPositions, calculateGridPositions } from '../utils/grid-utils';

export type GridType = 'lines' | 'dots' | 'columns' | 'bootstrap' | 'tailwind' | 'custom';

export interface GridBreakpoint {
  name: string;
  width: number;
  color?: string;
}

export interface GridGuideline {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'center' | 'edge' | 'distribution';
}

export interface EnhancedGridSystemProps {
  canvasWidth: number;
  canvasHeight: number;
  gridSize: number;
  gridType: GridType;
  guidelines?: GridGuideline[];
  darkMode?: boolean;
  visible?: boolean;
  columns?: number;
  gutter?: number;
  className?: string;
  breakpoints?: GridBreakpoint[];
  showBreakpoints?: boolean;
  opacity?: number;
  color?: string;
  onBreakpointClick?: (breakpoint: GridBreakpoint) => void;
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
  breakpoints = [],
  showBreakpoints = true,
  opacity = 0.15,
  color,
  onBreakpointClick
}) => {
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const guidelinesCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate grid colors based on theme
  const gridColor = useMemo(() => {
    return color || (darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)');
  }, [color, darkMode]);
  
  // Calculate margin gutters for column grids
  const margins = useMemo(() => {
    // For column-based grids, add margins on the sides
    if (['columns', 'bootstrap', 'tailwind'].includes(gridType)) {
      return gridType === 'bootstrap' ? 15 : (gridType === 'tailwind' ? 16 : gutter / 2);
    }
    return 0;
  }, [gridType, gutter]);
  
  // Calculate column positions
  const columnPositions = useMemo(() => {
    if (['columns', 'bootstrap', 'tailwind'].includes(gridType)) {
      // Adjust canvas width to account for margins
      const adjustedWidth = canvasWidth - (margins * 2);
      return calculateColumnPositions(adjustedWidth, columns, gutter, margins);
    }
    return [];
  }, [canvasWidth, columns, gutter, gridType, margins]);

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
    ctx.strokeStyle = gridColor;
    ctx.fillStyle = gridColor;
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
      const positions = calculateGridPositions(canvasWidth, canvasHeight, gridSize);
      
      // Draw horizontal lines
      positions.horizontal.forEach(y => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      });
      
      // Draw vertical lines
      positions.vertical.forEach(x => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      });
    } else if (['columns', 'bootstrap', 'tailwind'].includes(gridType)) {
      // Draw column layout with the correct margin offset
      columnPositions.forEach((position, index) => {
        // Skip the last position (right edge)
        if (index < columnPositions.length - 1) {
          const colLeft = position + margins;
          const colWidth = columnPositions[index + 1] - position - gutter;
          
          // Draw column background
          ctx.fillStyle = darkMode 
            ? `rgba(255, 255, 255, ${opacity / 2})`  
            : `rgba(0, 0, 50, ${opacity / 2})`;
          ctx.fillRect(colLeft, 0, colWidth, canvasHeight);
          
          // Draw column borders
          ctx.strokeStyle = darkMode 
            ? `rgba(255, 255, 255, ${opacity * 1.5})`
            : `rgba(0, 0, 0, ${opacity * 1.5})`;
          
          // Left border
          ctx.beginPath();
          ctx.moveTo(colLeft, 0);
          ctx.lineTo(colLeft, canvasHeight);
          ctx.stroke();
          
          // Right border
          ctx.beginPath();
          ctx.moveTo(colLeft + colWidth, 0);
          ctx.lineTo(colLeft + colWidth, canvasHeight);
          ctx.stroke();
        }
      });
      
      // Draw container boundaries with more prominence
      const containerLeft = margins;
      const containerRight = canvasWidth - margins;
      
      ctx.strokeStyle = darkMode 
        ? `rgba(255, 255, 255, ${opacity * 2})` 
        : `rgba(0, 0, 0, ${opacity * 2})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      // Left container boundary
      ctx.beginPath();
      ctx.moveTo(containerLeft, 0);
      ctx.lineTo(containerLeft, canvasHeight);
      ctx.stroke();
      
      // Right container boundary
      ctx.beginPath();
      ctx.moveTo(containerRight, 0);
      ctx.lineTo(containerRight, canvasHeight);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }
    
    // Draw breakpoints if enabled
    if (showBreakpoints && breakpoints.length > 0) {
      const applicableBreakpoints = breakpoints.filter(bp => bp.width < canvasWidth);
      
      applicableBreakpoints.forEach(breakpoint => {
        const bpColor = breakpoint.color || '#2563eb';
        
        ctx.strokeStyle = bpColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(breakpoint.width, 0);
        ctx.lineTo(breakpoint.width, canvasHeight);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Add breakpoint label
        ctx.font = '10px Arial';
        ctx.fillStyle = bpColor;
        ctx.fillText(breakpoint.name, breakpoint.width + 5, 15);
        
        // Add a clickable area if callback provided
        if (onBreakpointClick) {
          const area = document.createElement('div');
          area.style.position = 'absolute';
          area.style.left = `${breakpoint.width - 5}px`;
          area.style.top = '0';
          area.style.width = '10px';
          area.style.height = '30px';
          area.style.cursor = 'pointer';
          area.title = `${breakpoint.name} (${breakpoint.width}px)`;
          area.onclick = () => onBreakpointClick(breakpoint);
          
          // Append to parent container
          if (canvas.parentNode) {
            canvas.parentNode.appendChild(area);
          }
        }
      });
    }

  }, [canvasWidth, canvasHeight, gridSize, gridType, visible, darkMode, columns, gutter, 
      breakpoints, showBreakpoints, gridColor, opacity, columnPositions, margins, onBreakpointClick]);

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
      
      {/* Grid type indicator */}
      <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-md text-muted-foreground">
        {gridType === 'lines' && 'Grid Lines'}
        {gridType === 'dots' && 'Grid Dots'}
        {gridType === 'columns' && `${columns}-Column Grid`}
        {gridType === 'bootstrap' && 'Bootstrap Grid'}
        {gridType === 'tailwind' && 'Tailwind Grid'}
        {gridType === 'custom' && 'Custom Grid'}
      </div>
    </div>
  );
};

export default EnhancedGridSystem;
