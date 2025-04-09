
import { WireframeSection } from '@/types/wireframe';
import { DeviceType } from './responsive-utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Adaptive section type that extends the base section with responsive variations
 */
export interface AdaptiveWireframeSection extends WireframeSection {
  responsive?: Record<DeviceType, {
    visible: boolean;
    layout?: any;
    styles?: any;
    content?: any;
  }>;
}

/**
 * Responsive section layout settings
 */
export interface ResponsiveLayoutSettings {
  layout: 'stack' | 'grid' | 'flex' | 'columns';
  columns?: number;
  gap?: number | string;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
  autoRows?: boolean;
  rowHeight?: number | string;
  wrap?: boolean;
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
    layout: section.layout.type || 'flex',
    alignItems: section.layout.alignment || 'center',
    justifyContent: section.layout.justifyContent || 'between',
    columns: section.layout.columns || 1,
    gap: section.layout.gap || 16,
    wrap: section.layout.wrap !== false
  } : defaultLayout;
  
  // Apply device-specific overrides if available
  if (section.responsive && section.responsive[device]?.layout) {
    return {
      ...baseLayout,
      ...section.responsive[device].layout
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
 * Get responsive styles for a section based on device type
 */
export function getResponsiveStyles(
  section: AdaptiveWireframeSection,
  device: DeviceType
): Record<string, any> {
  // Get base styles
  const baseStyles = section.styleProperties || {};
  
  // Apply device-specific overrides if available
  if (section.responsive && section.responsive[device]?.styles) {
    return {
      ...baseStyles,
      ...section.responsive[device].styles
    };
  }
  
  // Default device-specific styles
  switch (device) {
    case 'mobile':
      return {
        ...baseStyles,
        padding: baseStyles.padding 
          ? Math.max(8, parseInt(baseStyles.padding as string) / 2) 
          : 16
      };
    case 'tablet':
      return {
        ...baseStyles,
        padding: baseStyles.padding 
          ? Math.max(12, parseInt(baseStyles.padding as string) * 0.75) 
          : 24
      };
    case 'desktop':
    default:
      return baseStyles;
  }
}

/**
 * Check if a section should be shown on a specific device type
 */
export function isSectionVisibleOnDevice(
  section: AdaptiveWireframeSection,
  device: DeviceType
): boolean {
  if (!section.responsive) return true;
  return section.responsive[device]?.visible !== false; // Default to visible
}

/**
 * Get responsive content for a section based on device type
 */
export function getResponsiveContent(
  section: AdaptiveWireframeSection,
  device: DeviceType
): any {
  // Get base content
  const baseContent = section.content || {};
  
  // Apply device-specific overrides if available
  if (section.responsive && section.responsive[device]?.content) {
    return {
      ...baseContent,
      ...section.responsive[device].content
    };
  }
  
  return baseContent;
}

/**
 * Create a responsive variation of a section for a specific device
 */
export function createResponsiveVariation(
  section: WireframeSection,
  device: DeviceType,
  overrides: Record<string, any> = {}
): AdaptiveWireframeSection {
  const adaptiveSection = section as AdaptiveWireframeSection;
  
  // Initialize responsive property if it doesn't exist
  if (!adaptiveSection.responsive) {
    adaptiveSection.responsive = {
      mobile: { visible: true },
      tablet: { visible: true },
      desktop: { visible: true }
    };
  }
  
  // Update responsive properties for the specified device
  adaptiveSection.responsive[device] = {
    ...adaptiveSection.responsive[device],
    ...overrides
  };
  
  return adaptiveSection;
}

/**
 * Create a deep clone of a section
 */
export function cloneSection(section: WireframeSection): WireframeSection {
  return JSON.parse(JSON.stringify(section));
}

/**
 * Create a new section with default values
 */
export function createEmptySection(type: string = 'custom'): WireframeSection {
  return {
    id: uuidv4(),
    name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
    sectionType: type,
    components: [],
    layout: { type: 'flex', direction: 'column' }
  };
}

/**
 * Create a grid layout section
 */
export function createGridSection(columns: number = 3, rows: number = 1): WireframeSection {
  const section = createEmptySection('grid');
  section.name = `${columns}x${rows} Grid Section`;
  section.layout = { 
    type: 'grid',
    columns, 
    rows,
    gap: 16
  };
  
  // Create empty cell components
  for (let i = 0; i < columns * rows; i++) {
    section.components?.push({
      id: uuidv4(),
      type: 'cell',
      content: { text: `Cell ${i + 1}` },
      styles: { 
        backgroundColor: '#f3f4f6',
        padding: '16px',
        borderRadius: '8px'
      }
    });
  }
  
  return section;
}

/**
 * Create a responsive variation for all devices
 */
export function makeFullyResponsive(section: WireframeSection): AdaptiveWireframeSection {
  const adaptiveSection = section as AdaptiveWireframeSection;
  
  // Create responsive variations for all device types
  const devices: DeviceType[] = ['desktop', 'tablet', 'mobile'];
  
  adaptiveSection.responsive = devices.reduce((acc, device) => {
    let deviceOverrides: any = { visible: true };
    
    // Apply device-specific defaults
    if (device === 'mobile') {
      deviceOverrides.layout = { 
        columns: 1,
        layout: 'stack'
      };
    } else if (device === 'tablet') {
      const baseColumns = section.layout?.columns || 3;
      deviceOverrides.layout = { 
        columns: Math.min(baseColumns, 2) 
      };
    }
    
    acc[device] = deviceOverrides;
    return acc;
  }, {} as Record<DeviceType, any>);
  
  return adaptiveSection;
}

/**
 * Get tailwind classes for responsive layout
 */
export function getResponsiveTailwindClasses(section: AdaptiveWireframeSection): string {
  const baseClasses = [];
  const mobileClasses = [];
  const tabletClasses = [];
  const desktopClasses = [];
  
  // Base layout classes
  if (section.layout) {
    if (section.layout.type === 'flex') {
      baseClasses.push('flex');
      baseClasses.push(section.layout.direction === 'row' ? 'flex-row' : 'flex-col');
      if (section.layout.wrap) baseClasses.push('flex-wrap');
      
      // Alignment
      switch (section.layout.alignment) {
        case 'start': baseClasses.push('items-start'); break;
        case 'center': baseClasses.push('items-center'); break;
        case 'end': baseClasses.push('items-end'); break;
        default: baseClasses.push('items-center');
      }
      
      // Justification
      switch (section.layout.justifyContent) {
        case 'start': baseClasses.push('justify-start'); break;
        case 'center': baseClasses.push('justify-center'); break;
        case 'end': baseClasses.push('justify-end'); break;
        case 'between': baseClasses.push('justify-between'); break;
        case 'around': baseClasses.push('justify-around'); break;
        default: baseClasses.push('justify-between');
      }
      
      // Gap
      if (section.layout.gap) {
        baseClasses.push(`gap-${section.layout.gap}`);
      }
    } else if (section.layout.type === 'grid') {
      baseClasses.push('grid');
      
      if (section.layout.columns) {
        baseClasses.push(`grid-cols-${section.layout.columns}`);
      }
      
      if (section.layout.rows) {
        baseClasses.push(`grid-rows-${section.layout.rows}`);
      }
      
      if (section.layout.gap) {
        baseClasses.push(`gap-${section.layout.gap}`);
      }
    }
  }
  
  // Add responsive overrides if available
  if (section.responsive) {
    // Mobile overrides
    if (section.responsive.mobile?.layout) {
      if (section.responsive.mobile.layout.layout === 'stack') {
        mobileClasses.push('flex flex-col items-center');
      } else if (section.responsive.mobile.layout.columns) {
        mobileClasses.push(`grid-cols-${section.responsive.mobile.layout.columns}`);
      }
    }
    
    // Tablet overrides
    if (section.responsive.tablet?.layout) {
      if (section.responsive.tablet.layout.columns) {
        tabletClasses.push(`md:grid-cols-${section.responsive.tablet.layout.columns}`);
      }
    }
    
    // Desktop overrides
    if (section.responsive.desktop?.layout) {
      if (section.responsive.desktop.layout.columns) {
        desktopClasses.push(`lg:grid-cols-${section.responsive.desktop.layout.columns}`);
      }
    }
  }
  
  // Combine all classes with responsive prefixes
  return [
    ...baseClasses,
    ...mobileClasses.map(cls => `sm:${cls}`),
    ...tabletClasses,
    ...desktopClasses
  ].join(' ');
}
