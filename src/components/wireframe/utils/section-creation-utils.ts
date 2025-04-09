
import { v4 as uuidv4 } from 'uuid';
import { AdaptiveWireframeSection } from './responsive-layout-utils';

/**
 * Create a deep clone of a section
 */
export function cloneSection(section: any): any {
  if (!section) return null;
  
  // Create a deep copy using JSON parse/stringify
  const clone = JSON.parse(JSON.stringify(section));
  
  // Generate new IDs for the section and its components
  clone.id = uuidv4();
  
  if (Array.isArray(clone.components)) {
    clone.components = clone.components.map((component: any) => ({
      ...component,
      id: uuidv4()
    }));
  }
  
  return clone;
}

/**
 * Create an empty section with default properties
 */
export function createEmptySection(
  name: string = 'New Section',
  sectionType: string = 'generic',
  options: {
    position?: { x: number, y: number };
    dimensions?: { width: number, height: number };
    backgroundColor?: string;
    layoutType?: string;
  } = {}
): any {
  const {
    position = { x: 0, y: 0 },
    dimensions = { width: 1200, height: 300 },
    backgroundColor = '#ffffff',
    layoutType = 'flex'
  } = options;
  
  return {
    id: uuidv4(),
    name,
    sectionType,
    description: `${name} section`,
    position,
    dimensions,
    backgroundColor,
    layoutType,
    layout: {
      type: layoutType,
      direction: 'column',
      alignment: 'center',
      justifyContent: 'center'
    },
    components: [],
    copySuggestions: {
      heading: name,
      subheading: 'Edit this section to add your content'
    },
    visible: true
  };
}

/**
 * Create a responsive grid section
 */
export function createGridSection(
  name: string = 'Grid Section',
  columns: number = 3,
  options: {
    position?: { x: number, y: number };
    dimensions?: { width: number, height: number };
    backgroundColor?: string;
    gap?: number;
    responsiveBreakpoints?: boolean;
    numItems?: number;
  } = {}
): AdaptiveWireframeSection {
  const {
    position = { x: 0, y: 0 },
    dimensions = { width: 1200, height: 400 },
    backgroundColor = '#ffffff',
    gap = 24,
    responsiveBreakpoints = true,
    numItems = columns
  } = options;
  
  // Create items for the grid
  const items = Array.from({ length: numItems }).map((_, index) => ({
    id: uuidv4(),
    type: 'card',
    content: {
      title: `Item ${index + 1}`,
      text: 'Lorem ipsum dolor sit amet',
      image: null
    },
    style: {
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '8px'
    }
  }));
  
  const baseSection = {
    id: uuidv4(),
    name,
    sectionType: 'grid',
    description: `${name} with ${columns} columns`,
    position,
    components: items,
    backgroundColor,
    copySuggestions: {
      heading: name,
      subheading: 'A grid of items'
    },
    visible: {
      desktop: true,
      tablet: true,
      mobile: true
    }
  };
  
  if (responsiveBreakpoints) {
    // Create a responsive section with different layouts for different devices
    return {
      ...baseSection,
      layout: {
        desktop: {
          type: 'grid',
          columns,
          gap
        },
        tablet: {
          type: 'grid',
          columns: Math.min(columns, 2),
          gap: Math.max(gap - 8, 16)
        },
        mobile: {
          type: 'grid',
          columns: 1,
          gap: Math.max(gap - 12, 12)
        }
      },
      dimensions: {
        desktop: dimensions,
        tablet: { width: 768, height: dimensions.height },
        mobile: { width: 375, height: dimensions.height * 1.5 }
      }
    } as AdaptiveWireframeSection;
  } else {
    // Create a simple section with a single layout
    return {
      ...baseSection,
      layout: {
        desktop: {
          type: 'grid',
          columns,
          gap
        }
      },
      dimensions: {
        desktop: dimensions
      }
    } as AdaptiveWireframeSection;
  }
}
