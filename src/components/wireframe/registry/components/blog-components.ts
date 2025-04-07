
import { ComponentDefinition } from '../component-registry';

export const blogComponents: ComponentDefinition = {
  type: 'blog',
  name: 'Blog Section',
  description: 'Display your latest articles and posts',
  category: 'content',
  icon: 'file-text',
  variants: [
    {
      id: 'blog-startup-001',
      name: 'Startup Blog Grid',
      description: 'Modern grid layout with card shadows and hover effects',
      thumbnail: '/thumbnails/blog-startup-001.png'
    },
    {
      id: 'blog-creative-001',
      name: 'Creative Journal',
      description: 'Centered gradient layout with creative branding',
      thumbnail: '/thumbnails/blog-creative-001.png'
    },
    {
      id: 'blog-creative-002',
      name: 'Studio Dispatch',
      description: 'Visually-driven creative blog slider',
      thumbnail: '/thumbnails/blog-creative-002.png'
    },
    {
      id: 'blog-creative-003',
      name: 'Minimal Field Notes',
      description: 'Minimalist, dark-mode editorial layout',
      thumbnail: '/thumbnails/blog-creative-003.png'
    },
    {
      id: 'blog-startup-002',
      name: 'Engineering Blog',
      description: 'Technical SaaS blog layout with minimalist theme',
      thumbnail: '/thumbnails/blog-startup-002.png'
    },
    {
      id: 'blog-startup-003',
      name: 'Startup Journal',
      description: 'Gradient-backed story slider',
      thumbnail: '/thumbnails/blog-startup-003.png'
    },
    {
      id: 'blog-startup-004',
      name: 'Insights Hub',
      description: 'Image-heavy grid layout for marketing blogs',
      thumbnail: '/thumbnails/blog-startup-004.png'
    },
    {
      id: 'blog-ecom-001',
      name: 'Product Blog',
      description: 'Shoppable content grid layout',
      thumbnail: '/thumbnails/blog-ecom-001.png'
    },
    {
      id: 'blog-ecom-002',
      name: 'Press Coverage',
      description: 'Dark editorial press-style layout',
      thumbnail: '/thumbnails/blog-ecom-002.png'
    },
    {
      id: 'blog-ecom-003',
      name: 'Brand Story',
      description: 'Lifestyle slider for storytelling',
      thumbnail: '/thumbnails/blog-ecom-003.png'
    },
    {
      id: 'blog-flex-001',
      name: 'Simple Updates',
      description: 'General-purpose blog layout',
      thumbnail: '/thumbnails/blog-flex-001.png'
    },
    {
      id: 'blog-flex-002',
      name: 'Resource Library',
      description: 'Utility-first layout for blog-as-resource-hub',
      thumbnail: '/thumbnails/blog-flex-002.png'
    },
    {
      id: 'blog-flex-003',
      name: 'Founder Notes',
      description: 'Personal blog layout for creators',
      thumbnail: '/thumbnails/blog-flex-003.png'
    }
  ],
  fields: [
    {
      id: 'headline',
      name: 'Headline',
      type: 'text',
      description: 'Main heading for the blog section',
      defaultValue: 'Latest Articles'
    },
    {
      id: 'description',
      name: 'Description',
      type: 'textarea',
      description: 'Brief description or introduction for the blog section',
      defaultValue: 'Stay up-to-date with our latest news and insights'
    },
    {
      id: 'layoutStyle',
      name: 'Layout Style',
      type: 'select',
      description: 'How the blog posts should be arranged',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Carousel', value: 'carousel' }
      ],
      defaultValue: 'grid'
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
    },
    {
      id: 'showCategories',
      name: 'Show Categories',
      type: 'boolean',
      description: 'Whether to display post categories',
      defaultValue: true
    },
    {
      id: 'showAuthors',
      name: 'Show Authors',
      type: 'boolean',
      description: 'Whether to display post authors',
      defaultValue: true
    }
  ],
  defaultData: {
    sectionType: 'blog',
    componentVariant: 'blog-startup-001',
    name: 'Blog Section',
    headline: 'Latest Updates',
    description: 'Stay up-to-date with our latest news and product updates',
    layoutStyle: 'grid',
    backgroundStyle: 'light',
    alignment: 'center',
    showCategories: true,
    showAuthors: true
  }
};
