
import { ComponentDefinition } from '../component-types';
import blogVariants from '@/data/component-library-variants-blog';

export const blogComponents: ComponentDefinition = {
  type: 'blog',
  name: 'Blog Section',
  description: 'Blog post listings in various layouts',
  category: 'content',
  icon: 'newspaper',
  variants: [
    {
      id: 'blog-startup-001',
      name: 'Latest Updates',
      description: 'Modern grid layout with card shadows and hover effects',
      thumbnail: '/thumbnails/blog-startup-001.png'
    },
    {
      id: 'blog-creative-001',
      name: 'The Journal',
      description: 'Centered gradient layout with creative branding, stacked thumbnails, and layered text',
      thumbnail: '/thumbnails/blog-creative-001.png'
    },
    {
      id: 'blog-creative-002',
      name: 'Studio Dispatch',
      description: 'Visually-driven creative blog slider with large fonts and mixed media',
      thumbnail: '/thumbnails/blog-creative-002.png'
    },
    {
      id: 'blog-creative-003',
      name: 'Field Notes',
      description: 'Minimalist, dark-mode editorial layout with no categories or summaries — just vibes',
      thumbnail: '/thumbnails/blog-creative-003.png'
    },
    {
      id: 'blog-startup-002',
      name: 'Engineering Deep Dives',
      description: 'Technical SaaS blog layout with minimalist theme and dev focus',
      thumbnail: '/thumbnails/blog-startup-002.png'
    },
    {
      id: 'blog-startup-003',
      name: 'The Startup Journal',
      description: 'Gradient-backed story slider — great for YC/startup blogs',
      thumbnail: '/thumbnails/blog-startup-003.png'
    },
    {
      id: 'blog-startup-004',
      name: 'Insights Hub',
      description: 'Image-heavy grid layout styled for marketing and growth blogs',
      thumbnail: '/thumbnails/blog-startup-004.png'
    },
    {
      id: 'blog-ecom-001',
      name: 'The Fit Edit',
      description: 'Glossier/Gymshark-inspired grid for shoppable content',
      thumbnail: '/thumbnails/blog-ecom-001.png'
    },
    {
      id: 'blog-ecom-002',
      name: 'In the Press',
      description: 'Dark editorial press-style layout with minimal markup',
      thumbnail: '/thumbnails/blog-ecom-002.png'
    },
    {
      id: 'blog-ecom-003',
      name: 'Behind the Brand',
      description: 'Lifestyle-style slider for storytelling with product overlap',
      thumbnail: '/thumbnails/blog-ecom-003.png'
    },
    {
      id: 'blog-flex-001',
      name: 'What\'s New',
      description: 'General-purpose blog layout ideal for portfolios or consultants',
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
      name: 'Founder\'s Notes',
      description: 'Carousel-driven, personal blog layout for creators or indie founders',
      thumbnail: '/thumbnails/blog-flex-003.png'
    }
  ],
  fields: [
    {
      id: 'headline',
      name: 'Headline',
      type: 'text',
      description: 'Main heading for the blog section',
      defaultValue: 'Latest Updates'
    },
    {
      id: 'description',
      name: 'Description',
      type: 'textarea',
      description: 'Supporting text beneath the headline',
      defaultValue: 'Stay up-to-date with our latest news and product updates.'
    },
    {
      id: 'layoutStyle',
      name: 'Layout Style',
      type: 'select',
      description: 'The layout style for blog posts',
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
      defaultValue: 'center'
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
    data: {
      headline: 'Latest Updates',
      description: 'Stay up-to-date with our latest news and product updates',
      layoutStyle: 'grid',
      backgroundStyle: 'light',
      alignment: 'center',
      showCategories: true,
      showAuthors: true
    }
  }
};
