
import { WireframeSection, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';

/**
 * Advanced layout utilities for positioning components within sections
 */
export const layoutAlgorithms = {
  /**
   * Position components in a masonry-style layout
   */
  masonry: (
    components: WireframeComponent[],
    containerWidth: number,
    columns: number = 3,
    gap: number = 16
  ): WireframeComponent[] => {
    if (!components || components.length === 0) return [];
    
    // Create column trackers
    const columnHeights = Array(columns).fill(0);
    const columnWidth = (containerWidth - (gap * (columns - 1))) / columns;
    
    return components.map(component => {
      // Find shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Position component in the shortest column
      const x = shortestColumnIndex * (columnWidth + gap);
      const y = columnHeights[shortestColumnIndex];
      
      // Update column height
      const componentHeight = component.dimensions?.height || 100;
      columnHeights[shortestColumnIndex] += componentHeight + gap;
      
      // Return updated component with position
      return {
        ...component,
        position: { x, y },
        dimensions: {
          ...component.dimensions,
          width: columnWidth
        }
      };
    });
  },

  /**
   * Auto-resize text components to fit available space
   */
  autoFitText: (
    component: WireframeComponent,
    availableWidth: number,
    availableHeight?: number
  ): WireframeComponent => {
    if (component.type !== 'text' && component.type !== 'heading' && 
        component.type !== 'paragraph' && component.type !== 'h1' && 
        component.type !== 'h2' && component.type !== 'h3') {
      return component;
    }
    
    // Calculate optimal font size based on available width
    const textLength = (component.content?.length || 10);
    const minFontSize = 12;
    const maxFontSize = component.type === 'heading' || 
                        component.type === 'h1' || 
                        component.type === 'h2' ? 36 : 18;
    
    // Simple algorithm - can be refined for production
    let fontSize = Math.min(Math.max(availableWidth / (textLength * 0.6), minFontSize), maxFontSize);
    
    // Adjust for headings
    if (component.type === 'heading' || component.type === 'h1') fontSize *= 1.5;
    if (component.type === 'h2') fontSize *= 1.3;
    if (component.type === 'h3') fontSize *= 1.1;
    
    return {
      ...component,
      style: {
        ...component.style,
        fontSize: `${fontSize}px`
      }
    };
  },
  
  /**
   * Arrange components in a responsive grid layout
   */
  responsiveGrid: (
    components: WireframeComponent[],
    containerWidth: number,
    deviceType: 'desktop' | 'tablet' | 'mobile',
    gap: number = 16
  ): WireframeComponent[] => {
    // Determine columns based on device type
    let columns: number;
    switch(deviceType) {
      case 'mobile':
        columns = 1;
        break;
      case 'tablet':
        columns = 2;
        break;
      case 'desktop':
      default:
        columns = 3;
        break;
    }
    
    const columnWidth = (containerWidth - (gap * (columns - 1))) / columns;
    
    return components.map((component, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      
      return {
        ...component,
        position: {
          x: col * (columnWidth + gap),
          y: row * (component.dimensions?.height || 100 + gap)
        },
        dimensions: {
          ...component.dimensions,
          width: columnWidth
        }
      };
    });
  },
  
  /**
   * Apply flexbox layout algorithm
   */
  flexLayout: (
    components: WireframeComponent[],
    containerWidth: number,
    containerHeight: number,
    layout: {
      direction?: 'row' | 'column';
      wrap?: boolean;
      justifyContent?: string;
      alignItems?: string;
      gap?: number;
    }
  ): WireframeComponent[] => {
    if (!components || components.length === 0) return [];
    
    const {
      direction = 'row',
      wrap = true,
      justifyContent = 'start',
      alignItems = 'center',
      gap = 16
    } = layout;
    
    let currentX = 0;
    let currentY = 0;
    let currentRowHeight = 0;
    
    return components.map(component => {
      const componentWidth = component.dimensions?.width || 100;
      const componentHeight = component.dimensions?.height || 100;
      
      // Handle row layout
      if (direction === 'row') {
        // Handle wrapping
        if (wrap && currentX + componentWidth > containerWidth) {
          currentX = 0;
          currentY += currentRowHeight + gap;
          currentRowHeight = 0;
        }
        
        const position = { x: currentX, y: currentY };
        
        // Update trackers
        currentX += componentWidth + gap;
        currentRowHeight = Math.max(currentRowHeight, componentHeight);
        
        return { ...component, position };
      }
      // Handle column layout
      else {
        const position = { x: 0, y: currentY };
        currentY += componentHeight + gap;
        return { ...component, position };
      }
    });
  },
  
  /**
   * Create auto-layout for a section based on its components and layout preferences
   */
  autoLayout: (
    section: WireframeSection,
    deviceType: 'desktop' | 'tablet' | 'mobile',
    containerWidth: number = 1200,
    containerHeight: number = 800
  ): WireframeSection => {
    if (!section.components || section.components.length === 0) {
      return section;
    }
    
    // Determine layout strategy
    const layout = section.layout || { type: 'flex', direction: 'column' };
    const layoutType = typeof layout === 'string' ? layout : layout.type;
    
    // Apply layout algorithm based on type
    let positionedComponents: WireframeComponent[];
    
    switch (layoutType) {
      case 'masonry':
        positionedComponents = layoutAlgorithms.masonry(
          section.components,
          containerWidth,
          typeof layout === 'object' ? layout.columns : 3,
          typeof layout === 'object' ? layout.gap : 16
        );
        break;
      
      case 'grid':
        positionedComponents = layoutAlgorithms.responsiveGrid(
          section.components,
          containerWidth,
          deviceType,
          typeof layout === 'object' ? layout.gap : 16
        );
        break;
      
      case 'flex':
      default:
        positionedComponents = layoutAlgorithms.flexLayout(
          section.components,
          containerWidth,
          containerHeight,
          {
            direction: typeof layout === 'object' ? 
              layout.direction === 'horizontal' ? 'row' : 'column' : 'row',
            wrap: typeof layout === 'object' ? layout.wrap !== false : true,
            justifyContent: typeof layout === 'object' ? layout.justifyContent : 'start',
            alignItems: typeof layout === 'object' ? layout.alignment : 'center',
            gap: typeof layout === 'object' ? layout.gap : 16
          }
        );
        break;
    }
    
    return {
      ...section,
      components: positionedComponents
    };
  }
};

export default layoutAlgorithms;
