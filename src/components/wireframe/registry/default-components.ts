
import { ComponentDefinition } from './component-registry';
import { v4 as uuidv4 } from 'uuid';

/**
 * Default component definitions for the wireframe editor
 */
export const defaultComponents: ComponentDefinition[] = [
  // Hero section
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Main banner section at the top of a page',
    category: 'content',
    icon: 'layout',
    variants: [
      { id: 'hero-centered', name: 'Centered Hero', description: 'Content centered with optional image' },
      { id: 'hero-split', name: 'Split Hero', description: 'Content on left, media on right' }
    ],
    fields: [
      { id: 'headline', name: 'Headline', type: 'text', description: 'Main heading text' },
      { id: 'subheadline', name: 'Subheadline', type: 'textarea', description: 'Supporting text below headline' },
      { id: 'cta', name: 'Call to Action', type: 'text', description: 'Primary button text' }
    ],
    defaultData: {
      id: uuidv4(),
      name: 'Hero Section',
      sectionType: 'hero',
      componentVariant: 'hero-centered',
      data: {
        headline: 'Welcome to our platform',
        subheadline: 'The easiest way to build amazing websites',
        cta: { label: 'Get Started', url: '#' },
        ctaSecondary: { label: 'Learn More', url: '#' },
        backgroundStyle: 'light',
        alignment: 'center',
        mediaType: 'image',
        image: '/placeholder.svg'
      }
    }
  },
  // Feature section
  {
    type: 'feature-grid',
    name: 'Feature Grid',
    description: 'Grid of features or benefits',
    category: 'content',
    icon: 'grid',
    variants: [
      { id: 'feature-grid', name: 'Feature Grid', description: 'Grid of features with icons' },
      { id: 'feature-list', name: 'Feature List', description: 'Features in a vertical list' }
    ],
    fields: [
      { id: 'title', name: 'Title', type: 'text', description: 'Section heading' },
      { id: 'subtitle', name: 'Subtitle', type: 'textarea', description: 'Section description' },
      { id: 'columns', name: 'Columns', type: 'number', description: 'Number of columns' }
    ],
    defaultData: {
      id: uuidv4(),
      name: 'Feature Grid',
      sectionType: 'feature-grid',
      componentVariant: 'feature-grid',
      data: {
        title: 'Our Features',
        subtitle: 'Everything you need to succeed',
        columns: 3,
        features: [
          { title: 'Feature One', description: 'Description of feature one', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
          { title: 'Feature Two', description: 'Description of feature two', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
          { title: 'Feature Three', description: 'Description of feature three', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' }
        ],
        backgroundStyle: 'light',
        alignment: 'center',
        mediaType: 'icon'
      }
    }
  },
  // Testimonial section
  {
    type: 'testimonial',
    name: 'Testimonials',
    description: 'Customer quotes and testimonials',
    category: 'content',
    icon: 'quote',
    variants: [
      { id: 'testimonial-cards', name: 'Testimonial Cards', description: 'Grid of testimonial cards' },
      { id: 'testimonial-slider', name: 'Testimonial Slider', description: 'Carousel of testimonials' }
    ],
    fields: [
      { id: 'title', name: 'Title', type: 'text', description: 'Section heading' },
      { id: 'subtitle', name: 'Subtitle', type: 'textarea', description: 'Section description' }
    ],
    defaultData: {
      id: uuidv4(),
      name: 'Testimonials',
      sectionType: 'testimonial',
      componentVariant: 'testimonial-cards',
      data: {
        title: 'What Our Customers Say',
        subtitle: 'Don\'t take our word for it',
        testimonials: [
          { 
            quote: 'This product has completely transformed our business operations.',
            author: 'Jane Smith',
            role: 'CEO at Company',
            avatar: '/placeholder.svg' 
          },
          { 
            quote: 'The best solution we\'ve found in the market by far.',
            author: 'John Doe',
            role: 'CTO at Enterprise',
            avatar: '/placeholder.svg' 
          }
        ],
        backgroundStyle: 'light',
        alignment: 'center',
        mediaType: 'avatar'
      }
    }
  },
  // Navigation section
  {
    type: 'navigation',
    name: 'Navigation',
    description: 'Site header with navigation',
    category: 'navigation',
    icon: 'menu',
    variants: [
      { id: 'nav-startup', name: 'Startup Nav', description: 'Clean modern navigation' },
      { id: 'nav-simple', name: 'Simple Nav', description: 'Minimal navigation' }
    ],
    fields: [
      { id: 'brandName', name: 'Brand Name', type: 'text', description: 'Company or product name' },
      { id: 'isSticky', name: 'Sticky Header', type: 'boolean', description: 'Fix navigation to top while scrolling' }
    ],
    defaultData: {
      id: uuidv4(),
      name: 'Navigation',
      sectionType: 'navigation',
      componentVariant: 'nav-startup',
      data: {
        brandName: 'Company Name',
        links: [
          { label: 'Features', url: '#', isActive: false },
          { label: 'Pricing', url: '#', isActive: false },
          { label: 'About', url: '#', isActive: false },
          { label: 'Contact', url: '#', isActive: false }
        ],
        cta: { label: 'Get Started', url: '#', isPrimary: true },
        isSticky: true,
        hasSearch: false
      }
    }
  },
  // CTA section
  {
    type: 'cta',
    name: 'Call to Action',
    description: 'Conversion-focused call to action section',
    category: 'content',
    icon: 'arrow-right',
    variants: [
      { id: 'cta-centered', name: 'Centered CTA', description: 'Centered content with button' },
      { id: 'cta-split', name: 'Split CTA', description: 'Content on left, form on right' }
    ],
    fields: [
      { id: 'headline', name: 'Headline', type: 'text', description: 'Main heading text' },
      { id: 'subheadline', name: 'Subheadline', type: 'textarea', description: 'Supporting text' },
      { id: 'ctaLabel', name: 'Button Text', type: 'text', description: 'Call to action button text' }
    ],
    defaultData: {
      id: uuidv4(),
      name: 'Call to Action',
      sectionType: 'cta',
      componentVariant: 'cta-centered',
      data: {
        headline: 'Ready to get started?',
        subheadline: 'Join thousands of satisfied customers today.',
        ctaLabel: 'Sign Up Now',
        ctaUrl: '#',
        secondaryCtaLabel: 'Learn More',
        secondaryCtaUrl: '#',
        backgroundStyle: 'primary',
        alignment: 'center'
      }
    }
  },
  // FAQ section
  {
    type: 'faq',
    name: 'FAQ Section',
    description: 'Frequently asked questions',
    category: 'content',
    icon: 'help-circle',
    variants: [
      { id: 'faq-accordion', name: 'FAQ Accordion', description: 'Expandable FAQ items' },
      { id: 'faq-grid', name: 'FAQ Grid', description: 'Grid of frequently asked questions' }
    ],
    fields: [
      { id: 'title', name: 'Title', type: 'text', description: 'Section heading' },
      { id: 'subtitle', name: 'Subtitle', type: 'textarea', description: 'Section description' }
    ],
    defaultData: {
      id: uuidv4(),
      name: 'FAQ Section',
      sectionType: 'faq',
      componentVariant: 'faq-accordion',
      data: {
        title: 'Frequently Asked Questions',
        subtitle: 'Find answers to common questions about our product',
        faqs: [
          {
            question: 'How do I get started?',
            answer: 'Getting started is easy! Simply sign up for an account and follow the onboarding process.'
          },
          {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards, PayPal, and bank transfers.'
          },
          {
            question: 'Can I cancel my subscription?',
            answer: 'Yes, you can cancel your subscription at any time from your account settings.'
          },
          {
            question: 'Is there a free trial?',
            answer: 'Yes, we offer a 14-day free trial with no credit card required.'
          }
        ],
        faqType: 'accordion',
        backgroundStyle: 'light',
        alignment: 'center'
      }
    }
  },
  // Footer section
  {
    type: 'footer',
    name: 'Footer',
    description: 'Site footer with links and info',
    category: 'navigation',
    icon: 'layout-bottom',
    variants: [
      { id: 'footer-simple', name: 'Simple Footer', description: 'Clean minimal footer' },
      { id: 'footer-multi', name: 'Multi-column Footer', description: 'Footer with multiple columns' }
    ],
    fields: [
      { id: 'companyName', name: 'Company Name', type: 'text', description: 'Company or site name' },
      { id: 'columns', name: 'Number of columns', type: 'number', description: 'Number of link columns' }
    ],
    defaultData: {
      id: uuidv4(),
      name: 'Footer Section',
      sectionType: 'footer',
      componentVariant: 'footer-multi',
      data: {
        companyName: 'Company Name',
        columns: [
          {
            title: 'Product',
            links: [
              { label: 'Features', url: '#' },
              { label: 'Pricing', url: '#' },
              { label: 'Roadmap', url: '#' }
            ]
          },
          {
            title: 'Company',
            links: [
              { label: 'About', url: '#' },
              { label: 'Careers', url: '#' },
              { label: 'Contact', url: '#' }
            ]
          },
          {
            title: 'Resources',
            links: [
              { label: 'Blog', url: '#' },
              { label: 'Documentation', url: '#' },
              { label: 'Support', url: '#' }
            ]
          }
        ],
        copyright: '© 2025 Company Name. All rights reserved.',
        socialLinks: [
          { platform: 'twitter', url: '#' },
          { platform: 'linkedin', url: '#' },
          { platform: 'github', url: '#' }
        ],
        backgroundStyle: 'dark',
        showLogo: true
      }
    }
  },
  // Pricing section
  {
    type: 'pricing',
    name: 'Pricing Section',
    description: 'Product or service pricing plans',
    category: 'commerce',
    icon: 'credit-card',
    variants: [
      { id: 'pricing-tier', name: 'Pricing Tiers', description: 'Horizontal pricing cards' },
      { id: 'pricing-table', name: 'Pricing Table', description: 'Feature comparison table' }
    ],
    fields: [
      { id: 'title', name: 'Title', type: 'text', description: 'Section heading' },
      { id: 'description', name: 'Description', type: 'textarea', description: 'Section description' }
    ],
    defaultData: {
      id: uuidv4(),
      name: 'Pricing Section',
      sectionType: 'pricing',
      componentVariant: 'pricing-tier',
      data: {
        title: 'Simple, Transparent Pricing',
        description: 'Choose a plan that works best for you and your team.',
        plans: [
          {
            name: 'Basic',
            price: '$29',
            interval: 'month',
            description: 'Perfect for individuals and small projects',
            features: ['Up to 5 users', '10 GB storage', 'Basic support', 'Basic analytics'],
            cta: { label: 'Get Started', url: '#' }
          },
          {
            name: 'Professional',
            price: '$79',
            interval: 'month',
            description: 'Great for teams and growing businesses',
            features: ['Up to 20 users', '50 GB storage', 'Priority support', 'Advanced analytics'],
            cta: { label: 'Get Started', url: '#' },
            badge: 'Popular',
            featured: true
          },
          {
            name: 'Enterprise',
            price: '$199',
            interval: 'month',
            description: 'For large organizations with specific needs',
            features: ['Unlimited users', '500 GB storage', 'Dedicated support', 'Custom reporting'],
            cta: { label: 'Contact Sales', url: '#' }
          }
        ],
        backgroundStyle: 'light',
        alignment: 'center',
        showToggle: true,
        toggleLabels: { annual: 'Annual', monthly: 'Monthly' }
      }
    }
  },
  // Contact section
  {
    type: 'contact',
    name: 'Contact Section',
    description: 'Contact form and information',
    category: 'form',
    icon: 'mail',
    variants: [
      { id: 'contact-split', name: 'Split Contact', description: 'Form on one side, info on the other' },
      { id: 'contact-simple', name: 'Simple Contact', description: 'Centered contact form' }
    ],
    fields: [
      { id: 'title', name: 'Title', type: 'text', description: 'Section heading' },
      { id: 'subtitle', name: 'Subtitle', type: 'textarea', description: 'Section description' }
    ],
    defaultData: {
      id: uuidv4(),
      name: 'Contact Section',
      sectionType: 'contact',
      componentVariant: 'contact-split',
      data: {
        title: 'Get in Touch',
        subtitle: 'We\'d love to hear from you. Fill out the form and we\'ll get back to you shortly.',
        formFields: [
          { label: 'Name', type: 'text', placeholder: 'Your name' },
          { label: 'Email', type: 'email', placeholder: 'your.email@example.com' },
          { label: 'Subject', type: 'text', placeholder: 'What is this regarding?' },
          { label: 'Message', type: 'textarea', placeholder: 'Your message here...' }
        ],
        contactInfo: {
          email: 'hello@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, City, State 10001'
        },
        backgroundStyle: 'light',
        alignment: 'left',
        mapEnabled: true
      }
    }
  },
  // Blog section
  {
    type: 'blog',
    name: 'Blog Section',
    description: 'Latest posts or articles',
    category: 'content',
    icon: 'file-text',
    variants: [
      { id: 'blog-grid', name: 'Blog Grid', description: 'Grid of blog posts' },
      { id: 'blog-list', name: 'Blog List', description: 'Vertical list of blog posts' }
    ],
    fields: [
      { id: 'headline', name: 'Headline', type: 'text', description: 'Section heading' },
      { id: 'description', name: 'Description', type: 'textarea', description: 'Section description' }
    ],
    defaultData: {
      id: uuidv4(),
      name: 'Blog Section',
      sectionType: 'blog',
      componentVariant: 'blog-grid',
      data: {
        headline: 'Latest from our Blog',
        description: 'Check out our latest articles and resources',
        layoutStyle: 'grid',
        posts: [
          {
            title: 'Getting Started with Our Platform',
            summary: 'A beginner\'s guide to getting the most out of our platform.',
            date: 'Apr 1, 2025',
            category: 'Tutorial',
            author: 'Jane Smith',
            image: '/placeholder.svg'
          },
          {
            title: 'Best Practices for Optimal Results',
            summary: 'Learn the best practices that will help you achieve better results.',
            date: 'Mar 15, 2025',
            category: 'Guide',
            author: 'John Doe',
            image: '/placeholder.svg'
          },
          {
            title: 'New Features Released This Month',
            summary: 'Explore all the new capabilities we\'ve added to the platform.',
            date: 'Mar 1, 2025',
            category: 'News',
            author: 'Alex Johnson',
            image: '/placeholder.svg'
          }
        ],
        backgroundStyle: 'light',
        alignment: 'left',
        showCategories: true,
        showAuthors: true
      }
    }
  }
];
