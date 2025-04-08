import { ComponentDefinition, ComponentVariant } from './component-types';

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
      thumbnail: '/placeholder.svg', // Added missing thumbnail
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
      thumbnail: '/placeholder.svg', // Added missing thumbnail
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
      defaultValue: 'Welcome to our platform'
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'The best solution for your needs'
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Alignment',
      options: ['left', 'center', 'right'],
      defaultValue: 'center'
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Text',
      defaultValue: 'Get Started'
    },
    {
      name: 'backgroundType',
      type: 'select',
      label: 'Background Type',
      options: ['color', 'image'],
      defaultValue: 'color'
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
      thumbnail: '/placeholder.svg', // Added missing thumbnail
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
      thumbnail: '/placeholder.svg', // Added missing thumbnail
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
      defaultValue: 'Our Features'
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'What makes us special'
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      itemType: 'text',
      defaultValue: ['Feature 1', 'Feature 2', 'Feature 3']
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
      thumbnail: '/placeholder.svg', // Added missing thumbnail
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
      defaultValue: 'What Our Customers Say'
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      itemType: 'text',
      defaultValue: ['Great product!', 'Excellent service!']
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
      thumbnail: '/placeholder.svg', // Added missing thumbnail
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
      defaultValue: 'Ready to get started?'
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Join thousands of satisfied customers'
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      defaultValue: 'Sign Up Now'
    },
    {
      name: 'buttonVariant',
      type: 'select',
      label: 'Button Variant',
      options: ['primary', 'secondary'],
      defaultValue: 'primary'
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
      thumbnail: '/placeholder.svg', // Added missing thumbnail
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
      defaultValue: '© 2024 My Company'
    },
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      itemType: 'text',
      defaultValue: ['About', 'Contact', 'Privacy Policy']
    }
  ],
  defaultData: {
    copyright: '© 2024 My Company',
    links: ['About', 'Contact', 'Privacy Policy']
  }
};
