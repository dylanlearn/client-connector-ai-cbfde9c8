
import { ComponentDefinition, ComponentField } from './component-types';

// Default hero component definition
export const defaultHeroComponent: ComponentDefinition = {
  type: 'hero',
  name: 'Hero Section',
  description: 'A prominent header section, typically at the top of a page',
  category: 'layout',
  icon: 'layout',
  variants: [
    {
      id: 'centered',
      name: 'Centered Hero',
      description: 'A centered hero section with title, subtitle and CTA',
      thumbnail: '/placeholder.svg',
      defaultContent: {
        title: 'Welcome to our platform',
        subtitle: 'The best solution for your needs',
        alignment: 'center',
        ctaText: 'Get Started',
        backgroundType: 'color'
      }
    },
    {
      id: 'split',
      name: 'Split Hero',
      description: 'A hero section with content on one side and image on the other',
      thumbnail: '/placeholder.svg',
      defaultContent: {
        title: 'Welcome to our platform',
        subtitle: 'The best solution for your needs',
        alignment: 'left',
        ctaText: 'Get Started',
        backgroundType: 'image',
        imagePosition: 'right'
      }
    }
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Welcome to our platform',
      description: 'The main heading for the hero section',
      id: 'title-field'
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'The best solution for your needs',
      description: 'The supportive text under the main heading',
      id: 'subtitle-field'
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ],
      defaultValue: 'center',
      description: 'Horizontal alignment of content',
      id: 'alignment-field'
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Text',
      defaultValue: 'Get Started',
      description: 'Call-to-action button text',
      id: 'cta-text-field'
    },
    {
      name: 'backgroundType',
      type: 'select',
      label: 'Background Type',
      options: [
        { label: 'Color', value: 'color' },
        { label: 'Image', value: 'image' }
      ],
      defaultValue: 'color',
      description: 'Type of background for the hero section',
      id: 'background-type-field'
    }
  ],
  defaultData: {
    title: 'Welcome to our platform',
    subtitle: 'The best solution for your needs'
  }
};

// Default features component definition
export const defaultFeaturesComponent: ComponentDefinition = {
  type: 'features',
  name: 'Features Section',
  description: 'Display key features or benefits',
  category: 'content',
  icon: 'grid',
  variants: [
    {
      id: 'grid',
      name: 'Features Grid',
      description: 'Features displayed in a grid layout',
      thumbnail: '/placeholder.svg',
      defaultContent: {
        title: 'Our Features',
        subtitle: 'What makes us special',
        features: [
          { id: '1', type: 'feature', content: 'Feature 1' },
          { id: '2', type: 'feature', content: 'Feature 2' },
          { id: '3', type: 'feature', content: 'Feature 3' }
        ]
      }
    },
    {
      id: 'alternating',
      name: 'Alternating Features',
      description: 'Features displayed in alternating layout',
      thumbnail: '/placeholder.svg',
      defaultContent: {
        title: 'Our Features',
        subtitle: 'What makes us special',
        features: [
          { id: '1', type: 'feature', content: 'Feature 1' },
          { id: '2', type: 'feature', content: 'Feature 2' },
          { id: '3', type: 'feature', content: 'Feature 3' }
        ]
      }
    }
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Our Features',
      description: 'The heading for the features section',
      id: 'features-title-field'
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'What makes us special',
      description: 'The subheading for the features section',
      id: 'features-subtitle-field'
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      itemType: 'text',
      defaultValue: ['Feature 1', 'Feature 2', 'Feature 3'],
      description: 'List of features to display',
      id: 'features-list-field'
    }
  ],
  defaultData: {
    title: 'Our Features',
    subtitle: 'What makes us special'
  }
};

// Default testimonials component definition
export const defaultTestimonialsComponent: ComponentDefinition = {
  type: 'testimonials',
  name: 'Testimonials Section',
  description: 'Display customer testimonials or reviews',
  category: 'social proof',
  icon: 'quote',
  variants: [
    {
      id: 'cards',
      name: 'Testimonial Cards',
      description: 'Testimonials displayed as cards',
      thumbnail: '/placeholder.svg',
      defaultContent: {
        title: 'What Our Customers Say',
        testimonials: [
          { id: '1', type: 'testimonial', content: 'Great product!' },
          { id: '2', type: 'testimonial', content: 'Excellent service!' }
        ]
      }
    }
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'What Our Customers Say',
      description: 'The heading for testimonials section',
      id: 'testimonials-title-field'
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      itemType: 'text',
      defaultValue: ['Great product!', 'Excellent service!'],
      description: 'List of testimonials to display',
      id: 'testimonials-list-field'
    }
  ],
  defaultData: {
    title: 'What Our Customers Say'
  }
};

// Default CTA component definition
export const defaultCTAComponent: ComponentDefinition = {
  type: 'cta',
  name: 'Call to Action',
  description: 'A section prompting the user to take action',
  category: 'conversion',
  icon: 'zap',
  variants: [
    {
      id: 'simple',
      name: 'Simple CTA',
      description: 'A simple centered call to action',
      thumbnail: '/placeholder.svg',
      defaultContent: {
        title: 'Ready to get started?',
        subtitle: 'Join thousands of satisfied customers',
        buttonText: 'Sign Up Now',
        buttonVariant: 'primary'
      }
    }
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Ready to get started?',
      description: 'The main heading for the CTA section',
      id: 'cta-title-field'
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Join thousands of satisfied customers',
      description: 'The supportive text for the CTA section',
      id: 'cta-subtitle-field'
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      defaultValue: 'Sign Up Now',
      description: 'Text displayed on the CTA button',
      id: 'cta-button-text-field'
    },
    {
      name: 'buttonVariant',
      type: 'select',
      label: 'Button Variant',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' }
      ],
      defaultValue: 'primary',
      description: 'The visual style of the button',
      id: 'cta-button-variant-field'
    }
  ],
  defaultData: {
    title: 'Ready to get started?',
    subtitle: 'Join thousands of satisfied customers'
  }
};

// Default footer component definition
export const defaultFooterComponent: ComponentDefinition = {
  type: 'footer',
  name: 'Footer Section',
  description: 'A footer section with copyright and links',
  category: 'layout',
  icon: 'corner-down-left',
  variants: [
    {
      id: 'standard',
      name: 'Standard Footer',
      description: 'A standard footer with copyright and links',
      thumbnail: '/placeholder.svg',
      defaultContent: {
        copyright: '© 2024 My Company',
        links: ['About', 'Contact', 'Privacy Policy']
      }
    }
  ],
  fields: [
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright',
      defaultValue: '© 2024 My Company',
      description: 'Copyright text for the footer',
      id: 'footer-copyright-field'
    },
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      itemType: 'text',
      defaultValue: ['About', 'Contact', 'Privacy Policy'],
      description: 'List of links to display in the footer',
      id: 'footer-links-field'
    }
  ],
  defaultData: {
    copyright: '© 2024 My Company',
    links: ['About', 'Contact', 'Privacy Policy']
  }
};

// Export all component definitions for register-components.ts
export const defaultComponents = [
  defaultHeroComponent,
  defaultFeaturesComponent,
  defaultTestimonialsComponent,
  defaultCTAComponent,
  defaultFooterComponent
];
