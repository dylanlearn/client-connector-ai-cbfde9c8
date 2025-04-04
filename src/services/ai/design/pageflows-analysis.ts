
import { WebsiteAnalysisService } from './website-analysis-service';

/**
 * Pre-analyzed PageFlows data for immediate use in the design memory system
 * Based on the screenshots and analysis provided by the user
 */
export const pageFlowsAnalysis = {
  /**
   * Store pre-analyzed PageFlows design patterns to enhance the AI design memory
   */
  storePageFlowsPatterns: async () => {
    console.log('Storing pre-analyzed PageFlows design patterns...');
    
    try {
      // Hero Section Analysis
      await WebsiteAnalysisService.storeWebsiteAnalysis({
        title: "PageFlows Hero Section - Brand & Social Proof Pattern",
        description: "PageFlows uses a hero section with a clear value proposition, strong headline, and app logo grid for immediate visual recognition and credibility. The section uses a dark background with a clear call-to-action and supporting text that explains the benefit.",
        category: "layout-hero",
        subcategory: "hero",
        visualElements: {
          layout: "Centered content with logo grid beneath the main headline",
          colorScheme: "Dark background with high contrast white text for readability",
          typography: "Large bold headline with smaller supporting text",
          spacing: "Generous whitespace between elements for clarity",
          imagery: "Grid of recognizable app logos (Netflix, Uber, Amazon, etc.)"
        },
        userExperience: {
          userFlow: "Entry point that immediately communicates value and credibility",
          interactions: "Clear CTAs: 'Try it Free' and 'Explore Flows' buttons",
          accessibility: "High contrast text for readability"
        },
        contentAnalysis: {
          headline: "Unlock UI/UX Inspiration with the Best User Flow Examples",
          subheadline: "Explore real-world user flows and design patterns from leading apps and websites.",
          callToAction: "Explore Flows",
          valueProposition: "Get design inspiration from real-world examples of successful apps",
          testimonials: []
        },
        targetAudience: [
          "UI/UX Designers",
          "Product Managers",
          "Developers",
          "Design Teams"
        ],
        effectivenessScore: 0.92,
        tags: [
          "hero-section",
          "social-proof",
          "value-proposition",
          "cta",
          "brand-showcase",
          "trust-signals"
        ],
        source: "pageflows.com",
        imageUrl: "public/lovable-uploads/3ffcf93f-2dca-479f-867d-cc445acdac8d.png"
      });
      
      // Testimonials Wall Analysis
      await WebsiteAnalysisService.storeWebsiteAnalysis({
        title: "PageFlows Testimonial Wall - Cross-Role Validation Pattern",
        description: "PageFlows uses a testimonial wall that showcases feedback from different roles (designers, product managers, founders) to appeal to a broad audience. The testimonials highlight specific benefits like '2,000+ recordings' and 'workflow improvement'.",
        category: "content-testimonials",
        subcategory: "testimonials",
        visualElements: {
          layout: "Grid layout with testimonial cards of consistent sizing",
          colorScheme: "Dark background with light text for high contrast",
          typography: "Quote styling with clear attribution showing name, role and company",
          spacing: "Grid layout with consistent spacing between testimonials",
          imagery: "User avatars and company logos for credibility"
        },
        userExperience: {
          userFlow: "Social proof section that appears after the main value proposition",
          interactions: "Cards have subtle hover effects to indicate they are interactive",
          accessibility: "Clear contrast between text and background"
        },
        contentAnalysis: {
          headline: "Trusted by Designers and Product Teams Worldwide",
          subheadline: "",
          callToAction: "",
          valueProposition: "Cross-role endorsement shows value for entire product teams",
          testimonials: [
            "Today I found that someone has recorded themself over 2,000 times going through different user flows on various apps and made them all available for $99 a year.",
            "Page Flows has been a game changer for our design team. The ability to see how top companies craft their experiences is invaluable.",
            "Using Page Flows has drastically improved my workflow. Not only does it help me solve UX problems, it's also super helpful to get validated by seeing what others are doing."
          ]
        },
        targetAudience: [
          "UI/UX Designers",
          "Product Managers",
          "Design Teams",
          "Company Founders"
        ],
        effectivenessScore: 0.88,
        tags: [
          "testimonials",
          "social-proof",
          "trust-building",
          "cross-role-appeal",
          "user-quotes"
        ],
        source: "pageflows.com",
        imageUrl: "public/lovable-uploads/4efe39c0-e0e0-4c25-a11a-d9f9648b0495.png"
      });
      
      // Persona Targeting Section Analysis
      await WebsiteAnalysisService.storeWebsiteAnalysis({
        title: "PageFlows Role-Based Value Proposition Pattern",
        description: "PageFlows uses a three-column layout to target specific personas (Designers, Product Managers, Developers) with custom benefit statements for each role. This approach positions the product as a cross-functional UX tool valuable to the entire product team.",
        category: "content-features",
        subcategory: "persona-targeting",
        visualElements: {
          layout: "Three-column grid with icon, heading, and description for each persona",
          colorScheme: "Dark theme with subtle color variations for each persona column",
          typography: "Clear hierarchy with role title and benefit description",
          spacing: "Consistent padding and alignment across all columns",
          imagery: "Persona avatars that represent each role visually"
        },
        userExperience: {
          userFlow: "Appears after general value proposition to show specific benefits by role",
          interactions: "Clear visual separation between persona sections",
          accessibility: "Consistent contrast and readable font sizes"
        },
        contentAnalysis: {
          headline: "Page Flows Empowers UX Research for All",
          subheadline: "Discover how leading brands design, test, and implement user experiences, and apply these proven strategies to your UI/UX designs.",
          callToAction: "",
          valueProposition: "Tailored benefits for each role in the product development process",
          testimonials: []
        },
        targetAudience: [
          "UI/UX Designers",
          "Product Managers",
          "Developers"
        ],
        effectivenessScore: 0.9,
        tags: [
          "persona-targeting",
          "role-based-messaging",
          "value-proposition",
          "feature-benefits",
          "cross-functional"
        ],
        source: "pageflows.com",
        imageUrl: "public/lovable-uploads/d9eb0f5d-57b5-4d7e-8da0-23bc6c9c83f1.png"
      });
      
      // Why Choose Us Section Analysis
      await WebsiteAnalysisService.storeWebsiteAnalysis({
        title: "PageFlows Feature Showcase - Flow Demonstration Pattern",
        description: "PageFlows showcases its value with real-world examples of user flows (onboarding, login, search, checkout) and screen recordings with annotations. This section effectively demonstrates the core product offering through visual examples.",
        category: "content-features",
        subcategory: "feature-showcase",
        visualElements: {
          layout: "Two-column layout with text on left and annotated screen recording on right",
          colorScheme: "Dark theme with highlighted UI elements in the demonstration",
          typography: "Clear headings and descriptive text explaining the value",
          spacing: "Balanced whitespace between text and visual elements",
          imagery: "Annotated screen recordings showing real user flows"
        },
        userExperience: {
          userFlow: "Demonstrates exactly what the user will get after signing up",
          interactions: "Visual timeline showing different steps in the user flow",
          accessibility: "Clear annotations and timestamps"
        },
        contentAnalysis: {
          headline: "Why Choose Page Flows?",
          subheadline: "Real-World User Flow Examples",
          callToAction: "",
          valueProposition: "See exactly how top companies design their user experiences through annotated recordings",
          testimonials: []
        },
        targetAudience: [
          "UI/UX Designers",
          "Product Teams",
          "UX Researchers"
        ],
        effectivenessScore: 0.94,
        tags: [
          "feature-showcase",
          "product-demo",
          "user-flows",
          "screen-recordings",
          "annotations",
          "onboarding",
          "checkout-flows"
        ],
        source: "pageflows.com",
        imageUrl: "public/lovable-uploads/0392ac21-110f-484c-8f3d-5fcbb0dcefc6.png"
      });
      
      // Overall Site Analysis
      await WebsiteAnalysisService.storeWebsiteAnalysis({
        title: "PageFlows Complete Site Analysis - UX Research Tool Pattern",
        description: "PageFlows presents itself as a comprehensive UX research tool with a strong focus on real-world examples and user flows. The site effectively targets multiple personas while maintaining a consistent dark theme with high contrast elements and a clear information hierarchy.",
        category: "site-analysis",
        subcategory: "ux-research-tool",
        visualElements: {
          layout: "Clean, modern layout with consistent section structure",
          colorScheme: "Dark theme with high contrast text and accent colors",
          typography: "Bold headlines with clear descriptive text",
          spacing: "Generous whitespace between sections",
          imagery: "App logos, user avatars, and screen recordings"
        },
        userExperience: {
          userFlow: "Logical progression from value proposition to social proof to specific benefits",
          interactions: "Clear call-to-action buttons and intuitive navigation",
          accessibility: "High contrast elements and consistent information hierarchy"
        },
        contentAnalysis: {
          headline: "Unlock UI/UX Inspiration with the Best User Flow Examples",
          subheadline: "Explore real-world user flows and design patterns from leading apps and websites.",
          callToAction: "Try it Free / Explore Flows",
          valueProposition: "Access to real-world UI/UX examples from leading apps to improve your design process",
          testimonials: [
            "Today I found that someone has recorded themself over 2,000 times going through different user flows on various apps and made them all available for $99 a year.",
            "Page Flows has been a game changer for our design team."
          ]
        },
        targetAudience: [
          "UI/UX Designers",
          "Product Managers",
          "Developers",
          "Design Teams",
          "UX Researchers"
        ],
        effectivenessScore: 0.91,
        tags: [
          "ux-research",
          "design-tool",
          "user-flows",
          "design-patterns",
          "cross-functional",
          "dark-theme",
          "saas-website"
        ],
        source: "pageflows.com",
        imageUrl: ""
      });
      
      console.log('PageFlows design patterns stored successfully');
      return true;
    } catch (error) {
      console.error('Error storing PageFlows design patterns:', error);
      return false;
    }
  }
};
