
import { CopySuggestions } from '@/components/wireframe/renderers/utilities';

/**
 * Returns copy suggestions based on the section type
 * @param sectionType The type of the wireframe section
 * @returns An object containing suggested copy for the section
 */
export const getSuggestedCopy = (sectionType: string): CopySuggestions => {
  // Default copy suggestions
  const defaultSuggestions: CopySuggestions = {
    heading: 'Section Heading',
    subheading: 'Section subheading or brief description',
    supportText: 'Additional supporting text for this section',
    ctaText: 'Call to Action',
  };

  // Section-specific copy suggestions
  switch (sectionType) {
    case 'hero':
      return {
        heading: 'Welcome to Our Platform',
        subheading: 'The easiest way to build amazing websites',
        supportText: 'Get started in minutes with our intuitive tools',
        primaryCta: 'Get Started',
        secondaryCta: 'Learn More',
      };

    case 'features':
      return {
        heading: 'Key Features',
        subheading: 'Everything you need to succeed',
        supportText: 'Our platform provides all the tools you need',
        ctaText: 'Explore Features',
      };

    case 'testimonials':
      return {
        heading: 'What Our Customers Say',
        subheading: 'Don\'t take our word for it',
        supportText: 'Trusted by thousands of businesses worldwide',
      };

    case 'pricing':
      return {
        heading: 'Simple, Transparent Pricing',
        subheading: 'No hidden fees, no surprises',
        supportText: 'Choose the plan that works for you',
        ctaText: 'Get Started',
      };

    case 'contact':
      return {
        heading: 'Get In Touch',
        subheading: 'We\'d love to hear from you',
        supportText: 'Our team is ready to answer your questions',
        ctaText: 'Send Message',
      };

    case 'cta':
      return {
        heading: 'Ready to Get Started?',
        subheading: 'Join thousands of satisfied customers',
        supportText: 'No credit card required for trial',
        primaryCta: 'Start Free Trial',
        secondaryCta: 'Contact Sales',
      };

    case 'footer':
      return {
        heading: 'Company Name',
        supportText: '© 2025 Company. All rights reserved.',
      };

    case 'navigation':
      return {
        heading: 'Company Name',
        primaryCta: 'Sign Up',
        secondaryCta: 'Login',
      };

    case 'faq':
      return {
        heading: 'Frequently Asked Questions',
        subheading: 'Find answers to common questions',
        supportText: 'Can\'t find what you\'re looking for? Contact us.',
      };

    case 'stats':
      return {
        heading: 'Our Impact',
        subheading: 'Numbers that speak for themselves',
        supportText: 'See how we\'ve helped businesses grow',
      };

    case 'blog':
      return {
        heading: 'Latest from Our Blog',
        subheading: 'Insights and updates',
        supportText: 'Stay current with the latest trends and news',
        ctaText: 'View All Posts',
      };

    default:
      return defaultSuggestions;
  }
};

/**
 * Get feature-specific copy suggestions
 * @param featureType The specific feature type
 * @returns Suggested copy for the feature
 */
export const getFeatureCopySuggestions = (featureType: string): CopySuggestions => {
  switch (featureType) {
    case 'main':
      return {
        heading: 'Core Feature',
        supportText: 'Detailed description of this amazing feature',
      };
    case 'secondary':
      return {
        heading: 'Additional Feature',
        supportText: 'Support information about this feature',
      };
    default:
      return {
        heading: 'Feature Title',
        supportText: 'Feature description goes here',
      };
  }
};

/**
 * Generates placeholder content for different wireframe components
 */
export const getPlaceholderContent = (componentType: string): string => {
  switch (componentType) {
    case 'paragraph':
      return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.';
    case 'short-text':
      return 'Brief text description';
    case 'headline':
      return 'Main Headline';
    case 'subheadline':
      return 'Supporting Subheading';
    case 'button':
      return 'Click Me';
    default:
      return 'Content placeholder';
  }
};
