
import { ComponentDefinition } from '../component-types';

export const footerComponents: ComponentDefinition = {
  type: 'footer',
  name: 'Footer Section',
  description: 'Site footer with various layouts and content options',
  category: 'navigation',
  icon: 'layout-grid',
  variants: [
    {
      id: 'footer-creative-001',
      name: 'Avant-garde Footer',
      description: 'Asymmetrical columns with pastel gradients',
      thumbnail: '/thumbnails/footer-creative-001.png'
    },
    {
      id: 'footer-creative-002',
      name: 'Split-screen Footer',
      description: 'Video background with funky navigation',
      thumbnail: '/thumbnails/footer-creative-002.png'
    },
    {
      id: 'footer-creative-003',
      name: 'Editorial Footer',
      description: 'Column-free with horizontal scroll for links',
      thumbnail: '/thumbnails/footer-creative-003.png'
    },
    {
      id: 'footer-startup-001',
      name: 'SaaS Footer',
      description: '3-column footer with product links and legal',
      thumbnail: '/thumbnails/footer-startup-001.png'
    },
    {
      id: 'footer-startup-002',
      name: 'Developer Footer',
      description: 'Dark-mode with Discord + Docs CTA',
      thumbnail: '/thumbnails/footer-startup-002.png'
    },
    {
      id: 'footer-startup-003',
      name: 'Gradient Hero Footer',
      description: 'Minimal with newsletter focus',
      thumbnail: '/thumbnails/footer-startup-003.png'
    },
    {
      id: 'footer-startup-004',
      name: 'Visual Product Footer',
      description: 'Product collage background and split newsletter',
      thumbnail: '/thumbnails/footer-startup-004.png'
    },
    {
      id: 'footer-ecom-001',
      name: 'Gymshark-style Footer',
      description: 'Bold footer with category links and order support',
      thumbnail: '/thumbnails/footer-ecom-001.png'
    },
    {
      id: 'footer-ecom-002',
      name: 'Glossier-style Footer',
      description: 'Clean with newsletter and brand tone',
      thumbnail: '/thumbnails/footer-ecom-002.png'
    },
    {
      id: 'footer-ecom-003',
      name: 'Apple-style Footer',
      description: 'Minimalist layout with device navs',
      thumbnail: '/thumbnails/footer-ecom-003.png'
    },
    {
      id: 'footer-flex-001',
      name: 'Personal Brand Footer',
      description: 'Coaching layout with email opt-in',
      thumbnail: '/thumbnails/footer-flex-001.png'
    },
    {
      id: 'footer-flex-002',
      name: 'LMS Footer',
      description: 'Visual branding and compact sitemap',
      thumbnail: '/thumbnails/footer-flex-002.png'
    },
    {
      id: 'footer-flex-003',
      name: 'Freelancer Footer',
      description: 'Compact with anchor nav and project CTA',
      thumbnail: '/thumbnails/footer-flex-003.png'
    }
  ],
  fields: [
    {
      id: 'logo',
      name: 'logo',
      label: 'Logo',
      type: 'image',
      description: 'Footer logo image',
      defaultValue: ''
    },
    {
      id: 'backgroundStyle',
      name: 'backgroundStyle',
      label: 'Background Style',
      type: 'select',
      description: 'The background style of the footer',
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
    },
    {
      id: 'showSocialIcons',
      name: 'showSocialIcons',
      label: 'Show Social Icons',
      type: 'boolean',
      description: 'Whether to display social media icons',
      defaultValue: true
    },
    {
      id: 'showLegalLinks',
      name: 'showLegalLinks',
      label: 'Show Legal Links',
      type: 'boolean',
      description: 'Whether to display legal/copyright links',
      defaultValue: true
    }
  ],
  defaultData: {
    id: '',
    type: 'footer',
    position: { x: 0, y: 0 },
    size: { width: 1200, height: 300 },
    zIndex: 1,
    sectionType: 'footer',
    componentVariant: 'footer-startup-001',
    name: 'Footer Section',
    data: {
      backgroundStyle: 'light',
      alignment: 'center',
      showSocialIcons: true,
      showLegalLinks: true
    }
  }
};
