
/**
 * Alignment guides utilities for wireframe editor
 */

export interface AlignmentGuide {
  orientation: 'horizontal' | 'vertical';
  position: number;
  type: 'edge' | 'center' | 'grid';
  strength?: number;
}

export interface AlignmentGuideOptions {
  showEdgeGuides: boolean;
  showCenterGuides: boolean;
  showGridGuides: boolean;
  guideColor: string;
  snapDistance: number;
  enabled: boolean;
}

const DEFAULT_GUIDE_OPTIONS: AlignmentGuideOptions = {
  showEdgeGuides: true,
  showCenterGuides: true,
  showGridGuides: true,
  guideColor: 'rgba(0, 120, 255, 0.75)',
  snapDistance: 8,
  enabled: true,
};

/**
 * Generate alignment guides for a collection of objects
 */
export function generateAlignmentGuides(
  objects: Array<{ position: { x: number; y: number }; size: { width: number; height: number } }>, 
  activeObjectIndex: number,
  options: Partial<AlignmentGuideOptions> = {}
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  const mergedOptions = { ...DEFAULT_GUIDE_OPTIONS, ...options };
  const { showEdgeGuides, showCenterGuides } = mergedOptions;
  
  if (!mergedOptions.enabled) return [];
  
  // Skip if no active object
  if (activeObjectIndex < 0 || activeObjectIndex >= objects.length) {
    return guides;
  }
  
  const activeObject = objects[activeObjectIndex];
  
  // Generate alignment guides for each object
  objects.forEach((object, index) => {
    // Don't generate guides for the active object itself
    if (index === activeObjectIndex) return;
    
    // Edge guides
    if (showEdgeGuides) {
      // Left edge
      guides.push({
        orientation: 'vertical',
        position: object.position.x,
        type: 'edge',
        strength: 10
      });
      
      // Right edge
      guides.push({
        orientation: 'vertical',
        position: object.position.x + object.size.width,
        type: 'edge',
        strength: 10
      });
      
      // Top edge
      guides.push({
        orientation: 'horizontal',
        position: object.position.y,
        type: 'edge',
        strength: 10
      });
      
      // Bottom edge
      guides.push({
        orientation: 'horizontal',
        position: object.position.y + object.size.height,
        type: 'edge',
        strength: 10
      });
    }
    
    // Center guides
    if (showCenterGuides) {
      // Vertical center
      guides.push({
        orientation: 'vertical',
        position: object.position.x + object.size.width / 2,
        type: 'center',
        strength: 8
      });
      
      // Horizontal center
      guides.push({
        orientation: 'horizontal',
        position: object.position.y + object.size.height / 2,
        type: 'center',
        strength: 8
      });
    }
  });
  
  return guides;
}

/**
 * Check if an object position should snap to any guides
 */
export function findNearestGuide(
  position: { x: number; y: number },
  size: { width: number; height: number },
  guides: AlignmentGuide[],
  snapDistance: number = 8
): { guide: AlignmentGuide | null, offset: number } | null {
  let nearestGuide: AlignmentGuide | null = null;
  let minDistance = snapDistance;
  let offset = 0;
  
  // Calculate object edges and center
  const left = position.x;
  const right = position.x + size.width;
  const top = position.y;
  const bottom = position.y + size.height;
  const centerX = position.x + size.width / 2;
  const centerY = position.y + size.height / 2;
  
  // Check each guide
  guides.forEach(guide => {
    if (guide.orientation === 'vertical') {
      // Check left edge
      const distanceLeft = Math.abs(guide.position - left);
      if (distanceLeft < minDistance) {
        minDistance = distanceLeft;
        nearestGuide = guide;
        offset = guide.position - left;
      }
      
      // Check right edge
      const distanceRight = Math.abs(guide.position - right);
      if (distanceRight < minDistance) {
        minDistance = distanceRight;
        nearestGuide = guide;
        offset = guide.position - right;
      }
      
      // Check center
      const distanceCenter = Math.abs(guide.position - centerX);
      if (distanceCenter < minDistance) {
        minDistance = distanceCenter;
        nearestGuide = guide;
        offset = guide.position - centerX;
      }
    } else {
      // Check top edge
      const distanceTop = Math.abs(guide.position - top);
      if (distanceTop < minDistance) {
        minDistance = distanceTop;
        nearestGuide = guide;
        offset = guide.position - top;
      }
      
      // Check bottom edge
      const distanceBottom = Math.abs(guide.position - bottom);
      if (distanceBottom < minDistance) {
        minDistance = distanceBottom;
        nearestGuide = guide;
        offset = guide.position - bottom;
      }
      
      // Check center
      const distanceCenter = Math.abs(guide.position - centerY);
      if (distanceCenter < minDistance) {
        minDistance = distanceCenter;
        nearestGuide = guide;
        offset = guide.position - centerY;
      }
    }
  });
  
  return nearestGuide ? { guide: nearestGuide, offset } : null;
}

export default {
  generateAlignmentGuides,
  findNearestGuide,
  DEFAULT_GUIDE_OPTIONS
};
