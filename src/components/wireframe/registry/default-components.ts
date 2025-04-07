
import { ComponentDefinition } from './component-registry';

/**
 * Hero Section Component Definition
 */
export const heroComponent: ComponentDefinition = {
  type: 'hero',
  name: 'Hero Section',
  description: 'Main banner section typically at the top of a webpage',
  category: 'layout',
  icon: 'layout',
  variants: [
    {
      id: 'hero-centered',
      name: 'Centered Hero',
      description: 'Content aligned in the center with heading, subheading and CTA buttons'
    },
    {
      id: 'hero-split',
      name: 'Split Hero',
      description: 'Two-column layout with text and image side-by-side'
    },
    {
      id: 'hero-minimal',
      name: 'Minimal Hero',
      description: 'Clean and simple hero with minimal elements'
    }
  ],
  fields: [
    {
      id: 'heading',
      name: 'Heading',
      type: 'text',
      defaultValue: 'Your Impactful Heading Here',
      validation: {
        required: true
      }
    },
    {
      id: 'subheading',
      name: 'Subheading',
      type: 'textarea',
      defaultValue: 'A descriptive subheading to provide more context and engage your visitors.'
    },
    {
      id: 'primaryCta',
      name: 'Primary CTA Text',
      type: 'text',
      defaultValue: 'Get Started'
    },
    {
      id: 'secondaryCta',
      name: 'Secondary CTA Text',
      type: 'text',
      defaultValue: 'Learn More'
    },
    {
      id: 'backgroundType',
      name: 'Background Type',
      type: 'select',
      options: [
        { label: 'Solid Color', value: 'color' },
        { label: 'Gradient', value: 'gradient' },
        { label: 'Image', value: 'image' }
      ],
      defaultValue: 'color'
    },
    {
      id: 'backgroundColor',
      name: 'Background Color',
      type: 'color',
      defaultValue: '#f9fafb'
    },
    {
      id: 'imageUrl',
      name: 'Background Image URL',
      type: 'image',
      defaultValue: ''
    }
  ],
  defaultData: {
    name: 'Hero Section',
    sectionType: 'hero',
    componentVariant: 'hero-centered',
    // Instead of using 'data', add properties directly to the section
    heading: 'Your Impactful Heading Here',
    subheading: 'A descriptive subheading to provide more context and engage your visitors.',
    primaryCta: 'Get Started',
    secondaryCta: 'Learn More',
    backgroundType: 'color',
    backgroundColor: '#f9fafb',
    imageUrl: '',
    styleProperties: {
      paddingTop: 'lg',
      paddingBottom: 'lg',
      textAlignment: 'center'
    }
  }
};

/**
 * Features Section Component Definition
 */
export const featuresComponent: ComponentDefinition = {
  type: 'features',
  name: 'Features Section',
  description: 'Showcase your product or service features',
  category: 'content',
  icon: 'check-square',
  variants: [
    {
      id: 'features-grid',
      name: 'Features Grid',
      description: 'Features displayed in a grid layout'
    },
    {
      id: 'features-list',
      name: 'Features List',
      description: 'Features shown as a vertical list'
    },
    {
      id: 'features-alternating',
      name: 'Alternating Features',
      description: 'Features displayed in alternating left-right layout'
    }
  ],
  fields: [
    {
      id: 'heading',
      name: 'Heading',
      type: 'text',
      defaultValue: 'Key Features',
      validation: {
        required: true
      }
    },
    {
      id: 'subheading',
      name: 'Subheading',
      type: 'textarea',
      defaultValue: 'Discover what makes our product stand out from the competition.'
    },
    {
      id: 'features',
      name: 'Features',
      type: 'array',
      defaultValue: [
        {
          title: 'Feature One',
          description: 'Description of the first feature highlighting its benefits.',
          icon: 'star'
        },
        {
          title: 'Feature Two',
          description: 'Description of the second feature highlighting its benefits.',
          icon: 'clock'
        },
        {
          title: 'Feature Three',
          description: 'Description of the third feature highlighting its benefits.',
          icon: 'shield'
        }
      ]
    },
    {
      id: 'columnsCount',
      name: 'Columns',
      type: 'select',
      options: [
        { label: 'Two Columns', value: 2 },
        { label: 'Three Columns', value: 3 },
        { label: 'Four Columns', value: 4 }
      ],
      defaultValue: 3
    }
  ],
  defaultData: {
    name: 'Features Section',
    sectionType: 'features',
    componentVariant: 'features-grid',
    // Instead of using 'data', add properties directly to the section
    heading: 'Key Features',
    subheading: 'Discover what makes our product stand out from the competition.',
    features: [
      {
        title: 'Feature One',
        description: 'Description of the first feature highlighting its benefits.',
        icon: 'star'
      },
      {
        title: 'Feature Two',
        description: 'Description of the second feature highlighting its benefits.',
        icon: 'clock'
      },
      {
        title: 'Feature Three',
        description: 'Description of the third feature highlighting its benefits.',
        icon: 'shield'
      }
    ],
    columnsCount: 3,
    styleProperties: {
      paddingTop: 'md',
      paddingBottom: 'md',
      backgroundColor: '#ffffff'
    }
  }
};

/**
 * Register default components
 */
export const defaultComponents: ComponentDefinition[] = [
  heroComponent,
  featuresComponent
];
