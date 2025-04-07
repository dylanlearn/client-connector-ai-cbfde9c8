
import { FooterComponentProps } from '@/types/component-library';

// FOOTER SECTION COMPONENT LIBRARY (13 VARIANTS)
// Style Distribution: 3 Creative, 4 Startup-Focused, 3 eCommerce, 3 Flexible
// Inspired by: Apple, Shopify, Gymshark, Glossier, user visual references

export const footerVariants: FooterComponentProps[] = [
  // === CREATIVE VARIANTS ===
  {
    variant: 'footer-creative-001',
    logo: "/logos/avantgarde.svg",
    alignment: "left",
    backgroundStyle: "gradient",
    styleNote: "Avant-garde layout with asymmetrical columns, pastel gradients, and animated newsletter CTA. Inspired by art portfolios and Glossier.",
    columns: [
      {
        heading: "Discover",
        links: [
          { label: "Projects", url: "/projects" },
          { label: "Exhibitions", url: "/exhibitions" }
        ]
      },
      {
        heading: "Studio",
        links: [
          { label: "Team", url: "/team" },
          { label: "Collaborate", url: "/collab" }
        ]
      }
    ],
    newsletter: {
      placeholder: "Your email address",
      ctaLabel: "Join Art Feed",
      successMessage: "You're on the list!"
    },
    showSocialIcons: true,
    showLegalLinks: false
  },
  {
    variant: 'footer-creative-002',
    logo: "/logos/splitscene.svg",
    alignment: "center",
    backgroundStyle: "image",
    styleNote: "Split-screen layout with looping video background and funky nav. Ideal for creative agencies.",
    columns: [
      {
        heading: "Services",
        links: [
          { label: "Concepting", url: "/concept" },
          { label: "Web Experiments", url: "/web" }
        ]
      },
      {
        heading: "Now Playing",
        links: [
          { label: "Showreel", url: "/reel" },
          { label: "Playlist", url: "/music" }
        ]
      }
    ],
    showSocialIcons: false,
    showLegalLinks: false
  },
  {
    variant: 'footer-creative-003',
    logo: "/logos/editorialdark.svg",
    alignment: "right",
    backgroundStyle: "dark",
    styleNote: "Column-free footer with horizontal scroll for links, oversized logo, and sticky social icons. Inspired by fashion/editorial UX.",
    columns: [
      {
        heading: "Explore",
        links: [
          { label: "Stories", url: "/stories" },
          { label: "Index", url: "/index" }
        ]
      }
    ],
    showSocialIcons: true,
    showLegalLinks: false
  },
  {
    variant: 'footer-startup-001', // Ideal for early-stage SaaS and B2B startups with clear product + resource architecture
    logo: "/logos/startflow.svg",
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "SaaS-style 3-column footer with product links and legal",
    columns: [
      {
        heading: "Product",
        links: [
          { label: "Features", url: "/features" },
          { label: "Pricing", url: "/pricing" }
        ]
      },
      {
        heading: "Company",
        links: [
          { label: "About", url: "/about" },
          { label: "Careers", url: "/careers" }
        ]
      },
      {
        heading: "Resources",
        links: [
          { label: "Blog", url: "/blog" },
          { label: "Docs", url: "/docs" }
        ]
      }
    ],
    showSocialIcons: true,
    showLegalLinks: true
  },
  {
    variant: 'footer-startup-002', // Great for technical tools or dev platforms — Discord + changelog funnel built-in
    logo: "/logos/betaengine.svg",
    alignment: "left",
    backgroundStyle: "dark",
    styleNote: "Dark-mode developer footer with Discord + Docs CTA",
    columns: [
      {
        heading: "Build",
        links: [
          { label: "Docs", url: "/docs" },
          { label: "API", url: "/api" }
        ]
      },
      {
        heading: "Community",
        links: [
          { label: "Discord", url: "/discord" },
          { label: "Changelog", url: "/changelog" }
        ]
      }
    ],
    newsletter: {
      placeholder: "Enter email for updates",
      ctaLabel: "Subscribe"
    },
    showSocialIcons: true,
    showLegalLinks: false
  },
  {
    variant: 'footer-startup-003', // Minimal gradient footer for solo founders or SaaS MVPs with newsletter-first focus
    logo: "/logos/foundersync.svg",
    alignment: "center",
    backgroundStyle: "gradient",
    styleNote: "Gradient hero footer with strong SaaS vibe",
    columns: [
      {
        heading: "Get Started",
        links: [
          { label: "Start Trial", url: "/signup" },
          { label: "Book Demo", url: "/demo" }
        ]
      }
    ],
    newsletter: {
      placeholder: "Your email",
      ctaLabel: "Get Updates"
    },
    showSocialIcons: false,
    showLegalLinks: true
  },
  {
    variant: 'footer-startup-004', // Visual product collage footer — excellent for demo-heavy startups or YC-style product intros
    logo: "/logos/productlite.svg",
    alignment: "right",
    backgroundStyle: "image",
    styleNote: "Visual footer with product collage background and split newsletter",
    columns: [
      {
        heading: "Company",
        links: [
          { label: "About", url: "/about" },
          { label: "Press", url: "/press" }
        ]
      },
      {
        heading: "Legal",
        links: [
          { label: "Terms", url: "/terms" },
          { label: "Privacy", url: "/privacy" }
        ]
      }
    ],
    newsletter: {
      placeholder: "Get the latest features",
      ctaLabel: "Notify Me"
    },
    showSocialIcons: true,
    showLegalLinks: false
  },

  // === ECOMMERCE VARIANTS ===
  {
    variant: 'footer-ecom-001', // Best for fitness, lifestyle, or gymwear ecommerce brands with order tracking and newsletter capture
    logo: "/logos/gymstyle.svg",
    alignment: "center",
    backgroundStyle: "dark",
    styleNote: "Bold footer with category links and order support (inspired by Gymshark)",
    columns: [
      {
        heading: "Shop",
        links: [
          { label: "Men", url: "/men" },
          { label: "Women", url: "/women" }
        ]
      },
      {
        heading: "Support",
        links: [
          { label: "Returns", url: "/returns" },
          { label: "Track Order", url: "/track" }
        ]
      }
    ],
    newsletter: {
      placeholder: "Enter your email",
      ctaLabel: "Sign Up"
    },
    showSocialIcons: true,
    showLegalLinks: true
  },
  {
    variant: 'footer-ecom-002', // Clean and editorial — tailored for beauty, skincare, or ethical DTC brands
    logo: "/logos/glosslite.svg",
    alignment: "left",
    backgroundStyle: "light",
    styleNote: "Glossier-style clean footer with newsletter and brand tone",
    columns: [
      {
        heading: "Info",
        links: [
          { label: "FAQs", url: "/faq" },
          { label: "Our Story", url: "/about" }
        ]
      },
      {
        heading: "More",
        links: [
          { label: "Careers", url: "/careers" },
          { label: "Sustainability", url: "/sustainability" }
        ]
      }
    ],
    newsletter: {
      placeholder: "Your email",
      ctaLabel: "Get Glossier News"
    },
    showSocialIcons: false,
    showLegalLinks: true
  },
  {
    variant: 'footer-ecom-003', // Great for electronics or high-end hardware brands — Apple-inspired with sleek simplicity
    logo: "/logos/applefooter.svg",
    alignment: "center",
    backgroundStyle: "gradient",
    styleNote: "Apple-style universal footer with device navs and minimalist layout",
    columns: [
      {
        heading: "Products",
        links: [
          { label: "Mac", url: "/mac" },
          { label: "iPhone", url: "/iphone" },
          { label: "Watch", url: "/watch" }
        ]
      }
    ],
    showSocialIcons: false,
    showLegalLinks: true
  },

  // === FLEXIBLE/OTHER VARIANTS ===
  {
    variant: 'footer-flex-001', // Coaching brands or creators who rely on personal trust and weekly content strategy
    logo: "/logos/coachhub.svg",
    alignment: "center",
    backgroundStyle: "light",
    styleNote: "Personal brand or coaching layout with email opt-in",
    columns: [
      {
        heading: "Explore",
        links: [
          { label: "Testimonials", url: "/testimonials" },
          { label: "Sessions", url: "/sessions" }
        ]
      }
    ],
    newsletter: {
      placeholder: "Join my weekly tips",
      ctaLabel: "Subscribe"
    },
    showSocialIcons: true,
    showLegalLinks: false
  },
  {
    variant: 'footer-flex-002', // Best for LMS platforms or online educators — visual branding meets sitemap efficiency
    logo: "/logos/teachlite.svg",
    alignment: "left",
    backgroundStyle: "image",
    styleNote: "Footer with visual LMS branding and compact sitemap",
    columns: [
      {
        heading: "Courses",
        links: [
          { label: "All Courses", url: "/courses" },
          { label: "Pricing", url: "/pricing" }
        ]
      },
      {
        heading: "Help",
        links: [
          { label: "Contact", url: "/contact" },
          { label: "Terms", url: "/terms" }
        ]
      }
    ],
    showSocialIcons: false,
    showLegalLinks: true
  },
  {
    variant: 'footer-flex-003', // Ideal for freelancers, agencies, or small studios — works well on one-pagers or portfolio sites
    logo: "/logos/freelanceflow.svg",
    alignment: "right",
    backgroundStyle: "dark",
    styleNote: "Freelancer-style compact footer with anchor nav and project CTA",
    columns: [
      {
        heading: "Quick Links",
        links: [
          { label: "Portfolio", url: "/work" },
          { label: "Start a Project", url: "/contact" }
        ]
      }
    ],
    showSocialIcons: true,
    showLegalLinks: false
  }
];
