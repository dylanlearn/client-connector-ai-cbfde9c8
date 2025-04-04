/**
 * Service for industry-specific wireframe templates
 */
export const IndustryTemplateService = {
  /**
   * Get template suggestions for a specific industry
   */
  getTemplatesForIndustry: (industry: string) => {
    // Default/fallback template
    const defaultTemplate = {
      sections: [
        {
          name: "Hero",
          sectionType: "hero",
          layoutType: "centered",
          layout: { type: "centered-content" },
          components: [
            { type: "heading", content: "Welcome to Our Website" },
            { type: "paragraph", content: "We provide quality services to meet your needs." },
            { type: "button", content: "Get Started" }
          ],
          copySuggestions: {
            heading: "Welcome to Our Website",
            subheading: "We provide quality services to meet your needs.",
            cta: "Get Started"
          }
        },
        {
          name: "Features",
          sectionType: "features",
          layoutType: "grid",
          layout: { type: "grid-layout" },
          components: [
            { type: "heading", content: "Our Features" },
            { type: "feature-card", content: "Feature 1" },
            { type: "feature-card", content: "Feature 2" },
            { type: "feature-card", content: "Feature 3" }
          ],
          copySuggestions: {
            heading: "Our Features",
            subheading: "Discover what makes us special"
          }
        },
        {
          name: "Contact",
          sectionType: "contact",
          layoutType: "split",
          layout: { type: "split-layout" },
          components: [
            { type: "heading", content: "Get In Touch" },
            { type: "form", content: "Contact Form" },
            { type: "map", content: "Location Map" }
          ],
          copySuggestions: {
            heading: "Get In Touch",
            subheading: "We'd love to hear from you"
          }
        }
      ]
    };

    // Industry-specific templates
    switch (industry.toLowerCase()) {
      case 'ecommerce':
        return {
          sections: [
            {
              name: "Hero",
              sectionType: "hero",
              layoutType: "split",
              layout: { type: "split-layout" },
              components: [
                { type: "heading", content: "Shop the Latest Products" },
                { type: "image", content: "Product Showcase" },
                { type: "button", content: "Shop Now" }
              ],
              copySuggestions: {
                heading: "Shop the Latest Products",
                subheading: "Quality items at competitive prices",
                cta: "Shop Now"
              }
            },
            {
              name: "Featured Products",
              sectionType: "products",
              layoutType: "grid",
              layout: { type: "product-grid" },
              components: [
                { type: "heading", content: "Featured Products" },
                { type: "product-card", content: "Product 1" },
                { type: "product-card", content: "Product 2" },
                { type: "product-card", content: "Product 3" }
              ],
              copySuggestions: {
                heading: "Featured Products",
                subheading: "Our best selling items"
              }
            },
            {
              name: "Testimonials",
              sectionType: "testimonials",
              layoutType: "carousel",
              layout: { type: "carousel-layout" },
              components: [
                { type: "heading", content: "What Our Customers Say" },
                { type: "testimonial-card", content: "Testimonial 1" },
                { type: "testimonial-card", content: "Testimonial 2" },
                { type: "testimonial-card", content: "Testimonial 3" }
              ],
              copySuggestions: {
                heading: "What Our Customers Say",
                subheading: "Real reviews from satisfied customers"
              }
            }
          ]
        };
      
      case 'portfolio':
        return {
          sections: [
            {
              name: "Hero",
              sectionType: "hero",
              layoutType: "fullwidth",
              layout: { type: "fullwidth-layout" },
              components: [
                { type: "heading", content: "Hi, I'm [Name]" },
                { type: "paragraph", content: "I create amazing designs" },
                { type: "button", content: "View My Work" }
              ],
              copySuggestions: {
                heading: "Hi, I'm [Name]",
                subheading: "I create amazing designs",
                cta: "View My Work"
              }
            },
            {
              name: "Portfolio",
              sectionType: "portfolio",
              layoutType: "masonry",
              layout: { type: "masonry-grid" },
              components: [
                { type: "heading", content: "My Work" },
                { type: "portfolio-item", content: "Project 1" },
                { type: "portfolio-item", content: "Project 2" },
                { type: "portfolio-item", content: "Project 3" }
              ],
              copySuggestions: {
                heading: "My Work",
                subheading: "Check out my latest projects"
              }
            },
            {
              name: "Skills",
              sectionType: "skills",
              layoutType: "list",
              layout: { type: "list-layout" },
              components: [
                { type: "heading", content: "My Skills" },
                { type: "skill-bar", content: "Skill 1" },
                { type: "skill-bar", content: "Skill 2" },
                { type: "skill-bar", content: "Skill 3" }
              ],
              copySuggestions: {
                heading: "My Skills",
                subheading: "What I bring to the table"
              }
            }
          ]
        };
      
      default:
        return defaultTemplate;
    }
  },

  /**
   * Get all available templates
   */
  getAllTemplates: () => {
    return {
      'default': IndustryTemplateService.getTemplatesForIndustry('default'),
      'ecommerce': IndustryTemplateService.getTemplatesForIndustry('ecommerce'),
      'portfolio': IndustryTemplateService.getTemplatesForIndustry('portfolio')
    };
  },

  /**
   * Apply a template by ID
   */
  applyTemplate: (templateId: string) => {
    // If template ID is actually an industry name
    if (['ecommerce', 'portfolio', 'default'].includes(templateId.toLowerCase())) {
      return IndustryTemplateService.getTemplatesForIndustry(templateId);
    }

    // Otherwise, use a default template
    return IndustryTemplateService.getTemplatesForIndustry('default');
  }
};
