
import { ComponentDefinition } from './component-registry';

export const defaultComponents: ComponentDefinition[] = [
  // Hero section component definition
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Large banner section typically at the top of a page',
    category: 'content',
    icon: 'layout',
    baseStyles: {
      padding: '8',
      layout: 'stack',
      gap: '4'
    },
    responsiveConfig: {
      desktop: {
        padding: '8',
        textSize: 'xl',
        layout: 'row'
      },
      tablet: {
        padding: '6',
        textSize: 'lg',
        layout: 'stack'
      },
      mobile: {
        padding: '4',
        textSize: 'base',
        layout: 'stack'
      }
    },
    variants: [
      {
        id: 'centered',
        name: 'Centered Hero',
        description: 'Hero with centered content',
        baseStyles: {
          alignment: 'center',
          layout: 'stack'
        }
      },
      {
        id: 'split',
        name: 'Split Hero',
        description: 'Hero with text on one side and image on other',
        baseStyles: {
          layout: 'row',
          gap: '8'
        },
        responsiveConfig: {
          mobile: {
            layout: 'stack'
          }
        }
      }
    ],
    fields: [
      {
        id: 'headline',
        name: 'Headline',
        type: 'text',
        defaultValue: 'Main Headline'
      },
      {
        id: 'subheading',
        name: 'Subheading',
        type: 'textarea',
        defaultValue: 'Supporting subheading text goes here'
      },
      {
        id: 'cta',
        name: 'Call to Action',
        type: 'text',
        defaultValue: 'Get Started'
      },
      {
        id: 'image',
        name: 'Hero Image',
        type: 'image'
      }
    ],
    defaultData: {
      name: 'Hero Section',
      components: [
        { id: 'headline', content: 'Main Headline' },
        { id: 'subheading', content: 'Supporting subheading text' },
        { id: 'cta', content: 'Get Started' }
      ]
    }
  },
  
  // Features grid component definition
  {
    type: 'features',
    name: 'Features Grid',
    description: 'Grid of features or benefits',
    category: 'content',
    icon: 'grid',
    baseStyles: {
      padding: '8',
      layout: 'grid',
      columns: 3,
      gap: '6'
    },
    responsiveConfig: {
      tablet: {
        columns: 2
      },
      mobile: {
        columns: 1
      }
    },
    variants: [
      {
        id: 'cards',
        name: 'Feature Cards',
        description: 'Features displayed as cards with icons'
      },
      {
        id: 'minimal',
        name: 'Minimal Features',
        description: 'Simple list of features'
      }
    ],
    fields: [
      {
        id: 'sectionTitle',
        name: 'Section Title',
        type: 'text',
        defaultValue: 'Features'
      },
      {
        id: 'features',
        name: 'Feature Items',
        type: 'array'
      }
    ],
    defaultData: {
      name: 'Features Grid',
      components: [
        { id: 'feature-1', content: 'Feature 1' },
        { id: 'feature-2', content: 'Feature 2' },
        { id: 'feature-3', content: 'Feature 3' }
      ]
    }
  },
  
  // Navigation component
  {
    type: 'navigation',
    name: 'Navigation Bar',
    description: 'Top navigation with menu items',
    category: 'navigation',
    icon: 'menu',
    baseStyles: {
      padding: '4',
      layout: 'row'
    },
    variants: [
      {
        id: 'centered',
        name: 'Centered Nav',
        description: 'Navigation with centered items'
      },
      {
        id: 'right-aligned',
        name: 'Right-aligned Nav',
        description: 'Navigation with items aligned to the right'
      }
    ],
    fields: [
      {
        id: 'logo',
        name: 'Logo',
        type: 'image'
      },
      {
        id: 'menuItems',
        name: 'Menu Items',
        type: 'array'
      }
    ],
    defaultData: {
      name: 'Navigation',
      components: [
        { id: 'logo', content: 'Logo' },
        { id: 'menu', content: 'Menu Items' }
      ]
    }
  }
];
