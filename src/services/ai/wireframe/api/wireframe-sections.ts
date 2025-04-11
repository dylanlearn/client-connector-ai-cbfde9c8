import { v4 as uuidv4 } from 'uuid';
import { generateComponent } from './wireframe-components';
import { CopySuggestions, AnimationSuggestion } from '../wireframe-types';

type Json = string | number | boolean | null | { [property: string]: Json } | Json[];

/**
 * Generate a hero section
 */
export const generateHeroSection = async (
  description: string,
  style?: Record<string, any>,
  suggestions?: CopySuggestions[]
): Promise<any> => {
  const heading = suggestions && suggestions.length > 0 ? suggestions[0].heading : 'Hero Section';
  const subheading = suggestions && suggestions.length > 0 ? suggestions[0].subheading : 'A powerful solution for your business';
  
  return {
    id: uuidv4(),
    name: 'Hero Section',
    sectionType: 'hero',
    description: description,
    components: [
      generateComponent('heading', { content: heading }),
      generateComponent('paragraph', { content: subheading }),
      generateComponent('button', { content: 'Learn More' })
    ],
    style: style
  };
};

/**
 * Generate a features section
 */
export const generateFeaturesSection = async (
  description: string,
  style?: Record<string, any>,
  suggestions?: CopySuggestions[]
): Promise<any> => {
  const heading = suggestions && suggestions.length > 0 ? suggestions[0].heading : 'Features Section';
  const subheading = suggestions && suggestions.length > 0 ? suggestions[0].subheading : 'Key features of our product';
  
  return {
    id: uuidv4(),
    name: 'Features Section',
    sectionType: 'features',
    description: description,
    components: [
      generateComponent('heading', { content: heading }),
      generateComponent('paragraph', { content: subheading }),
      generateComponent('grid', {
        columns: 3,
        items: [
          { title: 'Feature 1', description: 'Description of feature 1' },
          { title: 'Feature 2', description: 'Description of feature 2' },
          { title: 'Feature 3', description: 'Description of feature 3' }
        ]
      })
    ],
    style: style
  };
};

/**
 * Generate a contact section
 */
export const generateContactSection = async (
  description: string,
  style?: Record<string, any>,
  suggestions?: CopySuggestions[],
  animationSuggestions?: AnimationSuggestion[]
): Promise<any> => {
  const heading = suggestions && suggestions.length > 0 ? suggestions[0].heading : 'Contact Us';
  const subheading = suggestions && suggestions.length > 0 ? suggestions[0].subheading : 'Get in touch with us';
  
  const section: any = {
    id: uuidv4(),
    name: 'Contact Section',
    sectionType: 'contact',
    description: description,
    components: [
      generateComponent('heading', { content: heading }),
      generateComponent('paragraph', { content: subheading }),
      generateComponent('form', {
        fields: [
          { label: 'Name', type: 'text' },
          { label: 'Email', type: 'email' },
          { label: 'Message', type: 'textarea' }
        ],
        submitButtonText: 'Send Message'
      })
    ],
    style: style
  };
  
  // section.animationSuggestions = suggestions as Json[];
  // section.animationSuggestions = suggestions as unknown as Json[];
  // section.animationSuggestions = suggestions as AnimationSuggestion[];
  section.animationSuggestions = suggestions as unknown as any;
  
  return section;
};

/**
 * Generate a pricing section
 */
