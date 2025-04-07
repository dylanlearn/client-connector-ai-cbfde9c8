import { 
  PricingComponentProps, 
  TestimonialComponentProps,
  FeatureGridComponentProps,
  FAQComponentProps,
  CTAComponentProps
} from '@/types/component-library';
import { faqVariants } from './component-library-variants-faq';
import { ctaVariants } from './component-library-variants-cta';

// ================================
// Pricing Component Variants
// ================================
export const pricingVariants: PricingComponentProps[] = [
  // === CREATIVE VARIANTS ===
  {
    variant: 'pricing-creative-001',
    title: "Simple, Transparent Pricing",
    description: "No hidden fees. No surprises.",
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "Creative layout with clean columns and optional iconography",
    mediaType: "icon",
    plans: [
      {
        name: "Starter",
        price: "$12/mo",
        description: "Basic tools to get started",
        features: ["1 Project", "Community Support"],
        cta: { label: "Get Started", url: "/signup" },
        badge: "Most Popular"
      },
      {
        name: "Pro",
        price: "$24/mo",
        features: ["5 Projects", "Priority Support"],
        cta: { label: "Choose Plan", url: "/pro" }
      }
    ]
  },
  {
    variant: 'pricing-creative-002',
    title: "Flexible Tiers for Growing Teams",
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Dark layout with alternating visual backgrounds per plan",
    mediaType: "none",
    plans: [
      {
        name: "Team",
        price: "$39/mo",
        description: "Built for collaboration",
        features: ["10 Projects", "Custom Domains"],
        cta: { label: "Start Now", url: "/team" }
      },
      {
        name: "Agency",
        price: "$79/mo",
        features: ["Unlimited Projects", "White Label"],
        cta: { label: "Go Agency", url: "/agency" }
      }
    ]
  },
  {
    variant: 'pricing-creative-003',
    title: "Designed for Scale",
    description: "Plans that evolve with your growth",
    alignment: "left",
    backgroundStyle: "image",
    styleNote: "Creative background image and stacked layout with visual tiering",
    mediaType: "image",
    plans: [
      {
        name: "Growth",
        price: "$49/mo",
        features: ["100K Monthly Visits", "Analytics"],
        cta: { label: "Try Growth", url: "/growth" },
        badge: "Best Value"
      },
      {
        name: "Enterprise",
        price: "Custom",
        features: ["Unlimited Usage", "Dedicated Manager"],
        cta: { label: "Talk to Sales", url: "/contact" }
      }
    ]
  },
  // === STARTUP-FOCUSED VARIANTS ===
  {
    variant: 'pricing-startup-001',
    title: "Launch With Confidence",
    description: "Startups love our free-to-paid flow",
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "Straightforward layout with large CTAs, great for MVPs",
    mediaType: "none",
    plans: [
      {
        name: "Free",
        price: "$0/mo",
        features: ["1 Project", "Limited Support"],
        cta: { label: "Try Free", url: "/signup" }
      },
      {
        name: "Pro",
        price: "$20/mo",
        features: ["Unlimited Projects", "Email Support"],
        cta: { label: "Upgrade Now", url: "/upgrade" }
      }
    ]
  },
  {
    variant: 'pricing-startup-002',
    title: "Plans for Every Stage",
    description: "From solo makers to funded startups",
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Table layout with aligned rows for feature comparison",
    mediaType: "none",
    plans: [
      {
        name: "Starter",
        price: "$10/mo",
        features: ["2 Projects", "Email Support"],
        cta: { label: "Start", url: "/starter" }
      },
      {
        name: "Growth",
        price: "$30/mo",
        features: ["10 Projects", "Analytics"],
        cta: { label: "Choose Growth", url: "/growth" }
      },
      {
        name: "Scale",
        price: "$70/mo",
        features: ["50 Projects", "Priority Support"],
        cta: { label: "Go Scale", url: "/scale" },
        badge: "Popular"
      }
    ]
  },
  {
    variant: 'pricing-startup-003',
    title: "One Simple Price",
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Single-column plan focused on early-stage clarity",
    mediaType: "icon",
    plans: [
      {
        name: "Flat",
        price: "$15/mo",
        description: "Everything you need, one price",
        features: ["Unlimited Pages", "No Hidden Fees"],
        cta: { label: "Sign Up", url: "/flat" }
      }
    ]
  },
  {
    variant: 'pricing-startup-004',
    title: "Flexible Billing Options",
    alignment: "right",
    backgroundStyle: "image",
    styleNote: "Split layout with pricing and FAQ side-by-side",
    mediaType: "image",
    plans: [
      {
        name: "Monthly",
        price: "$19/mo",
        features: ["All Features Included"],
        cta: { label: "Go Monthly", url: "/monthly" }
      },
      {
        name: "Annual",
        price: "$190/yr",
        features: ["2 Months Free"],
        cta: { label: "Save with Annual", url: "/annual" },
        badge: "Save 16%"
      }
    ]
  },
  // === ECOMMERCE VARIANTS ===
  {
    variant: 'pricing-ecom-001',
    title: "Buy Once, Own Forever",
    description: "Transparent pricing for physical and digital products.",
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Inspired by Shopify templates — classic two-column layout with product icons",
    mediaType: "icon",
    plans: [
      {
        name: "Single Product",
        price: "$29",
        features: ["1-Time Payment", "No Renewal"],
        cta: { label: "Purchase Now", url: "/buy" }
      },
      {
        name: "Bundle Pack",
        price: "$79",
        features: ["3 Products Included", "Free Shipping"],
        cta: { label: "Buy Bundle", url: "/bundle" },
        badge: "Best Deal"
      }
    ]
  },
  {
    variant: 'pricing-ecom-002',
    title: "Your Style. Your Subscription.",
    description: "Glossier-style subscription plans for curated delivery.",
    alignment: "center",
    backgroundStyle: "image",
    styleNote: "Image-driven layout with soft tones, inspired by Glossier",
    mediaType: "image",
    plans: [
      {
        name: "Monthly",
        price: "$15/mo",
        features: ["1 Box/Month", "Free Samples"],
        cta: { label: "Subscribe", url: "/subscribe" }
      },
      {
        name: "Annual",
        price: "$150/yr",
        features: ["Save 20%", "Exclusive Perks"],
        cta: { label: "Go Annual", url: "/annual" },
        badge: "Popular"
      }
    ]
  },
  {
    variant: 'pricing-ecom-003',
    title: "Premium Tech. Flexible Payments.",
    description: "Apple-style layout with high-end branding",
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Sleek, minimal layout styled after Apple checkout plans",
    mediaType: "image",
    plans: [
      {
        name: "Pay Monthly",
        price: "$99/mo",
        features: ["iPad Pro 11\"", "AppleCare Included"],
        cta: { label: "Pay Monthly", url: "/checkout" }
      },
      {
        name: "Pay in Full",
        price: "$1,099",
        features: ["One-time Payment"],
        cta: { label: "Buy Now", url: "/buy" }
      }
    ]
  },
  // === FLEXIBLE/OTHER VARIANTS ===
  {
    variant: 'pricing-flex-001',
    title: "Affordable Plans for Every Industry",
    description: "Used by educators, creatives, and coaches.",
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "Educational platform-style table with simplified plan types",
    mediaType: "none",
    plans: [
      {
        name: "Basic",
        price: "$5/mo",
        features: ["Lesson Uploads", "Basic Analytics"],
        cta: { label: "Start Teaching", url: "/basic" }
      },
      {
        name: "Professional",
        price: "$20/mo",
        features: ["Certificates", "Student Messaging"],
        cta: { label: "Go Pro", url: "/pro" },
        badge: "Top Pick"
      }
    ]
  },
  {
    variant: 'pricing-flex-002',
    title: "Transparent Pricing for Local Services",
    description: "Great for agencies, cleaners, and home services",
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Local business style, left-aligned text and service descriptions",
    mediaType: "none",
    plans: [
      {
        name: "Hourly",
        price: "$45/hr",
        features: ["No Minimum", "Same-Day Booking"],
        cta: { label: "Book Now", url: "/book" }
      },
      {
        name: "Monthly Retainer",
        price: "$400/mo",
        features: ["Priority Support", "Routine Service"],
        cta: { label: "Set Up Retainer", url: "/retainer" }
      }
    ]
  },
  {
    variant: 'pricing-flex-003',
    title: "Nonprofit & Educational Discounts",
    description: "Supportive pricing for mission-driven orgs",
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Donation-style tiering with CTA for contact",
    mediaType: "icon",
    plans: [
      {
        name: "Nonprofit",
        price: "$10/mo",
        features: ["All Features", "Unlimited Projects"],
        cta: { label: "Apply Discount", url: "/nonprofit" }
      },
      {
        name: "University",
        price: "$30/mo",
        features: ["License for Departments"],
        cta: { label: "Join Campus Plan", url: "/edu" }
      }
    ]
  }
]; 

