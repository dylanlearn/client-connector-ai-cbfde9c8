
import { DesignReference } from '../types/design-references-types';

/**
 * Curated list of high-quality website design references
 * organized by category with relevant metadata
 */
export const websiteDesignReferences: DesignReference[] = [
  // SaaS Websites
  {
    name: 'Notion',
    description: 'Productivity tool with clean, minimal design for complex functionality',
    url: 'https://notion.so',
    category: 'saas',
    tags: ['productivity', 'minimalist', 'clean', 'software'],
    visualElements: {
      layout: 'Clean, hierarchical layout with ample whitespace',
      colorScheme: 'Monochromatic with slight accents',
      typography: 'Sans-serif, clear hierarchy',
      spacing: 'Generous spacing between elements',
      imagery: 'Simple illustrations and screenshots'
    }
  },
  {
    name: 'Slack',
    description: 'Team communication platform with friendly, accessible design',
    url: 'https://slack.com',
    category: 'saas',
    tags: ['communication', 'colorful', 'friendly', 'accessible'],
    visualElements: {
      layout: 'Grid-based with clear sections',
      colorScheme: 'Bold brand colors with purple primary',
      typography: 'Friendly sans-serif with varied weights',
      spacing: 'Consistent rhythm throughout the page',
      imagery: 'Lifestyle photos and product screenshots'
    }
  },
  
  // Startup Landing Pages
  {
    name: 'Linear.app',
    description: 'Issue tracking with sleek, high-contrast design',
    url: 'https://linear.app',
    category: 'startup-landing',
    tags: ['productivity', 'dark-theme', 'sleek', 'gradients'],
    visualElements: {
      layout: 'Vertical sections with full-width content',
      colorScheme: 'Dark theme with vibrant accents and gradients',
      typography: 'Clean sans-serif with tight line heights',
      spacing: 'Strategic spacing to group related content',
      imagery: 'Product UI with glow effects and gradients'
    }
  },
  {
    name: 'Arc Browser',
    description: 'Next-gen browser with bold, colorful design',
    url: 'https://arc.net',
    category: 'startup-landing',
    tags: ['browser', 'colorful', 'bold', 'modern'],
    visualElements: {
      layout: 'Large hero section with split-screen layouts',
      colorScheme: 'Vibrant multi-color palette',
      typography: 'Bold headlines with clear hierarchy',
      spacing: 'Dramatic use of negative space',
      imagery: 'Product screenshots with animated elements'
    }
  },
  
  // Developer Tools / API Products
  {
    name: 'Supabase',
    description: 'Backend-as-a-service with developer-friendly design',
    url: 'https://supabase.com',
    category: 'developer-tools',
    tags: ['baas', 'code-friendly', 'dark-theme', 'technical'],
    visualElements: {
      layout: 'Code-focused with clear documentation layout',
      colorScheme: 'Dark theme with green accent',
      typography: 'Monospace for code, sans-serif for content',
      spacing: 'Dense but organized information hierarchy',
      imagery: 'Code snippets and technical diagrams'
    }
  },
  {
    name: 'Stripe',
    description: 'Payment platform with premium, trustworthy design',
    url: 'https://stripe.com',
    category: 'developer-tools',
    tags: ['payments', 'premium', 'trustworthy', 'gradient'],
    visualElements: {
      layout: 'Alternating sections with strong visual anchors',
      colorScheme: 'Purple gradients with white space',
      typography: 'Premium sans-serif with varied weights',
      spacing: 'Balanced spacing with rhythm',
      imagery: 'Abstract 3D elements and product UI'
    }
  },
  
  // AI Product Pages
  {
    name: 'ChatGPT',
    description: 'AI assistant with clean, minimalist design',
    url: 'https://chat.openai.com',
    category: 'ai-product',
    tags: ['ai', 'minimal', 'clean', 'conversational'],
    visualElements: {
      layout: 'Conversation-focused interface',
      colorScheme: 'Neutral palette with green accent',
      typography: 'Clean sans-serif with clear hierarchy',
      spacing: 'Comfortable reading spacing',
      imagery: 'Minimal use of imagery, focus on text'
    }
  },
  {
    name: 'Midjourney',
    description: 'AI art generation with immersive, gallery-like design',
    url: 'https://midjourney.com',
    category: 'ai-product',
    tags: ['ai', 'art', 'gallery', 'immersive'],
    visualElements: {
      layout: 'Gallery-style masonry grid',
      colorScheme: 'Dark theme to showcase colorful artwork',
      typography: 'Minimal, unobtrusive text',
      spacing: 'Dense image gallery with minimal spacing',
      imagery: 'Showcase of AI-generated artwork'
    }
  }
  
  // Add more categories as needed from the user's list
];
