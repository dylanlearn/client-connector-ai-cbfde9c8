
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
      layout: (section.responsive[device].layout.layout || baseLayout.layout) as 'flex' | 'grid' | 'stack' | 'columns',
      alignItems: (section.responsive[device].layout.alignItems || baseLayout.alignItems) as 'start' | 'center' | 'end' | 'stretch',
      justifyContent: (section.responsive[device].layout.justifyContent || baseLayout.justifyContent) as 'start' | 'center' | 'end' | 'between' | 'around'
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
