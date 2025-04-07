
import { ComponentDefinition } from '../component-registry';

/**
 * Interface for Hero Component data
 */
export interface HeroComponentProps {
  variant: string;
  headline: string;
  subheadline?: string;
  image?: string;
  cta?: {
    label: string;
    url: string;
  };
  ctaSecondary?: {
    label: string;
    url: string;
  };
  badge?: string;
  alignment?: 'left' | 'center' | 'right';
  backgroundStyle?: 'light' | 'dark' | 'image';
  styleNote?: string;
  mediaType?: 'image' | 'video' | 'illustration';
}

/**
 * Hero component variants for the wireframe editor
 */
export const heroVariants: HeroComponentProps[] = [
  // === CREATIVE VARIANTS ===
  {
    variant: 'hero-creative-001',
    headline: "Design Beyond Limits",
    subheadline: "Elevate your digital presence with expressive visuals.",
    image: "/placeholder.svg",
    cta: { label: "Explore Gallery", url: "/gallery" },
    ctaSecondary: { label: "Contact Sales", url: "/contact" },
    alignment: "center",
    backgroundStyle: "image",
    styleNote: "Creative layout with strong visual emphasis and image background",
    mediaType: "image"
  },
  {
    variant: 'hero-creative-002',
    headline: "Ideas in Motion",
    subheadline: "Animation meets strategy — build with fluid creativity.",
    image: "/placeholder.svg",
    cta: { label: "See in Action", url: "/motion" },
    alignment: "left",
    backgroundStyle: "dark",
    styleNote: "Dark creative layout ideal for animated visuals or motion showcases",
    mediaType: "video"
  },
  {
    variant: 'hero-creative-003',
    headline: "Art-Driven Interfaces",
    subheadline: "Because your brand deserves personality.",
    image: "/placeholder.svg",
    cta: { label: "Get Inspired", url: "/inspiration" },
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "Clean, art-focused layout for creative agencies or portfolios",
    mediaType: "illustration"
  },

  // === STARTUP-FOCUSED VARIANTS ===
  {
    variant: 'hero-startup-001',
    headline: "Launch Faster With AI Design",
    subheadline: "Generate, edit, and deploy in record time.",
    image: "/placeholder.svg",
    cta: { label: "Start Free Trial", url: "/signup" },
    ctaSecondary: { label: "Request Demo", url: "/demo" },
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Left-aligned startup hero with bold CTA and clean layout",
    mediaType: "image"
  },
  {
    variant: 'hero-startup-002',
    headline: "Build Better. Ship Quicker.",
    subheadline: "Tools that scale with your MVP.",
    image: "/placeholder.svg",
    cta: { label: "Book Demo", url: "/demo" },
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Center-aligned dark layout with strong contrast, ideal for SaaS startups",
    mediaType: "image"
  },
  {
    variant: 'hero-startup-003',
    headline: "Your Product, Front and Center",
    subheadline: "Clean, bold, and conversion-optimized.",
    image: "/placeholder.svg",
    cta: { label: "See Features", url: "/features" },
    alignment: "right",
    backgroundStyle: "light",
    styleNote: "Right-aligned hero for startups with product images",
    mediaType: "image"
  },
  {
    variant: 'hero-startup-004',
    headline: "No-Code. Full Control.",
    subheadline: "Ideal for fast-moving founders and small teams.",
    image: "/placeholder.svg",
    cta: { label: "Start Building", url: "/launch" },
    alignment: "center",
    backgroundStyle: "image",
    styleNote: "No-code hero with vibrant visual background and clear call-to-action",
    mediaType: "image"
  },

  // === ECOMMERCE VARIANTS ===
  {
    variant: 'hero-ecom-001',
    headline: "New Season. New Arrivals.",
    subheadline: "Shop the latest drops before they sell out.",
    image: "/placeholder.svg",
    cta: { label: "Shop Now", url: "/shop" },
    ctaSecondary: { label: "View All", url: "/products" },
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Retail-style eCommerce hero with left-aligned image and urgency",
    mediaType: "image"
  },
  {
    variant: 'hero-ecom-002',
    headline: "Style, Simplified",
    subheadline: "Discover curated essentials for everyday wear.",
    image: "/placeholder.svg",
    cta: { label: "Browse Collection", url: "/collection" },
    alignment: "center",
    backgroundStyle: "image",
    styleNote: "Elegant fashion-focused layout with image background",
    mediaType: "image"
  },
  {
    variant: 'hero-ecom-003',
    headline: "Tech Meets Lifestyle",
    subheadline: "Where innovation and comfort intersect.",
    image: "/placeholder.svg",
    cta: { label: "Shop Devices", url: "/products" },
    alignment: "right",
    backgroundStyle: "dark",
    styleNote: "Bold right-aligned tech-focused ecommerce layout",
    mediaType: "image"
  },

  // === FLEXIBLE/OTHER VARIANTS ===
  {
    variant: 'hero-flex-001',
    headline: "Your Ideas Deserve a Beautiful Start",
    subheadline: "Templates and tools for every industry.",
    image: "/placeholder.svg",
    cta: { label: "Browse Templates", url: "/templates" },
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "Flexible hero layout ideal for template platforms and multi-industry use",
    mediaType: "image"
  },
  {
    variant: 'hero-flex-002',
    headline: "Get Online in Minutes",
    subheadline: "Perfect for local businesses, agencies, and creators.",
    image: "/placeholder.svg",
    cta: { label: "Start Free", url: "/start" },
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Service-based hero for local or small business with left image",
    mediaType: "image"
  },
  {
    variant: 'hero-flex-003',
    headline: "Turn Your Vision Into a Page",
    subheadline: "Flexible layouts, instant feedback, live previews.",
    image: "/placeholder.svg",
    cta: { label: "Try the Builder", url: "/builder" },
    alignment: "center",
    backgroundStyle: "image",
    styleNote: "Platform-focused layout with flexible calls-to-action and visual backdrop",
    mediaType: "image"
  }
];

