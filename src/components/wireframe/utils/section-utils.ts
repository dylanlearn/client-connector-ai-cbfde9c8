
import { WireframeSection } from '@/types/wireframe';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique section ID
 */
export const generateSectionId = (): string => {
  return `section-${uuidv4()}`;
};

/**
 * Create a new section with default properties
 */
export const createEmptySection = (
  sectionType: string = 'container',
  name: string = 'New Section'
): WireframeSection => {
  return {
    id: generateSectionId(),
    name,
    sectionType,
    components: [],
    layout: {
      type: 'flex',
      direction: 'column',
      alignment: 'center'
    },
    layoutType: 'default',
    positionOrder: 0,
    dimensions: {
      width: 800,
      height: 400
    },
    position: {
      x: 20,
      y: 20
    },
    styleProperties: {}
  };
};

/**
 * Convert a section to its responsive variant
 * This adjusts dimensions and layout based on target device
 */
export const getResponsiveSection = (
  section: WireframeSection,
  deviceType: 'desktop' | 'tablet' | 'mobile'
): WireframeSection => {
  // Create a deep copy of the section to avoid mutating the original
  const responsiveSection = JSON.parse(JSON.stringify(section)) as WireframeSection;
  
  // Adjust dimensions based on device type
  switch (deviceType) {
    case 'mobile':
      // For mobile, we scale down width significantly and adjust height proportionally
      if (responsiveSection.dimensions) {
        const heightRatio = responsiveSection.dimensions.height / responsiveSection.dimensions.width;
        responsiveSection.dimensions.width = Math.min(350, responsiveSection.dimensions.width);
        responsiveSection.dimensions.height = Math.round(responsiveSection.dimensions.width * heightRatio);
      }
      
      // Adjust layout for mobile
      if (responsiveSection.layout) {
        // On mobile, we generally want a column layout
        responsiveSection.layout.direction = 'column';
      }
      
      // Adjust position for mobile view (centered)
      if (responsiveSection.position) {
        responsiveSection.position.x = 10;
      }
      break;
      
    case 'tablet':
      // For tablet, scale down width moderately
      if (responsiveSection.dimensions) {
        const heightRatio = responsiveSection.dimensions.height / responsiveSection.dimensions.width;
        responsiveSection.dimensions.width = Math.min(700, responsiveSection.dimensions.width);
        responsiveSection.dimensions.height = Math.round(responsiveSection.dimensions.width * heightRatio);
      }
      
      // Adjust position for tablet view
      if (responsiveSection.position) {
        responsiveSection.position.x = 15;
      }
      break;
      
    // Desktop uses original dimensions
  }
  
  return responsiveSection;
};

/**
 * Get component variations based on device type
 * This is useful for components that need different layouts per device
 */
export const getComponentVariant = (
  componentType: string,
  deviceType: 'desktop' | 'tablet' | 'mobile',
  variant: string = 'default'
): string => {
  // Map of component types to their responsive variants
  const variantMap: Record<string, Record<'desktop' | 'tablet' | 'mobile', Record<string, string>>> = {
    header: {
      desktop: { default: 'standard', minimal: 'minimal' },
      tablet: { default: 'standard', minimal: 'minimal' },
      mobile: { default: 'hamburger', minimal: 'minimal-hamburger' }
    },
    hero: {
      desktop: { default: 'split', centered: 'centered' },
      tablet: { default: 'stacked', centered: 'centered' },
      mobile: { default: 'stacked', centered: 'centered' }
    },
    features: {
      desktop: { default: 'three-column', minimal: 'two-column' },
      tablet: { default: 'two-column', minimal: 'two-column' },
      mobile: { default: 'single-column', minimal: 'single-column' }
    }
  };
  
  // Return the variant if it exists, or fall back to the device's default
  if (variantMap[componentType]?.[deviceType]?.[variant]) {
    return variantMap[componentType][deviceType][variant];
  }
  
  // Default fallback - return the original variant
  return variant;
};

/**
 * Helper to check if a section has responsive variations
 */
export const hasResponsiveVariations = (section: WireframeSection): boolean => {
  // These section types typically have responsive variations
  const responsiveTypes = ['header', 'hero', 'features', 'footer', 'gallery', 'testimonials'];
  return responsiveTypes.includes(section.sectionType);
};

/**
 * Calculate bounds for each section
 * Used for alignment guides and snapping
 */
export const calculateSectionBounds = (sections: WireframeSection[]) => {
  return sections.map(section => {
    const { position, dimensions } = section;
    
    if (!position || !dimensions) {
      return {
        id: section.id,
        bounds: { top: 0, left: 0, right: 0, bottom: 0, centerX: 0, centerY: 0 }
      };
    }
    
    const { x, y } = position;
    const { width, height } = dimensions;
    
    const left = x;
    const top = y;
    const right = x + width;
    const bottom = y + height;
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    return {
      id: section.id,
      bounds: { top, left, right, bottom, centerX, centerY }
    };
  });
};

/**
 * Find alignment guides for a section compared to other sections
 * Used for smart guides when moving or resizing sections
 */
export const findAlignmentGuides = (
  activeSectionId: string,
  activeBounds: { top: number; left: number; right: number; bottom: number; centerX: number; centerY: number },
  allBounds: Array<{ id: string; bounds: typeof activeBounds }>,
  tolerance: number = 5
) => {
  const guides: Array<{ position: number; orientation: 'horizontal' | 'vertical' }> = [];
  
  // Skip if no active bounds
  if (!activeBounds) {
    return guides;
  }
  
  // Compare with all other section bounds
  allBounds.forEach(({ id, bounds }) => {
    // Skip self
    if (id === activeSectionId || !bounds) {
      return;
    }
    
    // Check for horizontal alignments (top, center, bottom)
    if (Math.abs(activeBounds.top - bounds.top) <= tolerance) {
      guides.push({ position: bounds.top, orientation: 'horizontal' });
    }
    
    if (Math.abs(activeBounds.centerY - bounds.centerY) <= tolerance) {
      guides.push({ position: bounds.centerY, orientation: 'horizontal' });
    }
    
    if (Math.abs(activeBounds.bottom - bounds.bottom) <= tolerance) {
      guides.push({ position: bounds.bottom, orientation: 'horizontal' });
    }
    
    // Check for vertical alignments (left, center, right)
    if (Math.abs(activeBounds.left - bounds.left) <= tolerance) {
      guides.push({ position: bounds.left, orientation: 'vertical' });
    }
    
    if (Math.abs(activeBounds.centerX - bounds.centerX) <= tolerance) {
      guides.push({ position: bounds.centerX, orientation: 'vertical' });
    }
    
    if (Math.abs(activeBounds.right - bounds.right) <= tolerance) {
      guides.push({ position: bounds.right, orientation: 'vertical' });
    }
  });
  
  return guides;
};
