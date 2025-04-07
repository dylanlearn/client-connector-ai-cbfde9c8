import { BlogSectionProps } from '@/types/component-library';

// BLOG SECTION COMPONENT LIBRARY VARIANTS
export const blogVariants: BlogSectionProps[] = [
  {
    variant: 'blog-startup-001',
    headline: "Latest Updates",
    description: "Stay up-to-date with our latest news and product updates.",
    alignment: 'center',
    backgroundStyle: 'light',
    layoutStyle: 'grid',
    styleNote: "Modern grid layout with card shadows and hover effects",
    showCategories: true,
    showAuthors: true,
    posts: [
      {
        title: "Introducing Our New Feature",
        url: "/blog/new-feature",
        summary: "Learn about our exciting new feature that helps boost productivity.",
        image: "/images/blog/feature.jpg",
        category: "Product",
        author: "Jane Smith",
        date: "2023-05-15"
      },
      {
        title: "How to Maximize Your Workflow",
        url: "/blog/workflow",
        summary: "Tips and tricks for getting the most out of your daily work routine.",
        image: "/images/blog/workflow.jpg",
        category: "Guides",
        author: "John Doe",
        date: "2023-05-10"
      },
      {
        title: "Case Study: Enterprise Success",
        url: "/blog/case-study",
        summary: "How our enterprise customers achieve 200% ROI with our platform.",
        image: "/images/blog/case-study.jpg",
        category: "Case Studies",
        author: "Emily Johnson",
        date: "2023-05-01"
      }
    ]
  },
  {
    variant: 'blog-creative-001',
    headline: "The Journal",
    description: "Essays, inspiration, and deep dives from the creative side.",
    layoutStyle: "grid",
    alignment: "center",
    backgroundStyle: "gradient",
    showCategories: true,
    showAuthors: true,
    posts: [
      {
        title: "Design in Motion",
        url: "/journal/design-motion",
        summary: "Exploring the kinetic qualities of digital storytelling.",
        category: "Editorial",
        author: "Nico Mora",
        date: "2024-03-15",
        image: "/images/blog/motion.jpg"
      },
      {
        title: "Palette Studies",
        url: "/journal/color-2024",
        summary: "Color, mood, and motion across modern interfaces.",
        category: "Color",
        author: "Eli Yang",
        date: "2024-02-20",
        image: "/images/blog/color.jpg"
      }
    ],
    styleNote: "Centered gradient layout with creative branding, stacked thumbnails, and layered text"
  },
  {
    variant: 'blog-creative-002',
    headline: "Studio Dispatch",
    description: "Project notes, creative updates, and things we're vibing on.",
    layoutStyle: "carousel",
    alignment: "left",
    backgroundStyle: "image",
    posts: [
      {
        title: "Experimental Typography",
        url: "/dispatch/type",
        summary: "Exploring shape, form, and message.",
        author: "Tasha Kim",
        image: "/images/blog/type.jpg"
      },
      {
        title: "Set Design to Web Design",
        url: "/dispatch/set-to-screen",
        summary: "Physical composition lessons applied to layout."
      }
    ],
    styleNote: "Visually-driven creative blog slider with large fonts and mixed media"
  },
  {
    variant: 'blog-creative-003',
    headline: "Field Notes",
    layoutStyle: "list",
    backgroundStyle: "dark",
    alignment: "right",
    posts: [
      {
        title: "On Pattern Disruption",
        url: "/notes/pattern-break",
        date: "2024-01-12"
      },
      {
        title: "Notes from the Archive",
        url: "/notes/archive"
      }
    ],
    styleNote: "Minimalist, dark-mode editorial layout with no categories or summaries — just vibes"
  },
  {
    variant: 'blog-startup-002',
    headline: "Engineering Deep Dives",
    description: "A look under the hood of our infrastructure and process.",
    layoutStyle: "list",
    backgroundStyle: "dark",
    alignment: "left",
    showAuthors: true,
    posts: [
      {
        title: "How We Rebuilt Syncing from Scratch",
        url: "/blog/sync-rebuild",
        author: "Linda Xu"
      },
      {
        title: "The Power of Edge Functions",
        url: "/blog/edge-power"
      }
    ],
    styleNote: "Technical SaaS blog layout with minimalist theme and dev focus"
  },
  {
    variant: 'blog-startup-003',
    headline: "The Startup Journal",
    layoutStyle: "carousel",
    backgroundStyle: "gradient",
    alignment: "center",
    posts: [
      {
        title: "Our Founder Story",
        url: "/story/founder",
        summary: "How we got started — and what we've learned."
      },
      {
        title: "Hiring for Culture and Growth",
        url: "/journal/hiring"
      }
    ],
    styleNote: "Gradient-backed story slider — great for YC/startup blogs"
  },
  {
    variant: 'blog-startup-004',
    headline: "Insights Hub",
    description: "Whitepapers, reports, and business tools for decision-makers.",
    layoutStyle: "grid",
    backgroundStyle: "image",
    alignment: "right",
    posts: [
      {
        title: "2024 SaaS Trends Report",
        url: "/insights/2024-trends",
        image: "/images/blog/saasreport.jpg"
      }
    ],
    styleNote: "Image-heavy grid layout styled for marketing and growth blogs"
  },
  {
    variant: 'blog-ecom-001',
    headline: "The Fit Edit",
    description: "How-tos, style guides, and product drops.",
    layoutStyle: "grid",
    alignment: "center",
    backgroundStyle: "light",
    posts: [
      {
        title: "Best Sellers for Spring",
        url: "/blog/spring-best",
        image: "/images/blog/spring.jpg"
      },
      {
        title: "Fit & Fabric Explained",
        url: "/blog/fabric",
        summary: "How we choose materials for comfort and performance."
      }
    ],
    styleNote: "Glossier/Gymshark-inspired grid for shoppable content"
  },
  {
    variant: 'blog-ecom-002',
    headline: "In the Press",
    layoutStyle: "list",
    backgroundStyle: "dark",
    alignment: "left",
    posts: [
      {
        title: "Featured in Elle Magazine",
        url: "/press/elle"
      },
      {
        title: "2024 Design Award Winner",
        url: "/press/awards"
      }
    ],
    styleNote: "Dark editorial press-style layout with minimal markup"
  },
  {
    variant: 'blog-ecom-003',
    headline: "Behind the Brand",
    layoutStyle: "carousel",
    backgroundStyle: "gradient",
    alignment: "right",
    posts: [
      {
        title: "From Sketch to Shelf",
        url: "/brand/sketch",
        image: "/images/blog/sketch.jpg"
      }
    ],
    styleNote: "Lifestyle-style slider for storytelling with product overlap"
  },
  {
    variant: 'blog-flex-001',
    headline: "What's New",
    layoutStyle: "list",
    alignment: "left",
    backgroundStyle: "light",
    posts: [
      {
        title: "Speaking at WebConf 2024",
        url: "/updates/webconf"
      },
      {
        title: "New Client Feature",
        url: "/updates/clients"
      }
    ],
    styleNote: "General-purpose blog layout ideal for portfolios or consultants"
  },
  {
    variant: 'blog-flex-002',
    headline: "Resource Library",
    description: "Templates, case studies, and community favorites.",
    layoutStyle: "grid",
    alignment: "center",
    backgroundStyle: "image",
    posts: [
      {
        title: "Brand Strategy Template",
        url: "/library/brand-template"
      },
      {
        title: "Case Study: Revamp 2023",
        url: "/library/revamp"
      }
    ],
    styleNote: "Utility-first layout for blog-as-resource-hub"
  },
  {
    variant: 'blog-flex-003',
    headline: "Founder's Notes",
    layoutStyle: "carousel",
    backgroundStyle: "dark",
    alignment: "center",
    posts: [
      {
        title: "Why I Started This Company",
        url: "/notes/origin"
      }
    ],
    styleNote: "Carousel-driven, personal blog layout for creators or indie founders"
  }
];

export default blogVariants;
