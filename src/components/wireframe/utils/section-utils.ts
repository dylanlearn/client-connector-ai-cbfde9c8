
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
 * Find alignment guides between the active section and other sections
 */
export const findAlignmentGuides = (
  activeSection: WireframeSection,
  allSections: WireframeSection[],
  tolerance: number = 5
): AlignmentGuide[] => {
  if (!activeSection || allSections.length <= 1) return [];
  
  const activeBounds = calculateSectionBounds(activeSection);
  const guides: AlignmentGuide[] = [];
  
  // Filter out the active section
  const otherSections = allSections.filter(section => section.id !== activeSection.id);
  
  otherSections.forEach(section => {
    const bounds = calculateSectionBounds(section);
    
    // Center alignments
    if (Math.abs(activeBounds.centerX - bounds.centerX) <= tolerance) {
      guides.push({
        position: bounds.centerX,
        orientation: 'vertical',
        type: 'center',
        sections: [section.id, activeSection.id]
      });
    }
    
    if (Math.abs(activeBounds.centerY - bounds.centerY) <= tolerance) {
      guides.push({
        position: bounds.centerY,
        orientation: 'horizontal',
        type: 'center',
        sections: [section.id, activeSection.id]
      });
    }
    
    // Edge alignments
    if (Math.abs(activeBounds.left - bounds.left) <= tolerance) {
      guides.push({
        position: bounds.left,
        orientation: 'vertical',
        type: 'edge',
        sections: [section.id, activeSection.id]
      });
    }
    
    if (Math.abs(activeBounds.right - bounds.right) <= tolerance) {
      guides.push({
        position: bounds.right,
        orientation: 'vertical',
        type: 'edge',
        sections: [section.id, activeSection.id]
      });
    }
    
    if (Math.abs(activeBounds.top - bounds.top) <= tolerance) {
      guides.push({
        position: bounds.top,
        orientation: 'horizontal',
        type: 'edge',
        sections: [section.id, activeSection.id]
      });
    }
    
    if (Math.abs(activeBounds.bottom - bounds.bottom) <= tolerance) {
      guides.push({
        position: bounds.bottom,
        orientation: 'horizontal',
        type: 'edge',
        sections: [section.id, activeSection.id]
      });
    }
  });
  
  // Add distribution guides (equal spacing between 3+ elements)
  if (allSections.length >= 3) {
    // Horizontal distribution
    const sortedHorizontal = [...allSections].sort((a, b) => 
      (a.position?.x || 0) - (b.position?.x || 0)
    );
    
    // Vertical distribution
    const sortedVertical = [...allSections].sort((a, b) => 
      (a.position?.y || 0) - (b.position?.y || 0)
    );
    
    // Calculate distribution guides for horizontal
    for (let i = 1; i < sortedHorizontal.length - 1; i++) {
      const prev = calculateSectionBounds(sortedHorizontal[i-1]);
      const curr = calculateSectionBounds(sortedHorizontal[i]);
      const next = calculateSectionBounds(sortedHorizontal[i+1]);
      
      const gap1 = curr.left - prev.right;
      const gap2 = next.left - curr.right;
      
      if (Math.abs(gap1 - gap2) <= tolerance) {
        guides.push({
          position: curr.centerX,
          orientation: 'vertical',
          type: 'distribution',
          sections: [sortedHorizontal[i-1].id, sortedHorizontal[i].id, sortedHorizontal[i+1].id]
        });
      }
    }
    
    // Calculate distribution guides for vertical
    for (let i = 1; i < sortedVertical.length - 1; i++) {
      const prev = calculateSectionBounds(sortedVertical[i-1]);
      const curr = calculateSectionBounds(sortedVertical[i]);
      const next = calculateSectionBounds(sortedVertical[i+1]);
      
      const gap1 = curr.top - prev.bottom;
      const gap2 = next.top - curr.bottom;
      
      if (Math.abs(gap1 - gap2) <= tolerance) {
        guides.push({
          position: curr.centerY,
          orientation: 'horizontal',
          type: 'distribution',
          sections: [sortedVertical[i-1].id, sortedVertical[i].id, sortedVertical[i+1].id]
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
