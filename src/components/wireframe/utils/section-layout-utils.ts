
import { AlignmentGuide } from './types';

/**
 * Calculate the bounding box for multiple sections
 */
export function calculateSectionsBounds(sections: any[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (!sections || sections.length === 0) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0
    };
  }
  
  // Initialize with first section
  let minX = sections[0].position?.x || 0;
  let minY = sections[0].position?.y || 0;
  let maxX = minX + (sections[0].dimensions?.width || 0);
  let maxY = minY + (sections[0].dimensions?.height || 0);
  
  // Calculate min and max for all sections
  sections.forEach(section => {
    const x = section.position?.x || 0;
    const y = section.position?.y || 0;
    const width = section.dimensions?.width || 0;
    const height = section.dimensions?.height || 0;
    
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Find alignment guides between sections
 */
export function findAlignmentGuides(
  sections: any[],
  activeSection: any,
  threshold: number = 10
): AlignmentGuide[] {
  if (!sections || sections.length < 2 || !activeSection) return [];
  
  const guides: AlignmentGuide[] = [];
  const activeId = activeSection.id;
  
  // Get active section bounds
  const activeX = activeSection.position?.x || 0;
  const activeY = activeSection.position?.y || 0;
  const activeWidth = activeSection.dimensions?.width || 0;
  const activeHeight = activeSection.dimensions?.height || 0;
  const activeRight = activeX + activeWidth;
  const activeBottom = activeY + activeHeight;
  const activeCenterX = activeX + activeWidth / 2;
  const activeCenterY = activeY + activeHeight / 2;
  
  // Check alignment with other sections
  sections.forEach(section => {
    // Skip the active section itself
    if (section.id === activeId) return;
    
    const x = section.position?.x || 0;
    const y = section.position?.y || 0;
    const width = section.dimensions?.width || 0;
    const height = section.dimensions?.height || 0;
    const right = x + width;
    const bottom = y + height;
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    // Check horizontal alignments (vertical guides)
    
    // Left edge alignment
    if (Math.abs(activeX - x) <= threshold) {
      guides.push({
        orientation: 'vertical',
        position: x,
        type: 'edge',
        strength: 10,
        label: 'Left Edge'
      });
    }
    
    // Right edge alignment
    if (Math.abs(activeRight - right) <= threshold) {
      guides.push({
        orientation: 'vertical',
        position: right,
        type: 'edge',
        strength: 10,
        label: 'Right Edge'
      });
    }
    
    // Center alignment
    if (Math.abs(activeCenterX - centerX) <= threshold) {
      guides.push({
        orientation: 'vertical',
        position: centerX,
        type: 'center',
        strength: 15,
        label: 'Center'
      });
    }
    
    // Left to right alignment
    if (Math.abs(activeX - right) <= threshold) {
      guides.push({
        orientation: 'vertical',
        position: right,
        type: 'edge',
        strength: 8,
        label: 'Left to Right'
      });
    }
    
    // Right to left alignment
    if (Math.abs(activeRight - x) <= threshold) {
      guides.push({
        orientation: 'vertical',
        position: x,
        type: 'edge',
        strength: 8,
        label: 'Right to Left'
      });
    }
    
    // Check vertical alignments (horizontal guides)
    
    // Top edge alignment
    if (Math.abs(activeY - y) <= threshold) {
      guides.push({
        orientation: 'horizontal',
        position: y,
        type: 'edge',
        strength: 10,
        label: 'Top Edge'
      });
    }
    
    // Bottom edge alignment
    if (Math.abs(activeBottom - bottom) <= threshold) {
      guides.push({
        orientation: 'horizontal',
        position: bottom,
        type: 'edge',
        strength: 10,
        label: 'Bottom Edge'
      });
    }
    
    // Middle alignment
    if (Math.abs(activeCenterY - centerY) <= threshold) {
      guides.push({
        orientation: 'horizontal',
        position: centerY,
        type: 'center',
        strength: 15,
        label: 'Middle'
      });
    }
    
    // Top to bottom alignment
    if (Math.abs(activeY - bottom) <= threshold) {
      guides.push({
        orientation: 'horizontal',
        position: bottom,
        type: 'edge',
        strength: 8,
        label: 'Top to Bottom'
      });
    }
    
    // Bottom to top alignment
    if (Math.abs(activeBottom - y) <= threshold) {
      guides.push({
        orientation: 'horizontal',
        position: y,
        type: 'edge',
        strength: 8,
        label: 'Bottom to Top'
      });
    }
  });
  
  // Add equal spacing guides if there are more than 3 sections
  if (sections.length >= 3) {
    // Calculate distribution guides for equal spacing
    const horizontalSections = [...sections].sort((a, b) => {
      return (a.position?.y || 0) - (b.position?.y || 0);
    });
    
    const verticalSections = [...sections].sort((a, b) => {
      return (a.position?.x || 0) - (b.position?.x || 0);
    });
    
    // Generate horizontal distribution guides
    for (let i = 1; i < horizontalSections.length; i++) {
      const prev = horizontalSections[i - 1];
      const current = horizontalSections[i];
      
      // Calculate spacing between sections
      const prevBottom = (prev.position?.y || 0) + (prev.dimensions?.height || 0);
      const currentTop = current.position?.y || 0;
      const spacing = currentTop - prevBottom;
      
      if (spacing > 0) {
        // Check if active section's bottom edge would create equal spacing
        const potentialSpacing = activeY - prevBottom;
        if (Math.abs(potentialSpacing - spacing) <= threshold) {
          guides.push({
            orientation: 'horizontal',
            position: prevBottom + spacing,
            type: 'distribution', // This is now valid in the updated AlignmentGuide type
            strength: 5,
            label: 'Equal Spacing'
          });
        }
      }
    }
  }
  
  return guides;
}