/**
 * Hero component definitions for the wireframe editor
 */
export const heroComponents: ComponentDefinition = {
  type: 'hero',
  name: 'Hero Section',
  description: 'Main banner section typically at the top of a page',
  category: 'content',
  icon: 'layout-dashboard',
  variants: [
    {
      id: 'hero-creative-001',
      name: 'Creative Hero 1',
      description: 'Creative layout with strong visual emphasis and image background',
    },
    {
      id: 'hero-creative-002',
      name: 'Creative Hero 2',
      description: 'Dark creative layout ideal for animated visuals or motion showcases',
    },
    {
      id: 'hero-creative-003',
      name: 'Creative Hero 3',
      description: 'Clean, art-focused layout for creative agencies or portfolios',
    },
    {
      id: 'hero-startup-001',
      name: 'Startup Hero 1',
      description: 'Left-aligned startup hero with bold CTA and clean layout',
    },
    {
      id: 'hero-startup-002',
      name: 'Startup Hero 2',
      description: 'Center-aligned dark layout with strong contrast, ideal for SaaS startups',
    },
    {
      id: 'hero-startup-003',
      name: 'Startup Hero 3',
      description: 'Right-aligned hero for startups with product images',
    },
    {
      id: 'hero-startup-004',
      name: 'Startup Hero 4',
      description: 'No-code hero with vibrant visual background and clear call-to-action',
    },
    {
      id: 'hero-ecom-001',
      name: 'eCommerce Hero 1',
      description: 'Retail-style eCommerce hero with left-aligned image and urgency',
    },
    {
      id: 'hero-ecom-002',
      name: 'eCommerce Hero 2',
      description: 'Elegant fashion-focused layout with image background',
    },
    {
      id: 'hero-ecom-003',
      name: 'eCommerce Hero 3',
      description: 'Bold right-aligned tech-focused ecommerce layout',
    },
    {
      id: 'hero-flex-001',
      name: 'Flexible Hero 1',
      description: 'Flexible hero layout ideal for template platforms and multi-industry use',
    },
    {
      id: 'hero-flex-002',
      name: 'Flexible Hero 2',
      description: 'Service-based hero for local or small business with left image',
    },
    {
      id: 'hero-flex-003',
      name: 'Flexible Hero 3',
      description: 'Platform-focused layout with flexible calls-to-action and visual backdrop',
    },
  ],
  fields: [
    {
      id: 'headline',
      name: 'Headline',
      type: 'text',
      description: 'Primary heading text',
      defaultValue: 'Main Headline Goes Here',
      validation: {
        required: true,
      },
    },
    {
      id: 'subheadline',
      name: 'Subheadline',
      type: 'textarea',
      description: 'Supporting text that appears below headline',
      defaultValue: 'This is a supporting text that provides more context to the headline above.',
    },
    {
      id: 'ctaText',
      name: 'CTA Button Text',
      type: 'text',
      description: 'Call to action button text',
      defaultValue: 'Get Started',
    },
    {
      id: 'ctaUrl',
      name: 'CTA URL',
      type: 'text',
      description: 'Call to action button link',
      defaultValue: '#',
    },
    {
      id: 'ctaSecondaryText',
      name: 'Secondary Button Text',
      type: 'text',
      description: 'Text for the secondary button',
      defaultValue: 'Learn More',
    },
    {
      id: 'ctaSecondaryUrl',
      name: 'Secondary Button URL',
      type: 'text',
      description: 'Link for the secondary button',
      defaultValue: '#',
    },
    {
      id: 'backgroundType',
      name: 'Background Type',
      type: 'select',
      description: 'Type of background for the hero section',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Image', value: 'image' },
      ],
    },
    {
      id: 'alignment',
      name: 'Content Alignment',
      type: 'select',
      description: 'Alignment of the hero content',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      id: 'imageUrl',
      name: 'Image URL',
      type: 'image',
      description: 'URL for the hero image',
      defaultValue: '',
    },
    {
      id: 'mediaType',
      name: 'Media Type',
      type: 'select',
      description: 'Type of media to display in the hero',
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Illustration', value: 'illustration' },
      ],
    },
    {
      id: 'badge',
      name: 'Badge Text',
      type: 'text',
      description: 'Optional badge text to display (e.g., "New", "Featured")',
      defaultValue: '',
    },
  ],
  defaultData: {
    name: 'Hero Section',
    sectionType: 'hero',
    componentVariant: 'hero-startup-001',
    data: {
      headline: 'Launch Faster With AI Design',
      subheadline: 'Generate, edit, and deploy in record time.',
      ctaText: 'Start Free Trial',
      ctaUrl: '/signup',
      ctaSecondaryText: 'Request Demo',
      ctaSecondaryUrl: '/demo',
      alignment: 'left',
      backgroundType: 'light',
      mediaType: 'image',
      imageUrl: '/placeholder.svg',
    },
    styleProperties: {
      padding: 'large',
      alignment: 'left',
    }
  }
};
