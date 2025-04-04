
import { WireframeData } from './wireframe-types';

// Sample industry-specific wireframe templates
const industryTemplates: Record<string, WireframeData> = {
  ecommerce: {
    title: "E-Commerce Website",
    description: "A standard e-commerce website template with product listings, cart, and checkout flow.",
    sections: [
      {
        name: "Hero Section",
        sectionType: "hero",
        layoutType: "full-width",
        layout: { type: "standard-layout", alignment: "center" },
        components: [
          { type: "heading", content: "Welcome to Our Store" },
          { type: "paragraph", content: "Discover amazing products at great prices." },
          { type: "button", content: "Shop Now" }
        ],
        copySuggestions: {
          heading: "Welcome to Our Store",
          subheading: "Discover amazing products at great prices.",
          cta: "Shop Now"
        },
        description: "Main hero banner with promotional message"
      },
      {
        name: "Featured Products",
        sectionType: "products",
        layoutType: "grid",
        layout: { type: "grid-layout", columns: 3 },
        components: [
          { type: "heading", content: "Featured Products" },
          { type: "product-card", content: "Product 1" },
          { type: "product-card", content: "Product 2" },
          { type: "product-card", content: "Product 3" }
        ],
        copySuggestions: {
          heading: "Featured Products",
          subheading: "Our top picks this week",
          cta: "View All"
        },
        description: "Display of featured or top-selling products"
      }
    ],
    designTokens: {
      colors: {
        primary: "#4a90e2",
        secondary: "#50e3c2",
        accent: "#b8e986",
        background: "#ffffff",
        text: "#333333"
      },
      typography: {
        headings: "Montserrat, sans-serif",
        body: "Open Sans, sans-serif"
      }
    }
  },
  
  portfolio: {
    title: "Portfolio Website",
    description: "A professional portfolio website for showcasing work and skills.",
    sections: [
      {
        name: "Hero Section",
        sectionType: "hero",
        layoutType: "full-width",
        layout: { type: "standard-layout", alignment: "left" },
        components: [
          { type: "heading", content: "Hi, I'm [Name]" },
          { type: "paragraph", content: "I'm a professional specializing in [field]." },
          { type: "button", content: "View My Work" }
        ],
        copySuggestions: {
          heading: "Hi, I'm [Name]",
          subheading: "I'm a professional specializing in [field].",
          cta: "View My Work"
        },
        description: "Personal introduction and key message"
      },
      {
        name: "Portfolio Gallery",
        sectionType: "gallery",
        layoutType: "masonry",
        layout: { type: "masonry-layout" },
        components: [
          { type: "heading", content: "My Work" },
          { type: "image", content: "Project 1" },
          { type: "image", content: "Project 2" },
          { type: "image", content: "Project 3" }
        ],
        copySuggestions: {
          heading: "My Work",
          subheading: "Selected projects and case studies",
          cta: "See more"
        },
        description: "Gallery showcase of work samples and projects"
      }
    ],
    designTokens: {
      colors: {
        primary: "#333333",
        secondary: "#6200ee",
        accent: "#03dac6",
        background: "#ffffff",
        text: "#333333"
      },
      typography: {
        headings: "Playfair Display, serif",
        body: "Raleway, sans-serif"
      }
    }
  },
  
  business: {
    title: "Business Website",
    description: "A professional website for businesses and organizations.",
    sections: [
      {
        name: "Hero Section",
        sectionType: "hero",
        layoutType: "split",
        layout: { type: "split-layout", ratio: "60-40" },
        components: [
          { type: "heading", content: "We Help Businesses Grow" },
          { type: "paragraph", content: "Strategic solutions for modern challenges." },
          { type: "button", content: "Learn More" },
          { type: "image", content: "Business Image" }
        ],
        copySuggestions: {
          heading: "We Help Businesses Grow",
          subheading: "Strategic solutions for modern challenges.",
          cta: "Learn More"
        },
        description: "Main banner with value proposition"
      },
      {
        name: "Services",
        sectionType: "services",
        layoutType: "cards",
        layout: { type: "card-layout", columns: 3 },
        components: [
          { type: "heading", content: "Our Services" },
          { type: "service-card", content: "Service 1" },
          { type: "service-card", content: "Service 2" },
          { type: "service-card", content: "Service 3" }
        ],
        copySuggestions: {
          heading: "Our Services",
          subheading: "How we can help your business thrive",
          cta: "Get Started"
        },
        description: "Services offered by the business"
      }
    ],
    designTokens: {
      colors: {
        primary: "#0056b3",
        secondary: "#6c757d",
        accent: "#ffc107",
        background: "#ffffff",
        text: "#212529"
      },
      typography: {
        headings: "Merriweather, serif",
        body: "Source Sans Pro, sans-serif"
      }
    }
  }
};

/**
 * Service for working with industry-specific wireframe templates
 */
export const industryTemplateService = {
  /**
   * Get template data for a specific industry
   */
  getTemplatesForIndustry: (industry: string): WireframeData | undefined => {
    const normalizedIndustry = industry.toLowerCase().trim();
    
    // Try to find exact match
    if (industryTemplates[normalizedIndustry]) {
      return industryTemplates[normalizedIndustry];
    }
    
    // Try to find partial match
    for (const key of Object.keys(industryTemplates)) {
      if (key.includes(normalizedIndustry) || normalizedIndustry.includes(key)) {
        return industryTemplates[key];
      }
    }
    
    // Default to business if no match found
    return industryTemplates.business;
  },
  
  /**
   * Get all available industry templates
   */
  getAllTemplates: (): Record<string, WireframeData> => {
    return { ...industryTemplates };
  },
  
  /**
   * Get a list of available industry names
   */
  getAvailableIndustries: (): string[] => {
    return Object.keys(industryTemplates);
  }
};

// For backward compatibility
export const IndustryTemplateService = industryTemplateService;
