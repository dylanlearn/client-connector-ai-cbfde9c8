
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Ruler } from 'lucide-react';
import { 
  GridConfig, 
  DEFAULT_GRID_CONFIG, 
  calculateColumnPositions,
  calculateGridPositions
} from '@/components/wireframe/utils/grid-utils';

export type GridType = 'lines' | 'dots' | 'columns' | 'custom';

interface EnhancedGridSystemProps {
  /**
   * Configuration for the grid system
   */
  gridConfig?: GridConfig;
  /**
   * Width of the canvas
   */
  width?: number;
  /**
   * Height of the canvas
   */
  height?: number;
  /**
   * Whether the grid is visible
   */
  visible?: boolean;
  /**
   * Whether to snap to grid
   */
  snapToGrid?: boolean;
  /**
   * Whether to show responsive breakpoints
   */
  showResponsiveBreakpoints?: boolean;
  /**
   * Callback when grid config changes
   */
  onConfigChange?: (config: Partial<GridConfig>) => void;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Current width for responsive testing
   */
  responsiveWidth?: number;
}

export const EnhancedGridSystem: React.FC<EnhancedGridSystemProps> = ({
  gridConfig = DEFAULT_GRID_CONFIG,
  width = 1200,
  height = 800,
  visible = true,
  snapToGrid = true,
  showResponsiveBreakpoints = false,
  onConfigChange,
  className,
  responsiveWidth
}) => {
  // Get the actual configuration to use
  const config: GridConfig = {
    ...DEFAULT_GRID_CONFIG,
    ...gridConfig,
    visible,
    snapToGrid,
  };
  
  // Calculate grid positions
  const gridPositions = useMemo(() => {
    if (!config.visible) return { horizontal: [], vertical: [] };
    
    if (config.type === 'columns') {
      return {
        vertical: calculateColumnPositions(width, config.size, 0, 0),
        horizontal: []
      };
    } else {
      return calculateGridPositions(
        width,
        height,
        config.size || 8
      );
    }
  }, [config, width, height]);

  if (!visible) return null;
  
  return (
    <div className={cn("enhanced-grid-system absolute inset-0 pointer-events-none", className)}>
      {/* Grid lines for columns or regular grid */}
      {config.visible && config.type === 'columns' && (
        <div className="column-grid absolute inset-0">
          {gridPositions.vertical.map((position, index) => (
            <div
              key={`col-${index}`}
              className="absolute top-0 bottom-0 border-dashed border-l border-gray-300 dark:border-gray-700"
              style={{ left: `${position}px` }}
            />
          ))}
        </div>
      )}
      
      {config.visible && config.type !== 'columns' && (
        <div className="regular-grid absolute inset-0">
          {gridPositions.horizontal.map((position, index) => (
            <div
              key={`h-${index}`}
              className={cn(
                "absolute left-0 right-0 border-b",
                config.type === 'lines' ? "border-gray-200 dark:border-gray-800" : "border-gray-100 dark:border-gray-900",
                config.type === 'dots' && "border-dotted"
              )}
              style={{ top: `${position}px` }}
            />
          ))}
          {gridPositions.vertical.map((position, index) => (
            <div
              key={`v-${index}`}
              className={cn(
                "absolute top-0 bottom-0 border-r",
                config.type === 'lines' ? "border-gray-200 dark:border-gray-800" : "border-gray-100 dark:border-gray-900",
                config.type === 'dots' && "border-dotted"
              )}
              style={{ left: `${position}px` }}
            />
          ))}
        </div>
      )}
      
      {/* Breakpoint indicators */}
      {showResponsiveBreakpoints && config.breakpoints && (
        <div className="breakpoint-indicators absolute bottom-4 right-4 flex items-center gap-2 pointer-events-auto">
          {config.breakpoints.map((breakpoint, index) => {
            const isActive = responsiveWidth && responsiveWidth >= breakpoint.width;
            
            return (
              <Button
                key={`breakpoint-${index}`}
                size="sm"
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "text-xs h-7 px-2",
                  breakpoint.color ? `bg-${breakpoint.color}` : ""
                )}
                onClick={() => onConfigChange?.({ currentBreakpoint: breakpoint.name })}
                title={`${breakpoint.name} (${breakpoint.width}px)`}
              >
                {breakpoint.name}
              </Button>
            );
          })}
        </div>
      )}
      
      {/* Current width indicator */}
      {showResponsiveBreakpoints && responsiveWidth && (
        <div className="current-width absolute bottom-4 left-4 text-sm bg-background border px-2 py-1 rounded pointer-events-auto">
          {responsiveWidth}px
        </div>
      )}
      
      {/* Toggle button */}
      <div className="grid-controls absolute top-4 right-4 pointer-events-auto flex gap-2">
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
          title="Toggle grid"
          onClick={() => onConfigChange?.({ visible: !config.visible })}
        >
          <Ruler className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EnhancedGridSystem;
