
import { ComponentDefinition } from '../component-registry';

export const contactComponents: ComponentDefinition = {
  type: 'contact',
  name: 'Contact Section',
  description: 'A contact form section with various layout options',
  category: 'form',
  icon: 'mail',
  variants: [
    {
      id: 'contact-startup-001',
      name: 'Standard Contact',
      description: 'Clean contact form with contact info',
      thumbnail: '/thumbnails/contact-startup-001.png'
    },
    {
      id: 'contact-creative-001',
      name: 'Creative Collaboration',
      description: 'Creative layout with soft background',
      thumbnail: '/thumbnails/contact-creative-001.png'
    },
    {
      id: 'contact-creative-002',
      name: 'Say Hello',
      description: 'Gradient card layout with social links',
      thumbnail: '/thumbnails/contact-creative-002.png'
    },
    {
      id: 'contact-creative-003',
      name: 'Book a Session',
      description: 'Split background image contact layout',
      thumbnail: '/thumbnails/contact-creative-003.png'
    },
    {
      id: 'contact-startup-002',
      name: 'Technical Contact',
      description: 'Dark UI for technical SaaS contact',
      thumbnail: '/thumbnails/contact-startup-002.png'
    },
    {
      id: 'contact-startup-003',
      name: 'Feedback Form',
      description: 'Gradient SaaS contact with map',
      thumbnail: '/thumbnails/contact-startup-003.png'
    },
    {
      id: 'contact-startup-004',
      name: 'Enterprise Inquiries',
      description: 'Image-backed form for enterprise leads',
      thumbnail: '/thumbnails/contact-startup-004.png'
    },
    {
      id: 'contact-ecom-001',
      name: 'Customer Support',
      description: 'Support form with order number',
      thumbnail: '/thumbnails/contact-ecom-001.png'
    },
    {
      id: 'contact-ecommerce-001',
      name: 'E-commerce Support',
      description: 'Clean support form for e-commerce sites',
      thumbnail: '/thumbnails/contact-ecommerce-001.png'
    },
    {
      id: 'contact-ecom-002',
      name: 'Ask Us Anything',
      description: 'Minimal form with soft tone',
      thumbnail: '/thumbnails/contact-ecom-002.png'
    },
    {
      id: 'contact-ecom-003',
      name: 'Expert Contact',
      description: 'Photo-forward support layout',
      thumbnail: '/thumbnails/contact-ecom-003.png'
    },
    {
      id: 'contact-flex-001',
      name: 'Work Together',
      description: 'Freelancer contact block with service dropdown',
      thumbnail: '/thumbnails/contact-flex-001.png'
    },
    {
      id: 'contact-flex-002',
      name: 'Community Contact',
      description: 'Community-driven contact form',
      thumbnail: '/thumbnails/contact-flex-002.png'
    },
    {
      id: 'contact-flex-003',
      name: 'Simple Question',
      description: 'Simple, approachable contact block',
      thumbnail: '/thumbnails/contact-flex-003.png'
    }
  ],
  fields: [
    {
      id: 'headline',
      name: 'Headline',
      type: 'text',
      description: 'Main heading for the contact section',
      defaultValue: 'Get in Touch'
    },
    {
      id: 'subheadline',
      name: 'Subheadline',
      type: 'textarea',
      description: 'Supporting text beneath the headline',
      defaultValue: "We'd love to hear from you. Fill out the form and we'll get back to you soon."
    },
    {
      id: 'ctaLabel',
      name: 'Button Label',
      type: 'text',
      description: 'Text for the form submit button',
      defaultValue: 'Send Message'
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
      id: 'showMap',
      name: 'Show Map',
      type: 'boolean',
      description: 'Whether to display a map',
      defaultValue: false
    }
  ],
  defaultData: {
    sectionType: 'contact',
    componentVariant: 'contact-startup-001',
    name: 'Contact Section',
    data: {
      headline: 'Get in Touch',
      subheadline: "We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.",
      ctaLabel: 'Send Message',
      backgroundStyle: 'light',
      alignment: 'left',
      showMap: false
    }
  }
};
