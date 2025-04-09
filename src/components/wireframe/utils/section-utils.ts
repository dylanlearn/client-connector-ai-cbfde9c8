import { WireframeSection } from '@/types/wireframe';

export interface SectionBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  id?: string; // Add id to relate bounds to a section
}

export interface SectionBoundsWithId {
  id: string;
  bounds: SectionBounds;
}

export interface AlignmentGuide {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'center' | 'edge' | 'distribution';
  sections: string[];
}

/**
 * Calculate the bounds of a section from its position and dimensions
 */
export const calculateSectionBounds = (section: WireframeSection): SectionBounds => {
  const position = section.position || { x: 0, y: 0 };
  const dimensions = section.dimensions || { width: 200, height: 100 };
  
  const left = position.x;
  const top = position.y;
  const width = dimensions.width;
  const height = dimensions.height;
  
  return {
    top,
    right: left + width,
    bottom: top + height,
    left,
    width,
    height,
    centerX: left + width / 2,
    centerY: top + height / 2,
  };
};

/**
 * Calculate bounds for an array of sections
 */
export const calculateSectionsBounds = (sections: WireframeSection[]): SectionBoundsWithId[] => {
  return sections.map(section => ({
    id: section.id,
    bounds: calculateSectionBounds(section)
  }));
};

/**
 * Find alignment guides between the active section and other sections
 */
export const findAlignmentGuides = (
  activeSectionId: string,
  activeBounds: SectionBounds,
  allBounds: SectionBoundsWithId[],
  tolerance: number = 5
): Array<{position: number, orientation: 'horizontal' | 'vertical'}> => {
  if (!activeSectionId || allBounds.length <= 1) return [];
  
  const guides: Array<{position: number, orientation: 'horizontal' | 'vertical'}> = [];
  
  // Filter out the active section
  const otherBounds = allBounds.filter(item => item.id !== activeSectionId);
  
  otherBounds.forEach(item => {
    const bounds = item.bounds;
    
    // Center alignments
    if (Math.abs(activeBounds.centerX - bounds.centerX) <= tolerance) {
      guides.push({
        position: bounds.centerX,
        orientation: 'vertical'
      });
    }
    
    if (Math.abs(activeBounds.centerY - bounds.centerY) <= tolerance) {
      guides.push({
        position: bounds.centerY,
        orientation: 'horizontal'
      });
    }
    
    // Edge alignments
    if (Math.abs(activeBounds.left - bounds.left) <= tolerance) {
      guides.push({
        position: bounds.left,
        orientation: 'vertical'
      });
    }
    
    if (Math.abs(activeBounds.right - bounds.right) <= tolerance) {
      guides.push({
        position: bounds.right,
        orientation: 'vertical'
      });
    }
    
    if (Math.abs(activeBounds.top - bounds.top) <= tolerance) {
      guides.push({
        position: bounds.top,
        orientation: 'horizontal'
      });
    }
    
    if (Math.abs(activeBounds.bottom - bounds.bottom) <= tolerance) {
      guides.push({
        position: bounds.bottom,
        orientation: 'horizontal'
      });
    }
  });
  
  // Add distribution guides (equal spacing between 3+ elements)
  if (allBounds.length >= 3) {
    // Horizontal distribution
    const sortedHorizontal = [...allBounds].sort((a, b) => {
      const sectionA = allBounds.find(item => item.id === a.id)?.bounds;
      const sectionB = allBounds.find(item => item.id === b.id)?.bounds;
      
      if (!sectionA || !sectionB) return 0;
      
      return sectionA.left - sectionB.left;
    });
    
    // Vertical distribution
    const sortedVertical = [...allBounds].sort((a, b) => {
      const sectionA = allBounds.find(item => item.id === a.id)?.bounds;
      const sectionB = allBounds.find(item => item.id === b.id)?.bounds;
      
      if (!sectionA || !sectionB) return 0;
      
      return sectionA.top - sectionB.top;
    });
    
    // Calculate distribution guides for horizontal
    for (let i = 1; i < sortedHorizontal.length - 1; i++) {
      const prev = sortedHorizontal[i-1].bounds;
      const curr = sortedHorizontal[i].bounds;
      const next = sortedHorizontal[i+1].bounds;
      
      const gap1 = curr.left - prev.right;
      const gap2 = next.left - curr.right;
      
      if (Math.abs(gap1 - gap2) <= tolerance) {
        guides.push({
          position: curr.centerX,
          orientation: 'vertical'
        });
      }
    }
    
    // Calculate distribution guides for vertical
    for (let i = 1; i < sortedVertical.length - 1; i++) {
      const prev = sortedVertical[i-1].bounds;
      const curr = sortedVertical[i].bounds;
      const next = sortedVertical[i+1].bounds;
      
      const gap1 = curr.top - prev.bottom;
      const gap2 = next.top - curr.bottom;
      
      if (Math.abs(gap1 - gap2) <= tolerance) {
        guides.push({
          position: curr.centerY,
          orientation: 'horizontal'
        });
      }
    }
  }
  
  return guides;
};

