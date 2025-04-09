import { WireframeSection } from '@/types/wireframe';

/**
 * Gets the nearest grid position for coordinates
 */
export const getGridPosition = (x: number, y: number, gridSize: number): { x: number, y: number } => {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize
  };
};

/**
 * Calculate bounding boxes for a collection of sections
 */
export const calculateSectionBounds = (sections: WireframeSection[]): Array<{ id: string, bounds: DOMRect }> => {
  return sections.map(section => {
    const el = document.getElementById(`section-${section.id}`);
    return {
      id: section.id,
      bounds: el ? el.getBoundingClientRect() : new DOMRect(0, 0, 0, 0)
    };
  }).filter(item => item.bounds.width > 0 && item.bounds.height > 0);
};

/**
 * Find alignment guides for a section relative to others
 */
export const findAlignmentGuides = (
  activeId: string,
  activeBounds: DOMRect,
  allBounds: Array<{ id: string, bounds: DOMRect }>,
  tolerance: number = 5
): Array<{ position: number, orientation: 'horizontal' | 'vertical' }> => {
  const guides: Array<{ position: number, orientation: 'horizontal' | 'vertical' }> = [];
  
  // Skip if no active bounds
  if (!activeBounds || !activeId) return guides;
  
  // Other sections to compare against
  const otherBounds = allBounds.filter(b => b.id !== activeId);
  
  // Check for horizontal alignments (top, middle, bottom)
  otherBounds.forEach(({ bounds }) => {
    // Top edge alignment
    if (Math.abs(bounds.top - activeBounds.top) <= tolerance) {
      guides.push({
        position: bounds.top,
        orientation: 'horizontal'
      });
    }
    
    // Middle alignment
    const boundsMiddle = bounds.top + bounds.height / 2;
    const activeMiddle = activeBounds.top + activeBounds.height / 2;
    if (Math.abs(boundsMiddle - activeMiddle) <= tolerance) {
      guides.push({
        position: boundsMiddle,
        orientation: 'horizontal'
      });
    }
    
    // Bottom alignment
    const boundsBottom = bounds.top + bounds.height;
    const activeBottom = activeBounds.top + activeBounds.height;
    if (Math.abs(boundsBottom - activeBottom) <= tolerance) {
      guides.push({
        position: boundsBottom,
        orientation: 'horizontal'
      });
    }
    
    // Check for vertical alignments (left, center, right)
    // Left edge alignment
    if (Math.abs(bounds.left - activeBounds.left) <= tolerance) {
      guides.push({
        position: bounds.left,
        orientation: 'vertical'
      });
    }
    
    // Center alignment
    const boundsCenter = bounds.left + bounds.width / 2;
    const activeCenter = activeBounds.left + activeBounds.width / 2;
    if (Math.abs(boundsCenter - activeCenter) <= tolerance) {
      guides.push({
        position: boundsCenter,
        orientation: 'vertical'
      });
    }
    
    // Right alignment
    const boundsRight = bounds.left + bounds.width;
    const activeRight = activeBounds.left + activeBounds.width;
    if (Math.abs(boundsRight - activeRight) <= tolerance) {
      guides.push({
        position: boundsRight,
        orientation: 'vertical'
      });
    }
  });
  
  return guides;
};

/**
 * Apply a grid layout to sections
 */
export const applyGridLayout = (
  sections: WireframeSection[], 
  columns: number = 3, 
  gridSize: number = 8,
  gapSize: number = 16
): WireframeSection[] => {
  let rowHeight = 0;
  let currentRow = 0;
  let currentColumn = 0;
  
  return sections.map((section, index) => {
    // If we've reached the max columns, move to next row
    if (currentColumn >= columns) {
      currentColumn = 0;
      currentRow++;
    }
    
    // Calculate position based on grid coordinates
    const padding = gridSize * 2;
    const availableWidth = (columns * gridSize * 20) - (padding * 2);
    const columnWidth = (availableWidth - (gapSize * (columns - 1))) / columns;
    
    const x = padding + (currentColumn * (columnWidth + gapSize));
    const y = padding + (currentRow * (rowHeight + gapSize));
    
    // Update for next iteration
    currentColumn++;
    
    // Adjust height for the current section
    const height = section.dimensions?.height || 200;
    rowHeight = Math.max(rowHeight, height);
    
    // Return updated section
    return {
      ...section,
      position: { x, y },
      dimensions: {
        width: columnWidth,
        height
      }
    };
  });
};

/**
 * Generate a random color based on a seed string
 */
export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

/**
 * Redistribute sections to fill available space
 */
export const redistributeSections = (
  sections: WireframeSection[],
  canvasWidth: number,
  canvasHeight: number,
  padding: number = 20
): WireframeSection[] => {
  if (sections.length === 0) return [];
  
  // Calculate total height of all sections
  const totalHeight = sections.reduce((sum, section) => 
    sum + (section.dimensions?.height || 200), 0);
  
  // Add spacing between sections
  const totalSpacing = (sections.length - 1) * padding;
  
  // Available height
  const availableHeight = canvasHeight - (padding * 2);
  
  // Scale factor if total height exceeds available height
  const scale = Math.min(1, availableHeight / (totalHeight + totalSpacing));
  
  // Position sections one after another vertically
  let currentY = padding;
  
  return sections.map(section => {
    const height = (section.dimensions?.height || 200) * scale;
    const width = Math.min(canvasWidth - (padding * 2), section.dimensions?.width || canvasWidth - (padding * 2));
    
    // Center horizontally
    const x = (canvasWidth - width) / 2;
    const y = currentY;
    
    // Update Y for next section
    currentY += height + padding;
    
    return {
      ...section,
      position: { x, y },
      dimensions: { width, height }
    };
  });
};
