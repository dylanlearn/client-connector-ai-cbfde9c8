
import { ComponentDefinition } from './component-registry';
import { heroComponents } from './components/hero-components';
import { blogComponents } from './components/blog-components';
import { contactComponents } from './components/contact-components';
import { footerComponents } from './components/footer-components';

/**
 * Default components that are registered with the wireframe editor
 */
export const defaultComponents: ComponentDefinition[] = [
  heroComponents,
  blogComponents,
  contactComponents,
  footerComponents
  // Add other component types here as you develop them
];

