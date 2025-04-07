import { WireframeData, WireframeSection, WireframeComponent } from './wireframe-types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to create components with IDs
const createComponent = (type: string, content: string): WireframeComponent => {
  return {
    id: uuidv4(),
    type,
    content
  };
};

// Helper function to convert array to single string or keep as is for backward compatibility
const formatCopy = (value: string[] | string): string | string[] => {
  return value; // Now our interface supports both string and string[]
};

export const industryTemplates: Record<string, WireframeData> = {
  'technology': {
    title: 'Technology Website Template',
    description: 'A modern design for tech companies',
    sections: [
      {
        id: uuidv4(),
        name: 'Hero Section',
        sectionType: 'hero',
        components: [
          createComponent('heading', 'Welcome to Tech Solutions'),
          createComponent('subheading', 'Innovative technology for modern problems'),
          createComponent('cta-button', 'Learn More')
        ],
        copySuggestions: {
          heading: ['Innovative Solutions', 'Tech for Tomorrow', 'Cutting-edge Technology'],
          subheading: ['Empowering businesses through technology', 'Building the future, one byte at a time'],
          cta: ['Get Started', 'Explore Solutions', 'Learn More']
        }
      },
      {
        id: uuidv4(),
        name: 'Product Grid',
        sectionType: 'product-grid',
        components: [
          { id: uuidv4(), type: 'filter', content: 'Product filtering sidebar' },
          { id: uuidv4(), type: 'product-card', content: 'Product card with image and price' },
          { id: uuidv4(), type: 'pagination', content: 'Product pagination' },
          { id: uuidv4(), type: 'sort', content: 'Product sorting dropdown' }
        ],
        copySuggestions: {
          heading: ['Featured Products', 'New Arrivals', 'Best Sellers'],
          subheading: ['Shop by category', 'Handpicked for you'],
          cta: ['Add to Cart', 'Quick View', 'Save for Later']
        }
      },
      {
        id: uuidv4(),
        name: 'Footer',
        sectionType: 'footer',
        components: [
          { id: uuidv4(), type: 'footer-links', content: 'Footer navigation links' },
          { id: uuidv4(), type: 'newsletter', content: 'Newsletter signup' },
          { id: uuidv4(), type: 'social-links', content: 'Social media icons' }
        ],
        copySuggestions: {
          heading: ['Stay Connected', 'Sign Up for Updates'],
          subheading: ['Follow us on social media', 'Get exclusive offers'],
          cta: ['Subscribe', 'Follow Us']
        }
      }
    ],
    layoutType: 'grid',
    colorScheme: {
      primary: '#0099FF',
      secondary: '#6F42C1',
      accent: '#FF5C00',
      background: '#FFFFFF'
    },
    typography: {
      headings: 'Inter, sans-serif',
      body: 'Roboto, sans-serif'
    }
  },
  'ecommerce': {
    title: 'E-Commerce Template',
    description: 'Standard e-commerce website template with product listings and checkout flow',
    sections: [
      {
        id: uuidv4(),
        name: 'Header with Search',
        sectionType: 'header',
        components: [
          { id: uuidv4(), type: 'navigation', content: 'Main navigation with cart' },
          { id: uuidv4(), type: 'search', content: 'Product search box' },
          { id: uuidv4(), type: 'cart-icon', content: 'Shopping cart icon with counter' }
        ],
        copySuggestions: {
          heading: ['Shop the Latest Trends', 'Discover Quality Products'],
          subheading: ['Free shipping on orders over $50', 'Satisfaction guaranteed'],
          cta: ['Shop Now', 'Explore']
        }
      }
    ],
    layoutType: 'grid',
    colorScheme: {
      primary: '#3498db',
      secondary: '#2ecc71',
      accent: '#f39c12',
      background: '#ffffff'
    },
    typography: {
      headings: 'Montserrat',
      body: 'Open Sans'
    }
  },
  'saas': {
    title: 'SaaS Platform Template',
    description: 'Template for SaaS and web application landing pages',
    sections: [
      {
        id: uuidv4(),
        name: 'Hero with CTA',
        sectionType: 'hero',
        components: [
          { id: uuidv4(), type: 'hero-heading', content: 'Main value proposition heading' },
          { id: uuidv4(), type: 'hero-subheading', content: 'Supporting text explaining benefits' },
          { id: uuidv4(), type: 'cta-button', content: 'Primary call to action button' },
          { id: uuidv4(), type: 'hero-image', content: 'App screenshot or illustration' }
        ],
        copySuggestions: {
          heading: ['Simplify Your Workflow', 'Boost Team Productivity', 'Work Smarter, Not Harder'],
          subheading: ['All-in-one platform for teams', 'Trusted by over 10,000 companies'],
          cta: ['Start Free Trial', 'Book a Demo', 'Get Started']
        }
      },
      {
        id: uuidv4(),
        name: 'Features Section',
        sectionType: 'features',
        components: [
          { id: uuidv4(), type: 'feature-card', content: 'Feature card with icon and description' },
          { id: uuidv4(), type: 'feature-card', content: 'Feature card with icon and description' },
          { id: uuidv4(), type: 'feature-card', content: 'Feature card with icon and description' },
          { id: uuidv4(), type: 'feature-card', content: 'Feature card with icon and description' }
        ],
        copySuggestions: {
          heading: ['Powerful Features', 'Why Choose Us', 'Built for Teams'],
          subheading: ['Everything you need to succeed', 'Designed with your workflow in mind'],
          cta: ['Learn More', 'See All Features']
        }
      }
    ],
    layoutType: 'flex',
    colorScheme: {
      primary: '#6772e5',
      secondary: '#24b47e',
      accent: '#e25950',
      background: '#f6f9fc'
    },
    typography: {
      headings: 'Inter',
      body: 'Roboto'
    }
  },
  'portfolio': {
    title: 'Creative Portfolio Template',
    description: 'Portfolio template for designers, photographers, and creatives',
    sections: [
      {
        id: uuidv4(),
        name: 'Minimal Header',
        sectionType: 'header',
        components: [
          { id: uuidv4(), type: 'logo', content: 'Personal logo' },
          { id: uuidv4(), type: 'menu', content: 'Minimal navigation menu' }
        ],
        copySuggestions: {
          heading: ['Work', 'Projects', 'Portfolio'],
          subheading: ['Designer & Developer', 'Visual Artist'],
          cta: ['View Work', 'Get in Touch']
        }
      },
      {
        id: uuidv4(),
        name: 'Project Grid',
        sectionType: 'projects',
        components: [
          { id: uuidv4(), type: 'project-card', content: 'Project thumbnail with hover effect' },
          { id: uuidv4(), type: 'project-card', content: 'Project thumbnail with hover effect' },
          { id: uuidv4(), type: 'project-card', content: 'Project thumbnail with hover effect' },
          { id: uuidv4(), type: 'project-card', content: 'Project thumbnail with hover effect' }
        ],
        copySuggestions: {
          heading: ['Selected Works', 'Recent Projects', 'Featured Work'],
          subheading: ['Explore my projects', 'A collection of my best work'],
          cta: ['View Project', 'Case Study', 'Learn More']
        }
      },
      {
        id: uuidv4(),
        name: 'About Section',
        sectionType: 'about',
        components: [
          { id: uuidv4(), type: 'profile-image', content: 'Professional headshot' },
          { id: uuidv4(), type: 'bio', content: 'Professional biography' },
          { id: uuidv4(), type: 'skills-list', content: 'List of key skills' },
          { id: uuidv4(), type: 'contact-info', content: 'Contact information' }
        ],
        copySuggestions: {
          heading: ['About Me', 'Hello, I\'m [Name]', 'Nice to Meet You'],
          subheading: ['Designer based in [Location]', 'Passionate about creating beautiful experiences'],
          cta: ['Download Resume', 'View LinkedIn', 'Contact Me']
        }
      }
    ],
    layoutType: 'masonry',
    colorScheme: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#ff3366',
      background: '#ffffff'
    },
    typography: {
      headings: 'Playfair Display',
      body: 'Source Sans Pro'
    }
  }
};

export const getTemplateForIndustry = (industry: string): WireframeData => {
  return industryTemplates[industry.toLowerCase()] || industryTemplates['technology'];
};
