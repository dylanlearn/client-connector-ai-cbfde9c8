
import { ComponentDefinition } from './component-registry';

// Default set of components to register
export const defaultComponents: ComponentDefinition[] = [
  {
    id: 'hero-section',
    type: 'hero',
    name: 'Hero Section',
    description: 'Main hero section with title, subtitle and CTA',
    category: 'layout',
    tags: ['header', 'intro', 'banner'],
    variants: [
      {
        id: 'centered',
        name: 'Centered Hero',
        description: 'Centered text with button below',
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
        description: 'Text on left, image on right',
        defaultContent: {
          title: 'Transform your workflow',
          subtitle: 'Powerful tools for modern teams',
          alignment: 'left',
          ctaText: 'Learn More',
          backgroundType: 'image',
          imagePosition: 'right'
        }
      }
    ],
    defaultProps: {
      layout: 'centered',
      height: 'medium'
    }
  },
  {
    id: 'features-section',
    type: 'features',
    name: 'Features Section',
    description: 'Display product or service features',
    category: 'content',
    tags: ['features', 'benefits', 'grid'],
    variants: [
      {
        id: 'grid',
        name: 'Feature Grid',
        description: '3x3 grid of features with icons',
        defaultContent: {
          title: 'Our Features',
          subtitle: 'What makes us different',
          features: [
            { 
              id: 'feature-1', 
              type: 'feature',
              content: 'Feature 1 description' 
            },
            { 
              id: 'feature-2', 
              type: 'feature',
              content: 'Feature 2 description' 
            },
            { 
              id: 'feature-3', 
              type: 'feature',
              content: 'Feature 3 description' 
            }
          ]
        }
      },
      {
        id: 'list',
        name: 'Feature List',
        description: 'Vertical list of features with descriptions',
        defaultContent: {
          title: 'What We Offer',
          subtitle: 'Discover our services',
          features: [
            { 
              id: 'feature-1', 
              type: 'feature',
              content: 'Feature 1 with detailed explanation' 
            },
            { 
              id: 'feature-2', 
              type: 'feature',
              content: 'Feature 2 with detailed explanation' 
            },
            { 
              id: 'feature-3', 
              type: 'feature',
              content: 'Feature 3 with detailed explanation' 
            }
          ]
        }
      }
    ],
    defaultProps: {
      layout: 'grid',
      columns: 3
    }
  },
  {
    id: 'testimonials-section',
    type: 'testimonials',
    name: 'Testimonials Section',
    description: 'Display customer testimonials',
    category: 'social-proof',
    tags: ['reviews', 'quotes', 'customers'],
    variants: [
      {
        id: 'cards',
        name: 'Testimonial Cards',
        description: 'Grid of testimonial cards',
        defaultContent: {
          title: 'What Our Customers Say',
          testimonials: [
            { 
              id: 'testimonial-1', 
              type: 'testimonial',
              content: 'Great product, highly recommend!' 
            },
            { 
              id: 'testimonial-2', 
              type: 'testimonial',
              content: 'Changed how we work forever.' 
            },
            { 
              id: 'testimonial-3', 
              type: 'testimonial',
              content: 'Best decision we ever made.' 
            }
          ]
        }
      }
    ],
    defaultProps: {
      layout: 'grid',
      columns: 3
    }
  },
  {
    id: 'cta-section',
    type: 'cta',
    name: 'Call to Action',
    description: 'Prompt users to take action',
    category: 'conversion',
    tags: ['action', 'signup', 'download'],
    variants: [
      {
        id: 'simple',
        name: 'Simple CTA',
        description: 'Centered CTA with title and button',
        defaultContent: {
          title: 'Ready to get started?',
          subtitle: 'Join thousands of satisfied customers',
          buttonText: 'Sign Up Now',
          buttonVariant: 'primary'
        }
      }
    ],
    defaultProps: {
      background: 'accent',
      alignment: 'center'
    }
  }
];
