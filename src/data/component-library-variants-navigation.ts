
import { NavigationComponentProps } from '@/types/component-library';

// NAVIGATION SECTION COMPONENT LIBRARY (13 VARIANTS)
// Style Distribution: 3 Creative, 4 Startup-Focused, 3 eCommerce, 3 Flexible
// Inspired by: Apple, Shopify, Gymshark, Glossier, and user-provided design references

export const navigationVariants: NavigationComponentProps[] = [
  // === CREATIVE VARIANTS ===
  {
    variant: 'nav-startup-001', // Great for SaaS dashboards, startup platforms, and app landing pages that prioritize clean navigation and conversion
    logo: "/logos/launchpad.svg",
    links: [
      { label: "Features", url: "/features" },
      { label: "Pricing", url: "/pricing" },
      { label: "Resources", url: "/resources" }
    ],
    cta: { label: "Start Free Trial", url: "/signup" },
    mobileMenuStyle: "drawer",
    alignment: "left",
    backgroundStyle: "light",
    sticky: true,
    styleNote: "Sticky SaaS nav with drawer menu and clean CTA hierarchy"
  },
  {
    variant: 'nav-startup-002', // Ideal for dev-focused products, APIs, and technical communities with docs and search integration
    logo: "/logos/scaleit.svg",
    links: [
      { label: "Docs", url: "/docs" },
      { label: "API", url: "/api" },
      { label: "Community", url: "/community" }
    ],
    cta: { label: "Join Beta", url: "/beta" },
    backgroundStyle: "dark",
    mobileMenuStyle: "dropdown",
    alignment: "center",
    sticky: true,
    hasSearch: true,
    styleNote: "Developer-oriented SaaS nav with built-in search and beta funnel"
  },
  {
    variant: 'nav-startup-003', // Perfect for high-growth product sites that want bold branding and gradient-based UI appeal
    logo: "/logos/producthub.svg",
    links: [
      { label: "Product", url: "/product" },
      { label: "Teams", url: "/teams" },
      { label: "Login", url: "/login" }
    ],
    backgroundStyle: "gradient",
    alignment: "right",
    sticky: false,
    mobileMenuStyle: "overlay",
    styleNote: "Gradient startup nav with login CTA and high contrast"
  },
  {
    variant: 'nav-startup-004', // Designed for demo-focused products or Web3-style apps with rich visuals and CTA overlay
    logo: "/logos/buildflow.svg",
    links: [
      { label: "Solutions", url: "/solutions" },
      { label: "Pricing", url: "/pricing" },
      { label: "Company", url: "/company" }
    ],
    cta: { label: "Get a Demo", url: "/demo" },
    backgroundStyle: "image",
    alignment: "center",
    sticky: true,
    mobileMenuStyle: "drawer",
    styleNote: "Hero-style nav with blurred image background and demo funnel"
  },

  // === ECOMMERCE VARIANTS ===
  {
    variant: 'nav-ecom-001', // Best for beauty brands, DTC shops, or minimalist ecommerce — includes search and category UX
    logo: "/logos/glossier-lite.svg",
    links: [
      { label: "Shop All", url: "/shop" },
      { label: "Best Sellers", url: "/bestsellers" },
      { label: "Skin", url: "/skin" }
    ],
    hasSearch: true,
    sticky: true,
    backgroundStyle: "light",
    alignment: "left",
    mobileMenuStyle: "dropdown",
    styleNote: "Glossier-inspired beauty nav with soft colors and sticky UX"
  },
  {
    variant: 'nav-ecom-002', // Great for fitness apparel or gear-based ecommerce — includes CTA/cart trigger and strong visual hierarchy
    logo: "/logos/gymedge.svg",
    links: [
      { label: "Men", url: "/men" },
      { label: "Women", url: "/women" },
      { label: "Gear", url: "/gear" }
    ],
    cta: { label: "Cart (2)", url: "/cart" },
    hasSearch: true,
    backgroundStyle: "dark",
    alignment: "center",
    sticky: true,
    mobileMenuStyle: "drawer",
    styleNote: "Bold, Gymshark-style nav with cart CTA and category nav"
  },
  {
    variant: 'nav-ecom-003', // Ideal for premium electronics or high-end product brands — works great on hero overlays and light UI
    logo: "/logos/applesimple.svg",
    links: [
      { label: "Mac", url: "/mac" },
      { label: "iPhone", url: "/iphone" },
      { label: "Watch", url: "/watch" }
    ],
    backgroundStyle: "transparent",
    alignment: "center",
    sticky: true,
    mobileMenuStyle: "overlay",
    styleNote: "Ultra-minimal Apple-style nav with icon focus and glass hover"
  },

  // === FLEXIBLE/OTHER VARIANTS ===
  {
    variant: 'nav-flex-001', // Tailored for coaching platforms, consultants, or service providers offering booked sessions or free trials
    logo: "/logos/coachhub.svg",
    links: [
      { label: "Programs", url: "/programs" },
      { label: "Testimonials", url: "/testimonials" },
      { label: "Contact", url: "/contact" }
    ],
    cta: { label: "Book Free Session", url: "/book" },
    backgroundStyle: "light",
    alignment: "left",
    sticky: true,
    mobileMenuStyle: "dropdown",
    styleNote: "Coaching-style nav with soft branding and session CTA"
  },
  {
    variant: 'nav-flex-002', // Works well for online education, membership sites, or instructor hubs with centralized resources
    logo: "/logos/teachmore.svg",
    links: [
      { label: "Courses", url: "/courses" },
      { label: "Resources", url: "/resources" },
      { label: "Support", url: "/support" }
    ],
    backgroundStyle: "light",
    sticky: true,
    hasSearch: true,
    alignment: "center",
    mobileMenuStyle: "drawer",
    styleNote: "Education-style nav for LMS or instructors"
  },
  {
    variant: 'nav-flex-003', // Designed for freelancers, creative professionals, or small agencies — especially those who pitch via project-based CTAs
    logo: "/logos/freelanceflow.svg",
    links: [
      { label: "Work", url: "/work" },
      { label: "Rates", url: "/rates" },
      { label: "FAQ", url: "/faq" }
    ],
    cta: { label: "Start a Project", url: "/contact" },
    backgroundStyle: "image",
    alignment: "right",
    sticky: false,
    mobileMenuStyle: "overlay",
    styleNote: "Freelancer-style nav with subtle image layer and project CTA"
  }
];
