
// This file initializes and exports all component registry functions
import { registerComponent } from './component-registry';
import { heroComponents } from './components/hero-components';
import { featureGridComponents } from './components/feature-grid-components';
import { testimonialComponents } from './components/testimonial-components';
import { ctaComponents } from './components/cta-components';
import { pricingComponents } from './components/pricing-components';
import { faqComponents } from './components/faq-components';
import { footerComponents } from './components/footer-components';
import { navigationComponents } from './components/navigation-components';
import { blogComponents } from './components/blog-components';
import { contactComponents } from './components/contact-components';

// Export functions from component-registry
export { 
  registerComponent,
  getAllComponentDefinitions 
} from './component-registry';

// Export types from component-types using 'export type' syntax for isolatedModules
export type {
  ComponentField,
  ComponentVariant,
  ComponentDefinition,
  ComponentLibrary,
  StyleConfig,
  ResponsiveConfig
} from './component-types';

// Export device breakpoints and utilities as values
export { 
  deviceBreakpoints,
  getDeviceStyles,
  styleOptionsToTailwind
} from './component-types';

// Initialize registry by registering all component types
export function initializeComponentRegistry() {
  // Register all components
  [
    heroComponents,
    featureGridComponents,
    testimonialComponents,
    ctaComponents,
    pricingComponents,
    faqComponents,
    footerComponents,
    navigationComponents,
    blogComponents,
    contactComponents
  ].forEach(component => {
    if (component) registerComponent(component);
  });
  
  console.log('Wireframe component registry initialized');
}

// Export components for direct use
export {
  heroComponents,
  featureGridComponents,
  testimonialComponents,
  ctaComponents,
  pricingComponents,
  faqComponents,
  footerComponents,
  navigationComponents,
  blogComponents,
  contactComponents
};
