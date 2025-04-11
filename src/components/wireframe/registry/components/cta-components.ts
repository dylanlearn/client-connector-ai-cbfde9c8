
import { ComponentDefinition } from '../component-types';

export const ctaComponents: ComponentDefinition = {
  type: 'cta',
  name: 'Call to Action Section',
  description: 'Compelling calls-to-action to drive user engagement',
  category: 'content',
  icon: 'arrow-right',
  variants: [
    {
      id: 'cta-creative-001',
      name: 'Creative Community CTA',
      description: 'Clean, minimal CTA with ample whitespace and strong typography',
      thumbnail: '/thumbnails/cta-creative-001.png'
    },
    {
      id: 'cta-creative-002',
      name: 'Visual Creation CTA',
      description: 'Left-aligned CTA on image background with dual actions',
      thumbnail: '/thumbnails/cta-creative-002.png'
    },
    {
      id: 'cta-creative-003',
      name: 'Dark Design CTA',
      description: 'Dark-mode CTA with right alignment and minimal UI',
      thumbnail: '/thumbnails/cta-creative-003.png'
    },
    {
      id: 'cta-startup-001',
      name: 'Launch CTA',
      description: 'SaaS startup CTA with dual actions, mono fonts, light tone',
      thumbnail: '/thumbnails/cta-startup-001.png'
    },
    {
      id: 'cta-startup-002',
      name: 'Scale CTA',
      description: 'Dark-mode focused layout with left-anchored gradient and early access language',
      thumbnail: '/thumbnails/cta-startup-002.png'
    },
    {
      id: 'cta-startup-003',
      name: 'Product Team CTA',
      description: 'SaaS product-style image CTA with right aligned typography and button',
      thumbnail: '/thumbnails/cta-startup-003.png'
    },
    {
      id: 'cta-startup-004',
      name: 'Developer CTA',
      description: 'Gradient tech-style CTA with dev/discord integrations and buttons',
      thumbnail: '/thumbnails/cta-startup-004.png'
    },
    {
      id: 'cta-ecom-001',
      name: 'Product Drop CTA',
      description: 'Gymshark-inspired launch banner with CTA-centered layout',
      thumbnail: '/thumbnails/cta-ecom-001.png'
    },
    {
      id: 'cta-ecom-002',
      name: 'Subscription CTA',
      description: 'Soft aesthetic, opt-in form style CTA with newsletter integration',
      thumbnail: '/thumbnails/cta-ecom-002.png'
    },
    {
      id: 'cta-ecom-003',
      name: 'Premium Product CTA',
      description: 'Minimalist dark background with high-contrast CTA button',
      thumbnail: '/thumbnails/cta-ecom-003.png'
    },
    {
      id: 'cta-flex-001',
      name: 'Creator CTA',
      description: 'Universal creator CTA block with balanced tone',
      thumbnail: '/thumbnails/cta-flex-001.png'
    },
    {
      id: 'cta-flex-002',
      name: 'Team Trial CTA',
      description: 'Business-style conversion CTA with dual paths and bright gradient',
      thumbnail: '/thumbnails/cta-flex-002.png'
    },
    {
      id: 'cta-flex-003',
      name: 'Support CTA',
      description: 'Support-oriented layout with human-centered photo + CTA',
      thumbnail: '/thumbnails/cta-flex-003.png'
    }
  ],
  fields: [
    {
      id: 'headline',
      name: 'headline',
      label: 'Headline',
      type: 'text',
      description: 'Main heading for the CTA',
      defaultValue: 'Ready to Get Started?'
    },
    {
      id: 'subheadline',
      name: 'subheadline', 
      label: 'Subheadline',
      type: 'textarea',
      description: 'Supporting text beneath the headline',
      defaultValue: 'Join thousands of satisfied customers using our platform.'
    },
    {
      id: 'ctaLabel',
      name: 'ctaLabel',
      label: 'CTA Button Label',
      type: 'text',
      description: 'Text for the primary call to action button',
      defaultValue: 'Get Started'
    },
    {
      id: 'ctaUrl',
      name: 'ctaUrl',
      label: 'CTA Button URL',
      type: 'text',
      description: 'URL for the primary call to action button',
      defaultValue: '/signup'
    },
    {
      id: 'secondaryCtaLabel',
      name: 'secondaryCtaLabel',
      label: 'Secondary CTA Label',
      type: 'text',
      description: 'Text for the secondary call to action (optional)',
      defaultValue: ''
    },
    {
      id: 'secondaryCtaUrl',
      name: 'secondaryCtaUrl',
      label: 'Secondary CTA URL',
      type: 'text',
      description: 'URL for the secondary call to action',
      defaultValue: ''
    },
    {
      id: 'backgroundStyle',
      name: 'backgroundStyle',
      label: 'Background Style',
      type: 'select',
      description: 'The background style of the CTA',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Gradient', value: 'gradient' },
        { label: 'Image', value: 'image' }
      ],
      defaultValue: 'light'
    },
    {
      id: 'alignment',
      name: 'alignment',
      label: 'Content Alignment',
      type: 'select',
      description: 'How the content should be aligned',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ],
      defaultValue: 'center'
    }
  ],
  defaultData: {
    id: '',
    type: 'cta',
    position: { x: 0, y: 0 },
    size: { width: 1200, height: 400 },
    zIndex: 1,
    sectionType: 'cta',
    componentVariant: 'cta-startup-001',
    name: 'Call to Action Section',
    data: {
      headline: 'Ready to Get Started?',
      subheadline: 'Join thousands of satisfied customers using our platform.',
      ctaLabel: 'Get Started',
      ctaUrl: '/signup',
      backgroundStyle: 'light',
      alignment: 'center'
    }
  }
};
