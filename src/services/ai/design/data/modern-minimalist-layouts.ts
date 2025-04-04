
import { DesignPattern, DesignPatternCollection } from '../types/design-patterns';

/**
 * Collection of modern minimalist layout patterns
 * that are currently trending and optimized for conversions
 */
export const modernMinimalistLayouts: DesignPatternCollection = [
  {
    id: 'dark-hero-dual-image',
    name: 'Dark Hero with Dual Images',
    description: 'A high-contrast dark background with bold typography, centered content, a clear CTA, and dual imagery below. Highly effective for conversions.',
    category: 'landing-page',
    conversionOptimized: true,
    tags: ['minimalist', 'dark-theme', 'bold-typography', 'dual-imagery', 'high-contrast'],
    elements: {
      background: 'Dark (typically black or very dark gray)',
      typography: 'Large, bold, sans-serif headline with clean subtext',
      layout: 'Centered content with vertical flow and balanced dual images',
      cta: 'High-contrast button with simple, direct text',
      spacing: 'Generous whitespace between sections',
      branding: 'Minimal logo placement, usually top-left'
    },
    bestFor: ['Startups', 'Digital agencies', 'SaaS products', 'Creative services', 'Professional services'],
    conversionFeatures: [
      'Bold headline that clearly communicates value proposition',
      'Minimal distractions focus attention on core message',
      'Strategic placement of CTA in high-visibility area',
      'Social proof section with logo showcase',
      'Human imagery to create emotional connection'
    ],
    responsiveConsiderations: [
      'Dual images stack vertically on mobile',
      'Typography scales down gracefully on smaller screens',
      'Maintain adequate touch targets for CTA buttons'
    ]
  },
  {
    id: 'minimal-split-screen',
    name: 'Minimal Split Screen Layout',
    description: 'Clean layout that divides the screen into two sections, typically with text content on one side and visual content on the other.',
    category: 'landing-page',
    conversionOptimized: true,
    tags: ['split-screen', 'minimal', 'balanced', 'high-contrast'],
    elements: {
      background: 'Can be light or dark, often with high contrast between sections',
      typography: 'Bold headlines with clean body text, ample line spacing',
      layout: 'Horizontal split on desktop, vertical stack on mobile',
      cta: 'Positioned prominently within the text section',
      spacing: 'Clear separation between content blocks',
      branding: 'Subtle branding elements that don\'t compete with core message'
    },
    bestFor: ['Product showcases', 'Portfolio sites', 'SaaS products', 'Fashion brands', 'Real estate'],
    conversionFeatures: [
      'Visual balance creates pleasing aesthetic that keeps users engaged',
      'Clear content hierarchy guides users through conversion process',
      'Simple navigation minimizes decision fatigue',
      'Each section focuses on one key message or action'
    ],
    responsiveConsiderations: [
      'Section order matters when stacking vertically on mobile',
      'Consider content priority for mobile users',
      'Maintain adequate spacing between sections'
    ]
  },
  {
    id: 'saas-dashboard-layout',
    name: 'Modern SaaS Dashboard Layout',
    description: 'Clean, card-based interface with ample whitespace designed for B2B SaaS platforms, product management tools, and analytics dashboards.',
    category: 'application',
    conversionOptimized: true,
    tags: ['dashboard', 'card-based', 'data-visualization', 'business', 'analytics'],
    elements: {
      background: 'Light neutral background (#F5F7FA or similar) with white cards',
      typography: 'Clear hierarchical typography system with emphasis on readability',
      layout: 'Top navigation with user controls, sidebar for main navigation, content area with responsive grid',
      cta: 'Contextual action buttons within cards and modules',
      spacing: 'Consistent spacing system with room for data-dense displays',
      branding: 'Subtle brand elements integrated into navigation and accent elements'
    },
    bestFor: ['B2B SaaS', 'Product management tools', 'Analytics platforms', 'Enterprise applications'],
    conversionFeatures: [
      'Task-oriented interface reduces cognitive load',
      'Modular components that maintain information hierarchy',
      'Strategic data visualization for quick understanding',
      'Contextual actions that promote feature discovery'
    ],
    responsiveConsiderations: [
      'Collapsible sidebar for mobile views',
      'Responsive data visualization components',
      'Prioritized actions for smaller screens',
      'Touch-friendly interaction targets'
    ]
  },
  {
    id: 'ecommerce-product-showcase',
    name: 'Full-width E-commerce Product Showcase',
    description: 'Visually rich product presentation layout for fashion, home goods, and consumer products, designed to highlight product details and drive conversions.',
    category: 'e-commerce',
    conversionOptimized: true,
    tags: ['product-focused', 'imagery', 'retail', 'shopping', 'conversion-optimized'],
    elements: {
      background: 'Clean white or light neutral backgrounds to emphasize product imagery',
      typography: 'Elegant typography with clear hierarchy for product details and pricing',
      layout: 'Full-width product imagery with minimal navigation and grid-based product displays',
      cta: 'High-contrast, prominent "Add to Cart" CTAs with clear purchase pathways',
      spacing: 'Strategic white space around products to avoid visual crowding',
      branding: 'Consistent brand elements that enhance but don\'t compete with products'
    },
    bestFor: ['Fashion', 'Home goods', 'Consumer products', 'Luxury items', 'Specialty retail'],
    conversionFeatures: [
      'Large hero product imagery creates emotional connection',
      'Minimal product cards with effective hover states',
      'Typography emphasis on product quality and details',
      'Sticky add-to-cart elements reduce friction to purchase',
      'Social proof elements strategically placed near decision points'
    ],
    responsiveConsiderations: [
      'Optimized product imagery for mobile devices',
      'Simplified navigation for mobile shoppers',
      'Touch-friendly product galleries',
      'Streamlined mobile checkout experience'
    ]
  },
  {
    id: 'creative-agency-portfolio',
    name: 'Immersive Case Study Layout',
    description: 'Bold, visually-driven layout that showcases creative work through immersive case studies, ideal for design agencies and creative studios.',
    category: 'portfolio',
    conversionOptimized: true,
    tags: ['creative', 'portfolio', 'case-study', 'visual', 'agency'],
    elements: {
      background: 'Strategic use of white space with image-heavy content areas',
      typography: 'Bold typography with varying sizes for dramatic visual hierarchy',
      layout: 'Asymmetrical grid layouts with alternating text and image blocks',
      cta: 'Subtle but clear contact/collaboration CTAs integrated into the narrative',
      spacing: 'Vertical rhythm with consistent spacing and strategic use of negative space',
      branding: 'Distinctive brand voice expressed through typography and micro-interactions'
    },
    bestFor: ['Design agencies', 'Creative studios', 'Portfolios', 'Photographers', 'Architectural firms'],
    conversionFeatures: [
      'Full-bleed imagery showcasing work creates impact',
      'Smooth scrolling transitions maintain engagement',
      'Strategic storytelling through visual hierarchy',
      'Testimonials integrated within case studies for credibility',
      'Clear pathways to contact or collaboration'
    ],
    responsiveConsiderations: [
      'Optimized imagery loading for mobile devices',
      'Adjusted typography scale for smaller screens',
      'Reimagined grid layouts for vertical viewing',
      'Touch-optimized interaction patterns'
    ]
  },
  {
    id: 'startup-split-hero',
    name: 'Split-screen Startup Hero Section',
    description: 'High-impact hero section that divides the screen between compelling content and relevant imagery, ideal for tech startups and digital products.',
    category: 'landing-page',
    conversionOptimized: true,
    tags: ['startup', 'hero-section', 'split-screen', 'tech', 'product-launch'],
    elements: {
      background: 'Clean with strategic color accents, often using subtle gradients',
      typography: 'Bold, concise headline with supporting subheading that explains value',
      layout: 'Horizontal split between content and imagery on desktop, stacked on mobile',
      cta: 'High-contrast primary action button with optional secondary action',
      spacing: 'Generous whitespace with visual elements that guide eye movement',
      branding: 'Integrated brand elements that establish identity without distraction'
    },
    bestFor: ['Tech startups', 'SaaS products', 'Mobile apps', 'Digital products', 'Innovative services'],
    conversionFeatures: [
      'Clear, concise value proposition immediately visible',
      'Visual hierarchy emphasizing primary action',
      'Social proof elements (logos, numbers) establishing credibility',
      'Limited options to reduce decision fatigue',
      'Strategic use of visual elements to direct attention'
    ],
    responsiveConsiderations: [
      'Content-first approach on mobile devices',
      'Optimized imagery for various screen sizes',
      'Maintained prominence of primary CTA on all devices',
      'Adjusted spacing system for different breakpoints'
    ]
  },
  {
    id: 'content-first-blog',
    name: 'Content-first Reading Experience',
    description: 'Typography-driven design optimized for readability and engagement, ideal for blogs, publications, and content-heavy websites.',
    category: 'content',
    conversionOptimized: true,
    tags: ['blog', 'reading', 'typography', 'content', 'publishing'],
    elements: {
      background: 'Clean, often white or very light neutral for maximum readability',
      typography: 'Carefully selected serif or sans-serif fonts optimized for reading comfort',
      layout: 'Centered content with ideal reading width (around 680px) and strategic white space',
      cta: 'Contextual CTAs related to content consumption (subscribe, share, related content)',
      spacing: 'Generous line height and paragraph spacing for reading comfort',
      branding: 'Subtle brand elements that establish identity without disrupting reading flow'
    },
    bestFor: ['Publishing', 'Blogs', 'Media sites', 'Newsletters', 'Documentation'],
    conversionFeatures: [
      'Typography-driven design prioritizing readability and engagement',
      'Subtle animations for page transitions maintain context',
      'Clear content hierarchy guiding reading progression',
      'Minimal distractions during reading experience',
      'Strategic placement of related content recommendations'
    ],
    responsiveConsiderations: [
      'Adjusted type scale for different device sizes',
      'Maintained optimal reading width across devices',
      'Touch-friendly navigation controls',
      'Careful handling of embedded media on small screens'
    ]
  }
];
