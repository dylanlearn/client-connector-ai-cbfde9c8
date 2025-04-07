
import { ComponentDefinition } from './component-registry';
import { heroComponents } from './components/hero-components';
import { blogComponents } from './components/blog-components';
import { contactComponents } from './components/contact-components';
import { footerComponents } from './components/footer-components';
import { navigationComponents } from './components/navigation-components';
import { pricingComponents } from './components/pricing-components';
import { testimonialComponents } from './components/testimonial-components';
import { featureGridComponents } from './components/feature-grid-components';
import { faqComponents } from './components/faq-components';
import { ctaComponents } from './components/cta-components';

/**
 * Default components that are registered with the wireframe editor
 */
export const defaultComponents: ComponentDefinition[] = [
  heroComponents,
  blogComponents,
  contactComponents,
  footerComponents,
  navigationComponents,
  pricingComponents,
  testimonialComponents,
  featureGridComponents,
  faqComponents,
  ctaComponents
];

