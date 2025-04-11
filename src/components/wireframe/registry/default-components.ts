// Fix for the type error on line 210 (incomplete WireframeComponent)
import { WireframeComponent } from '@/types/wireframe-component';
import { ComponentDefinition, ComponentVariant } from './component-types';

// Define proper default components
export const defaultHeroComponent: ComponentDefinition = {
  type: 'hero',
  name: 'Hero Section',
  description: 'A hero section for landing pages',
  icon: 'layout',
  variants: [
    {
      id: 'hero-standard',
      name: 'Standard Hero',
      description: 'Standard hero section with headline, subheadline and CTA',
      thumbnail: '/thumbnails/hero-standard.png',
      defaultContent: {
        headline: 'Build amazing products',
        subheadline: 'Our platform helps you create and launch faster',
        ctaText: 'Get Started'
      }
    },
    {
      id: 'hero-image',
      name: 'Hero with Image',
      description: 'Hero section with a large background image',
      thumbnail: '/thumbnails/hero-image.png',
      defaultContent: {
        headline: 'Visually Stunning',
        subheadline: 'Capture attention with a beautiful image',
        imageUrl: '/images/hero-image.jpg'
      }
    },
    {
      id: 'hero-video',
      name: 'Hero with Video',
      description: 'Hero section with an engaging video background',
      thumbnail: '/thumbnails/hero-video.png',
      defaultContent: {
        headline: 'Engage with Video',
        subheadline: 'Showcase your product with a captivating video',
        videoUrl: '/videos/hero-video.mp4'
      }
    }
  ],
  fields: [
    {
      id: 'headline',
      name: 'Headline',
      label: 'Headline',
      type: 'text',
      description: 'Main headline for the hero section',
      defaultValue: 'Build amazing products'
    },
    {
      id: 'subheadline',
      name: 'Subheadline',
      label: 'Subheadline',
      type: 'textarea',
      description: 'Supporting text beneath the headline',
      defaultValue: 'Our platform helps you create and launch faster'
    },
    {
      id: 'ctaText',
      name: 'CTA Button Text',
      label: 'CTA Button Text',
      type: 'text',
      description: 'Text for the call to action button',
      defaultValue: 'Get Started'
    },
    {
      id: 'ctaUrl',
      name: 'CTA Button URL',
      label: 'CTA Button URL',
      type: 'text',
      description: 'URL for the call to action button',
      defaultValue: '/signup'
    },
    {
      id: 'backgroundStyle',
      name: 'Background Style',
      label: 'Background Style',
      type: 'select',
      description: 'The background style of the section',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Gradient', value: 'gradient' }
      ],
      defaultValue: 'light'
    },
    {
      id: 'imageUrl',
      name: 'Image URL',
      label: 'Image URL',
      type: 'image',
      description: 'URL for the background image',
      defaultValue: ''
    },
    {
      id: 'videoUrl',
      name: 'Video URL',
      label: 'Video URL',
      type: 'image',
      description: 'URL for the background video',
      defaultValue: ''
    },
    {
      id: 'alignment',
      name: 'Content Alignment',
      label: 'Content Alignment',
      type: 'select',
      description: 'How the content should be aligned',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ],
      defaultValue: 'center'
    },
    {
      id: 'showStats',
      name: 'Show Statistics',
      label: 'Show Statistics',
      type: 'boolean',
      description: 'Whether to display statistics',
      defaultValue: false
    }
  ],
  defaultData: {
    id: 'hero-section',
    type: 'hero',
    position: { x: 0, y: 0 },
    size: { width: 1200, height: 600 },
    zIndex: 1,
    title: 'Hero Section',
    subtitle: 'A powerful hero section to capture attention',
    sectionType: 'hero',
    componentVariant: 'hero-standard'
  }
};

