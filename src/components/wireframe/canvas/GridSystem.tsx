
import React from 'react';
import { cn } from '@/lib/utils';

export type GridType = 'lines' | 'dots' | 'columns';

interface GuidelineProps {
  position: number;
  orientation: 'horizontal' | 'vertical';
}

interface GridSystemProps {
  canvasWidth: number;
  canvasHeight: number;
  gridSize: number;
  gridType: GridType;
  guidelines?: GuidelineProps[];
  darkMode?: boolean;
  visible?: boolean;
}

const GridSystem: React.FC<GridSystemProps> = ({
  canvasWidth,
  canvasHeight,
  gridSize,
  gridType,
  guidelines = [],
  darkMode = false,
  visible = true
}) => {
  // If grid is not visible, don't render anything
  if (!visible) return null;
  
  const renderGridLines = () => {
    const lines = [];
    
    if (gridType === 'lines' || gridType === 'columns') {
      // Render vertical grid lines
      for (let x = gridSize; x < canvasWidth; x += gridSize) {
        const isMainLine = x % (gridSize * 5) === 0;
        
        lines.push(
          <line
            key={`v-${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={canvasHeight}
            stroke={darkMode ? '#374151' : '#e5e7eb'}
            strokeWidth={isMainLine ? 1 : 0.5}
            strokeDasharray={gridType === 'columns' && !isMainLine ? '2,2' : undefined}
          />
        );
      }
      
      // Render horizontal grid lines
      for (let y = gridSize; y < canvasHeight; y += gridSize) {
        const isMainLine = y % (gridSize * 5) === 0;
        
        lines.push(
          <line
            key={`h-${y}`}
            x1={0}
            y1={y}
            x2={canvasWidth}
            y2={y}
            stroke={darkMode ? '#374151' : '#e5e7eb'}
            strokeWidth={isMainLine ? 1 : 0.5}
            strokeDasharray={gridType === 'columns' && !isMainLine ? '2,2' : undefined}
          />
        );
      }
    } else if (gridType === 'dots') {
      // Render grid as dots
      for (let x = gridSize; x < canvasWidth; x += gridSize) {
        for (let y = gridSize; y < canvasHeight; y += gridSize) {
          const isMainDot = (x % (gridSize * 5) === 0) && (y % (gridSize * 5) === 0);
          
          lines.push(
            <circle
              key={`dot-${x}-${y}`}
              cx={x}
              cy={y}
              r={isMainDot ? 1.5 : 1}
              fill={darkMode ? '#374151' : '#d1d5db'}
            />
          );
        }
      }
    }
    
    return lines;
  };
  
  const renderGuidelines = () => {
    return guidelines.map((guideline, index) => {
      const isHorizontal = guideline.orientation === 'horizontal';
      
      return isHorizontal ? (
        <line
          key={`guide-h-${index}`}
          x1={0}
          y1={guideline.position}
          x2={canvasWidth}
          y2={guideline.position}
          stroke="#3b82f6"
          strokeWidth={1}
          strokeDasharray="4,2"
        />
      ) : (
        <line
          key={`guide-v-${index}`}
          x1={guideline.position}
          y1={0}
          x2={guideline.position}
          y2={canvasHeight}
          stroke="#3b82f6"
          strokeWidth={1}
          strokeDasharray="4,2"
        />
      );
    });
  };
  
  return (
    <svg
      className={cn(
        "absolute top-0 left-0 w-full h-full pointer-events-none z-0 transition-opacity",
        darkMode ? "text-gray-700" : "text-gray-300",
        visible ? "opacity-100" : "opacity-0"
      )}
      width={canvasWidth}
      height={canvasHeight}
    >
      {renderGridLines()}
      {renderGuidelines()}
    </svg>
  );
};

export default GridSystem;
