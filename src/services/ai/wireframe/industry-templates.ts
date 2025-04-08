import { WireframeGenerationParams } from './wireframe-types';

// Industry-specific wireframe templates
export const INDUSTRY_TEMPLATES: Record<string, Partial<WireframeGenerationParams>> = {
  ecommerce: {
    description: "E-commerce homepage with featured products, categories, and promotional sections",
    pageType: "homepage",
    style: "modern",
    componentTypes: ["navigation", "hero", "productGrid", "categoryCards", "testimonials", "newsletter", "footer"],
    colorScheme: {
      primary: "#4F46E5",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF"
    },
    stylePreferences: ["clean", "professional", "trustworthy"],
    colorTheme: "branded",
    complexity: "moderate"
  },
  
  saas: {
    description: "SaaS product landing page with feature highlights, pricing plans, and conversion elements",
    pageType: "landing",
    style: "minimal",
    componentTypes: ["navbar", "heroWithCta", "featureCards", "pricingTables", "testimonial", "faq", "footer"],
    colorScheme: {
      primary: "#2563EB",
      secondary: "#8B5CF6",
      accent: "#EC4899",
      background: "#F9FAFB"
    },
    stylePreferences: ["modern", "professional", "tech-focused"],
    colorTheme: "gradient",
    complexity: "moderate"
  },
  
  portfolio: {
    description: "Creative portfolio showcasing projects, skills, and contact information",
    pageType: "portfolio",
    style: "creative",
    componentTypes: ["headerMinimal", "projectShowcase", "skills", "biography", "contactForm", "socialLinks"],
    colorScheme: {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF"
    },
    stylePreferences: ["artistic", "expressive", "personal"],
    colorTheme: "vibrant",
    complexity: "simple"
  },
  
  agency: {
    description: "Agency website with services, portfolio, team, and contact information",
    pageType: "website",
    style: "modern",
    componentTypes: ["header", "serviceCard", "projectCard", "teamMember", "contactForm"],
    colorScheme: {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF"
    },
    stylePreferences: ["professional", "dynamic", "interactive"],
    colorTheme: "branded",
    complexity: "moderate"
  },
  
  restaurant: {
    description: "Restaurant website with menu, about, gallery, and contact information",
    pageType: "website",
    style: "modern",
    componentTypes: ["header", "menuItem", "aboutSection", "imageGallery", "reservationForm"],
    colorScheme: {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF"
    },
    stylePreferences: ["elegant", "interactive", "full-width"],
    colorTheme: "branded",
    complexity: "moderate"
  },
  
  realEstate: {
    description: "Real estate website with properties, agents, testimonials, and contact information",
    pageType: "website",
    style: "modern",
    componentTypes: ["header", "propertyCard", "agentProfile", "testimonialCard", "searchForm"],
    colorScheme: {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF"
    },
    stylePreferences: ["modern", "interactive", "map-integration"],
    colorTheme: "branded",
    complexity: "moderate"
  },
  
  travel: {
    description: "Travel agency website with destinations, tours, testimonials, and contact information",
    pageType: "website",
    style: "modern",
    componentTypes: ["header", "destinationCard", "tourPackage", "testimonialCard", "bookingForm"],
    colorScheme: {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF"
    },
    stylePreferences: ["vibrant", "interactive", "full-screen"],
    colorTheme: "branded",
    complexity: "moderate"
  },
  
  education: {
    description: "Education website with courses, events, testimonials, and contact information",
    pageType: "website",
    style: "modern",
    componentTypes: ["header", "courseCard", "eventItem", "testimonialCard", "applicationForm"],
    colorScheme: {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF"
    },
    stylePreferences: ["grid-courses", "interactive", "event-timeline"],
    colorTheme: "branded",
    complexity: "moderate"
  },
  
  health: {
    description: "Healthcare website with services, doctors, testimonials, and contact information",
    pageType: "website",
    style: "modern",
    componentTypes: ["header", "serviceCard", "doctorProfile", "testimonialCard", "appointmentForm"],
    colorScheme: {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF"
    },
    stylePreferences: ["clean-layout", "interactive", "service-blocks"],
    colorTheme: "branded",
    complexity: "moderate"
  }
};

// Legacy format templates - convert to proper WireframeGenerationParams
const legacyTemplates: Record<string, any> = {
  ecommerce: {
    title: "E-commerce Store",
    sections: ["header", "hero", "featured", "categories", "testimonials", "footer"],
    components: ["navigation", "search", "cart", "product-grid", "newsletter"],
    features: "Shopping cart functionality, product filters, and checkout process",
    colorSchemes: "Professional blues or vibrant with accent colors for CTAs",
    layoutOptions: "Grid-based with clear visual hierarchy and product showcases"
  },
  // ... other template entries
};

// Convert legacy templates to new format
Object.entries(legacyTemplates).forEach(([key, value]) => {
  if (!INDUSTRY_TEMPLATES[key]) {
    INDUSTRY_TEMPLATES[key] = {
      description: `${value.title} template with ${value.features}`,
      componentTypes: value.components,
      stylePreferences: [value.colorSchemes.split(" ")[0].toLowerCase()],
      style: "modern"
    };
  }
});

export default INDUSTRY_TEMPLATES;
