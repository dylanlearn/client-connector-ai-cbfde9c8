
import { v4 as uuidv4 } from 'uuid';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Get the default height for a section based on its type
 */
export function getSectionDefaultHeight(sectionType: string): number {
  switch (sectionType) {
    case 'hero':
      return 400;
    case 'features':
      return 300;
    case 'testimonials':
      return 250;
    case 'cta':
      return 150;
    case 'pricing':
      return 400;
    case 'contact':
      return 300;
    case 'footer':
      return 200;
    case 'navigation':
      return 80;
    default:
      return 200;
  }
}

/**
 * Get the default width for a section based on device type
 */
export function getSectionDefaultWidth(deviceType: 'desktop' | 'tablet' | 'mobile'): number {
  switch (deviceType) {
    case 'desktop':
      return 1140;
    case 'tablet':
      return 720;
    case 'mobile':
      return 320;
    default:
      return 1140;
  }
}

/**
 * Create a new section with default values
 */
export function createDefaultSection(
  sectionType: string,
  options: Partial<WireframeSection> = {}
): WireframeSection {
  return {
    id: uuidv4(),
    name: getDefaultSectionName(sectionType),
    sectionType,
    description: `Default ${sectionType} section`,
    dimensions: {
      width: options.dimensions?.width || 1140,
      height: options.dimensions?.height || getSectionDefaultHeight(sectionType)
    },
    position: options.position || { x: 0, y: 0 },
    components: options.components || [],
    ...options
  };
}

/**
 * Get the default name for a section based on its type
 */
export function getDefaultSectionName(sectionType: string): string {
  // Capitalize first letter and convert camelCase to spaces
  return sectionType
    .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
}

/**
 * Calculate section positions based on their order
 */
export function calculateSectionPositions(
  sections: WireframeSection[],
  startY: number = 0
): Record<string, { top: number }> {
  const positions: Record<string, { top: number }> = {};
  let currentY = startY;
  
  sections.forEach(section => {
    if (!section) return;
    
    positions[section.id] = { top: currentY };
    currentY += (section.dimensions?.height || getSectionDefaultHeight(section.sectionType)) + 20;
  });
  
  return positions;
}

/**
 * Get device-specific styles for a section
 */
export function getDeviceSpecificStyles(
  section: WireframeSection,
  deviceType: 'desktop' | 'tablet' | 'mobile'
): any {
  if (!section.responsiveConfig) return section.styleProperties || {};
  
  const baseStyles = section.styleProperties || {};
  
  if (deviceType === 'desktop') {
    return baseStyles;
  }
  
  // Apply device-specific overrides
  return {
    ...baseStyles,
    ...(deviceType === 'tablet' ? section.responsiveConfig.tablet || {} : {}),
    ...(deviceType === 'mobile' ? section.responsiveConfig.mobile || {})
  };
}
