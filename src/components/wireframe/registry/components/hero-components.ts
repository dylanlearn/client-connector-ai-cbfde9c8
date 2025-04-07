
import { ComponentDefinition } from '../component-registry';

export const heroComponents: ComponentDefinition = {
  type: 'hero',
  name: 'Hero Section',
  description: 'Impactful hero sections for landing pages',
  category: 'layout',
  icon: 'layout',
  variants: [
    {
      id: 'hero-creative-001',
      name: 'Creative Studio Hero',
      description: 'Bold typography with abstract shapes background',
      thumbnail: '/thumbnails/hero-creative-001.png'
    },
    {
      id: 'hero-creative-002',
      name: 'Visual Portfolio Hero',
      description: 'Fullscreen image/video with overlay text',
      thumbnail: '/thumbnails/hero-creative-002.png'
    },
    {
      id: 'hero-creative-003',
      name: 'Agency Splash Hero',
      description: 'Dynamic animated hero with horizontal scroll effect',
      thumbnail: '/thumbnails/hero-creative-003.png'
    },
    {
      id: 'hero-startup-001',
      name: 'Product Launch Hero',
      description: 'Clean SaaS hero with image and dual CTAs',
      thumbnail: '/thumbnails/hero-startup-001.png'
    },
    {
      id: 'hero-startup-002',
      name: 'Tech Dashboard Hero',
      description: 'Feature-focused hero with dashboard preview',
      thumbnail: '/thumbnails/hero-startup-002.png'
    },
    {
      id: 'hero-startup-003',
      name: 'App Showcase Hero',
      description: 'Mobile app preview with gradient background',
      thumbnail: '/thumbnails/hero-startup-003.png'
    },
    {
      id: 'hero-startup-004',
      name: 'B2B Enterprise Hero',
      description: 'Professional hero section with trust badges and testimonials',
      thumbnail: '/thumbnails/hero-startup-004.png'
    },
    {
      id: 'hero-ecom-001',
      name: 'Product Collection Hero',
      description: 'Gymshark-inspired hero with product highlights',
      thumbnail: '/thumbnails/hero-ecom-001.png'
    },
    {
      id: 'hero-ecom-002',
      name: 'Lifestyle Product Hero',
      description: 'Glossier-style hero with product spotlights',
      thumbnail: '/thumbnails/hero-ecom-002.png'
    },
    {
      id: 'hero-ecom-003',
      name: 'Premium Showcase Hero',
      description: 'Apple-inspired minimal hero with product focus',
      thumbnail: '/thumbnails/hero-ecom-003.png'
    },
    {
      id: 'hero-flex-001',
      name: 'Personal Brand Hero',
      description: 'Coach/consultant hero with clear value proposition',
      thumbnail: '/thumbnails/hero-flex-001.png'
    },
    {
      id: 'hero-flex-002',
      name: 'Education Platform Hero',
      description: 'Course/learning platform with social proof',
      thumbnail: '/thumbnails/hero-flex-002.png'
    },
    {
      id: 'hero-flex-003',
      name: 'Freelancer Portfolio Hero',
      description: 'Minimal portfolio hero with project highlights',
      thumbnail: '/thumbnails/hero-flex-003.png'
    }
  ],
  fields: [
    {
      id: 'headline',
      name: 'Headline',
      type: 'text',
      description: 'Main heading for the hero section',
      defaultValue: 'Your Compelling Headline Here'
    },
    {
      id: 'subheadline',
      name: 'Subheadline',
      type: 'textarea',
      description: 'Supporting text beneath the headline',
      defaultValue: 'A clear, concise explanation of your value proposition.'
    },
    {
      id: 'primaryCta',
      name: 'Primary CTA',
      type: 'text',
      description: 'Text for the primary call to action button',
      defaultValue: 'Get Started'
    },
    {
      id: 'secondaryCta',
      name: 'Secondary CTA',
      type: 'text',
      description: 'Text for the secondary call to action button (optional)',
      defaultValue: 'Learn More'
    },
    {
      id: 'backgroundType',
      name: 'Background Type',
      type: 'select',
      description: 'The type of background for the hero section',
      options: [
        { label: 'Solid Color', value: 'color' },
        { label: 'Gradient', value: 'gradient' },
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' }
      ],
      defaultValue: 'color'
    },
    {
      id: 'backgroundImage',
      name: 'Background Image',
      type: 'image',
      description: 'Background image for the hero section',
      defaultValue: ''
    },
    {
      id: 'heroImage',
      name: 'Hero Image',
      type: 'image',
      description: 'Main image or illustration for the hero section',
      defaultValue: ''
    },
    {
      id: 'layout',
      name: 'Layout',
      type: 'select',
      description: 'The layout of the hero content',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Split (Text Left)', value: 'split-left' },
        { label: 'Split (Text Right)', value: 'split-right' }
      ],
      defaultValue: 'center'
    },
    {
      id: 'showTrustBadges',
      name: 'Show Trust Badges',
      type: 'boolean',
      description: 'Whether to display customer/partner logos',
      defaultValue: false
    }
  ],
  defaultData: {
    sectionType: 'hero',
    componentVariant: 'hero-startup-001',
    name: 'Hero Section',
    data: {
      headline: 'Your Compelling Headline Here',
      subheadline: 'A clear, concise explanation of your value proposition.',
      primaryCta: 'Get Started',
      secondaryCta: 'Learn More',
      backgroundType: 'color',
      layout: 'split-left',
      showTrustBadges: true
    }
  }
};
