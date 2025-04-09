
import { GridType } from "../canvas/EnhancedGridSystem";
import { DeviceType, ResponsiveOptions, getResponsiveGridColumns, getResponsiveGutterSize } from "./responsive-utils";

export interface GridConfig {
  type: GridType;
  visible: boolean;
  size: number;
  columns: number;
  gutter: number;
  color: string;
  opacity: number;
  snapToGrid: boolean;
  snapTolerance: number;
  showBreakpoints: boolean;
}

export interface GridGuideline {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'center' | 'edge' | 'distribution';
}

export interface GridBreakpoint {
  name: string;
  width: number;
  color?: string;
}

/**
 * Default grid configuration
 */
export const DEFAULT_GRID_CONFIG: GridConfig = {
  type: 'lines',
  visible: true,
  size: 10,
  columns: 12,
  gutter: 24,
  color: '#2563eb',
  opacity: 0.2,
  snapToGrid: true,
  snapTolerance: 5,
  showBreakpoints: true
};

/**
 * Get responsive grid configuration based on device/breakpoint
 */
export function getResponsiveGridConfig(
  baseConfig: Partial<GridConfig> = {},
  options: ResponsiveOptions = {}
): GridConfig {
  // Start with default config
  const config: GridConfig = { ...DEFAULT_GRID_CONFIG, ...baseConfig };
  
  // Apply responsive settings
  config.columns = getResponsiveGridColumns(options);
  config.gutter = getResponsiveGutterSize(options);
  
  // Adjust grid size for smaller screens
  if (options.device === 'mobile' || options.width && options.width < 640) {
    config.size = 8;
  } else if (options.device === 'tablet' || options.width && options.width < 1024) {
    config.size = 10;
  }
  
  return config;
}

/**
 * Standard Tailwind breakpoints
 */
export const TAILWIND_BREAKPOINTS: GridBreakpoint[] = [
  { name: 'sm', width: 640, color: '#9333ea' },
  { name: 'md', width: 768, color: '#2563eb' },
  { name: 'lg', width: 1024, color: '#059669' },
  { name: 'xl', width: 1280, color: '#d97706' },
  { name: '2xl', width: 1536, color: '#dc2626' }
];

/**
 * Calculate column positions for a grid layout
 */
export function calculateColumnPositions(
  containerWidth: number,
  columns: number,
  gutter: number
): number[] {
  const positions: number[] = [];
  
  // Calculate column width
  const availableWidth = containerWidth;
  const totalGutterWidth = gutter * (columns - 1);
  const columnWidth = (availableWidth - totalGutterWidth) / columns;
  
  // Calculate positions
  let currentPosition = 0;
  for (let i = 0; i <= columns; i++) {
    positions.push(currentPosition);
    currentPosition += columnWidth + (i < columns - 1 ? gutter : 0);
  }
  
  return positions;
}

/**
 * Calculate grid positions (lines or dots)
 */
export function calculateGridPositions(
  dimension: number, 
  gridSize: number
): number[] {
  const positions: number[] = [];
  for (let pos = 0; pos <= dimension; pos += gridSize) {
    positions.push(pos);
  }
  return positions;
}

/**
 * Generate guidelines for snapping
 */
export function generateSnapGuidelines(
  objects: Array<{ x: number, y: number, width: number, height: number }>,
  activeObjectId?: string
): GridGuideline[] {
  const guidelines: GridGuideline[] = [];
  
  // Skip if no objects
  if (!objects || objects.length === 0) return guidelines;
  
  // Get active object
  const activeObject = activeObjectId 
    ? objects.find(obj => obj['id'] === activeObjectId) 
    : undefined;
  
  if (!activeObject) return guidelines;
  
  // Get other objects
  const otherObjects = objects.filter(obj => obj !== activeObject);
  
  // For each other object
  otherObjects.forEach(obj => {
    // Center alignment
    if (Math.abs(obj.x + obj.width / 2 - (activeObject.x + activeObject.width / 2)) <= 10) {
      guidelines.push({
        position: obj.x + obj.width / 2,
        orientation: 'vertical',
        type: 'center'
      });
    }
    
    if (Math.abs(obj.y + obj.height / 2 - (activeObject.y + activeObject.height / 2)) <= 10) {
      guidelines.push({
        position: obj.y + obj.height / 2,
        orientation: 'horizontal',
        type: 'center'
      });
    }
    
    // Edge alignment
    if (Math.abs(obj.x - activeObject.x) <= 10) {
      guidelines.push({
        position: obj.x,
        orientation: 'vertical',
        type: 'edge'
      });
    }
    
    if (Math.abs(obj.y - activeObject.y) <= 10) {
      guidelines.push({
        position: obj.y,
        orientation: 'horizontal',
        type: 'edge'
      });
    }
    
    if (Math.abs((obj.x + obj.width) - (activeObject.x + activeObject.width)) <= 10) {
      guidelines.push({
        position: obj.x + obj.width,
        orientation: 'vertical',
        type: 'edge'
      });
    }
    
    if (Math.abs((obj.y + obj.height) - (activeObject.y + activeObject.height)) <= 10) {
      guidelines.push({
        position: obj.y + obj.height,
        orientation: 'horizontal',
        type: 'edge'
      });
    }
    
    // Distribution guidelines (for equal spacing)
    // This is simplified - a real implementation would look at multiple objects
    if (Math.abs((obj.x + obj.width) - activeObject.x) <= 10) {
      guidelines.push({
        position: obj.x + obj.width,
        orientation: 'vertical',
        type: 'distribution'
      });
    }
    
    if (Math.abs((obj.y + obj.height) - activeObject.y) <= 10) {
      guidelines.push({
        position: obj.y + obj.height,
        orientation: 'horizontal',
        type: 'distribution'
      });
    }
  });
  
  return guidelines;
}
