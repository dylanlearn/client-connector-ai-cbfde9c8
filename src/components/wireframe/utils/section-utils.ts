
import { WireframeSection } from '@/types/wireframe';
import { DeviceType } from './responsive-utils';

// Define the ResponsiveLayoutSettings type
export interface ResponsiveLayoutSettings {
  layout: 'flex' | 'grid' | 'stack' | 'columns';
  alignItems: 'start' | 'center' | 'end' | 'stretch';
  justifyContent: 'start' | 'center' | 'end' | 'between' | 'around';
  columns?: number;
  gap?: number;
  wrap?: boolean;
  autoRows?: boolean;
  rowHeight?: number | string;
}

// Define the AdaptiveWireframeSection type
export interface AdaptiveWireframeSection extends WireframeSection {
  responsive?: {
    [key in DeviceType]?: {
      layout?: Partial<ResponsiveLayoutSettings>;
      visible?: boolean;
      content?: any;
      styles?: Record<string, any>;
    };
  };
}

/**
 * Get responsive layout settings for a section based on device type
 */
export function getResponsiveLayout(
  section: AdaptiveWireframeSection, 
  device: DeviceType
): ResponsiveLayoutSettings {
  const defaultLayout: ResponsiveLayoutSettings = {
    layout: 'flex',
    alignItems: 'center',
    justifyContent: 'between',
    wrap: true
  };
  
  // Get base layout
  const baseLayout = section.layout ? {
    layout: (section.layout.type || 'flex') as 'flex' | 'grid' | 'stack' | 'columns',
    alignItems: (section.layout.alignment || 'center') as 'start' | 'center' | 'end' | 'stretch',
    justifyContent: (section.layout.justifyContent || 'between') as 'start' | 'center' | 'end' | 'between' | 'around',
    columns: section.layout.columns || 1,
    gap: section.layout.gap || 16,
    wrap: section.layout.wrap !== false
  } : defaultLayout;
  
  // Apply device-specific overrides if available
  if (section.responsive && section.responsive[device]?.layout) {
    return {
      ...baseLayout,
      ...section.responsive[device].layout,
      // Ensure proper type casting for these properties
      layout: (section.responsive[device].layout?.layout || baseLayout.layout) as 'flex' | 'grid' | 'stack' | 'columns',
      alignItems: (section.responsive[device].layout?.alignItems || baseLayout.alignItems) as 'start' | 'center' | 'end' | 'stretch',
      justifyContent: (section.responsive[device].layout?.justifyContent || baseLayout.justifyContent) as 'start' | 'center' | 'end' | 'between' | 'around'
    };
  }
  
  // Device-specific defaults if no explicit settings
  switch (device) {
    case 'mobile':
      return {
        ...baseLayout,
        // On mobile, prefer stack layout with full width columns
        layout: 'stack',
        columns: 1
      };
    case 'tablet':
      return {
        ...baseLayout,
        // On tablet, reduce columns
        columns: Math.min(baseLayout.columns || 2, 2)
      };
    case 'desktop':
    default:
      return baseLayout;
  }
}

/**
 * Check if section is visible on the specified device
 */
export function isSectionVisibleOnDevice(section: AdaptiveWireframeSection, device: DeviceType): boolean {
  if (!section.responsive) return true;
  
  return section.responsive[device]?.visible !== false;
}

/**
 * Get device-specific content for a section
 */
export function getResponsiveContent(section: AdaptiveWireframeSection, device: DeviceType): any {
  if (!section.responsive || !section.responsive[device]?.content) {
    return section.content || {};
  }
  
  return {
    ...section.content,
    ...section.responsive[device].content
  };
}

/**
 * Create a responsive variation of a section for a specific device
 */
export function createResponsiveVariation(
  section: AdaptiveWireframeSection, 
  device: DeviceType, 
  updates: Partial<AdaptiveWireframeSection>
): AdaptiveWireframeSection {
  const newSection = { ...section };
  
  if (!newSection.responsive) {
    newSection.responsive = {};
  }
  
  newSection.responsive[device] = {
    ...newSection.responsive[device],
    ...updates
  };
  
  return newSection;
}

/**
 * Clone a section with a new ID
 */
export function cloneSection(section: AdaptiveWireframeSection): AdaptiveWireframeSection {
  return {
    ...section,
    id: `${section.id}_clone_${Date.now()}`,
    name: `${section.name} (Copy)`
  };
}

/**
 * Create an empty section
 */
export function createEmptySection(type: string, name?: string): AdaptiveWireframeSection {
  return {
    id: `section_${Date.now()}`,
    name: name || `New ${type} Section`,
    sectionType: type,
    position: {
      x: 0,
      y: 0
    },
    dimensions: {
      width: 800,
      height: 200
    },
    components: []
  };
}

/**
 * Create a grid section
 */
export function createGridSection(columns: number): AdaptiveWireframeSection {
  return {
    id: `grid_section_${Date.now()}`,
    name: `${columns}-Column Grid`,
    sectionType: 'grid',
    layout: {
      type: 'grid',
      columns: columns,
      gap: 16
    },
    position: {
      x: 0,
      y: 0
    },
    dimensions: {
      width: 800,
      height: 400
    },
    components: []
  };
}

/**
 * Make a section fully responsive
 */
export function makeFullyResponsive(section: AdaptiveWireframeSection): AdaptiveWireframeSection {
  const responsive: AdaptiveWireframeSection['responsive'] = {
    desktop: {
      layout: getResponsiveLayout(section, 'desktop')
    },
    tablet: {
      layout: getResponsiveLayout(section, 'tablet')
    },
    mobile: {
      layout: getResponsiveLayout(section, 'mobile')
    }
  };
  
  return {
    ...section,
    responsive
  };
}

/**
 * Convert responsive settings to Tailwind classes
 */
export function getResponsiveTailwindClasses(section: AdaptiveWireframeSection): string {
  // Base classes
  let classes = '';
  
  // Layout type
  if (section.layout?.type === 'grid') {
    classes += 'grid ';
  } else if (section.layout?.type === 'flex') {
    classes += 'flex ';
  }
  
  // Handle responsive variations
  if (section.responsive) {
    if (section.responsive.mobile?.layout?.layout === 'stack') {
      classes += 'flex-col sm:flex-row ';
    }
    
    if (section.responsive.tablet?.layout?.columns) {
      classes += `md:grid-cols-${section.responsive.tablet.layout.columns} `;
    }
    
    if (section.responsive.desktop?.layout?.columns) {
      classes += `lg:grid-cols-${section.responsive.desktop.layout.columns} `;
    }
  }
  
  return classes.trim();
}

/**
 * Get responsive styles for a section
 */
export function getResponsiveStyles(
  section: AdaptiveWireframeSection, 
  device: DeviceType
): Record<string, any> {
  if (!section.responsive || !section.responsive[device]?.styles) {
    return section.styleProperties || {};
  }
  
  return {
    ...section.styleProperties,
    ...section.responsive[device].styles
  };
}

/**
 * Calculate bounds of multiple sections
 */
export function calculateSectionsBounds(sections: WireframeSection[]): { left: number, top: number, right: number, bottom: number, width: number, height: number } {
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
