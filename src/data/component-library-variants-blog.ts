
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
    headline: "Our Journal",
    description: "Creative thoughts, design insights, and artistic explorations.",
    alignment: 'left',
    backgroundStyle: 'dark',
    layoutStyle: 'list',
    styleNote: "Editorial-style list layout with asymmetric design elements",
    showCategories: true,
    showAuthors: true,
    posts: [
      {
        title: "Design Systems That Scale",
        url: "/journal/design-systems",
        summary: "How to build extensible design systems that grow with your brand.",
        image: "/images/blog/design.jpg",
        category: "Design",
        author: "Alex Chen",
        date: "2023-05-18"
      },
      {
        title: "Typography Trends for 2023",
        url: "/journal/typography",
        summary: "Exploring the latest trends in digital typography and font pairings.",
        image: "/images/blog/typography.jpg",
        category: "Typography",
        author: "Maria Rodriguez",
        date: "2023-05-12"
      },
      {
        title: "Color Theory in Digital Spaces",
        url: "/journal/color-theory",
        summary: "Understanding how colors impact user experience and brand perception.",
        image: "/images/blog/color.jpg",
        category: "Color Theory",
        author: "David Kim",
        date: "2023-05-05"
      }
    ]
  },
  {
    variant: 'blog-ecommerce-001',
    headline: "Latest From Our Blog",
    description: "Stories, tips and guides to help you find the perfect product.",
    alignment: 'center',
    backgroundStyle: 'light',
    layoutStyle: 'carousel',
    styleNote: "Product-focused carousel layout with prominent images",
    showCategories: true,
    showAuthors: false,
    posts: [
      {
        title: "Summer Collection Lookbook",
        url: "/blog/summer-collection",
        summary: "Explore our new summer designs inspired by coastal living.",
        image: "/images/blog/summer.jpg",
        category: "Collections",
        date: "2023-05-20"
      },
      {
        title: "5 Ways to Style Our Bestseller",
        url: "/blog/styling-guide",
        summary: "Creative ways to incorporate our most popular product into your lifestyle.",
        image: "/images/blog/style.jpg",
        category: "Styling",
        date: "2023-05-17"
      },
      {
        title: "Behind the Scenes: Product Design",
        url: "/blog/product-design",
        summary: "How we design and test our products before they reach our store.",
        image: "/images/blog/design-process.jpg",
        category: "Process",
        date: "2023-05-08"
      }
    ]
  }
];

export default blogVariants;
