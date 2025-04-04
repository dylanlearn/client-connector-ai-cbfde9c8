export const ecommerceTemplate = {
  id: "ecommerce-standard",
  name: "E-Commerce Standard",
  sections: [
    {
      name: "Hero Banner",
      sectionType: "hero",
      layoutType: "full-width",
      layout: {
        type: "standard-hero",
        alignment: "center"
      }, // Added missing layout property
      components: [
        { type: "hero-image", content: "Product showcase image" },
        { type: "heading", content: "Shop Our Latest Collection" },
        { type: "cta-button", content: "Shop Now" }
      ],
      copySuggestions: {
        heading: "Discover Our Premium Collection",
        subheading: "Quality products for your lifestyle",
        cta: "Browse Products"
      },
      designReasoning: "A bold hero section grabs attention and immediately showcases featured products."
    },
    {
      name: "Product Categories",
      sectionType: "grid",
      layoutType: "contained",
      layout: {
        type: "grid",
        columns: 3
      }, // Added missing layout property
      components: [
        { type: "category-card", content: "Category 1" },
        { type: "category-card", content: "Category 2" },
        { type: "category-card", content: "Category 3" }
      ],
      copySuggestions: {
        heading: "Shop By Category"
      },
      designReasoning: "Categorized product display helps users quickly find what they're looking for."
    },
    {
      name: "Featured Products",
      sectionType: "products",
      layoutType: "contained",
      layout: {
        type: "slider",
        items: 4
      }, // Added missing layout property
      components: [
        { type: "product-card", content: "Product 1" },
        { type: "product-card", content: "Product 2" },
        { type: "product-card", content: "Product 3" },
        { type: "product-card", content: "Product 4" }
      ],
      copySuggestions: {
        heading: "Bestsellers",
        subheading: "Our most popular items this season"
      },
      designReasoning: "Highlighting popular products increases conversion rates and showcases your best offerings."
    }
  ],
};

export const saasTemplate = {
  id: "saas-standard",
  name: "SaaS Standard",
  sections: [
    {
      name: "Hero Banner",
      sectionType: "hero",
      layoutType: "full-width",
      layout: {
        type: "split-hero",
        alignment: "left"
      }, // Added missing layout property
      components: [
        { type: "hero-image", content: "Software dashboard preview" },
        { type: "heading", content: "Simplify Your Workflow" },
        { type: "subheading", content: "All-in-one solution for your business needs" },
        { type: "cta-button", content: "Start Free Trial" }
      ],
      copySuggestions: {
        heading: "Boost Your Team's Productivity",
        subheading: "The all-in-one platform that streamlines your workflow",
        cta: "Try For Free"
      },
      designReasoning: "Clean hero section with product screenshot immediately communicates the software's value proposition."
    },
    {
      name: "Features Section",
      sectionType: "features",
      layoutType: "contained",
      layout: {
        type: "grid",
        columns: 3
      }, // Added missing layout property
      components: [
        { type: "feature-card", content: "Feature 1" },
        { type: "feature-card", content: "Feature 2" },
        { type: "feature-card", content: "Feature 3" }
      ],
      copySuggestions: {
        heading: "Key Features"
      },
      designReasoning: "Concise feature highlights help users quickly understand the product's capabilities."
    },
    {
      name: "How It Works",
      sectionType: "process",
      layoutType: "contained",
      layout: {
        type: "timeline",
        steps: 3
      }, // Added missing layout property
      components: [
        { type: "step-card", content: "Step 1" },
        { type: "step-card", content: "Step 2" },
        { type: "step-card", content: "Step 3" }
      ],
      copySuggestions: {
        heading: "How It Works",
        subheading: "Getting started is easy"
      },
      designReasoning: "Step-by-step explanation reduces friction in the user adoption process."
    }
  ],
};

export const portfolioTemplate = {
  id: "portfolio-standard",
  name: "Portfolio Standard",
  sections: [
    {
      name: "Hero Banner",
      sectionType: "hero",
      layoutType: "full-width",
      layout: {
        type: "creative-hero",
        alignment: "center"
      }, // Added missing layout property
      components: [
        { type: "profile-image", content: "Professional photo" },
        { type: "heading", content: "John Doe" },
        { type: "subheading", content: "UX Designer & Developer" },
        { type: "cta-button", content: "View My Work" }
      ],
      copySuggestions: {
        heading: "Creating Digital Experiences",
        subheading: "Specializing in UI/UX and web development",
        cta: "Explore My Projects"
      },
      designReasoning: "A personal introduction creates a connection with potential clients and employers."
    },
    {
      name: "About Me",
      sectionType: "about",
      layoutType: "contained",
      layout: {
        type: "split",
        alignment: "left"
      }, // Added missing layout property
      components: [
        { type: "image", content: "Personal image" },
        { type: "heading", content: "About Me" },
        { type: "paragraph", content: "Brief biography" }
      ],
      copySuggestions: {
        heading: "My Story",
        subheading: "Background and experience"
      },
      designReasoning: "Personal background information builds trust and shows personality."
    },
    {
      name: "Portfolio Gallery",
      sectionType: "gallery",
      layoutType: "contained",
      layout: {
        type: "masonry",
        columns: 3
      }, // Added missing layout property
      components: [
        { type: "project-card", content: "Project 1" },
        { type: "project-card", content: "Project 2" },
        { type: "project-card", content: "Project 3" }
      ],
      copySuggestions: {
        heading: "Recent Projects",
        subheading: "Selected works from my portfolio"
      },
      designReasoning: "Visual showcase of work is essential for a portfolio site."
    }
  ],
};
