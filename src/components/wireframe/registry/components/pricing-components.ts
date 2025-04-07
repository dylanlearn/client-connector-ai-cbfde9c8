
import { ComponentDefinition } from '../component-registry';

export const pricingComponents: ComponentDefinition = {
  type: 'pricing',
  name: 'Pricing Section',
  description: 'Pricing tables and plan comparisons',
  category: 'commerce',
  icon: 'credit-card',
  variants: [
    {
      id: 'pricing-creative-001',
      name: 'Simple Pricing',
      description: 'Creative layout with clean columns and optional iconography',
      thumbnail: '/thumbnails/pricing-creative-001.png'
    },
    {
      id: 'pricing-creative-002',
      name: 'Flexible Teams Pricing',
      description: 'Dark layout with alternating visual backgrounds per plan',
      thumbnail: '/thumbnails/pricing-creative-002.png'
    },
    {
      id: 'pricing-creative-003',
      name: 'Scale Pricing',
      description: 'Creative background image and stacked layout with visual tiering',
      thumbnail: '/thumbnails/pricing-creative-003.png'
    },
    {
      id: 'pricing-startup-001',
      name: 'Launch Pricing',
      description: 'Straightforward layout with large CTAs, great for MVPs',
      thumbnail: '/thumbnails/pricing-startup-001.png'
    },
    {
      id: 'pricing-startup-002',
      name: 'Multi-stage Pricing',
      description: 'Table layout with aligned rows for feature comparison',
      thumbnail: '/thumbnails/pricing-startup-002.png'
    },
    {
      id: 'pricing-startup-003',
      name: 'Simple Price',
      description: 'Single-column plan focused on early-stage clarity',
      thumbnail: '/thumbnails/pricing-startup-003.png'
    },
    {
      id: 'pricing-startup-004',
      name: 'Flexible Billing',
      description: 'Split layout with pricing and FAQ side-by-side',
      thumbnail: '/thumbnails/pricing-startup-004.png'
    },
    {
      id: 'pricing-ecom-001',
      name: 'Product Pricing',
      description: 'Inspired by Shopify templates — classic two-column layout with product icons',
      thumbnail: '/thumbnails/pricing-ecom-001.png'
    },
    {
      id: 'pricing-ecom-002',
      name: 'Subscription Pricing',
      description: 'Image-driven layout with soft tones, inspired by Glossier',
      thumbnail: '/thumbnails/pricing-ecom-002.png'
    },
    {
      id: 'pricing-ecom-003',
      name: 'Premium Pricing',
      description: 'Sleek, minimal layout styled after Apple checkout plans',
      thumbnail: '/thumbnails/pricing-ecom-003.png'
    },
    {
      id: 'pricing-flex-001',
      name: 'Education Pricing',
      description: 'Educational platform-style table with simplified plan types',
      thumbnail: '/thumbnails/pricing-flex-001.png'
    },
    {
      id: 'pricing-flex-002',
      name: 'Service Pricing',
      description: 'Local business style, left-aligned text and service descriptions',
      thumbnail: '/thumbnails/pricing-flex-002.png'
    },
    {
      id: 'pricing-flex-003',
      name: 'Nonprofit Pricing',
      description: 'Donation-style tiering with CTA for contact',
      thumbnail: '/thumbnails/pricing-flex-003.png'
    }
  ],
  fields: [
    {
      id: 'title',
      name: 'Section Title',
      type: 'text',
      description: 'Main heading for the pricing section',
      defaultValue: 'Simple, Transparent Pricing'
    },
    {
      id: 'description',
      name: 'Section Description',
      type: 'textarea',
      description: 'Supporting text beneath the title',
      defaultValue: 'No hidden fees. No surprises. Just straightforward pricing.'
    },
    {
      id: 'plans',
      name: 'Pricing Plans',
      type: 'array',
      description: 'The pricing plans to display',
      defaultValue: [
        {
          name: 'Starter',
          price: '$12/mo',
          features: ['1 Project', 'Community Support'],
          cta: { label: 'Get Started', url: '/signup' }
        },
        {
          name: 'Pro',
          price: '$24/mo',
          features: ['5 Projects', 'Priority Support'],
          cta: { label: 'Choose Plan', url: '/pro' },
          badge: 'Most Popular'
        }
      ]
    },
    {
      id: 'mediaType',
      name: 'Media Type',
      type: 'select',
      description: 'Type of media to display with pricing plans',
      options: [
        { label: 'Icon', value: 'icon' },
        { label: 'Image', value: 'image' },
        { label: 'None', value: 'none' }
      ],
      defaultValue: 'icon'
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
      defaultValue: 'center'
    }
  ],
  defaultData: {
    sectionType: 'pricing',
    componentVariant: 'pricing-startup-001',
    name: 'Pricing Section',
    data: {
      title: 'Simple, Transparent Pricing',
      description: 'No hidden fees. No surprises. Just straightforward pricing.',
      plans: [
        {
          name: 'Starter',
          price: '$12/mo',
          features: ['1 Project', 'Community Support'],
          cta: { label: 'Get Started', url: '/signup' }
        },
        {
          name: 'Pro',
          price: '$24/mo',
          features: ['5 Projects', 'Priority Support'],
          cta: { label: 'Choose Plan', url: '/pro' },
          badge: 'Most Popular'
        }
      ],
      mediaType: 'icon',
      backgroundStyle: 'light',
      alignment: 'center'
    }
  }
};
