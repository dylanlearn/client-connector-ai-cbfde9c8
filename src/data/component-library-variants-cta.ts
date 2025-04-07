
import { CTAComponentProps } from '@/types/component-library';

// CTA Component Variants
export const ctaVariants: CTAComponentProps[] = [
  // === CREATIVE VARIANTS ===
  {
    variant: 'cta-creative-001',
    headline: "Join the Creative Community",
    subheadline: "Connect with artists, designers, and thinkers",
    cta: { label: "Join Now", url: "/join" },
    backgroundStyle: "light",
    alignment: "center",
    styleNote: "Clean, minimal CTA with ample whitespace and strong typography"
  },
  {
    variant: 'cta-creative-002',
    headline: "Let's Make Something Beautiful",
    subheadline: "Collaborate on your next visual project",
    cta: { label: "Start Creating", url: "/create" },
    ctaSecondary: { label: "See Examples", url: "/gallery" },
    backgroundStyle: "image",
    alignment: "left",
    styleNote: "Left-aligned CTA on image background with dual actions"
  },
  {
    variant: 'cta-creative-003',
    headline: "Design Without Limits",
    subheadline: "Premium tools for serious creatives",
    cta: { label: "Explore Pro Tools", url: "/tools" },
    backgroundStyle: "dark",
    alignment: "right",
    styleNote: "Dark-mode CTA with right alignment and minimal UI",
    testimonial: {
      quote: "Completely transformed my workflow.",
      author: "Alex Chen, Art Director"
    }
  },

  // === STARTUP-FOCUSED VARIANTS ===
  {
    variant: 'cta-startup-001',
    headline: "Launch With Confidence",
    subheadline: "Built for founders, devs, and product teams.",
    cta: { label: "Start Free", url: "/signup" },
    ctaSecondary: { label: "Book Demo", url: "/demo" },
    backgroundStyle: "light",
    alignment: "center",
    styleNote: "SaaS startup CTA with dual actions, mono fonts, light tone"
  },
  {
    variant: 'cta-startup-002',
    headline: "Scale Without Limits",
    subheadline: "The infrastructure you won't outgrow.",
    cta: { label: "Request Access", url: "/waitlist" },
    backgroundStyle: "dark",
    alignment: "left",
    styleNote: "Dark-mode focused layout with left-anchored gradient and early access language"
  },
  {
    variant: 'cta-startup-003',
    headline: "Next-Level Product Teams",
    subheadline: "Move faster with real-time design sync.",
    cta: { label: "Join Beta", url: "/beta" },
    backgroundStyle: "image",
    alignment: "right",
    styleNote: "SaaS product-style image CTA with right aligned typography and button"
  },
  {
    variant: 'cta-startup-004',
    headline: "You Build, We Back It",
    subheadline: "Developer-friendly APIs and no-code tools.",
    cta: { label: "Explore Docs", url: "/docs" },
    ctaSecondary: { label: "Join Discord", url: "/community" },
    backgroundStyle: "gradient",
    alignment: "center",
    styleNote: "Gradient tech-style CTA with dev/discord integrations and buttons"
  },

  // === ECOMMERCE VARIANTS ===
  {
    variant: 'cta-ecom-001',
    headline: "Don't Miss This Drop",
    subheadline: "Limited edition gear. Available now.",
    cta: { label: "Shop Now", url: "/shop" },
    backgroundStyle: "image",
    alignment: "center",
    styleNote: "Gymshark-inspired launch banner with CTA-centered layout"
  },
  {
    variant: 'cta-ecom-002',
    headline: "Unlock Glossier Perks",
    subheadline: "Subscribe for product tips & special drops",
    cta: { label: "Subscribe", url: "/newsletter" },
    backgroundStyle: "light",
    alignment: "left",
    styleNote: "Soft aesthetic, opt-in form style CTA with newsletter integration"
  },
  {
    variant: 'cta-ecom-003',
    headline: "The Apple Experience",
    subheadline: "Premium gear. Financing available.",
    cta: { label: "Learn More", url: "/product" },
    backgroundStyle: "dark",
    alignment: "center",
    styleNote: "Minimalist dark background with high-contrast CTA button"
  },

  // === FLEXIBLE/OTHER VARIANTS ===
  {
    variant: 'cta-flex-001',
    headline: "Grow Your Audience",
    subheadline: "For creators, educators, and marketers.",
    cta: { label: "Start for Free", url: "/start" },
    backgroundStyle: "light",
    alignment: "center",
    styleNote: "Universal creator CTA block with balanced tone"
  },
  {
    variant: 'cta-flex-002',
    headline: "Try It With Your Team",
    subheadline: "No cards. No contracts. Just value.",
    cta: { label: "Try Free", url: "/trial" },
    ctaSecondary: { label: "Schedule Call", url: "/call" },
    backgroundStyle: "gradient",
    alignment: "left",
    styleNote: "Business-style conversion CTA with dual paths and bright gradient"
  },
  {
    variant: 'cta-flex-003',
    headline: "Need Help Deciding?",
    subheadline: "Reach out to a human or browse our templates.",
    cta: { label: "Talk to Support", url: "/support" },
    backgroundStyle: "image",
    alignment: "right",
    styleNote: "Support-oriented layout with human-centered photo + CTA"
  }
];
