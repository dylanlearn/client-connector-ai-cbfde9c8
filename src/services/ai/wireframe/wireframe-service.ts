import { v4 as uuidv4 } from 'uuid';
import { WireframeData, WireframeGenerationParams, WireframeGenerationResult, WireframeSection, WireframeComponent } from './wireframe-types';
import { generateWireframe as generateWireframeAPI } from './api/wireframe-generator';

/**
 * Creates a WireframeComponent with a guaranteed ID
 */
function createComponent(componentData: Partial<WireframeComponent>): WireframeComponent {
  return {
    id: uuidv4(),
    ...componentData,
  } as WireframeComponent;
}

/**
 * Generate a wireframe based on provided parameters
 */
export const generateWireframe = async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
  try {
    // Parse the description to determine sections to include
    const description = params.description || '';
    const sections: WireframeSection[] = [];
    
    // Generate a unique ID for the wireframe
    const wireframeId = uuidv4();
    
    // Generate navigation section (typically first)
    if (description.toLowerCase().includes('navigation') || description.toLowerCase().includes('navbar') || description.toLowerCase().includes('header')) {
      sections.push(generateNavigationSection());
    }
    
    // Generate hero section
    if (description.toLowerCase().includes('hero')) {
      sections.push(generateHeroSection());
    }
    
    // Generate features section
    if (description.toLowerCase().includes('features') || description.toLowerCase().includes('feature grid')) {
      sections.push(generateFeaturesSection());
    }
    
    // Generate testimonials section
    if (description.toLowerCase().includes('testimonials')) {
      sections.push(generateTestimonialsSection());
    }
    
    // Generate pricing section
    if (description.toLowerCase().includes('pricing')) {
      sections.push(generatePricingSection());
    }
    
    // Generate FAQ section
    if (description.toLowerCase().includes('faq') || description.toLowerCase().includes('accordion')) {
      sections.push(generateFAQSection());
    }
    
    // Generate footer section
    if (description.toLowerCase().includes('footer')) {
      sections.push(generateFooterSection());
    }
    
    // If no sections were determined, create a basic layout with common sections
    if (sections.length === 0) {
      sections.push(generateNavigationSection());
      sections.push(generateHeroSection());
      sections.push(generateFeaturesSection());
      sections.push(generateFooterSection());
    }
    
    // Create the wireframe data object
    const wireframe: WireframeData = {
      id: wireframeId,
      title: params.description ? `Wireframe for ${params.description.substring(0, 50)}` : 'New Wireframe',
      description: params.description || '',
      sections: sections,
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#111827'
      },
      typography: {
        headings: 'sans-serif',
        body: 'sans-serif'
      }
    };
    
    return {
      wireframe,
      success: true,
      message: 'Wireframe generated successfully'
    };
  } catch (error) {
    console.error("Error generating wireframe:", error);
    return {
      wireframe: null,
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

/**
 * Generate a variation of a wireframe with a different style
 * @param params The wireframe generation parameters, including baseWireframe if available
 * @param creativityLevel The creativity level to use (1-10)
 */
export const generateWireframeVariationWithStyle = async (
  params: WireframeGenerationParams,
  creativityLevel: number = 5
): Promise<WireframeGenerationResult> => {
  try {
    // For now, we'll use the mock or API call
    return generateWireframeAPI({
      ...params,
      creativityLevel,
      isVariation: true
    });
  } catch (error) {
    console.error("Error generating wireframe variation:", error);
    return {
      wireframe: null,
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

/**
 * Generate a navigation section
 */
function generateNavigationSection(): WireframeSection {
  const navigationId = uuidv4();
  
  return {
    id: navigationId,
    name: 'Navigation',
    sectionType: 'navigation',
    description: 'Main navigation bar',
    componentVariant: 'sticky',
    components: [
      createComponent({
        type: 'logo',
        position: { x: 0, y: 0 },
        props: { align: 'left' }
      }),
      createComponent({
        type: 'nav-links',
        position: { x: 0, y: 0 },
        props: { align: 'center', items: ['Features', 'Pricing', 'About', 'Contact'] }
      }),
      createComponent({
        type: 'button',
        position: { x: 0, y: 0 },
        props: { text: 'Get Started', align: 'right', variant: 'primary' }
      })
    ],
    copySuggestions: {
      heading: 'Your Brand',
      primaryCta: 'Get Started'
    }
  };
}

/**
 * Generate a hero section
 */
function generateHeroSection(): WireframeSection {
  const heroId = uuidv4();
  
  return {
    id: heroId,
    name: 'Hero',
    sectionType: 'hero',
    description: 'Main hero section',
    componentVariant: 'split',
    components: [
      createComponent({
        type: 'heading',
        position: { x: 0, y: 0 },
        props: { text: 'Powerful Solution for Your Business', level: 1 }
      }),
      createComponent({
        type: 'paragraph',
        position: { x: 0, y: 0 },
        props: { text: 'Streamline your workflow and boost productivity with our intuitive platform.' }
      }),
      createComponent({
        type: 'button-group',
        position: { x: 0, y: 0 },
        props: { buttons: [
          { text: 'Get Started', variant: 'primary' },
          { text: 'Learn More', variant: 'secondary' }
        ]}
      }),
      createComponent({
        type: 'image',
        position: { x: 0, y: 0 },
        props: { src: '/placeholder-hero.jpg', alt: 'Hero Image' }
      })
    ],
    copySuggestions: {
      heading: 'Powerful Solution for Your Business',
      subheading: 'Streamline your workflow and boost productivity with our intuitive platform.',
      primaryCta: 'Get Started',
      secondaryCta: 'Learn More'
    }
  };
}

/**
 * Generate a features section
 */
function generateFeaturesSection(): WireframeSection {
  const featuresId = uuidv4();
  
  return {
    id: featuresId,
    name: 'Features',
    sectionType: 'features',
    description: 'Key features section',
    stats: [
      { id: uuidv4(), value: 'Feature 1', label: 'Description of this amazing feature.' },
      { id: uuidv4(), value: 'Feature 2', label: 'Description of this amazing feature.' },
      { id: uuidv4(), value: 'Feature 3', label: 'Description of this amazing feature.' },
      { id: uuidv4(), value: 'Feature 4', label: 'Description of this amazing feature.' },
      { id: uuidv4(), value: 'Feature 5', label: 'Description of this amazing feature.' },
      { id: uuidv4(), value: 'Feature 6', label: 'Description of this amazing feature.' }
    ],
    copySuggestions: {
      heading: 'Powerful Features',
      subheading: 'Everything you need to streamline your workflow and boost productivity.'
    }
  };
}

/**
 * Generate a testimonials section
 */
function generateTestimonialsSection(): WireframeSection {
  const testimonialsId = uuidv4();
  
  return {
    id: testimonialsId,
    name: 'Testimonials',
    sectionType: 'testimonials',
    description: 'Customer testimonials',
    components: [
      createComponent({
        type: 'testimonial-card',
        position: { x: 0, y: 0 },
        props: {
          quote: "This platform has transformed our workflow. Highly recommended!",
          author: "Jane Smith",
          role: "CEO, Acme Inc.",
          rating: 5
        }
      }),
      createComponent({
        type: 'testimonial-card',
        position: { x: 0, y: 0 },
        props: {
          quote: "The best SaaS platform we've used. Intuitive and powerful.",
          author: "John Doe",
          role: "CTO, XYZ Corp",
          rating: 5
        }
      }),
      createComponent({
        type: 'testimonial-card',
        position: { x: 0, y: 0 },
        props: {
          quote: "Excellent support and feature-rich platform.",
          author: "Sarah Johnson",
          role: "Director, ABC Solutions",
          rating: 4
        }
      })
    ],
    copySuggestions: {
      heading: 'What Our Customers Say',
      subheading: 'Read testimonials from our satisfied clients and discover how we\'ve helped businesses like yours.'
    }
  };
}

/**
 * Generate a pricing section
 */
function generatePricingSection(): WireframeSection {
  const pricingId = uuidv4();
  
  return {
    id: pricingId,
    name: 'Pricing',
    sectionType: 'pricing',
    description: 'Pricing plans',
    components: [
      createComponent({
        type: 'pricing-card',
        position: { x: 0, y: 0 },
        props: {
          planName: "Basic",
          price: "$19",
          period: "per month",
          features: ["Feature 1", "Feature 2", "Feature 3"],
          cta: "Get Started"
        }
      }),
      createComponent({
        type: 'pricing-card',
        position: { x: 0, y: 0 },
        props: {
          planName: "Pro",
          price: "$49",
          period: "per month",
          features: ["All Basic features", "Feature 4", "Feature 5", "Feature 6"],
          cta: "Get Started",
          highlighted: true
        }
      }),
      createComponent({
        type: 'pricing-card',
        position: { x: 0, y: 0 },
        props: {
          planName: "Enterprise",
          price: "$99",
          period: "per month",
          features: ["All Pro features", "Feature 7", "Feature 8", "Feature 9"],
          cta: "Contact Sales"
        }
      })
    ],
    copySuggestions: {
      heading: 'Simple, Transparent Pricing',
      subheading: 'Choose the plan that best fits your needs. All plans include a 14-day free trial.'
    }
  };
}

/**
 * Generate a FAQ section
 */
function generateFAQSection(): WireframeSection {
  const faqId = uuidv4();
  
  return {
    id: faqId,
    name: 'FAQ',
    sectionType: 'faq',
    description: 'Frequently Asked Questions',
    components: [
      createComponent({
        type: 'faq-accordion',
        position: { x: 0, y: 0 },
        props: {
          items: [
            {
              question: "How does the platform work?",
              answer: "Our platform works by integrating with your existing systems to streamline workflows and automate repetitive tasks."
            },
            {
              question: "What kind of support do you offer?",
              answer: "We offer 24/7 email support for all plans, with phone and prioritized support for higher-tier plans."
            },
            {
              question: "Can I cancel my subscription?",
              answer: "Yes, you can cancel your subscription at any time. We offer a 14-day money-back guarantee for all plans."
            },
            {
              question: "Do you offer custom solutions?",
              answer: "Yes, we offer custom solutions for enterprise clients. Contact our sales team to learn more."
            }
          ]
        }
      })
    ],
    copySuggestions: {
      heading: 'Frequently Asked Questions',
      subheading: 'Find answers to common questions about our platform and services.'
    }
  };
}

/**
 * Generate a footer section
 */
function generateFooterSection(): WireframeSection {
  const footerId = uuidv4();
  
  return {
    id: footerId,
    name: 'Footer',
    sectionType: 'footer',
    description: 'Page footer',
    components: [
      createComponent({
        type: 'logo',
        position: { x: 0, y: 0 },
        props: {}
      }),
      createComponent({
        type: 'footer-links',
        position: { x: 0, y: 0 },
        props: {
          title: "Company",
          links: ["About", "Careers", "Contact Us", "Blog"]
        }
      }),
      createComponent({
        type: 'footer-links',
        position: { x: 0, y: 0 },
        props: {
          title: "Resources",
          links: ["Documentation", "FAQs", "Support", "Privacy Policy"]
        }
      }),
      createComponent({
        type: 'newsletter',
        position: { x: 0, y: 0 },
        props: {
          title: "Subscribe to our newsletter",
          placeholder: "Enter your email",
          buttonText: "Subscribe"
        }
      }),
      createComponent({
        type: 'social-icons',
        position: { x: 0, y: 0 },
        props: {
          icons: ["twitter", "facebook", "linkedin"]
        }
      })
    ],
    copySuggestions: {
      supportText: '© 2025 Your Company. All rights reserved.'
    }
  };
}

export default {
  generateWireframe,
  generateWireframeVariationWithStyle
};
