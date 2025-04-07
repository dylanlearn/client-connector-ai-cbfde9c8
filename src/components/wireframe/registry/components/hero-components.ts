
import { ComponentDefinition } from '../component-registry';

/**
 * Hero component definitions for the wireframe editor
 */
export const heroComponents: ComponentDefinition = {
  type: 'hero',
  name: 'Hero Section',
  description: 'Main banner section typically at the top of a page',
  category: 'content',
  icon: 'layout-dashboard',
  variants: [
    {
      id: 'hero-standard-001',
      name: 'Standard Hero',
      description: 'Clean layout with heading, text, and CTA button',
    },
    {
      id: 'hero-split-001',
      name: 'Split Hero',
      description: 'Content on one side, image on the other',
    },
    {
      id: 'hero-centered-001',
      name: 'Centered Hero',
      description: 'Centrally aligned content with prominent headline',
    },
    {
      id: 'hero-video-001',
      name: 'Video Hero',
      description: 'Hero with background video element',
    },
    {
      id: 'hero-creative-001',
      name: 'Creative Hero',
      description: 'Dynamic layout with decorative elements',
    },
    {
      id: 'hero-ecom-001',
      name: 'E-commerce Hero',
      description: 'Product-focused hero with call-to-action',
    },
  ],
  fields: [
    {
      id: 'headline',
      name: 'Headline',
      type: 'text',
      description: 'Primary heading text',
      defaultValue: 'Main Headline Goes Here',
      validation: {
        required: true,
      },
    },
    {
      id: 'subheadline',
      name: 'Subheadline',
      type: 'textarea',
      description: 'Supporting text that appears below headline',
      defaultValue: 'This is a supporting text that provides more context to the headline above.',
    },
    {
      id: 'ctaText',
      name: 'CTA Button Text',
      type: 'text',
      description: 'Call to action button text',
      defaultValue: 'Get Started',
    },
    {
      id: 'ctaUrl',
      name: 'CTA URL',
      type: 'text',
      description: 'Call to action button link',
      defaultValue: '#',
    },
    {
      id: 'backgroundType',
      name: 'Background Type',
      type: 'select',
      description: 'Type of background for the hero section',
      defaultValue: 'color',
      options: [
        { label: 'Solid Color', value: 'color' },
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Gradient', value: 'gradient' },
      ],
    },
    {
      id: 'imageUrl',
      name: 'Image URL',
      type: 'image',
      description: 'URL for the hero image',
      defaultValue: '',
    },
    {
      id: 'hasSecondaryButton',
      name: 'Show Secondary Button',
      type: 'boolean',
      description: 'Whether to show a secondary CTA button',
      defaultValue: false,
    },
    {
      id: 'secondaryButtonText',
      name: 'Secondary Button Text',
      type: 'text',
      description: 'Text for the secondary button',
      defaultValue: 'Learn More',
    },
  ],
  defaultData: {
    name: 'Hero Section',
    sectionType: 'hero',
    componentVariant: 'hero-standard-001',
    styleProperties: {
      padding: 'large',
      alignment: 'left',
      height: 'medium',
    },
    copySuggestions: {
      heading: [
        'Transform Your Business with Our Solutions',
        'The Future of Digital Experience Is Here',
        'Unlock Your Full Potential Today'
      ],
      subheading: [
        'Powerful tools designed to boost productivity and streamline your workflow',
        'Join thousands of satisfied customers who have transformed their business',
        'Easy to implement, with results you can see immediately'
      ],
      cta: [
        'Get Started',
        'Try For Free',
        'Book a Demo'
      ]
    }
  }
};
