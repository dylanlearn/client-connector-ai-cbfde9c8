
import { WireframeSection } from '@/types/wireframe';

/**
 * Calculate bounds of multiple sections
 */
export function calculateSectionsBounds(sections: WireframeSection[]): { 
  left: number; 
  top: number; 
  right: number; 
  bottom: number; 
  width: number; 
  height: number; 
} {
  if (!sections || sections.length === 0) {
    return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
  }

  // Find min/max coordinates
  let left = Number.MAX_VALUE;
  let top = Number.MAX_VALUE;
  let right = 0;
  let bottom = 0;

  sections.forEach(section => {
    const x = section.position?.x || 0;
    const y = section.position?.y || 0;
    const width = section.dimensions?.width || 0;
    const height = section.dimensions?.height || 0;

    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x + width);
    bottom = Math.max(bottom, y + height);
  });

  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top
  };
}

/**
 * Find alignment guides between sections
 */
export function findAlignmentGuides(
  activeSection: WireframeSection, 
  allSections: WireframeSection[]
): { position: number; orientation: 'horizontal' | 'vertical' }[] {
  const guides: { position: number; orientation: 'horizontal' | 'vertical' }[] = [];
  const threshold = 5; // Snap threshold in pixels
  
  if (!activeSection || !activeSection.position || !activeSection.dimensions) return guides;
  
  const activeBounds = {
    left: activeSection.position.x,
    top: activeSection.position.y,
    right: activeSection.position.x + activeSection.dimensions.width,
    bottom: activeSection.position.y + activeSection.dimensions.height,
    centerX: activeSection.position.x + activeSection.dimensions.width / 2,
    centerY: activeSection.position.y + activeSection.dimensions.height / 2
  };
  
  // Check alignment with other sections
  allSections.forEach(section => {
    if (section.id === activeSection.id) return;
    if (!section.position || !section.dimensions) return;
    
    const otherBounds = {
      left: section.position.x,
      top: section.position.y,
      right: section.position.x + section.dimensions.width,
      bottom: section.position.y + section.dimensions.height,
      centerX: section.position.x + section.dimensions.width / 2,
      centerY: section.position.y + section.dimensions.height / 2
    };
    
    // Horizontal alignment (top, center, bottom)
    if (Math.abs(activeBounds.top - otherBounds.top) < threshold) {
      guides.push({ position: otherBounds.top, orientation: 'horizontal' });
    }
    
    if (Math.abs(activeBounds.centerY - otherBounds.centerY) < threshold) {
      guides.push({ position: otherBounds.centerY, orientation: 'horizontal' });
    }
    
    if (Math.abs(activeBounds.bottom - otherBounds.bottom) < threshold) {
      guides.push({ position: otherBounds.bottom, orientation: 'horizontal' });
    }
    
    // Vertical alignment (left, center, right)
    if (Math.abs(activeBounds.left - otherBounds.left) < threshold) {
      guides.push({ position: otherBounds.left, orientation: 'vertical' });
    }
    
    if (Math.abs(activeBounds.centerX - otherBounds.centerX) < threshold) {
      guides.push({ position: otherBounds.centerX, orientation: 'vertical' });
    }
    
    if (Math.abs(activeBounds.right - otherBounds.right) < threshold) {
      guides.push({ position: otherBounds.right, orientation: 'vertical' });
    }
  });
  
  return guides;
}