export const defaultFeaturesComponent: ComponentDefinition = {
  type: 'features',
  name: 'Features Section',
  description: 'Display product or service features',
  icon: 'grid',
  variants: [
    {
      id: 'features-grid',
      name: 'Features Grid',
      description: 'Grid layout of features with icons',
      thumbnail: '/thumbnails/features-grid.png',
      defaultContent: {
        title: 'Our Amazing Features',
        features: [
          { title: 'Feature 1', description: 'Description of feature 1' },
          { title: 'Feature 2', description: 'Description of feature 2' },
          { title: 'Feature 3', description: 'Description of feature 3' }
        ]
      }
    },
    {
      id: 'features-list',
      name: 'Features List',
      description: 'List layout of features with descriptions',
      thumbnail: '/thumbnails/features-list.png',
      defaultContent: {
        title: 'Key Features',
        features: [
          { title: 'Feature A', description: 'Detailed description of feature A' },
          { title: 'Feature B', description: 'Detailed description of feature B' },
          { title: 'Feature C', description: 'Detailed description of feature C' }
        ]
      }
    }
  ],
  fields: [
    {
      id: 'title',
      name: 'Section Title',
      label: 'Section Title',
      type: 'text',
      description: 'Main heading for the features section',
      defaultValue: 'Our Features'
    },
    {
      id: 'features',
      name: 'Features',
      label: 'Features',
      type: 'array',
      itemType: 'feature',
      description: 'List of features to display',
      defaultValue: []
    },
    {
      id: 'layoutStyle',
      name: 'Layout Style',
      label: 'Layout Style',
      type: 'select',
      description: 'The layout style for blog posts',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' }
      ],
      defaultValue: 'grid'
    }
  ],
  defaultData: {
    id: 'features-section',
    type: 'features',
    position: { x: 0, y: 0 },
    size: { width: 1200, height: 600 },
    zIndex: 1,
    title: 'Features Section',
    subtitle: 'Showcase your product features',
    sectionType: 'features',
    componentVariant: 'features-grid'
  }
};

export const defaultTestimonialsComponent: ComponentDefinition = {
  type: 'testimonials',
  name: 'Testimonials Section',
  description: 'Display customer testimonials',
  icon: 'message-square',
  variants: [
    {
      id: 'testimonials-cards',
      name: 'Testimonial Cards',
      description: 'Customer testimonials displayed as cards',
      thumbnail: '/thumbnails/testimonials-cards.png',
      defaultContent: {
        title: 'What Our Customers Say',
        testimonials: [
          { 
            quote: 'This product changed how we work!',
            author: 'Jane Smith',
            company: 'Acme Inc.'
          }
        ]
      }
    },
    {
      id: 'testimonials-slider',
      name: 'Testimonial Slider',
      description: 'Customer testimonials displayed in a slider',
      thumbnail: '/thumbnails/testimonials-slider.png',
      defaultContent: {
        title: 'Customer Love',
        testimonials: [
          { 
            quote: 'Incredible service and support.',
            author: 'John Doe',
            company: 'Beta Corp'
          }
        ]
      }
    }
  ],
  fields: [
    {
      id: 'title',
      name: 'Section Title',
      label: 'Section Title',
      type: 'text',
      description: 'Main heading for the testimonials section',
      defaultValue: 'What Our Customers Say'
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      label: 'Testimonials',
      type: 'array',
      itemType: 'testimonial',
      description: 'List of testimonials to display',
      defaultValue: []
    },
    {
      id: 'layoutStyle',
      name: 'Layout Style',
      label: 'Layout Style',
      type: 'select',
      description: 'The layout style for blog posts',
      options: [
        { label: 'Cards', value: 'cards' },
        { label: 'Slider', value: 'slider' }
      ],
      defaultValue: 'cards'
    }
  ],
  defaultData: {
    id: 'testimonials-section',
    type: 'testimonials',
    position: { x: 0, y: 0 },
    size: { width: 1200, height: 400 },
    zIndex: 1,
    title: 'Testimonials',
    sectionType: 'testimonials',
    componentVariant: 'testimonials-cards'
  }
};

