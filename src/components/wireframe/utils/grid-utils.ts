
import { GridBreakpoint } from '../canvas/EnhancedGridSystem';
import { ResponsiveOptions } from './responsive-utils';

// Export the GridBreakpoint interface with proper syntax for isolatedModules
export type { GridBreakpoint };

// Define GridGuideline interface
export interface GridGuideline {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'center' | 'edge' | 'distribution';
}

export interface GridConfig {
  visible: boolean;
  size: number;
  columns: number;
  gutter: number;
  type: 'lines' | 'dots' | 'columns' | 'bootstrap' | 'tailwind' | 'custom';
  color: string;
  opacity: number;
  snapToGrid: boolean;
  showBreakpoints: boolean;
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
  visible: true,
  size: 8,
  columns: 12,
  gutter: 16,
  type: 'lines',
  color: '#e0e0e0',
  opacity: 0.3,
  snapToGrid: true,
  showBreakpoints: true
};

// Tailwind CSS breakpoints
export const TAILWIND_BREAKPOINTS: GridBreakpoint[] = [
  { name: 'sm', width: 640, color: '#0891b2' },
  { name: 'md', width: 768, color: '#0284c7' },
  { name: 'lg', width: 1024, color: '#2563eb' },
  { name: 'xl', width: 1280, color: '#4f46e5' },
  { name: '2xl', width: 1536, color: '#7c3aed' }
];

// Bootstrap breakpoints
export const BOOTSTRAP_BREAKPOINTS: GridBreakpoint[] = [
  { name: 'sm', width: 576, color: '#198754' },
  { name: 'md', width: 768, color: '#0d6efd' },
  { name: 'lg', width: 992, color: '#6f42c1' },
  { name: 'xl', width: 1200, color: '#dc3545' },
  { name: 'xxl', width: 1400, color: '#fd7e14' }
];

// Calculate grid positions for a specific dimension
export function calculateGridPositions(dimension: number, gridSize: number): number[] {
  const positions: number[] = [];
  for (let pos = 0; pos <= dimension; pos += gridSize) {
    positions.push(pos);
  }
  return positions;
}

// Calculate column positions for grid layout
export function calculateColumnPositions(width: number, columns: number, gutter: number): number[] {
  const positions: number[] = [];
  const columnWidth = (width - gutter * (columns - 1)) / columns;
  
  for (let i = 0; i <= columns; i++) {
    if (i === 0) {
      positions.push(0);
    } else {
      const position = i * (columnWidth + gutter) - gutter;
      positions.push(position);
    }
  }
  
  return positions;
}

// Get responsive grid configuration based on device
export function getResponsiveGridConfig(
  baseConfig: GridConfig, 
  responsiveOptions: ResponsiveOptions
): GridConfig {
  const { device, width } = responsiveOptions;
  
  // Default is the baseConfig
  let gridConfig = { ...baseConfig };
  
  if (device === 'mobile' || width < 768) {
    // Mobile adjustments
    gridConfig = {
      ...gridConfig,
      columns: 4,
      size: Math.max(4, baseConfig.size / 2), // Smaller grid size
      gutter: Math.max(8, baseConfig.gutter / 2) // Smaller gutters
    };
  } else if (device === 'tablet' || width < 1024) {
    // Tablet adjustments
    gridConfig = {
      ...gridConfig,
      columns: 8,
      size: Math.max(6, baseConfig.size / 1.5), // Slightly smaller grid size
      gutter: Math.max(12, baseConfig.gutter / 1.5) // Slightly smaller gutters
    };
  }
  
  return gridConfig;
}

// Generate snap guidelines for alignment
export function generateSnapGuidelines(objects: any[], activeObject: any, tolerance: number = 10): GridGuideline[] {
  const guidelines: GridGuideline[] = [];
  
  if (!activeObject || !objects.length) return guidelines;
  
  const activeBounds = {
    left: activeObject.left,
    top: activeObject.top,
    right: activeObject.left + activeObject.width,
    bottom: activeObject.top + activeObject.height,
    centerX: activeObject.left + activeObject.width / 2,
    centerY: activeObject.top + activeObject.height / 2
  };
  
  objects.forEach(obj => {
    if (obj === activeObject) return;
    
    const objBounds = {
      left: obj.left,
      top: obj.top,
      right: obj.left + obj.width,
      bottom: obj.top + obj.height,
      centerX: obj.left + obj.width / 2,
      centerY: obj.top + obj.height / 2
    };
    
    // Check for horizontal alignments
    if (Math.abs(activeBounds.top - objBounds.top) < tolerance) {
      guidelines.push({
        position: objBounds.top,
        orientation: 'horizontal',
        type: 'edge'
      });
    }
    
    if (Math.abs(activeBounds.bottom - objBounds.bottom) < tolerance) {
      guidelines.push({
        position: objBounds.bottom,
        orientation: 'horizontal',
        type: 'edge'
      });
    }
    
    if (Math.abs(activeBounds.centerY - objBounds.centerY) < tolerance) {
      guidelines.push({
        position: objBounds.centerY,
        orientation: 'horizontal',
        type: 'center'
      });
    }
    
    // Check for vertical alignments
    if (Math.abs(activeBounds.left - objBounds.left) < tolerance) {
      guidelines.push({
        position: objBounds.left,
        orientation: 'vertical',
        type: 'edge'
      });
    }
    
    if (Math.abs(activeBounds.right - objBounds.right) < tolerance) {
      guidelines.push({
        position: objBounds.right,
        orientation: 'vertical',
        type: 'edge'
      });
    }
    
    if (Math.abs(activeBounds.centerX - objBounds.centerX) < tolerance) {
      guidelines.push({
        position: objBounds.centerX,
        orientation: 'vertical',
        type: 'center'
      });
    }
  });
  
  return guidelines;
}

// Generate a grid system CSS for export
export function generateGridCSS(config: GridConfig): string {
  if (config.type === 'tailwind') {
    return `
.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: ${config.gutter/2}px;
  padding-left: ${config.gutter/2}px;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(${config.columns}, minmax(0, 1fr));
  gap: ${config.gutter}px;
}
`;
  } else if (config.type === 'bootstrap') {
    return `
.container {
  width: 100%;
  padding-right: ${config.gutter/2}px;
  padding-left: ${config.gutter/2}px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -${config.gutter/2}px;
  margin-left: -${config.gutter/2}px;
}

.col, [class*="col-"] {
  position: relative;
  width: 100%;
  padding-right: ${config.gutter/2}px;
  padding-left: ${config.gutter/2}px;
}
`;
  } else {
    // Custom grid
    return `
.grid-container {
  display: grid;
  grid-template-columns: repeat(${config.columns}, 1fr);
  grid-gap: ${config.gutter}px;
  max-width: 100%;
  margin: 0 auto;
}

.grid-item {
  min-height: 50px;
}
`;
  }
}

// Get grid breakpoint based on width
export function getBreakpointFromWidth(width: number, breakpoints: GridBreakpoint[] = TAILWIND_BREAKPOINTS): GridBreakpoint | null {
  // Sort breakpoints by width (ascending)
  const sortedBreakpoints = [...breakpoints].sort((a, b) => a.width - b.width);
  
  // Find the largest breakpoint that is smaller than or equal to the given width
  for (let i = sortedBreakpoints.length - 1; i >= 0; i--) {
    if (width >= sortedBreakpoints[i].width) {
      return sortedBreakpoints[i];
    }
  }
  
  return null; // No matching breakpoint
}
