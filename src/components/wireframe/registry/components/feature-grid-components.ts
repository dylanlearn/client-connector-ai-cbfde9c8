
import { ComponentDefinition } from '../component-registry';

export const featureGridComponents: ComponentDefinition = {
  type: 'feature',
  name: 'Feature Grid Section',
  description: 'Display product or service features in a grid layout',
  category: 'content',
  icon: 'layout-grid',
  variants: [
    {
      id: 'feature-creative-001',
      name: 'Creative Values Grid',
      description: 'Creative 3-column layout with abstract iconography',
      thumbnail: '/thumbnails/feature-creative-001.png'
    },
    {
      id: 'feature-creative-002',
      name: 'Interactive Features',
      description: '2-column layout with image previews of animations',
      thumbnail: '/thumbnails/feature-creative-002.png'
    },
    {
      id: 'feature-creative-003',
      name: 'Creative Stack Grid',
      description: 'Icon + headline cards with studio-style design',
      thumbnail: '/thumbnails/feature-creative-003.png'
    },
    {
      id: 'feature-startup-001',
      name: 'Startup Features',
      description: 'Grid layout with flat icons and consistent structure',
      thumbnail: '/thumbnails/feature-startup-001.png'
    },
    {
      id: 'feature-startup-002',
      name: 'Product Team Features',
      description: 'Side-aligned features with staggered icons',
      thumbnail: '/thumbnails/feature-startup-002.png'
    },
    {
      id: 'feature-startup-003',
      name: 'Builder Features',
      description: 'Feature checklist format with bright icons',
      thumbnail: '/thumbnails/feature-startup-003.png'
    },
    {
      id: 'feature-startup-004',
      name: 'Ship Features',
      description: 'Dark-themed feature banner with side-scroll',
      thumbnail: '/thumbnails/feature-startup-004.png'
    },
    {
      id: 'feature-ecom-001',
      name: 'Customer Benefits',
      description: 'Icon-focused 2-column layout with ecommerce tone',
      thumbnail: '/thumbnails/feature-ecom-001.png'
    },
    {
      id: 'feature-ecom-002',
      name: 'Product Features',
      description: 'Image card grid with soft tones and lifestyle visuals',
      thumbnail: '/thumbnails/feature-ecom-002.png'
    },
    {
      id: 'feature-ecom-003',
      name: 'Premium Features',
      description: 'Minimalist feature row with focus on typography',
      thumbnail: '/thumbnails/feature-ecom-003.png'
    },
    {
      id: 'feature-flex-001',
      name: 'Business Features',
      description: 'Universal service layout with badges',
      thumbnail: '/thumbnails/feature-flex-001.png'
    },
    {
      id: 'feature-flex-002',
      name: 'Education Features',
      description: 'Icon + text grid for online learning and coaching',
      thumbnail: '/thumbnails/feature-flex-002.png'
    },
    {
      id: 'feature-flex-003',
      name: 'Launch Features',
      description: 'Grid layout with image callouts and CTAs',
      thumbnail: '/thumbnails/feature-flex-003.png'
    }
  ],
  fields: [
    {
      id: 'title',
      name: 'Section Title',
      type: 'text',
      description: 'Main heading for the feature section',
      defaultValue: 'Our Features'
    },
    {
      id: 'subtitle',
      name: 'Section Subtitle',
      type: 'textarea',
      description: 'Supporting text beneath the title',
      defaultValue: 'Discover what makes our product special.'
    },
    {
      id: 'columns',
      name: 'Number of Columns',
      type: 'select',
      description: 'Number of columns in the feature grid',
      options: [
        { label: '2 Columns', value: 2 },
        { label: '3 Columns', value: 3 },
        { label: '4 Columns', value: 4 }
      ],
      defaultValue: 3
    },
    {
      id: 'mediaType',
      name: 'Media Type',
      type: 'select',
      description: 'Type of media to display with features',
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
    sectionType: 'feature',
    componentVariant: 'feature-startup-001',
    name: 'Feature Grid Section',
    data: {
      title: 'Why Choose Us',
      subtitle: 'Discover what makes our product special.',
      columns: 3,
      mediaType: 'icon',
      backgroundStyle: 'light',
      alignment: 'center'
    }
  }
};
