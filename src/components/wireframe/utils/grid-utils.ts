
import { EnterpriseGridConfig, GridBreakpoint } from '../types/canvas-types';

export interface GridConfig {
  visible: boolean;
  type: 'lines' | 'dots' | 'columns';
  size: number;
  snapToGrid: boolean;
  snapThreshold: number;
  color: string;
  showGuides: boolean;
  showRulers: boolean;
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  responsive: boolean;
  width?: number;
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
  visible: true,
  type: 'lines',
  size: 10,
  snapToGrid: true,
  snapThreshold: 5,
  color: '#e0e0e0',
  showGuides: true,
  showRulers: false,
  columns: 12,
  gutterWidth: 20,
  marginWidth: 40,
  responsive: true,
};

export const TAILWIND_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function createCanvasGrid(canvas: any, config: GridConfig) {
  // Implementation for creating a grid on canvas
  console.log('Creating grid with config:', config);
  return {
    gridLines: [],
    config
  };
}

export function removeGridFromCanvas(canvas: any) {
  // Implementation for removing grid from canvas
  console.log('Removing grid from canvas');
}

export function updateCanvasGrid(canvas: any, config: GridConfig) {
  // Implementation for updating grid on canvas
  console.log('Updating grid on canvas with config:', config);
}

export function calculateColumnPositions(canvasWidth: number, columns: number, gutterWidth: number, marginWidth: number) {
  // Calculate positions of columns in a grid
  const columnPositions = [];
  const availableWidth = canvasWidth - (marginWidth * 2);
  const columnWidth = (availableWidth - (gutterWidth * (columns - 1))) / columns;
  
  for (let i = 0; i < columns; i++) {
    const x = marginWidth + (i * (columnWidth + gutterWidth));
    columnPositions.push({
      x,
      width: columnWidth,
    });
  }
  
  return columnPositions;
}

export function calculateGridPositions(canvasWidth: number, canvasHeight: number, gridSize: number) {
  // Calculate positions for grid lines or dots
  const horizontalLines = Math.floor(canvasHeight / gridSize);
  const verticalLines = Math.floor(canvasWidth / gridSize);
  
  const positions = {
    horizontal: Array.from({ length: horizontalLines }, (_, i) => i * gridSize),
    vertical: Array.from({ length: verticalLines }, (_, i) => i * gridSize),
  };
  
  return positions;
}

export function getResponsiveGridConfig(width: number, config: GridConfig): GridConfig {
  // Get appropriate grid config based on viewport width
  if (width < TAILWIND_BREAKPOINTS.sm) {
    return { ...config, columns: 4, gutterWidth: 10, marginWidth: 16 };
  } else if (width < TAILWIND_BREAKPOINTS.md) {
    return { ...config, columns: 6, gutterWidth: 16, marginWidth: 24 };
  } else if (width < TAILWIND_BREAKPOINTS.lg) {
    return { ...config, columns: 8, gutterWidth: 20, marginWidth: 32 };
  } else {
    return config; // Default full configuration
  }
}

export function getBreakpointFromWidth(width: number): string {
  if (width < TAILWIND_BREAKPOINTS.sm) return 'xs';
  if (width < TAILWIND_BREAKPOINTS.md) return 'sm';
  if (width < TAILWIND_BREAKPOINTS.lg) return 'md';
  if (width < TAILWIND_BREAKPOINTS.xl) return 'lg';
  if (width < TAILWIND_BREAKPOINTS['2xl']) return 'xl';
  return '2xl';
}

export interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export function getObjectBounds(object: any): BoundingBox {
  const { left = 0, top = 0, width = 0, height = 0 } = object;
  
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
  };
}

export interface Guideline {
  position: number;
  type: 'horizontal' | 'vertical';
  origin?: string;
}

export function generateSnapGuidelines(objects: any[], currentObject: any): Guideline[] {
  const guidelines: Guideline[] = [];
  const currentBounds = getObjectBounds(currentObject);
  
  objects.forEach((obj) => {
    if (obj === currentObject) return;
    
    const bounds = getObjectBounds(obj);
    
    // Generate horizontal guidelines
    [
      { value: bounds.top, description: 'top' },
      { value: bounds.top + bounds.height / 2, description: 'middle' },
      { value: bounds.bottom, description: 'bottom' },
    ].forEach(({ value, description }) => {
      guidelines.push({
        position: value,
        type: 'horizontal',
        origin: `${obj.id || 'unknown'}-${description}`,
      });
    });
    
    // Generate vertical guidelines
    [
      { value: bounds.left, description: 'left' },
      { value: bounds.left + bounds.width / 2, description: 'center' },
      { value: bounds.right, description: 'right' },
    ].forEach(({ value, description }) => {
      guidelines.push({
        position: value,
        type: 'vertical',
        origin: `${obj.id || 'unknown'}-${description}`,
      });
    });
  });
  
  return guidelines;
}

export function snapObjectToGuidelines(
  object: any,
  guidelines: Guideline[],
  threshold: number = 5
): { snapped: boolean; adjustments: { left?: number; top?: number } } {
  const bounds = getObjectBounds(object);
  const result = { snapped: false, adjustments: {} as { left?: number; top?: number } };
  
  // Check horizontal guidelines
  const horizontalGuidelines = guidelines.filter(guide => guide.type === 'horizontal');
  for (const guide of horizontalGuidelines) {
    // Check if object's top, middle, or bottom is close to the guide
    const distances = [
      { position: bounds.top, edge: 'top' },
      { position: bounds.top + bounds.height / 2, edge: 'middle' },
      { position: bounds.bottom, edge: 'bottom' },
    ];
    
    for (const { position, edge } of distances) {
      const distance = Math.abs(position - guide.position);
      if (distance <= threshold) {
        const adjustment = guide.position - position;
        result.snapped = true;
        result.adjustments.top = (result.adjustments.top || 0) + adjustment;
        break; // Once snapped to a guide, don't snap to others
      }
    }
  }
  
  // Check vertical guidelines
  const verticalGuidelines = guidelines.filter(guide => guide.type === 'vertical');
  for (const guide of verticalGuidelines) {
    // Check if object's left, center, or right is close to the guide
    const distances = [
      { position: bounds.left, edge: 'left' },
      { position: bounds.left + bounds.width / 2, edge: 'center' },
      { position: bounds.right, edge: 'right' },
    ];
    
    for (const { position, edge } of distances) {
      const distance = Math.abs(position - guide.position);
      if (distance <= threshold) {
        const adjustment = guide.position - position;
        result.snapped = true;
        result.adjustments.left = (result.adjustments.left || 0) + adjustment;
        break; // Once snapped to a guide, don't snap to others
      }
    }
  }
  
  return result;
}
