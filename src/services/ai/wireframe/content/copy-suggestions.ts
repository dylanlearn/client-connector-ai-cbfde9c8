
/**
 * Copy suggestions interface for section content
 */
export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  primaryCta?: string;
  secondaryCta?: string;
  supportText?: string;
  [key: string]: string | undefined;
}

/**
 * Get suggested copy based on section type
 */
export function getSuggestedCopy(sectionType: string): CopySuggestions {
  switch (sectionType.toLowerCase()) {
    case 'hero':
      return {
        heading: 'Powerful Solution for Your Business',
        subheading: 'Streamline your workflow and boost productivity with our intuitive platform',
        primaryCta: 'Get Started',
        secondaryCta: 'Learn More'
      };
    
    case 'features':
      return {
        heading: 'Key Features',
        subheading: 'Discover what makes our product special',
        supportText: 'Our platform offers everything you need to succeed'
      };
    
    case 'testimonials':
      return {
        heading: 'What Our Clients Say',
        subheading: 'Trusted by businesses worldwide'
      };
    
    case 'pricing':
      return {
        heading: 'Simple, Transparent Pricing',
        subheading: 'Choose the plan that works for you',
        primaryCta: 'Get Started',
        supportText: 'No hidden fees. Cancel anytime.'
      };
    
    case 'cta':
      return {
        heading: 'Ready to Get Started?',
        subheading: 'Join thousands of satisfied customers today',
        ctaText: 'Sign Up Now'
      };
    
    case 'contact':
      return {
        heading: 'Get in Touch',
        subheading: "We'd love to hear from you",
        supportText: 'Our team is ready to answer your questions'
      };
    
    case 'footer':
      return {
        supportText: '© 2025 Your Company. All rights reserved.'
      };
    
    case 'navigation':
      return {
        heading: 'Your Brand'
      };
    
    case 'about':
      return {
        heading: 'About Us',
        subheading: 'Our story and mission'
      };
    
    case 'faq':
      return {
        heading: 'Frequently Asked Questions',
        subheading: 'Find answers to common questions'
      };
      
    case 'stats':
      return {
        heading: 'Our Impact',
        subheading: 'See the numbers that drive our success'
      };
      
    default:
      return {
        heading: `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section`,
        subheading: 'Section description goes here'
      };
  }
}

/**
 * Get AI-generated copy suggestions based on section type and project context
 */
export async function getAIGeneratedCopy(
  sectionType: string, 
  projectContext?: Record<string, any>
): Promise<CopySuggestions> {
  // This would normally call an AI service
  // For now, just return the static suggestions
  return getSuggestedCopy(sectionType);
}

export default {
  getSuggestedCopy,
  getAIGeneratedCopy
};
