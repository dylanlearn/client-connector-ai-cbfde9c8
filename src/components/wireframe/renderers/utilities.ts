
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
 * Process copy suggestions for a section, ensuring it's in the correct format
 */
export function processCopySuggestions(suggestions: CopySuggestions | CopySuggestions[] | undefined): CopySuggestions {
  // Handle undefined suggestions
  if (!suggestions) {
    return {
      heading: 'Section Heading',
      subheading: 'Section subheading or description text goes here.'
    };
  }

  // Handle array of suggestions (return the first one)
  if (Array.isArray(suggestions)) {
    return suggestions.length > 0 
      ? suggestions[0] 
      : {
          heading: 'Section Heading',
          subheading: 'Section subheading or description text goes here.'
        };
  }

  // Return the suggestions object directly
  return suggestions;
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
 * Get a suggestion for a specific section from the AI
 */
export function getSuggestion(sectionType: string, elementType: string): string {
  const suggestions = getSuggestedCopy(sectionType);
  return suggestions[elementType] || `${elementType} for ${sectionType}`;
}

/**
 * Create a style object that handles text-align correctly for React CSS Properties
 */
export function createStyleObject(styles: Record<string, any> = {}): React.CSSProperties {
  const result: Record<string, any> = { ...styles };
  
  // Handle textAlign specifically - cast it to a valid CSS text-align value
  if (styles?.textAlign) {
    switch (styles.textAlign) {
      case 'left':
      case 'center':
      case 'right':
      case 'justify':
        result.textAlign = styles.textAlign as 'left' | 'center' | 'right' | 'justify';
        break;
      default:
        // Use a safe default if the value isn't recognized
        result.textAlign = 'left';
    }
  }
  
  return result as React.CSSProperties;
}