/**
 * Distribute sections evenly along an axis
 */
export const distributeEvenly = (
  sections: WireframeSection[],
  axis: 'horizontal' | 'vertical'
): WireframeSection[] => {
  if (sections.length < 3) return sections;
  
  const sortedSections = [...sections].sort((a, b) => {
    if (axis === 'horizontal') {
      return (a.position?.x || 0) - (b.position?.x || 0);
    } else {
      return (a.position?.y || 0) - (b.position?.y || 0);
    }
  });
  
  const first = calculateSectionBounds(sortedSections[0]);
  const last = calculateSectionBounds(sortedSections[sortedSections.length - 1]);
  
  let totalSpace: number;
  let totalSectionSize = 0;
  
  if (axis === 'horizontal') {
    totalSpace = last.right - first.left;
    sortedSections.forEach(section => {
      totalSectionSize += (section.dimensions?.width || 0);
    });
  } else {
    totalSpace = last.bottom - first.top;
    sortedSections.forEach(section => {
      totalSectionSize += (section.dimensions?.height || 0);
    });
  }
  
  const availableSpace = totalSpace - totalSectionSize;
  const gapSize = availableSpace / (sortedSections.length - 1);
  
  const result = [...sortedSections];
  
  let currentPosition = first.left;
  if (axis === 'vertical') {
    currentPosition = first.top;
  }
  
  for (let i = 0; i < result.length; i++) {
    const section = result[i];
    
    if (!section.position) {
      section.position = { x: 0, y: 0 };
    }
    
    if (axis === 'horizontal') {
      section.position.x = currentPosition;
      currentPosition += (section.dimensions?.width || 0) + gapSize;
    } else {
      section.position.y = currentPosition;
      currentPosition += (section.dimensions?.height || 0) + gapSize;
    }
  }
  
  return result;
};

/**
 * Align sections by a specified edge or center
 */
export const alignSections = (
  sections: WireframeSection[],
  alignmentType: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
): WireframeSection[] => {
  if (sections.length < 2) return sections;
  
  // Use the first section as reference
  const referenceBounds = calculateSectionBounds(sections[0]);
  
  return sections.map(section => {
    const newSection = { ...section };
    
    if (!newSection.position) {
      newSection.position = { x: 0, y: 0 };
    }
    
    const bounds = calculateSectionBounds(newSection);
    
    switch (alignmentType) {
      case 'left':
        newSection.position.x = referenceBounds.left;
        break;
      case 'center':
        newSection.position.x = referenceBounds.centerX - (bounds.width / 2);
        break;
      case 'right':
        newSection.position.x = referenceBounds.right - bounds.width;
        break;
      case 'top':
        newSection.position.y = referenceBounds.top;
        break;
      case 'middle':
        newSection.position.y = referenceBounds.centerY - (bounds.height / 2);
        break;
      case 'bottom':
        newSection.position.y = referenceBounds.bottom - bounds.height;
        break;
    }
    
    return newSection;
  });
};