export const generatePricingSection = async (
  description: string,
  style?: Record<string, any>,
  suggestions?: CopySuggestions[]
): Promise<any> => {
  const heading = suggestions && suggestions.length > 0 ? suggestions[0].heading : 'Pricing Plans';
  const subheading = suggestions && suggestions.length > 0 ? suggestions[0].subheading : 'Choose the plan that fits your needs';
  
  return {
    id: uuidv4(),
    name: 'Pricing Section',
    sectionType: 'pricing',
    description: description,
    components: [
      generateComponent('heading', { content: heading }),
      generateComponent('paragraph', { content: subheading }),
      generateComponent('grid', {
        columns: 3,
        items: [
          { title: 'Basic', price: '$9', features: ['Feature 1', 'Feature 2'] },
          { title: 'Standard', price: '$19', features: ['Feature 1', 'Feature 2', 'Feature 3'] },
          { title: 'Premium', price: '$29', features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'] }
        ]
      })
    ],
    style: style
  };
};

/**
 * Generate a gallery section
 */
export const generateGallerySection = async (
  description: string,
  style?: Record<string, any>,
  suggestions?: CopySuggestions[]
): Promise<any> => {
  const heading = suggestions && suggestions.length > 0 ? suggestions[0].heading : 'Image Gallery';
  const subheading = suggestions && suggestions.length > 0 ? suggestions[0].subheading : 'Our beautiful collection of images';
  
  return {
    id: uuidv4(),
    name: 'Gallery Section',
    sectionType: 'gallery',
    description: description,
    components: [
      generateComponent('heading', { content: heading }),
      generateComponent('paragraph', { content: subheading }),
      generateComponent('grid', {
        columns: 3,
        items: [
          { image: 'image1.jpg', alt: 'Image 1' },
          { image: 'image2.jpg', alt: 'Image 2' },
          { image: 'image3.jpg', alt: 'Image 3' }
        ]
      })
    ],
    style: style
  };
};

/**
 * Generate a testimonials section
 */
export const generateTestimonialsSection = async (
  description: string,
  style?: Record<string, any>,
  suggestions?: CopySuggestions[]
): Promise<any> => {
  const heading = suggestions && suggestions.length > 0 ? suggestions[0].heading : 'What Our Clients Say';
  const subheading = suggestions && suggestions.length > 0 ? suggestions[0].subheading : 'Trusted by businesses worldwide';
  
  return {
    id: uuidv4(),
    name: 'Testimonials Section',
    sectionType: 'testimonials',
    description: description,
    components: [
      generateComponent('heading', { content: heading }),
      generateComponent('paragraph', { content: subheading }),
      generateComponent('grid', {
        columns: 1,
        items: [
          { quote: 'Great service!', author: 'John Doe' },
          { quote: 'Excellent product!', author: 'Jane Smith' }
        ]
      })
    ],
    style: style
  };
};

/**
 * Generate a CTA section
 */
export const generateCTASection = async (
  description: string,
  style?: Record<string, any>,
  suggestions?: CopySuggestions[]
): Promise<any> => {
  const heading = suggestions && suggestions.length > 0 ? suggestions[0].heading : 'Call to Action';
  const subheading = suggestions && suggestions.length > 0 ? suggestions[0].subheading : 'Ready to get started?';
  
  return {
    id: uuidv4(),
    name: 'CTA Section',
    sectionType: 'cta',
    description: description,
    components: [
      generateComponent('heading', { content: heading }),
      generateComponent('paragraph', { content: subheading }),
      generateComponent('button', { content: 'Get Started' })
    ],
    style: style
  };
};

/**
 * Generate a FAQ section
 */
export const generateFAQSection = async (
  description: string,
  style?: Record<string, any>,
  suggestions?: CopySuggestions[]
): Promise<any> => {
  const heading = suggestions && suggestions.length > 0 ? suggestions[0].heading : 'Frequently Asked Questions';
  const subheading = suggestions && suggestions.length > 0 ? suggestions[0].subheading : 'Find answers to common questions';
  
  return {
    id: uuidv4(),
    name: 'FAQ Section',
    sectionType: 'faq',
    description: description,
    components: [
      generateComponent('heading', { content: heading }),
      generateComponent('paragraph', { content: subheading }),
      generateComponent('list', {
        items: [
          { question: 'Question 1', answer: 'Answer 1' },
          { question: 'Question 2', answer: 'Answer 2' }
        ]
      })
    ],
    style: style
  };
};

/**
 * Generate a contact section
 */
export const generateFooterSection = async (
  description: string,
  style?: Record<string, any>,
  suggestions?: CopySuggestions[]
): Promise<any> => {
  return {
    id: uuidv4(),
    name: 'Footer Section',
    sectionType: 'footer',
    description: description,
    components: [
      generateComponent('paragraph', { content: '© 2024 Your Company. All rights reserved.' })
    ],
    style: style
  };
};
