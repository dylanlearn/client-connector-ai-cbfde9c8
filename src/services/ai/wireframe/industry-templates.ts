import { WireframeGeneratorPrompt } from './wireframe-types';

// Template definitions for different industries
const ecommerceTemplate = {
  title: "E-commerce Website Template",
  sections: ["hero", "product-grid", "featured-products", "testimonials", "newsletter", "footer"],
  components: ["header", "product-card", "cart", "search", "filters"],
  features: (["product showcase", "shopping cart", "checkout flow", "product reviews"]).join(", "), // Convert to string
  colorSchemes: (["blue-green", "black-white-accent", "brand-neutral"]).join(", "), // Convert to string
  layoutOptions: (["grid", "masonry", "horizontal scroll"]).join(", "), // Convert to string
};

const portfolioTemplate = {
  title: "Portfolio Website Template",
  sections: ["hero", "projects", "about", "contact"],
  components: ["header", "project-card", "gallery", "contact-form"],
  features: (["project gallery", "about me", "contact form", "skills"]).join(", "), // Convert to string
  colorSchemes: (["monochrome", "earthy", "dark-mode"]).join(", "), // Convert to string
  layoutOptions: (["full-screen", "minimalist", "parallax"]).join(", "), // Convert to string
};

const saasTemplate = {
  title: "SaaS Landing Page Template",
  sections: ["hero", "features", "pricing", "testimonials", "cta", "footer"],
  components: ["header", "feature-block", "pricing-table", "testimonial-card", "form"],
  features: (["feature highlights", "pricing plans", "customer testimonials", "call to action"]).join(", "), // Convert to string
  colorSchemes: (["gradient", "tech-blue", "clean-white"]).join(", "), // Convert to string
  layoutOptions: (["single-page", "split-screen", "isometric"]).join(", "), // Convert to string
};

const blogTemplate = {
  title: "Blog Website Template",
  sections: ["hero", "blog-posts", "categories", "newsletter", "footer"],
  components: ["header", "blog-card", "category-list", "subscribe-form"],
  features: (["blog posts", "category filters", "search", "comments"]).join(", "), // Convert to string
  colorSchemes: (["light-theme", "vintage", "pastel"]).join(", "), // Convert to string
  layoutOptions: (["list-view", "grid-view", "masonry-grid"]).join(", "), // Convert to string
};

const agencyTemplate = {
  title: "Agency Website Template",
  sections: ["hero", "services", "portfolio", "team", "contact", "footer"],
  components: ["header", "service-card", "project-card", "team-member", "contact-form"],
  features: (["service offerings", "portfolio showcase", "team bios", "contact form"]).join(", "), // Convert to string
  colorSchemes: (["corporate", "bold-contrast", "modern-clean"]).join(", "), // Convert to string
  layoutOptions: (["interactive", "dynamic", "grid-based"]).join(", "), // Convert to string
};

const restaurantTemplate = {
  title: "Restaurant Website Template",
  sections: ["hero", "menu", "about", "gallery", "contact", "footer"],
  components: ["header", "menu-item", "about-section", "image-gallery", "reservation-form"],
  features: (["menu display", "online ordering", "image gallery", "reservation form"]).join(", "), // Convert to string
  colorSchemes: (["warm-tones", "rustic", "elegant"]).join(", "), // Convert to string
  layoutOptions: (["parallax-scrolling", "full-width", "image-focused"]).join(", "), // Convert to string
};

const realEstateTemplate = {
  title: "Real Estate Website Template",
  sections: ["hero", "properties", "agents", "testimonials", "contact", "footer"],
  components: ["header", "property-card", "agent-profile", "testimonial-card", "search-form"],
  features: (["property listings", "agent profiles", "property search", "contact form"]).join(", "), // Convert to string
  colorSchemes: (["neutral", "blue-accent", "modern-luxury"]).join(", "), // Convert to string
  layoutOptions: (["map-integration", "carousel", "grid-listings"]).join(", "), // Convert to string
};

const travelTemplate = {
  title: "Travel Agency Website Template",
  sections: ["hero", "destinations", "tours", "testimonials", "contact", "footer"],
  components: ["header", "destination-card", "tour-package", "testimonial-card", "booking-form"],
  features: (["destination showcase", "tour packages", "booking form", "customer reviews"]).join(", "), // Convert to string
  colorSchemes: (["vibrant", "ocean-blue", "nature-green"]).join(", "), // Convert to string
  layoutOptions: (["full-screen", "interactive-map", "carousel-tours"]).join(", "), // Convert to string
};

const educationTemplate = {
  title: "Education Website Template",
  sections: ["hero", "courses", "events", "testimonials", "contact", "footer"],
  components: ["header", "course-card", "event-item", "testimonial-card", "application-form"],
  features: (["course listings", "event calendar", "student testimonials", "application form"]).join(", "), // Convert to string
  colorSchemes: (["academic-blue", "bright-yellow", "clean-white"]).join(", "), // Convert to string
  layoutOptions: (["grid-courses", "event-timeline", "interactive-campus"]).join(", "), // Convert to string
};

const healthTemplate = {
  title: "Healthcare Website Template",
  sections: ["hero", "services", "doctors", "testimonials", "contact", "footer"],
  components: ["header", "service-card", "doctor-profile", "testimonial-card", "appointment-form"],
  features: (["service offerings", "doctor profiles", "appointment booking", "patient testimonials"]).join(", "), // Convert to string
  colorSchemes: (["medical-blue", "calm-green", "clean-white"]).join(", "), // Convert to string
  layoutOptions: (["clean-layout", "service-blocks", "doctor-grid"]).join(", "), // Convert to string
};

// Map of industry to template
export const industryTemplates: Record<string, Partial<WireframeGeneratorPrompt>> = {
  "ecommerce": ecommerceTemplate,
  "portfolio": portfolioTemplate,
  "saas": saasTemplate,
  "blog": blogTemplate,
  "agency": agencyTemplate,
  "restaurant": restaurantTemplate,
  "real-estate": realEstateTemplate,
  "travel": travelTemplate,
  "education": educationTemplate,
  "healthcare": healthTemplate,
};
