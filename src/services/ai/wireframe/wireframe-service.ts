
import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeGenerationParams,
  WireframeGenerationResult,
  WireframeData,
  WireframeSection
} from './wireframe-types';
import { wireframeApiService } from './api/wireframe-api-service';

/**
 * Generate a wireframe from input parameters
 */
export const generateWireframe = async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
  try {
    console.log('Generating wireframe with params:', params);
    
    // Extract sections from the description
    const sections = extractSectionsFromPrompt(params.description);
    
    // Create a wireframe with the extracted sections
    const wireframe: WireframeData = {
      id: uuidv4(),
      title: `Wireframe: ${params.description.substring(0, 30)}...`,
      description: params.description || 'Generated wireframe',
      sections: sections,
      colorScheme: params.colorScheme || {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#1a202c'
      },
      typography: {
        headings: 'Inter',
        body: 'Inter'
      }
    };

    return {
      wireframe,
      success: true,
      message: 'Wireframe generated successfully'
    };
  } catch (error) {
    console.error('Error generating wireframe:', error);
    return {
      wireframe: null,
      success: false,
      message: `Failed to generate wireframe: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Generate a variation of a wireframe with style changes
 */
export const generateWireframeVariationWithStyle = async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
  try {
    console.log('Generating wireframe variation with params:', params);
    
    // For variations, we'll use the same approach but modify some aspects
    return generateWireframe({
      ...params,
      description: `Variation of: ${params.description}`
    });
  } catch (error) {
    console.error('Error generating wireframe variation:', error);
    return {
      wireframe: null,
      success: false,
      message: `Failed to generate variation: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Extract sections from a prompt description
 */
function extractSectionsFromPrompt(prompt: string): WireframeSection[] {
  const sections: WireframeSection[] = [];
  
  // Parse the prompt to identify sections
  // This is a more sophisticated section extractor that looks for explicit section descriptions
  
  // First, identify if we have a SaaS landing page structure
  const isSaasLandingPage = prompt.toLowerCase().includes('saas') && 
                           prompt.toLowerCase().includes('landing');
  
  const isEcommercePage = prompt.toLowerCase().includes('ecommerce') || 
                          prompt.toLowerCase().includes('shop') || 
                          prompt.toLowerCase().includes('store');
                          
  const isBlogPage = prompt.toLowerCase().includes('blog') && 
                    !prompt.toLowerCase().includes('landing');
                    
  // Look for section descriptions
  const navBarMatch = prompt.match(/nav(igation)?\s*(bar|header)?[^.]*\./i);
  const heroMatch = prompt.match(/hero\s*(section)?[^.]*\./i);
  const featuresMatch = prompt.match(/feature(s)?\s*(grid|section)?[^.]*\./i);
  const testimonialMatch = prompt.match(/testimonial(s)?[^.]*\./i);
  const pricingMatch = prompt.match(/pricing[^.]*\./i);
  const faqMatch = prompt.match(/faq[^.]*\./i);
  const footerMatch = prompt.match(/footer[^.]*\./i);
  
  // Add navigation section
  if (navBarMatch || isSaasLandingPage || isEcommercePage || isBlogPage) {
    sections.push({
      id: uuidv4(),
      name: 'Navigation',
      sectionType: 'navigation',
      description: navBarMatch ? navBarMatch[0] : 'Main navigation bar with logo, links, and CTA',
      componentVariant: 'sticky',
      components: [
        {
          type: 'logo',
          position: { x: 0, y: 0 },
          props: { align: 'left' }
        },
        {
          type: 'nav-links',
          position: { x: 0, y: 0 },
          props: { align: 'center', items: ['Features', 'Pricing', 'About', 'Contact'] }
        },
        {
          type: 'button',
          position: { x: 0, y: 0 },
          props: { text: 'Get Started', align: 'right', variant: 'primary' }
        }
      ],
      style: {
        padding: '1rem',
        backgroundColor: 'transparent',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }
    });
  }
  
  // Add hero section
  if (heroMatch || isSaasLandingPage || isEcommercePage) {
    sections.push({
      id: uuidv4(),
      name: 'Hero',
      sectionType: 'hero',
      description: heroMatch ? heroMatch[0] : 'Full-width hero section with headline, subheading and CTA',
      componentVariant: 'split',
      layout: {
        type: 'grid',
        columns: 2,
        gap: 16
      },
      components: [
        {
          type: 'heading',
          position: { x: 0, y: 0 },
          props: { text: 'Powerful SaaS Solution for Your Business', level: 1 }
        },
        {
          type: 'text',
          position: { x: 0, y: 0 },
          props: { text: 'Streamline your workflow and boost productivity with our platform' }
        },
        {
          type: 'button-group',
          position: { x: 0, y: 0 },
          props: { 
            buttons: [
              { text: 'Get Started', variant: 'primary' },
              { text: 'Learn More', variant: 'outline' }
            ]
          }
        },
        {
          type: 'image',
          position: { x: 0, y: 0 },
          props: { src: 'hero-image', alt: 'Platform Dashboard' }
        }
      ],
      style: {
        padding: '4rem 2rem',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center'
      }
    });
  }
  
  // Add features section
  if (featuresMatch || isSaasLandingPage) {
    sections.push({
      id: uuidv4(),
      name: 'Features',
      sectionType: 'features',
      description: featuresMatch ? featuresMatch[0] : '3-column feature grid with icons and descriptions',
      componentVariant: 'grid',
      layout: {
        type: 'grid',
        columns: 3,
        gap: 24
      },
      stats: [
        { id: uuidv4(), value: "Feature 1", label: "Short description of this amazing feature" },
        { id: uuidv4(), value: "Feature 2", label: "Short description of this amazing feature" },
        { id: uuidv4(), value: "Feature 3", label: "Short description of this amazing feature" },
      ],
      style: {
        padding: '4rem 2rem',
        backgroundColor: 'var(--background-alt)'
      },
      copySuggestions: {
        heading: "Powerful Features",
        subheading: "Everything you need to streamline your workflow and boost productivity."
      },
    });
  }
  
  // Add testimonials section
  if (testimonialMatch || isSaasLandingPage) {
    sections.push({
      id: uuidv4(),
      name: 'Testimonials',
      sectionType: 'testimonials',
      description: testimonialMatch ? testimonialMatch[0] : 'Testimonial slider with customer quotes',
      componentVariant: 'slider',
      layout: {
        type: 'grid',
        columns: 3,
        gap: 16
      },
      components: [
        {
          type: 'testimonial-card',
          position: { x: 0, y: 0 },
          props: { 
            quote: "This platform has transformed our workflow. Highly recommended!",
            author: "Jane Smith",
            role: "CEO, Acme Inc.",
            rating: 5
          }
        },
        {
          type: 'testimonial-card',
          position: { x: 0, y: 0 },
          props: { 
            quote: "The best SaaS platform we've used. Intuitive and powerful.",
            author: "John Doe",
            role: "CTO, XYZ Corp",
            rating: 5
          }
        },
        {
          type: 'testimonial-card',
          position: { x: 0, y: 0 },
          props: { 
            quote: "Excellent support and feature-rich platform.",
            author: "Sarah Johnson",
            role: "Director, ABC Solutions",
            rating: 4
          }
        }
      ],
      style: {
        padding: '4rem 2rem'
      },
      copySuggestions: {
        heading: "What Our Customers Say",
        subheading: "Read testimonials from our satisfied clients and discover how we've helped businesses like yours."
      },
    });
  }
  
  // Add pricing section
  if (pricingMatch || isSaasLandingPage) {
    sections.push({
      id: uuidv4(),
      name: 'Pricing',
      sectionType: 'pricing',
      description: pricingMatch ? pricingMatch[0] : '3 pricing tiers with features and CTAs',
      componentVariant: 'cards',
      layout: {
        type: 'grid',
        columns: 3,
        gap: 24
      },
      components: [
        {
          type: 'pricing-card',
          position: { x: 0, y: 0 },
          props: { 
            planName: "Basic",
            price: "$19",
            period: "per month",
            features: ["Feature 1", "Feature 2", "Feature 3"],
            cta: "Get Started"
          }
        },
        {
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
        },
        {
          type: 'pricing-card',
          position: { x: 0, y: 0 },
          props: { 
            planName: "Enterprise",
            price: "$99",
            period: "per month",
            features: ["All Pro features", "Feature 7", "Feature 8", "Feature 9"],
            cta: "Contact Sales"
          }
        }
      ],
      style: {
        padding: '4rem 2rem',
        backgroundColor: 'var(--background-alt)'
      },
      copySuggestions: {
        heading: "Simple, Transparent Pricing",
        subheading: "Choose the plan that best fits your needs. All plans include a 14-day free trial."
      },
    });
  }
  
  // Add FAQ section
  if (faqMatch || isSaasLandingPage) {
    sections.push({
      id: uuidv4(),
      name: 'FAQ',
      sectionType: 'faq',
      description: faqMatch ? faqMatch[0] : 'Frequently asked questions in accordion format',
      componentVariant: 'accordion',
      components: [
        {
          type: 'accordion',
          position: { x: 0, y: 0 },
          props: { 
            items: [
              { question: "How does the free trial work?", answer: "Our 14-day free trial gives you full access to all features with no credit card required." },
              { question: "Can I upgrade or downgrade my plan?", answer: "Yes, you can change your plan at any time. Changes take effect at the next billing cycle." },
              { question: "Do you offer refunds?", answer: "We offer a 30-day money-back guarantee if you're not satisfied with our service." },
              { question: "How secure is your platform?", answer: "We use industry-leading security measures including encryption and regular security audits." }
            ]
          }
        }
      ],
      style: {
        padding: '4rem 2rem'
      }
    });
  }
  
  // Add footer section
  if (footerMatch || isSaasLandingPage || isEcommercePage || isBlogPage) {
    sections.push({
      id: uuidv4(),
      name: 'Footer',
      sectionType: 'footer',
      description: footerMatch ? footerMatch[0] : 'Site footer with links, newsletter signup and social icons',
      componentVariant: 'columns',
      layout: {
        type: 'grid',
        columns: 4,
        gap: 16
      },
      components: [
        {
          type: 'logo',
          position: { x: 0, y: 0 },
          props: {}
        },
        {
          type: 'nav-links',
          position: { x: 0, y: 0 },
          props: { 
            title: "Product",
            links: ["Features", "Pricing", "Roadmap", "Support"]
          }
        },
        {
          type: 'nav-links',
          position: { x: 0, y: 0 },
          props: { 
            title: "Company",
            links: ["About Us", "Blog", "Careers", "Contact"]
          }
        },
        {
          type: 'newsletter',
          position: { x: 0, y: 0 },
          props: { 
            title: "Stay Updated",
            placeholder: "Your email address",
            buttonText: "Subscribe"
          }
        },
        {
          type: 'social-icons',
          position: { x: 0, y: 0 },
          props: { 
            icons: ["twitter", "facebook", "linkedin", "instagram"]
          }
        }
      ],
      style: {
        padding: '4rem 2rem',
        backgroundColor: 'var(--footer-bg)'
      }
    });
  }
  
  // If no sections were detected, create some default ones
  if (sections.length === 0) {
    sections.push(
      {
        id: uuidv4(),
        name: 'Navigation',
        sectionType: 'navigation',
        description: 'Main navigation bar',
        componentVariant: 'standard'
      },
      {
        id: uuidv4(),
        name: 'Hero',
        sectionType: 'hero',
        description: 'Hero section with headline and call to action',
        componentVariant: 'standard'
      },
      {
        id: uuidv4(),
        name: 'Content',
        sectionType: 'content',
        description: 'Main content area',
        componentVariant: 'standard'
      }
    );
  }
  
  return sections;
}

// Export for use in other files
export const wireframeService = {
  generateWireframe,
  generateWireframeVariationWithStyle
};

export default wireframeService;
