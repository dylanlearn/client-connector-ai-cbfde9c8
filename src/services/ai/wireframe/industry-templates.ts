import { WireframeGenerationParams } from "./wireframe-types";

/**
 * Industry-specific templates for wireframe generation
 */
export const industryTemplates = {
  /**
   * Template for e-commerce websites
   */
  ecommerce: {
    style: "modern",
    pageType: "e-commerce",
    componentTypes: ["product-grid", "product-card", "shopping-cart", "checkout", "filters"],
    colorTheme: "vibrant",
    description: `
      Create an e-commerce website wireframe with a clean modern design.
      Include a main product showcase section, featured products grid,
      category navigation, search functionality, cart preview, and call-to-action
      for special offers.
    `
  } as WireframeGenerationParams,
  
  /**
   * Template for SaaS (Software as a Service) websites
   */
  saas: {
    style: "minimal",
    pageType: "saas",
    componentTypes: ["feature-grid", "pricing-table", "testimonials", "integration-list"],
    colorTheme: "professional",
    description: `
      Create a SaaS website wireframe with a professional minimal design.
      Include a main hero section explaining the software solution,
      key features grid, pricing comparison table, customer testimonials,
      and integration logos. Focus on clear communication of value proposition.
    `
  } as WireframeGenerationParams,

  /**
   * Template for marketing agency websites
   */
  marketingAgency: {
    style: "creative",
    pageType: "agency",
    componentTypes: ["portfolio", "services-list", "case-studies", "team-bios"],
    colorTheme: "bold",
    description: `
      Create a marketing agency website wireframe with a bold creative design.
      Include a main portfolio section showcasing recent work,
      services list, case studies, team member bios, and contact form.
      Focus on visual appeal and clear calls-to-action.
    `
  } as WireframeGenerationParams,

  /**
   * Template for healthcare provider websites
   */
  healthcare: {
    style: "clean",
    pageType: "healthcare",
    componentTypes: ["appointment-form", "services-overview", "testimonials", "contact-details"],
    colorTheme: "calming",
    description: `
      Create a healthcare provider website wireframe with a clean calming design.
      Include an appointment booking form, services overview, patient testimonials,
      contact details, and doctor profiles. Focus on trust and ease of use.
    `
  } as WireframeGenerationParams,

  /**
   * Template for education institution websites
   */
  education: {
    style: "friendly",
    pageType: "education",
    componentTypes: ["course-list", "event-calendar", "admission-form", "faculty-profiles"],
    colorTheme: "friendly",
    description: `
      Create an education institution website wireframe with a friendly design.
      Include a course list, event calendar, admission form, faculty profiles,
      and campus tour. Focus on engaging content and clear navigation.
    `
  } as WireframeGenerationParams,

  /**
   * Template for real estate agency websites
   */
  realEstate: {
    style: "modern",
    pageType: "real-estate",
    componentTypes: ["property-listings", "search-filters", "agent-profiles", "virtual-tours"],
    colorTheme: "professional",
    description: `
      Create a real estate agency website wireframe with a modern professional design.
      Include property listings, search filters, agent profiles, virtual tours,
      and contact forms. Focus on high-quality visuals and easy navigation.
    `
  } as WireframeGenerationParams,

  /**
   * Template for travel agency websites
   */
  travelAgency: {
    style: "adventurous",
    pageType: "travel",
    componentTypes: ["destination-list", "package-deals", "booking-form", "travel-guides"],
    colorTheme: "vibrant",
    description: `
      Create a travel agency website wireframe with an adventurous vibrant design.
      Include a destination list, package deals, booking form, travel guides,
      and customer reviews. Focus on inspiring visuals and clear calls-to-action.
    `
  } as WireframeGenerationParams,

  /**
   * Template for restaurant websites
   */
  restaurant: {
    style: "inviting",
    pageType: "restaurant",
    componentTypes: ["menu-preview", "reservation-form", "photo-gallery", "location-map"],
    colorTheme: "warm",
    description: `
      Create a restaurant website wireframe with an inviting warm design.
      Include a menu preview, reservation form, photo gallery, location map,
      and customer testimonials. Focus on appetizing visuals and easy booking.
    `
  } as WireframeGenerationParams,

  /**
   * Template for personal portfolio websites
   */
  portfolio: {
    style: "minimal",
    pageType: "portfolio",
    componentTypes: ["project-gallery", "skills-list", "bio-section", "contact-form"],
    colorTheme: "neutral",
    description: `
      Create a personal portfolio website wireframe with a minimal neutral design.
      Include a project gallery, skills list, bio section, contact form,
      and resume download. Focus on clean presentation and clear calls-to-action.
    `
  } as WireframeGenerationParams,

  /**
   * Template for a landing page with a focus on lead generation
   */
  leadGeneration: {
    style: "modern",
    pageType: "landing-page",
    componentTypes: ["hero-section", "feature-list", "testimonial-slider", "lead-capture-form"],
    colorTheme: "persuasive",
    description: `
      Create a high-converting landing page wireframe with a modern design.
      Include a compelling hero section, key feature list, testimonial slider,
      and a prominent lead capture form. Focus on clear value proposition
      and persuasive calls-to-action.
    `
  } as WireframeGenerationParams,
};
