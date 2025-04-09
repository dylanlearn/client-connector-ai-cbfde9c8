
import { WireframeCanvasConfig } from './types';

export type ResponsiveLayoutSettings = {
  device: 'desktop' | 'tablet' | 'mobile';
  columns: number;
  breakpoint: number;
};

export interface AdaptiveWireframeSection {
  id: string;
  visible: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  layout: {
    desktop: any;
    tablet?: any;
    mobile?: any;
  };
  dimensions: {
    desktop: { width: number; height: number };
    tablet?: { width: number; height: number };
    mobile?: { width: number; height: number };
  };
  [key: string]: any;
}

// Responsive layout utility functions
export function getResponsiveLayout(
  section: any,
  device: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): any {
  if (!section) return null;
  
  if (section.layout && typeof section.layout === 'object') {
    // If it's an adaptive section with device-specific layouts
    if (section.layout[device]) {
      return section.layout[device];
    }
    // Fallback to desktop layout if specific device layout not found
    return section.layout.desktop || section.layout;
  }
  
  // Return the layout as-is if it's not device-specific
  return section.layout;
}

export function isSectionVisibleOnDevice(
  section: any,
  device: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): boolean {
  if (!section) return false;
  
  // If the section has a visibility object, check it
  if (section.visible && typeof section.visible === 'object') {
    return section.visible[device] !== false; // Default to true if not specified
  }
  
  // If no visibility config, assume visible
  return true;
}

export function getResponsiveContent(
  content: any,
  device: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): any {
  if (!content) return null;
  
  if (content[device]) {
    return content[device];
  }
  
  // Fallback to desktop or the content itself
  return content.desktop || content;
}

export function getResponsiveStyles(
  styles: any,
  device: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): any {
  if (!styles) return {};
  
  // Check for device-specific styles
  if (styles[device]) {
    return {
      ...styles.base, // Apply base styles if they exist
      ...styles[device] // Override with device-specific styles
    };
  }
  
  // Return base styles or the styles object itself
  return styles.base || styles;
}

export function getResponsiveTailwindClasses(
  classes: string,
  device: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): string {
  if (!classes) return '';
  
  const classesByDevice = {
    desktop: [],
    tablet: [],
    mobile: []
  };
  
  // Parse classes and categorize them
  classes.split(' ').forEach(cls => {
    if (cls.startsWith('md:') || cls.startsWith('lg:') || cls.startsWith('xl:')) {
      classesByDevice.desktop.push(cls);
    } else if (cls.startsWith('sm:')) {
      classesByDevice.tablet.push(cls);
    } else {
      // Base classes apply to all devices
      classesByDevice.desktop.push(cls);
      classesByDevice.tablet.push(cls);
      classesByDevice.mobile.push(cls);
    }
  });
  
  return classesByDevice[device].join(' ');
}

export function createResponsiveVariation(
  section: any,
  device: 'desktop' | 'tablet' | 'mobile',
  overrides: any = {}
): AdaptiveWireframeSection {
  if (!section) return {} as AdaptiveWireframeSection;
  
  // Start with a basic adaptive section
  const adaptiveSection: Partial<AdaptiveWireframeSection> = {
    id: section.id,
    name: section.name,
    sectionType: section.sectionType,
    visible: {
      desktop: true,
      tablet: true,
      mobile: true
    },
    layout: {
      desktop: section.layout || {}
    },
    dimensions: {
      desktop: section.dimensions || { width: 1200, height: 600 }
    }
  };
  
  // Add device-specific variations
  if (device === 'tablet') {
    adaptiveSection.layout = {
      ...adaptiveSection.layout,
      tablet: {
        ...adaptiveSection.layout?.desktop,
        // Default tablet modifications
        columns: 8,
        ...overrides.layout
      }
    };
    
    adaptiveSection.dimensions = {
      ...adaptiveSection.dimensions,
      tablet: {
        width: 768,
        height: adaptiveSection.dimensions?.desktop?.height || 600,
        ...overrides.dimensions
      }
    };
  }
  
  if (device === 'mobile') {
    adaptiveSection.layout = {
      ...adaptiveSection.layout,
      mobile: {
        ...adaptiveSection.layout?.desktop,
        // Default mobile modifications
        columns: 4,
        ...overrides.layout
      }
    };
    
    adaptiveSection.dimensions = {
      ...adaptiveSection.dimensions,
      mobile: {
        width: 375,
        height: adaptiveSection.dimensions?.desktop?.height || 600,
        ...overrides.dimensions
      }
    };
  }
  
  return adaptiveSection as AdaptiveWireframeSection;
}

export function makeFullyResponsive(wireframeData: any): any {
  if (!wireframeData || !wireframeData.sections) return wireframeData;
  
  const responsiveSections = wireframeData.sections.map((section: any) => {
    // Skip if section is already responsive
    if (
      section.layout && 
      (section.layout.desktop || section.layout.tablet || section.layout.mobile)
    ) {
      return section;
    }
    
    return createResponsiveVariation(section, 'desktop');
  });
  
  return {
    ...wireframeData,
    sections: responsiveSections
  };
}
