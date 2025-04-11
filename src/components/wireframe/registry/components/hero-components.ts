import { ComponentDefinition } from '../component-types';

export const heroComponents: ComponentDefinition = {
  type: 'hero',
  name: 'Hero Section',
  description: 'Eye-catching hero sections to capture visitor attention',
  category: 'landing',
  icon: 'layout',
  variants: [
    {
      id: 'hero-creative-001',
      name: 'Creative Hero',
      description: 'Creative-focused hero with bold typography',
      thumbnail: '/thumbnails/hero-creative-001.png'
    },
    {
      id: 'hero-creative-002',
      name: 'Studio Hero',
      description: 'Full-width image hero with overlay text',
      thumbnail: '/thumbnails/hero-creative-002.png'
    },
    {
      id: 'hero-creative-003',
      name: 'Editorial Hero',
      description: 'Text-driven editorial hero with serif fonts',
      thumbnail: '/thumbnails/hero-creative-003.png'
    },
    {
      id: 'hero-startup-001',
      name: 'Product Launch',
      description: 'SaaS-style hero with image and dual CTAs',
      thumbnail: '/thumbnails/hero-startup-001.png'
    },
    {
      id: 'hero-startup-002',
      name: 'Modern App',
      description: 'Dark mode hero with device mockup',
      thumbnail: '/thumbnails/hero-startup-002.png'
    },
    {
      id: 'hero-startup-003',
      name: 'Software Hero',
      description: 'Feature-focused hero with background gradient',
      thumbnail: '/thumbnails/hero-startup-003.png'
    },
    {
      id: 'hero-startup-004',
      name: 'Enterprise Hero',
      description: 'Corporate hero with trust badges',
      thumbnail: '/thumbnails/hero-startup-004.png'
    },
    {
      id: 'hero-ecom-001',
      name: 'Collection Launch',
      description: 'E-commerce hero with product focus',
      thumbnail: '/thumbnails/hero-ecom-001.png'
    },
    {
      id: 'hero-ecom-002',
      name: 'Product Spotlight',
      description: 'Clean product hero with lifestyle imagery',
      thumbnail: '/thumbnails/hero-ecom-002.png'
    },
    {
      id: 'hero-ecom-003',
      name: 'Premium Hero',
      description: 'High-end product hero with minimal design',
      thumbnail: '/thumbnails/hero-ecom-003.png'
    },
    {
      id: 'hero-flex-001',
      name: 'Personal Brand',
      description: 'Personal brand hero for coaches or creators',
      thumbnail: '/thumbnails/hero-flex-001.png'
    },
    {
      id: 'hero-flex-002',
      name: 'Course Launch',
      description: 'Educational hero for online courses',
      thumbnail: '/thumbnails/hero-flex-002.png'
    },
    {
      id: 'hero-flex-003',
      name: 'Freelancer Hero',
      description: 'Portfolio-style hero for freelancers',
      thumbnail: '/thumbnails/hero-flex-003.png'
    }
  ],
  fields: [
    {
      id: 'headline',
      name: 'headline',
      label: 'Headline',
      type: 'text',
      description: 'Main heading for the hero section',
      defaultValue: 'Elevate Your Digital Experience'
    },
    {
      id: 'subheadline',
      name: 'subheadline',
      label: 'Subheadline',
      type: 'textarea',
      description: 'Supporting text beneath the headline',
      defaultValue: 'A powerful platform designed to help you achieve your goals faster and with greater efficiency.'
    },
    {
      id: 'primaryCta',
      name: 'primaryCta',
      label: 'Primary CTA',
      type: 'text',
      description: 'Text for the primary call to action button',
      defaultValue: 'Get Started'
    },
    {
      id: 'secondaryCta',
      name: 'secondaryCta',
      label: 'Secondary CTA',
      type: 'text',
      description: 'Text for the secondary call to action button',
      defaultValue: 'Learn More'
    },
    {
      id: 'backgroundType',
      name: 'backgroundType',
      label: 'Background Type',
      type: 'select',
      description: 'The type of background for the hero',
      options: [
        { label: 'Color', value: 'color' },
        { label: 'Gradient', value: 'gradient' },
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Pattern', value: 'pattern' }
      ],
      defaultValue: 'color'
    },
    {
      id: 'heroImage',
      name: 'heroImage',
      label: 'Hero Image',
      type: 'image',
      description: 'Main image for the hero section',
      defaultValue: ''
    },
    {
      id: 'backgroundImage',
      name: 'backgroundImage',
      label: 'Background Image',
      type: 'image',
      description: 'Background image for the hero section',
      defaultValue: ''
    },
    {
      id: 'layout',
      name: 'layout',
      label: 'Layout',
      type: 'select',
      description: 'Layout pattern for the hero section',
      options: [
        { label: 'Side by Side', value: 'side-by-side' },
        { label: 'Text Over Image', value: 'text-over-image' },
        { label: 'Centered', value: 'centered' },
        { label: 'Split', value: 'split' }
      ],
      defaultValue: 'side-by-side'
    },
    {
      id: 'showTrustBadges',
      name: 'showTrustBadges',
      label: 'Show Trust Badges',
      type: 'boolean',
      description: 'Whether to display trust badges or logos',
      defaultValue: false
    }
  ],
  defaultData: {
    id: '',
    type: 'hero',
    position: { x: 0, y: 0 },
    size: { width: 1200, height: 600 },
    zIndex: 1,
    sectionType: 'hero',
    componentVariant: 'hero-startup-001',
    name: 'Hero Section',
    data: {
      headline: 'Elevate Your Digital Experience',
      subheadline: 'A powerful platform designed to help you achieve your goals faster and with greater efficiency.',
      primaryCta: 'Get Started',
      secondaryCta: 'Learn More',
      backgroundType: 'color',
      layout: 'side-by-side',
      showTrustBadges: true
    }
  }
};
