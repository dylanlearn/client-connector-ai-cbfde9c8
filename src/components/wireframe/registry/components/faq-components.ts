import { ComponentDefinition } from '../component-types';

export const faqComponents: ComponentDefinition = {
  type: 'faq',
  name: 'FAQ Section',
  description: 'Frequently asked questions with various layouts',
  category: 'content',
  icon: 'help-circle',
  variants: [
    {
      id: 'faq-creative-001',
      name: 'Curious Minds FAQ',
      description: 'Creative accordion with icon toggles and soft drop shadows',
      thumbnail: '/thumbnails/faq-creative-001.png'
    },
    {
      id: 'faq-creative-002',
      name: 'Studio FAQ',
      description: 'Creative grid layout with card-style Q&A and illustrations',
      thumbnail: '/thumbnails/faq-creative-002.png'
    },
    {
      id: 'faq-creative-003',
      name: 'Myths Debunked',
      description: 'Text-driven FAQ with editorial styling, serif fonts',
      thumbnail: '/thumbnails/faq-creative-003.png'
    },
    {
      id: 'faq-startup-001',
      name: 'Onboarding FAQ',
      description: 'Left-aligned accordion with clear spacing and mono-style fonts',
      thumbnail: '/thumbnails/faq-startup-001.png'
    },
    {
      id: 'faq-startup-002',
      name: 'Scaling Questions',
      description: 'Dark list-style layout ideal for high-level founders & investors',
      thumbnail: '/thumbnails/faq-startup-002.png'
    },
    {
      id: 'faq-startup-003',
      name: 'Developer FAQ',
      description: 'Right-aligned technical grid with two-line questions',
      thumbnail: '/thumbnails/faq-startup-003.png'
    },
    {
      id: 'faq-startup-004',
      name: 'Launch FAQ',
      description: 'Background image hero FAQ with onboarding focus',
      thumbnail: '/thumbnails/faq-startup-004.png'
    },
    {
      id: 'faq-ecom-001',
      name: 'Shipping & Returns',
      description: 'Simple FAQ styled after Gymshark & Glossier checkout pages',
      thumbnail: '/thumbnails/faq-ecom-001.png'
    },
    {
      id: 'faq-ecom-002',
      name: 'Product Questions',
      description: 'Grid FAQ below product gallery — Shopify-inspired',
      thumbnail: '/thumbnails/faq-ecom-002.png'
    },
    {
      id: 'faq-ecom-003',
      name: 'Orders & Tracking',
      description: 'Accordion with shipping icons and order status clarity',
      thumbnail: '/thumbnails/faq-ecom-003.png'
    },
    {
      id: 'faq-flex-001',
      name: 'Local Business FAQ',
      description: 'Great for salons, home services, freelancers',
      thumbnail: '/thumbnails/faq-flex-001.png'
    },
    {
      id: 'faq-flex-002',
      name: 'Course Support FAQ',
      description: 'Accordion + tags for learning systems or digital coaches',
      thumbnail: '/thumbnails/faq-flex-002.png'
    },
    {
      id: 'faq-flex-003',
      name: 'Miscellaneous Help',
      description: 'Utility layout for side projects or general info',
      thumbnail: '/thumbnails/faq-flex-003.png'
    }
  ],
  fields: [
    {
      id: 'title',
      name: 'Section Title',
      type: 'text',
      description: 'Main heading for the FAQ section',
      defaultValue: 'Frequently Asked Questions'
    },
    {
      id: 'subtitle',
      name: 'Section Subtitle',
      type: 'textarea',
      description: 'Supporting text beneath the title',
      defaultValue: 'Find answers to common questions about our platform.'
    },
    {
      id: 'faqType',
      name: 'FAQ Layout Type',
      type: 'select',
      description: 'The layout style of the FAQ items',
      options: [
        { label: 'Accordion', value: 'accordion' },
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' }
      ],
      defaultValue: 'accordion'
    },
    {
      id: 'animationStyle',
      name: 'Animation Style',
      type: 'select',
      description: 'The animation style for revealing answers',
      options: [
        { label: 'Expand', value: 'expand' },
        { label: 'Fade', value: 'fade' },
        { label: 'None', value: 'none' }
      ],
      defaultValue: 'expand'
    },
    {
      id: 'backgroundStyle',
      name: 'Background Style',
      type: 'select',
      description: 'The background style of the section',
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
      name: 'Content Alignment',
      type: 'select',
      description: 'How the content should be aligned',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ],
      defaultValue: 'left'
    }
  ],
  defaultData: {
    sectionType: 'faq',
    componentVariant: 'faq-startup-001',
    name: 'FAQ Section',
    data: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about our platform.',
      faqType: 'accordion',
      animationStyle: 'expand',
      backgroundStyle: 'light',
      alignment: 'left'
    }
  }
};