// ================================
// Testimonial Component Variants
// ================================
export const testimonialVariants: TestimonialComponentProps[] = [
  // === CREATIVE VARIANTS ===
  {
    variant: 'testimonial-creative-001',
    title: "Loved by Creators Everywhere",
    subtitle: "See what our community is saying.",
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "Card-style layout with overlapping avatars and bold type",
    mediaType: "avatar",
    testimonials: [
      {
        quote: "This platform unlocked my design potential.",
        author: "Ava R.",
        role: "Art Director",
        avatar: "/avatars/ava.png"
      },
      {
        quote: "Finally, a tool that matches my creative flow.",
        author: "Jules H.",
        avatar: "/avatars/jules.png"
      }
    ]
  },
  {
    variant: 'testimonial-creative-002',
    title: "Words That Move",
    subtitle: "Captured on stage and behind the scenes.",
    alignment: "left",
    backgroundStyle: "image",
    styleNote: "Overlay testimonial on image background, elegant serif fonts",
    mediaType: "none",
    testimonials: [
      {
        quote: "Working with them was like creating performance art.",
        author: "Niko L.",
        role: "Performer"
      }
    ]
  },
  {
    variant: 'testimonial-creative-003',
    title: "Studio Stories",
    subtitle: "Case studies from our creative partners.",
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Horizontal scrolling testimonial carousel with logo overlays",
    mediaType: "logo",
    testimonials: [
      {
        quote: "A perfect fit for our experimental workflows.",
        author: "Keira V.",
        brandLogo: "/logos/studiok.png"
      }
    ]
  },
  // === STARTUP-FOCUSED VARIANTS ===
  {
    variant: 'testimonial-startup-001',
    title: "Trusted by Founders",
    subtitle: "Built with speed and scale in mind.",
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Left-aligned stacked layout with logo badges",
    mediaType: "logo",
    testimonials: [
      {
        quote: "I launched our MVP in 3 days thanks to this platform.",
        author: "Jordan B.",
        brandLogo: "/logos/founderhype.svg"
      }
    ]
  },
  {
    variant: 'testimonial-startup-002',
    title: "Startup-Approved",
    subtitle: "Built by product teams who ship fast.",
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Grid layout with mono-style font and avatars",
    mediaType: "avatar",
    testimonials: [
      {
        quote: "A true product-led experience.",
        author: "Megan T.",
        role: "Product Manager",
        avatar: "/avatars/megan.png"
      },
      {
        quote: "Saves us time on every launch.",
        author: "Raymond P.",
        avatar: "/avatars/raymond.png"
      }
    ]
  },
  {
    variant: 'testimonial-startup-003',
    title: "Accelerated Teams",
    subtitle: "Why founders love building here.",
    alignment: "right",
    backgroundStyle: "light",
    styleNote: "Slider layout with bold headings and pull quotes",
    mediaType: "avatar",
    testimonials: [
      {
        quote: "Rapid iteration made real.",
        author: "Sasha Y.",
        avatar: "/avatars/sasha.png"
      }
    ]
  },
  {
    variant: 'testimonial-startup-004',
    title: "Proof in Performance",
    subtitle: "Impact statements from our power users.",
    alignment: "center",
    backgroundStyle: "image",
    styleNote: "Image-overlay block quote with translucent background",
    mediaType: "none",
    testimonials: [
      {
        quote: "Cut our dev/design cycles in half.",
        author: "Felix D."
      }
    ]
  },
  // === ECOMMERCE VARIANTS ===
  {
    variant: 'testimonial-ecom-001',
    title: "What Our Customers Say",
    subtitle: "Inspired by Shopify + Glossier product reviews.",
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Product review-style cards with customer avatars",
    mediaType: "avatar",
    testimonials: [
      {
        quote: "Super comfy and stylish — ordering again!",
        author: "Tessa L.",
        avatar: "/avatars/tessa.png"
      }
    ]
  },
  {
    variant: 'testimonial-ecom-002',
    title: "Real Style. Real People.",
    subtitle: "Powered by user-generated reviews.",
    alignment: "center",
    backgroundStyle: "image",
    styleNote: "Lifestyle testimonials with photo-first layouts (Glossier-style)",
    mediaType: "avatar",
    testimonials: [
      {
        quote: "These drops are 🔥. I'm a customer for life.",
        author: "Dez P."
      }
    ]
  },
  {
    variant: 'testimonial-ecom-003',
    title: "Trusted by Thousands",
    subtitle: "Apple-style elegance with star rating UI.",
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Clean testimonial layout with optional rating or icons",
    mediaType: "none",
    testimonials: [
      {
        quote: "Exceptional quality. From packaging to product.",
        author: "Cory N."
      }
    ]
  },
  // === FLEXIBLE/OTHER VARIANTS ===
  {
    variant: 'testimonial-flex-001',
    title: "Stories from Clients",
    subtitle: "Perfect for service providers or coaches.",
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Testimonial + author image + brief summary card",
    mediaType: "avatar",
    testimonials: [
      {
        quote: "My sessions booked out after updating my site.",
        author: "Emma R.",
        avatar: "/avatars/emma.png"
      }
    ]
  },
  {
    variant: 'testimonial-flex-002',
    title: "Nonprofit Voices",
    subtitle: "Real feedback from partner organizations.",
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "Simple center-aligned block quotes with organization logos",
    mediaType: "logo",
    testimonials: [
      {
        quote: "We saw increased volunteer signups instantly.",
        author: "Samira W.",
        brandLogo: "/logos/impacthub.png"
      }
    ]
  },
  {
    variant: 'testimonial-flex-003',
    title: "Local Client Results",
    subtitle: "Small business-ready layout with punchy quotes.",
    alignment: "right",
    backgroundStyle: "light",
    styleNote: "Side-by-side layout with bold testimonial and author image",
    mediaType: "avatar",
    testimonials: [
      {
        quote: "I went from 2 to 12 leads/week!",
        author: "Leo G.",
        avatar: "/avatars/leo.png"
      }
    ]
  }
];

