
import { DeviceType } from './responsive-utils';
import { ResponsiveLayoutSettings, AdaptiveWireframeSection } from './section-types';

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
  let baseLayout: ResponsiveLayoutSettings;
  
  if (section.layout) {
    if (typeof section.layout === 'string') {
      // Convert string layout to ResponsiveLayoutSettings format
      baseLayout = {
        layout: (section.layout === 'grid' ? 'grid' : 
                section.layout === 'stack' ? 'stack' : 
                section.layout === 'columns' ? 'columns' : 'flex') as 'flex' | 'grid' | 'stack' | 'columns',
        alignItems: (section.layout === 'centered' ? 'center' : 'start') as 'start' | 'center' | 'end' | 'stretch',
        justifyContent: (section.layout === 'centered' ? 'center' : 
                        section.layout === 'right' ? 'end' : 
                        section.layout === 'between' ? 'between' : 'start') as 'start' | 'center' | 'end' | 'between' | 'around',
        columns: 1,
        gap: 16,
        wrap: true
      };
    } else {
      // Convert the object layout to ResponsiveLayoutSettings format
      baseLayout = {
        layout: ((section.layout.type || 'flex') as 'flex' | 'grid' | 'stack' | 'columns'),
        alignItems: ((section.layout.alignment || 'center') as 'start' | 'center' | 'end' | 'stretch'),
        justifyContent: ((section.layout.justifyContent || 'between') as 'start' | 'center' | 'end' | 'between' | 'around'),
        columns: section.layout.columns || 1,
        gap: section.layout.gap || 16,
        wrap: section.layout.wrap !== false
      };
    }
  } else {
    baseLayout = defaultLayout;
  }
  
  // Apply device-specific overrides if available
  if (section.responsive && section.responsive[device]?.layout) {
    return {
      ...baseLayout,
      ...section.responsive[device].layout,
      // Ensure proper type casting for these properties
      layout: (section.responsive[device].layout?.layout || baseLayout.layout),
      alignItems: (section.responsive[device].layout?.alignItems || baseLayout.alignItems),
      justifyContent: (section.responsive[device].layout?.justifyContent || baseLayout.justifyContent)
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
 * Convert responsive settings to Tailwind classes
 */
export function getResponsiveTailwindClasses(section: AdaptiveWireframeSection): string {
  // Base classes
  let classes = '';
  
  // Layout type
  if (typeof section.layout === 'object' && section.layout?.type === 'grid') {
    classes += 'grid ';
  } else if (typeof section.layout === 'object' && section.layout?.type === 'flex') {
    classes += 'flex ';
  } else if (typeof section.layout === 'string') {
    // Handle string layout
    if (section.layout === 'grid') {
      classes += 'grid ';
    } else if (section.layout === 'flex') {
      classes += 'flex ';
    }
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
 * Create a responsive variation of a section for a specific device
 */
export function createResponsiveVariation(
  section: AdaptiveWireframeSection, 
  device: DeviceType, 
  updates: Partial<AdaptiveWireframeSection['responsive'][DeviceType]>
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
 * Make a section fully responsive
 */
export function makeFullyResponsive(section: AdaptiveWireframeSection): AdaptiveWireframeSection {
  // Create a correctly typed responsive object
  const responsive: AdaptiveWireframeSection['responsive'] = {};
  
  // Get layout for each device type
  const desktopLayout = getResponsiveLayout(section, 'desktop');
  const tabletLayout = getResponsiveLayout(section, 'tablet');
  const mobileLayout = getResponsiveLayout(section, 'mobile');
  
  // Apply layout settings to responsive object
  responsive['desktop'] = { layout: { ...desktopLayout } };
  responsive['tablet'] = { layout: { ...tabletLayout } };
  responsive['mobile'] = { layout: { ...mobileLayout } };
  
  // Return the updated section
  return {
    ...section,
    responsive
  };
}
