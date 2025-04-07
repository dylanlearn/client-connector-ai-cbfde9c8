
import { FAQComponentProps } from '@/types/component-library';

// FAQ Component Variants
export const faqVariants: FAQComponentProps[] = [
  // === CREATIVE VARIANTS ===
  {
    variant: 'faq-creative-001',
    title: "Curious Minds Welcome",
    subtitle: "Unusual questions from brilliant users",
    alignment: "center",
    backgroundStyle: "light",
    faqType: "accordion",
    animationStyle: "expand",
    styleNote: "Creative accordion with icon toggles and soft drop shadows",
    faqs: [
      {
        question: "Can I use this platform for performance art?",
        answer: "Absolutely. We've seen dancers, poets, and musicians adapt it beautifully.",
        isExpandedByDefault: false
      },
      {
        question: "What's the weirdest use case you've seen?",
        answer: "Someone built a tarot card generator integrated with GPT.",
        isExpandedByDefault: false
      }
    ]
  },
  {
    variant: 'faq-creative-002',
    title: "From the Studio",
    subtitle: "Quick tips for visual artists and design thinkers",
    alignment: "left",
    backgroundStyle: "image",
    faqType: "grid",
    animationStyle: "none",
    styleNote: "Creative grid layout with card-style Q&A and illustrations",
    faqs: [
      {
        question: "How do I upload custom brush files?",
        answer: "Use the asset manager and select the 'Brush' tab."
      },
      {
        question: "Can I animate layered compositions?",
        answer: "Yes, through our motion timeline panel."
      }
    ]
  },
  {
    variant: 'faq-creative-003',
    title: "Myths, Debunked",
    subtitle: "Art school didn't teach you this",
    alignment: "center",
    backgroundStyle: "dark",
    faqType: "list",
    animationStyle: "fade",
    styleNote: "Text-driven FAQ with editorial styling, serif fonts",
    faqs: [
      {
        question: "Is it true that vector is always better?",
        answer: "Not always — raster excels in detail-rich contexts."
      },
      {
        question: "Should I still design for print in 2025?",
        answer: "Yes, print is resurging in niche luxury and editorial spaces."
      }
    ]
  },
  
  // === STARTUP-FOCUSED VARIANTS ===
  {
    variant: 'faq-startup-001',
    title: "Startup Onboarding FAQs",
    subtitle: "What new users ask in week one",
    alignment: "left",
    backgroundStyle: "light",
    faqType: "accordion",
    animationStyle: "expand",
    styleNote: "Left-aligned accordion with clear spacing and mono-style fonts",
    faqs: [
      {
        question: "How do I invite my team?",
        answer: "Go to Settings → Team and click 'Invite Member'."
      },
      {
        question: "Is there a sandbox environment?",
        answer: "Yes. Your dashboard includes a staging area."
      }
    ]
  },
  {
    variant: 'faq-startup-002',
    title: "Scaling Questions",
    subtitle: "From MVP to hypergrowth",
    alignment: "center",
    backgroundStyle: "dark",
    faqType: "list",
    animationStyle: "none",
    styleNote: "Dark list-style layout ideal for high-level founders & investors",
    faqs: [
      {
        question: "Can I export analytics to CSV?",
        answer: "Yes, under the Reports tab."
      },
      {
        question: "Do you support multiple workspaces?",
        answer: "Yes. Each account can create isolated workspaces."
      }
    ]
  },
  {
    variant: 'faq-startup-003',
    title: "Dev FAQs",
    subtitle: "Everything your engineers need to know",
    alignment: "right",
    backgroundStyle: "light",
    faqType: "grid",
    animationStyle: "fade",
    styleNote: "Right-aligned technical grid with two-line questions",
    faqs: [
      {
        question: "Is the API REST or GraphQL?",
        answer: "It's GraphQL-first with REST fallback."
      },
      {
        question: "Do you offer code exports?",
        answer: "Yes, available in React and Vue."
      }
    ]
  },
  {
    variant: 'faq-startup-004',
    title: "Launch Confidently",
    subtitle: "FAQ with confidence boosters before going live",
    alignment: "center",
    backgroundStyle: "image",
    faqType: "accordion",
    animationStyle: "expand",
    styleNote: "Background image hero FAQ with onboarding focus",
    faqs: [
      {
        question: "Can I preview the site before launch?",
        answer: "Yes — we offer instant previews."
      },
      {
        question: "How do I toggle between live and test mode?",
        answer: "Toggle top right in the dashboard."
      }
    ]
  },

  // === ECOMMERCE VARIANTS ===
  {
    variant: 'faq-ecom-001',
    title: "Shipping & Returns",
    subtitle: "What shoppers care about most",
    alignment: "left",
    backgroundStyle: "light",
    faqType: "list",
    animationStyle: "none",
    styleNote: "Simple FAQ styled after Gymshark & Glossier checkout pages",
    faqs: [
      {
        question: "How long does shipping take?",
        answer: "3–5 business days in the US."
      },
      {
        question: "Can I return worn items?",
        answer: "Returns accepted within 30 days unworn and tagged."
      }
    ]
  },
  {
    variant: 'faq-ecom-002',
    title: "Product Questions",
    subtitle: "Details about our bestsellers",
    alignment: "center",
    backgroundStyle: "image",
    faqType: "grid",
    animationStyle: "fade",
    styleNote: "Grid FAQ below product gallery — Shopify-inspired",
    faqs: [
      {
        question: "Are your products vegan?",
        answer: "Yes, 100%."
      },
      {
        question: "Do you use sustainable packaging?",
        answer: "All shipping materials are recyclable."
      }
    ]
  },
  {
    variant: 'faq-ecom-003',
    title: "Orders & Tracking",
    subtitle: "Everything from checkout to your door",
    alignment: "right",
    backgroundStyle: "dark",
    faqType: "accordion",
    animationStyle: "expand",
    styleNote: "Accordion with shipping icons and order status clarity",
    faqs: [
      {
        question: "Where's my order?",
        answer: "Track it anytime using your order ID."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, to 90+ countries."
      }
    ]
  },

  // === FLEXIBLE/OTHER VARIANTS ===
  {
    variant: 'faq-flex-001',
    title: "Local Business FAQ",
    subtitle: "Answering common client questions",
    alignment: "left",
    backgroundStyle: "light",
    faqType: "list",
    animationStyle: "none",
    styleNote: "Great for salons, home services, freelancers",
    faqs: [
      {
        question: "Do you offer weekend appointments?",
        answer: "Yes, we're open Sat–Sun 9am–4pm."
      },
      {
        question: "What's the cancellation policy?",
        answer: "24 hours in advance, please."
      }
    ]
  },
  {
    variant: 'faq-flex-002',
    title: "Course Support",
    subtitle: "For educators, platforms, or memberships",
    alignment: "center",
    backgroundStyle: "light",
    faqType: "accordion",
    animationStyle: "fade",
    styleNote: "Accordion + tags for learning systems or digital coaches",
    faqs: [
      {
        question: "Can students message instructors?",
        answer: "Yes, through the member dashboard."
      },
      {
        question: "Is progress saved across devices?",
        answer: "Absolutely, synced via cloud."
      }
    ]
  },
  {
    variant: 'faq-flex-003',
    title: "Miscellaneous Help",
    subtitle: "Catch-all FAQ pattern with light editorial styling",
    alignment: "right",
    backgroundStyle: "image",
    faqType: "grid",
    animationStyle: "none",
    styleNote: "Utility layout for side projects or general info",
    faqs: [
      {
        question: "Do you offer discounts for nonprofits?",
        answer: "Yes, just email support@company.com."
      },
      {
        question: "Can I white-label this platform?",
        answer: "Yes, with a Pro or Enterprise license."
      }
    ]
  }
];
