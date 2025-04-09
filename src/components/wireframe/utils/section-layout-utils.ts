
import { AlignmentGuide } from './types';

/**
 * Calculate bounds for all sections to help with alignment
 */
export function calculateSectionsBounds(sections: any[]): {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  center: { x: number; y: number };
} {
  if (!sections || !sections.length) {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: 0,
      height: 0,
      center: { x: 0, y: 0 }
    };
  }
  
  // Initialize bounds with first section
  let left = sections[0].position?.x || 0;
  let right = (sections[0].position?.x || 0) + (sections[0].dimensions?.width || 0);
  let top = sections[0].position?.y || 0;
  let bottom = (sections[0].position?.y || 0) + (sections[0].dimensions?.height || 0);
  
  // Find min and max boundaries
  sections.forEach((section) => {
    const sectionLeft = section.position?.x || 0;
    const sectionRight = (section.position?.x || 0) + (section.dimensions?.width || 0);
    const sectionTop = section.position?.y || 0;
    const sectionBottom = (section.position?.y || 0) + (section.dimensions?.height || 0);
    
    left = Math.min(left, sectionLeft);
    right = Math.max(right, sectionRight);
    top = Math.min(top, sectionTop);
    bottom = Math.max(bottom, sectionBottom);
  });
  
  // Calculate width, height, and center
  const width = right - left;
  const height = bottom - top;
  const center = {
    x: left + width / 2,
    y: top + height / 2
  };
  
  return {
    left,
    right,
    top,
    bottom,
    width,
    height,
    center
  };
}

/**
 * Find alignment guides for a section being moved
 */
export function findAlignmentGuides(
  activeSection: any,
  allSections: any[],
  threshold: number = 10
): AlignmentGuide[] {
  if (!activeSection || !allSections || !allSections.length) {
    return [];
  }
  
  const guides: AlignmentGuide[] = [];
  const otherSections = allSections.filter(section => section.id !== activeSection.id);
  
  const activeLeft = activeSection.position?.x || 0;
  const activeRight = activeLeft + (activeSection.dimensions?.width || 0);
  const activeTop = activeSection.position?.y || 0;
  const activeBottom = activeTop + (activeSection.dimensions?.height || 0);
  const activeWidth = activeSection.dimensions?.width || 0;
  const activeHeight = activeSection.dimensions?.height || 0;
  const activeCenterX = activeLeft + activeWidth / 2;
  const activeCenterY = activeTop + activeHeight / 2;
  
  // Global page center and edges
  const globalBounds = calculateSectionsBounds(allSections);
  
  // Add guides for centering within the page
  const pageCenterX = globalBounds.center.x;
  if (Math.abs(activeCenterX - pageCenterX) < threshold) {
    guides.push({
      position: pageCenterX,
      orientation: 'vertical',
      type: 'center',
      label: 'Page Center',
      strength: 3 // High priority
    });
  }
  
  // Check alignment with other sections
  otherSections.forEach(section => {
    const sectionLeft = section.position?.x || 0;
    const sectionRight = sectionLeft + (section.dimensions?.width || 0);
    const sectionTop = section.position?.y || 0;
    const sectionBottom = sectionTop + (section.dimensions?.height || 0);
    const sectionWidth = section.dimensions?.width || 0;
    const sectionHeight = section.dimensions?.height || 0;
    const sectionCenterX = sectionLeft + sectionWidth / 2;
    const sectionCenterY = sectionTop + sectionHeight / 2;
    
    // Left edge alignment
    if (Math.abs(activeLeft - sectionLeft) < threshold) {
      guides.push({
        position: sectionLeft,
        orientation: 'vertical',
        type: 'edge',
        label: `Left edge (${section.name})`,
        strength: 2
      });
    }
    
    // Right edge alignment
    if (Math.abs(activeRight - sectionRight) < threshold) {
      guides.push({
        position: sectionRight,
        orientation: 'vertical',
        type: 'edge',
        label: `Right edge (${section.name})`,
        strength: 2
      });
    }
    
    // Center X alignment
    if (Math.abs(activeCenterX - sectionCenterX) < threshold) {
      guides.push({
        position: sectionCenterX,
        orientation: 'vertical',
        type: 'center',
        label: `Center (${section.name})`,
        strength: 3
      });
    }
    
    // Top edge alignment
    if (Math.abs(activeTop - sectionTop) < threshold) {
      guides.push({
        position: sectionTop,
        orientation: 'horizontal',
        type: 'edge',
        label: `Top edge (${section.name})`,
        strength: 2
      });
    }
    
    // Bottom edge alignment
    if (Math.abs(activeBottom - sectionBottom) < threshold) {
      guides.push({
        position: sectionBottom,
        orientation: 'horizontal',
        type: 'edge',
        label: `Bottom edge (${section.name})`,
        strength: 2
      });
    }
    
    // Center Y alignment
    if (Math.abs(activeCenterY - sectionCenterY) < threshold) {
      guides.push({
        position: sectionCenterY,
        orientation: 'horizontal',
        type: 'center',
        label: `Middle (${section.name})`,
        strength: 3
      });
    }
    
    // Equal spacing (more advanced - vertical)
    if (Math.abs(activeTop - sectionBottom) < threshold) {
      guides.push({
        position: sectionBottom,
        orientation: 'horizontal',
        type: 'distribution',
        label: `Snap to (${section.name}) bottom`,
        strength: 1
      });
    }
  });
  
  // Sort by strength
  return guides.sort((a, b) => (b.strength || 0) - (a.strength || 0));
}
