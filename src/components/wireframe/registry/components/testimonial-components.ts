
import { ComponentDefinition } from '../component-registry';

export const testimonialComponents: ComponentDefinition = {
  type: 'testimonial',
  name: 'Testimonial Section',
  description: 'Customer testimonials and social proof',
  category: 'content',
  icon: 'quote',
  variants: [
    {
      id: 'testimonial-creative-001',
      name: 'Creative Community Testimonials',
      description: 'Card-style layout with overlapping avatars and bold type',
      thumbnail: '/thumbnails/testimonial-creative-001.png'
    },
    {
      id: 'testimonial-creative-002',
      name: 'Moving Words Testimonial',
      description: 'Overlay testimonial on image background, elegant serif fonts',
      thumbnail: '/thumbnails/testimonial-creative-002.png'
    },
    {
      id: 'testimonial-creative-003',
      name: 'Studio Stories',
      description: 'Horizontal scrolling testimonial carousel with logo overlays',
      thumbnail: '/thumbnails/testimonial-creative-003.png'
    },
    {
      id: 'testimonial-startup-001',
      name: 'Founder Trust',
      description: 'Left-aligned stacked layout with logo badges',
      thumbnail: '/thumbnails/testimonial-startup-001.png'
    },
    {
      id: 'testimonial-startup-002',
      name: 'Startup Approval',
      description: 'Grid layout with mono-style font and avatars',
      thumbnail: '/thumbnails/testimonial-startup-002.png'
    },
    {
      id: 'testimonial-startup-003',
      name: 'Accelerated Teams',
      description: 'Slider layout with bold headings and pull quotes',
      thumbnail: '/thumbnails/testimonial-startup-003.png'
    },
    {
      id: 'testimonial-startup-004',
      name: 'Performance Proof',
      description: 'Image-overlay block quote with translucent background',
      thumbnail: '/thumbnails/testimonial-startup-004.png'
    },
    {
      id: 'testimonial-ecom-001',
      name: 'Customer Reviews',
      description: 'Product review-style cards with customer avatars',
      thumbnail: '/thumbnails/testimonial-ecom-001.png'
    },
    {
      id: 'testimonial-ecom-002',
      name: 'Real Customer Style',
      description: 'Lifestyle testimonials with photo-first layouts (Glossier-style)',
      thumbnail: '/thumbnails/testimonial-ecom-002.png'
    },
    {
      id: 'testimonial-ecom-003',
      name: 'Trusted Product',
      description: 'Clean testimonial layout with optional rating or icons',
      thumbnail: '/thumbnails/testimonial-ecom-003.png'
    },
    {
      id: 'testimonial-flex-001',
      name: 'Client Stories',
      description: 'Testimonial + author image + brief summary card',
      thumbnail: '/thumbnails/testimonial-flex-001.png'
    },
    {
      id: 'testimonial-flex-002',
      name: 'Nonprofit Voices',
      description: 'Simple center-aligned block quotes with organization logos',
      thumbnail: '/thumbnails/testimonial-flex-002.png'
    },
    {
      id: 'testimonial-flex-003',
      name: 'Local Client Results',
      description: 'Side-by-side layout with bold testimonial and author image',
      thumbnail: '/thumbnails/testimonial-flex-003.png'
    }
  ],
  fields: [
    {
      id: 'title',
      name: 'Section Title',
      type: 'text',
      description: 'Main heading for the testimonial section',
      defaultValue: 'What Our Customers Say'
    },
    {
      id: 'subtitle',
      name: 'Section Subtitle',
      type: 'textarea',
      description: 'Supporting text beneath the title',
      defaultValue: 'Hear from the people who use our product every day.'
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      type: 'array',
      description: 'The testimonials to display',
      defaultValue: [
        {
          quote: 'This product has completely transformed our workflow.',
          author: 'Jane Doe',
          role: 'Product Manager',
          avatar: '/avatars/jane.png'
        },
        {
          quote: 'We saw a 40% increase in productivity after implementing this solution.',
          author: 'John Smith',
          role: 'CTO',
          avatar: '/avatars/john.png'
        }
      ]
    },
    {
      id: 'mediaType',
      name: 'Media Type',
      type: 'select',
      description: 'Type of media to display with testimonials',
      options: [
        { label: 'Avatar', value: 'avatar' },
        { label: 'Logo', value: 'logo' },
        { label: 'None', value: 'none' }
      ],
      defaultValue: 'avatar'
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
    sectionType: 'testimonial',
    componentVariant: 'testimonial-startup-001',
    name: 'Testimonial Section',
    data: {
      title: 'What Our Customers Say',
      subtitle: 'Hear from the people who use our product every day.',
      testimonials: [
        {
          quote: 'This product has completely transformed our workflow.',
          author: 'Jane Doe',
          role: 'Product Manager',
          avatar: '/avatars/jane.png'
        },
        {
          quote: 'We saw a 40% increase in productivity after implementing this solution.',
          author: 'John Smith',
          role: 'CTO',
          avatar: '/avatars/john.png'
        }
      ],
      mediaType: 'avatar',
      backgroundStyle: 'light',
      alignment: 'center'
    }
  }
};
