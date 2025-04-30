
import React, { useState, useEffect, useMemo } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { 
  DEFAULT_GRID_CONFIG, 
  calculateColumnPositions,
  calculateGridPositions,
  GridBreakpoint,
  GridConfig
} from '@/utils/monitoring/grid-utils';

interface EnhancedGridSystemProps {
  canvas: fabric.Canvas;
  width: number;
  height: number;
  gridConfig: Partial<GridConfig>;
  darkMode?: boolean;
}

const EnhancedGridSystem: React.FC<EnhancedGridSystemProps> = ({
  canvas,
  width,
  height,
  gridConfig,
  darkMode = false
}) => {
  const [showColumns, setShowColumns] = useState(false);
  
  // Merge with default config
  const config: GridConfig = {
    ...DEFAULT_GRID_CONFIG,
    ...gridConfig
  };
  
  // Calculate grid positions
  const gridPositions = useMemo(() => {
    return calculateGridPositions(width, height, config.size);
  }, [width, height, config.size]);
  
  // Get current breakpoint
  const currentBreakpoint = useMemo(() => {
    if (!config.breakpoints || config.breakpoints.length === 0) {
      return null;
    }
    
    const activeBreakpoint = config.breakpoints.find(bp => bp.name === config.currentBreakpoint);
    return activeBreakpoint || config.breakpoints[0];
  }, [config.breakpoints, config.currentBreakpoint]);
  
  // Calculate column positions based on current breakpoint
  const columnPositions = useMemo(() => {
    if (!currentBreakpoint) return [];
    return calculateColumnPositions(width, currentBreakpoint);
  }, [width, currentBreakpoint]);
  
  // Render grid lines
  const renderGrid = () => {
    if (!config.visible) return null;
    
    const gridColor = darkMode ? '#374151' : (config.color || '#e5e7eb');
    const lineOpacity = config.opacity || 0.5;
    
    // Render based on grid type
    if (config.type === 'lines') {
      return (
        <g className="grid-lines">
          {/* Vertical lines */}
          {gridPositions.x.map((x, i) => (
            <line
              key={`v-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={height}
              stroke={gridColor}
              strokeWidth={x % (config.size * 5) === 0 ? 1 : 0.5}
              opacity={lineOpacity}
            />
          ))}
          
          {/* Horizontal lines */}
          {gridPositions.y.map((y, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke={gridColor}
              strokeWidth={y % (config.size * 5) === 0 ? 1 : 0.5}
              opacity={lineOpacity}
            />
          ))}
        </g>
      );
    } else if (config.type === 'dots') {
      return (
        <g className="grid-dots">
          {gridPositions.x.map((x) => (
            gridPositions.y.map((y, i) => (
              <circle
                key={`d-${x}-${y}-${i}`}
                cx={x}
                cy={y}
                r={(x % (config.size * 5) === 0 && y % (config.size * 5) === 0) ? 1.5 : 1}
                fill={gridColor}
                opacity={lineOpacity}
              />
            ))
          ))}
        </g>
      );
    } else if (config.type === 'columns' && currentBreakpoint) {
      return (
        <g className="grid-columns">
          {columnPositions.map((x, i) => {
            const colWidth = (width - (currentBreakpoint.marginWidth * 2) - 
                           ((currentBreakpoint.columns - 1) * currentBreakpoint.gutterWidth)) / 
                           currentBreakpoint.columns;
            
            return (
              <rect
                key={`col-${i}`}
                x={x}
                y={0}
                width={colWidth}
                height={height}
                fill={currentBreakpoint.color || gridColor}
                opacity={0.1}
                stroke={currentBreakpoint.color || gridColor}
                strokeWidth={1}
                strokeOpacity={0.3}
              />
            );
          })}
          
          {/* Margin indicators */}
          <rect
            x={0}
            y={0}
            width={currentBreakpoint.marginWidth}
            height={height}
            fill={currentBreakpoint.color || gridColor}
            opacity={0.15}
          />
          <rect
            x={width - currentBreakpoint.marginWidth}
            y={0}
            width={currentBreakpoint.marginWidth}
            height={height}
            fill={currentBreakpoint.color || gridColor}
            opacity={0.15}
          />
        </g>
      );
    }
    
    return null;
  };
  
  // Toggle grid visibility in canvas
  useEffect(() => {
    const toggleGrid = () => {
      if (canvas) {
        const objects = canvas.getObjects();
        objects.forEach(obj => {
          if (obj.data && obj.data.isGridLine) {
            obj.visible = config.visible;
          }
        });
        canvas.renderAll();
      }
    };
    
    toggleGrid();
  }, [canvas, config.visible]);
  
  if (!config.visible) return null;
  
  return (
    <div className="enhanced-grid-system">
      <svg
        className={cn(
          "absolute top-0 left-0 pointer-events-none z-0",
          darkMode ? "text-gray-700" : "text-gray-200"
        )}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        {renderGrid()}
      </svg>
    </div>
  );
};

export default EnhancedGridSystem;