// ================================
// Feature Grid Component Variants
// ================================
export const featureGridVariants: FeatureGridComponentProps[] = [
  // === CREATIVE VARIANTS ===
  {
    variant: 'feature-creative-001',
    title: "What Sets Us Apart",
    subtitle: "Our values in visual form.",
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "Creative 3-column layout with abstract iconography",
    mediaType: "icon",
    columns: 3,
    features: [
      {
        title: "Design-First",
        description: "Built with beauty and function.",
        icon: "palette"
      },
      {
        title: "Flexible Workflows",
        description: "Adapt to any process or creative stack.",
        icon: "layers"
      },
      {
        title: "Collaboration-Ready",
        description: "Tools to support teams of all sizes.",
        icon: "users"
      }
    ]
  },
  {
    variant: 'feature-creative-002',
    title: "Interactive Experiences",
    subtitle: "Dynamic content meets performance.",
    alignment: "left",
    backgroundStyle: "image",
    styleNote: "2-column layout with image previews of animations",
    mediaType: "image",
    columns: 2,
    features: [
      {
        title: "Scroll Effects",
        description: "Enhance engagement via motion.",
        image: "/features/scroll.gif"
      },
      {
        title: "Hover Previews",
        description: "Delightful interactivity.",
        image: "/features/hover.png"
      }
    ]
  },
  {
    variant: 'feature-creative-003',
    title: "Creative Stack",
    subtitle: "For modern creators and freelancers.",
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Icon + headline cards with studio-style design",
    mediaType: "icon",
    columns: 3,
    features: [
      {
        title: "Figma Native",
        icon: "figma"
      },
      {
        title: "AI Writing",
        icon: "sparkles"
      },
      {
        title: "Voice UI",
        icon: "mic"
      }
    ]
  },
  // === STARTUP-FOCUSED VARIANTS ===
  {
    variant: 'feature-startup-001',
    title: "Why Startups Choose Us",
    subtitle: "Optimized for fast-moving teams.",
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "Grid layout with flat icons and consistent structure",
    mediaType: "icon",
    columns: 3,
    features: [
      {
        title: "Launch Fast",
        description: "Get to MVP in days not months.",
        icon: "rocket"
      },
      {
        title: "Scalable Design",
        icon: "trending-up"
      },
      {
        title: "All-in-One Platform",
        icon: "grid"
      }
    ]
  },
  {
    variant: 'feature-startup-002',
    title: "Built for Product Teams",
    subtitle: "Everything from ideation to delivery.",
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Side-aligned features with staggered icons",
    mediaType: "icon",
    columns: 2,
    features: [
      {
        title: "Product Boards",
        icon: "layout"
      },
      {
        title: "Docs + Dev Sync",
        icon: "code"
      }
    ]
  },
  {
    variant: 'feature-startup-003',
    title: "We Power Builders",
    subtitle: "Used by over 10,000 founders.",
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Feature checklist format with bright icons",
    mediaType: "icon",
    columns: 3,
    features: [
      {
        title: "Built-in Analytics",
        icon: "bar-chart"
      },
      {
        title: "No-code Support",
        icon: "zap"
      },
      {
        title: "Developer Ready",
        icon: "terminal"
      }
    ]
  },
  {
    variant: 'feature-startup-004',
    title: "Everything You Need to Ship",
    alignment: "right",
    backgroundStyle: "image",
    styleNote: "Dark-themed feature banner with side-scroll",
    mediaType: "image",
    columns: 4,
    features: [
      {
        title: "Custom Domains",
        image: "/features/domain.png"
      },
      {
        title: "API Access",
        image: "/features/api.png"
      },
      {
        title: "Instant Publishing",
        image: "/features/publish.png"
      },
      {
        title: "SEO Toolkit",
        image: "/features/seo.png"
      }
    ]
  },
  // === ECOMMERCE VARIANTS ===
  {
    variant: 'feature-ecom-001',
    title: "Why Customers Choose Us",
    subtitle: "Shopify-style grid of feature benefits",
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Icon-focused 2-column layout with ecommerce tone",
    mediaType: "icon",
    columns: 2,
    features: [
      {
        title: "Free Returns",
        description: "30-day hassle-free returns",
        icon: "refresh-cw"
      },
      {
        title: "Secure Checkout",
        icon: "shield"
      }
    ]
  },
  {
    variant: 'feature-ecom-002',
    title: "Beauty in Every Box",
    subtitle: "Glossier-style grid with product visuals",
    alignment: "center",
    backgroundStyle: "image",
    styleNote: "Image card grid with soft tones and lifestyle visuals",
    mediaType: "image",
    columns: 3,
    features: [
      {
        title: "Monthly Drops",
        image: "/features/drop.png"
      },
      {
        title: "Sustainable Packaging",
        image: "/features/eco.png"
      },
      {
        title: "Cruelty-Free",
        image: "/features/ethics.png"
      }
    ]
  },
  {
    variant: 'feature-ecom-003',
    title: "The Apple Standard",
    subtitle: "Premium features, premium experience.",
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Minimalist feature row with focus on typography",
    mediaType: "none",
    columns: 2,
    features: [
      {
        title: "End-to-End Encryption",
        description: "Security at the hardware level"
      },
      {
        title: "Seamless Ecosystem",
        description: "Works across all your devices"
      }
    ]
  },
  // === FLEXIBLE/OTHER VARIANTS ===
  {
    variant: 'feature-flex-001',
    title: "Built for Any Business",
    subtitle: "Modular features for local or online needs.",
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Universal service layout with badges",
    mediaType: "icon",
    columns: 2,
    features: [
      {
        title: "Booking System",
        icon: "calendar"
      },
      {
        title: "Live Chat",
        icon: "message-square"
      }
    ]
  },
  {
    variant: 'feature-flex-002',
    title: "Teach. Share. Grow.",
    subtitle: "Perfect for educators and creators.",
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "Icon + text grid for online learning and coaching",
    mediaType: "icon",
    columns: 3,
    features: [
      {
        title: "Course Uploads",
        icon: "upload"
      },
      {
        title: "Member Portal",
        icon: "users"
      },
      {
        title: "Progress Tracking",
        icon: "activity"
      }
    ]
  },
  {
    variant: 'feature-flex-003',
    title: "Ready to Launch",
    subtitle: "For side projects and small shops.",
    alignment: "right",
    backgroundStyle: "image",
    styleNote: "Grid layout with image callouts and CTAs",
    mediaType: "image",
    columns: 2,
    features: [
      {
        title: "Built-in Templates",
        image: "/features/template.png"
      },
      {
        title: "One-Click Publish",
        image: "/features/publish-btn.png"
      }
    ]
  }
];

// Re-export FAQ and CTA variants from their separate files
export { faqVariants } from './component-library-variants-faq';
export { ctaVariants } from './component-library-variants-cta';
