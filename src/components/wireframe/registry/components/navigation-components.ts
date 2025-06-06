
import { ComponentDefinition } from '../component-types';

export const navigationComponents: ComponentDefinition = {
  type: 'navigation',
  name: 'Navigation Bar',
  description: 'Site navigation with various layouts and options',
  category: 'navigation',
  icon: 'menu',
  variants: [
    {
      id: 'nav-startup-001',
      name: 'SaaS Navigation',
      description: 'Sticky SaaS nav with drawer menu and clean CTA hierarchy',
      thumbnail: '/thumbnails/nav-startup-001.png'
    },
    {
      id: 'nav-startup-002',
      name: 'Developer Navigation',
      description: 'Developer-oriented SaaS nav with built-in search and beta funnel',
      thumbnail: '/thumbnails/nav-startup-002.png'
    },
    {
      id: 'nav-startup-003',
      name: 'Gradient Navigation',
      description: 'Gradient startup nav with login CTA and high contrast',
      thumbnail: '/thumbnails/nav-startup-003.png'
    },
    {
      id: 'nav-startup-004',
      name: 'Hero Navigation',
      description: 'Hero-style nav with blurred image background and demo funnel',
      thumbnail: '/thumbnails/nav-startup-004.png'
    },
    {
      id: 'nav-ecom-001',
      name: 'Beauty Brand Navigation',
      description: 'Glossier-inspired beauty nav with soft colors and sticky UX',
      thumbnail: '/thumbnails/nav-ecom-001.png'
    },
    {
      id: 'nav-ecom-002',
      name: 'Fitness Navigation',
      description: 'Bold, Gymshark-style nav with cart CTA and category nav',
      thumbnail: '/thumbnails/nav-ecom-002.png'
    },
    {
      id: 'nav-ecom-003',
      name: 'Premium Navigation',
      description: 'Ultra-minimal Apple-style nav with icon focus and glass hover',
      thumbnail: '/thumbnails/nav-ecom-003.png'
    },
    {
      id: 'nav-flex-001',
      name: 'Coaching Navigation',
      description: 'Coaching-style nav with soft branding and session CTA',
      thumbnail: '/thumbnails/nav-flex-001.png'
    },
    {
      id: 'nav-flex-002',
      name: 'Education Navigation',
      description: 'Education-style nav for LMS or instructors',
      thumbnail: '/thumbnails/nav-flex-002.png'
    },
    {
      id: 'nav-flex-003',
      name: 'Freelancer Navigation',
      description: 'Freelancer-style nav with subtle image layer and project CTA',
      thumbnail: '/thumbnails/nav-flex-003.png'
    },
    {
      id: 'nav-food-001',
      name: 'Restaurant Navigation',
      description: 'Restaurant-style nav with glass effect and prominent order CTA',
      thumbnail: '/thumbnails/nav-food-001.png'
    },
    {
      id: 'nav-media-001',
      name: 'Media Portal Navigation',
      description: 'Media portal nav with category focus and prominent search',
      thumbnail: '/thumbnails/nav-media-001.png'
    },
    {
      id: 'nav-nonprofit-001',
      name: 'Nonprofit Navigation',
      description: 'Nonprofit navigation with mission focus and prominent donation CTA',
      thumbnail: '/thumbnails/nav-nonprofit-001.png'
    }
  ],
  fields: [
    {
      id: 'logo',
      name: 'logo',
      label: 'Logo',
      type: 'image',
      description: 'Logo image for the navigation',
      defaultValue: ''
    },
    {
      id: 'links',
      name: 'links',
      label: 'Navigation Links',
      type: 'array',
      description: 'Links to display in the navigation',
      defaultValue: [
        { label: 'Features', url: '/features' },
        { label: 'Pricing', url: '/pricing' },
        { label: 'About', url: '/about' }
      ]
    },
    {
      id: 'ctaLabel',
      name: 'ctaLabel',
      label: 'CTA Button Label',
      type: 'text',
      description: 'Text for the call to action button',
      defaultValue: 'Get Started'
    },
    {
      id: 'ctaUrl',
      name: 'ctaUrl',
      label: 'CTA Button URL',
      type: 'text',
      description: 'URL for the call to action button',
      defaultValue: '/signup'
    },
    {
      id: 'mobileMenuStyle',
      name: 'mobileMenuStyle',
      label: 'Mobile Menu Style',
      type: 'select',
      description: 'The style of menu on mobile devices',
      options: [
        { label: 'Drawer', value: 'drawer' },
        { label: 'Dropdown', value: 'dropdown' },
        { label: 'Overlay', value: 'overlay' }
      ],
      defaultValue: 'drawer'
    },
    {
      id: 'backgroundStyle',
      name: 'backgroundStyle',
      label: 'Background Style',
      type: 'select',
      description: 'The background style of the navigation',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Transparent', value: 'transparent' },
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
      description: 'How the navigation content should be aligned',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ],
      defaultValue: 'left'
    },
    {
      id: 'sticky',
      name: 'sticky',
      label: 'Sticky Navigation',
      type: 'boolean',
      description: 'Whether the navigation sticks to the top when scrolling',
      defaultValue: true
    },
    {
      id: 'hasSearch',
      name: 'hasSearch',
      label: 'Include Search',
      type: 'boolean',
      description: 'Whether to include a search input in the navigation',
      defaultValue: false
    }
  ],
  defaultData: {
    id: '',
    type: 'navigation',
    position: { x: 0, y: 0 },
    size: { width: 1200, height: 80 },
    zIndex: 10,
    sectionType: 'navigation',
    componentVariant: 'nav-startup-001',
    name: 'Navigation Bar',
    data: {
      logo: '/logo.svg',
      links: [
        { label: 'Features', url: '/features' },
        { label: 'Pricing', url: '/pricing' },
        { label: 'About', url: '/about' }
      ],
      ctaLabel: 'Get Started',
      ctaUrl: '/signup',
      mobileMenuStyle: 'drawer',
      backgroundStyle: 'light',
      alignment: 'left',
      sticky: true,
      hasSearch: false
    }
  }
};