export const defaultCTAComponent: ComponentDefinition = {
  type: 'cta',
  name: 'Call to Action Section',
  description: 'A call to action section',
  icon: 'arrow-right-circle',
  variants: [
    {
      id: 'cta-standard',
      name: 'Standard CTA',
      description: 'Standard call to action with heading and button',
      thumbnail: '/thumbnails/cta-standard.png',
      defaultContent: {
        headline: 'Ready to get started?',
        ctaText: 'Sign Up Now'
      }
    },
    {
      id: 'cta-split',
      name: 'Split CTA',
      description: 'Call to action with split layout and image',
      thumbnail: '/thumbnails/cta-split.png',
      defaultContent: {
        headline: 'Transform Your Business',
        ctaText: 'Learn More',
        imageUrl: '/images/cta-image.jpg'
      }
    }
  ],
  fields: [
    {
      id: 'headline',
      name: 'Headline',
      label: 'Headline',
      type: 'text',
      description: 'Main heading for the CTA',
      defaultValue: 'Ready to get started?'
    },
    {
      id: 'ctaText',
      name: 'CTA Button Text',
      label: 'CTA Button Text',
      type: 'text',
      description: 'Text for the call to action button',
      defaultValue: 'Sign Up Now'
    },
    {
      id: 'ctaUrl',
      name: 'CTA Button URL',
      label: 'CTA Button URL',
      type: 'text',
      description: 'URL for the call to action button',
      defaultValue: '/signup'
    },
    {
      id: 'imageUrl',
      name: 'Image URL',
      label: 'Image URL',
      type: 'image',
      description: 'URL for the background image',
      defaultValue: ''
    },
    {
      id: 'backgroundStyle',
      name: 'Background Style',
      label: 'Background Style',
      type: 'select',
      description: 'The background style of the section',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Gradient', value: 'gradient' }
      ],
      defaultValue: 'light'
    }
  ],
  defaultData: {
    id: 'cta-section',
    type: 'cta',
    position: { x: 0, y: 0 },
    size: { width: 1200, height: 300 },
    zIndex: 1,
    title: 'Call to Action',
    subtitle: 'Drive user engagement with a compelling CTA',
    sectionType: 'cta',
    componentVariant: 'cta-standard'
  }
};

export const defaultFooterComponent: ComponentDefinition = {
  type: 'footer',
  name: 'Footer Section',
  description: 'Site footer with links and information',
  icon: 'layout-grid',
  variants: [
    {
      id: 'footer-standard',
      name: 'Standard Footer',
      description: 'Standard footer with columns of links',
      thumbnail: '/thumbnails/footer-standard.png',
      defaultContent: {
        links: [
          { title: 'Company', items: ['About', 'Careers', 'Contact'] },
          { title: 'Resources', items: ['Blog', 'Help', 'Support'] }
        ],
        copyright: '© 2023 Your Company. All rights reserved.'
      }
    },
    {
      id: 'footer-minimal',
      name: 'Minimal Footer',
      description: 'Minimal footer with copyright and social links',
      thumbnail: '/thumbnails/footer-minimal.png',
      defaultContent: {
        copyright: '© 2023 Your Company. All rights reserved.',
        socialLinks: [
          { icon: 'facebook', url: '/facebook' },
          { icon: 'twitter', url: '/twitter' }
        ]
      }
    }
  ],
  fields: [
    {
      id: 'links',
      name: 'Links',
      label: 'Links',
      type: 'array',
      itemType: 'linkGroup',
      description: 'List of links to display in the footer',
      defaultValue: []
    },
    {
      id: 'copyright',
      name: 'Copyright Text',
      label: 'Copyright Text',
      type: 'text',
      description: 'Copyright text for the footer',
      defaultValue: '© 2023 Your Company. All rights reserved.'
    },
    {
      id: 'socialLinks',
      name: 'Social Links',
      label: 'Social Links',
      type: 'array',
      itemType: 'socialLink',
      description: 'List of social media links',
      defaultValue: []
    }
  ],
  defaultData: {
    id: 'footer-section',
    type: 'footer',
    position: { x: 0, y: 0 },
    size: { width: 1200, height: 300 },
    zIndex: 1,
    copyright: '© 2023 Your Company. All rights reserved.',
    sectionType: 'footer',
    links: [
      { title: 'Company', items: ['About', 'Careers', 'Contact'] },
      { title: 'Resources', items: ['Blog', 'Help', 'Support'] }
    ],
    componentVariant: 'footer-standard'
  }
};

export const defaultComponents = [
  defaultHeroComponent,
  defaultFeaturesComponent,
  defaultTestimonialsComponent,
  defaultCTAComponent,
  defaultFooterComponent
];
