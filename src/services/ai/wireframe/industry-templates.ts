
import { WireframeSection, WireframeData } from './wireframe-types';

export interface IndustryTemplate {
  id: string;
  name: string;
  industry: string;
  description: string;
  sections: WireframeSection[];
  preview?: string;
}

export type IndustryType = 'ecommerce' | 'saas' | 'portfolio' | 'blog' | 'business' | 'healthcare' | 'education' | 'finance' | 'nonprofit' | 'real-estate';

/**
 * Service for managing industry-specific wireframe templates
 */
export const IndustryTemplateService = {
  /**
   * Get templates for a specific industry
   */
  getTemplatesForIndustry: (industry: string): IndustryTemplate[] => {
    return industryTemplates.filter(template => 
      template.industry === industry || template.industry === 'general'
    );
  },
  
  /**
   * Get a specific template by ID
   */
  getTemplateById: (templateId: string): IndustryTemplate | undefined => {
    return industryTemplates.find(template => template.id === templateId);
  },
  
  /**
   * Apply a template to create a base wireframe
   */
  applyTemplate: (templateId: string, customizations: Partial<WireframeData> = {}): WireframeData => {
    const template = IndustryTemplateService.getTemplateById(templateId);
    
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    
    // Create base wireframe from the template
    const baseWireframe: WireframeData = {
      title: customizations.title || `${template.name} Wireframe`,
      description: customizations.description || template.description,
      sections: [...template.sections], // Clone sections to avoid mutations
    };
    
    // Apply customizations from client preferences
    return {
      ...baseWireframe,
      ...customizations,
      // Ensure sections are merged properly
      sections: customizations.sections 
        ? [...baseWireframe.sections, ...customizations.sections]
        : baseWireframe.sections
    };
  },
  
  /**
   * Get all available industries
   */
  getAllIndustries: (): string[] => {
    return Array.from(new Set(industryTemplates.map(template => template.industry)));
  },
  
  /**
   * Get all templates
   */
  getAllTemplates: (): IndustryTemplate[] => {
    return [...industryTemplates];
  }
};

/**
 * Define industry-specific template library
 * These templates provide pre-designed section structures for common industries
 */
const industryTemplates: IndustryTemplate[] = [
  // E-commerce Templates
  {
    id: 'ecom-product-focus',
    name: 'Product-Focused E-commerce',
    industry: 'ecommerce',
    description: 'Wireframe template optimized for showcasing products with large imagery and clear CTAs',
    sections: [
      {
        name: 'Hero Carousel',
        sectionType: 'hero',
        layoutType: 'fullwidth-carousel',
        components: [
          { type: 'carousel', content: 'Product highlights carousel with large imagery' },
          { type: 'button', content: 'Shop Now CTA' }
        ],
        copySuggestions: {
          heading: 'New Collection Available Now',
          subheading: 'Limited time free shipping on all orders',
          cta: 'Shop Now'
        },
        designReasoning: 'Large hero carousel increases engagement and showcases multiple products'
      },
      {
        name: 'Featured Categories',
        sectionType: 'categories',
        layoutType: 'grid-3-column',
        components: [
          { type: 'category-card', content: 'Visual category cards with hover effects' }
        ],
        copySuggestions: {
          heading: 'Shop by Category',
        },
        designReasoning: 'Category cards help users navigate to desired product types quickly'
      },
      {
        name: 'Best Sellers',
        sectionType: 'products',
        layoutType: 'slider',
        components: [
          { type: 'product-card', content: 'Product cards with image, title, price, and add-to-cart' }
        ],
        copySuggestions: {
          heading: 'Best Sellers',
          subheading: 'Our most popular products this season'
        },
        designReasoning: 'Horizontal slider maximizes product exposure without consuming too much vertical space'
      }
    ]
  },
  
  // SaaS Templates
  {
    id: 'saas-conversion',
    name: 'SaaS Conversion Optimized',
    industry: 'saas',
    description: 'High-conversion wireframe template for SaaS products with feature highlights and social proof',
    sections: [
      {
        name: 'Hero with App Screenshot',
        sectionType: 'hero',
        layoutType: 'split-screen',
        components: [
          { type: 'heading', content: 'Main value proposition heading' },
          { type: 'paragraph', content: 'Subheading explaining the product benefit' },
          { type: 'button-group', content: 'Primary and secondary CTAs' },
          { type: 'image', content: 'App screenshot or mockup' }
        ],
        copySuggestions: {
          heading: 'The Complete Solution for [Problem]',
          subheading: 'Get started in minutes with no credit card required',
          cta: 'Start Free Trial'
        },
        designReasoning: 'Split-screen layout balances conversion copy with visual representation of the product'
      },
      {
        name: 'Social Proof Bar',
        sectionType: 'social-proof',
        layoutType: 'logo-bar',
        components: [
          { type: 'logo-grid', content: 'Customer logos in grayscale' }
        ],
        copySuggestions: {
          heading: 'Trusted by leading companies',
        },
        designReasoning: 'Social proof builds credibility and reduces signup hesitation'
      },
      {
        name: 'Feature Tabs',
        sectionType: 'features',
        layoutType: 'tabbed-content',
        components: [
          { type: 'tabs', content: 'Interactive tabs showing different features' },
          { type: 'image', content: 'Feature screenshot for each tab' },
          { type: 'text-block', content: 'Feature description' }
        ],
        copySuggestions: {
          heading: 'Powerful Features for Every Need',
        },
        designReasoning: 'Tabbed interface allows users to explore features without scrolling'
      }
    ]
  },
  
  // Healthcare Templates
  {
    id: 'healthcare-patient',
    name: 'Patient-Focused Healthcare',
    industry: 'healthcare',
    description: 'Accessible and trustworthy wireframe template for healthcare providers',
    sections: [
      {
        name: 'Reassuring Hero',
        sectionType: 'hero',
        layoutType: 'centered-content-overlay',
        components: [
          { type: 'heading', content: 'Trustworthy main heading' },
          { type: 'paragraph', content: 'Reassuring subheading' },
          { type: 'button', content: 'Book Appointment CTA' },
          { type: 'background-image', content: 'Caring medical professional image' }
        ],
        copySuggestions: {
          heading: 'Compassionate Care When You Need It Most',
          subheading: 'Trusted healthcare for you and your family',
          cta: 'Book an Appointment'
        },
        designReasoning: 'Warm, human-centered design builds trust and reduces patient anxiety'
      },
      {
        name: 'Service Finder',
        sectionType: 'services',
        layoutType: 'card-grid',
        components: [
          { type: 'service-card', content: 'Cards for different medical services' },
          { type: 'icon', content: 'Medical icons' }
        ],
        copySuggestions: {
          heading: 'Our Services',
          subheading: 'Comprehensive care for your health needs'
        },
        designReasoning: 'Clear organization of services helps patients quickly find relevant information'
      },
      {
        name: 'Doctor Profiles',
        sectionType: 'team',
        layoutType: 'profile-cards',
        components: [
          { type: 'profile-card', content: 'Doctor photo, name, specialty, credentials' },
          { type: 'button', content: 'View Profile CTA' }
        ],
        copySuggestions: {
          heading: 'Meet Our Specialists',
          subheading: 'Experienced professionals dedicated to your health'
        },
        designReasoning: 'Showcasing real doctors with credentials builds credibility and personal connection'
      }
    ]
  },
  
  // More industries can be added here...
];
