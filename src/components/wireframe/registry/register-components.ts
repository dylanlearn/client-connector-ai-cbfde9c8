
import { registerComponent } from "./component-registry";
import { v4 as uuidv4 } from 'uuid';
import { defaultComponents, defaultHeroComponent, defaultFeaturesComponent, defaultTestimonialsComponent, defaultCTAComponent, defaultFooterComponent } from "./default-components";
import { navigationComponents } from './components/navigation-components';
import { pricingComponents } from './components/pricing-components';
import { ctaComponents } from './components/cta-components';

/**
 * Initialize the component registry with default components
 */
export function initializeComponentRegistry() {
  // Register all default components
  defaultComponents.forEach(component => {
    registerComponent(component);
  });
  
  // Register specific component types from individual files
  registerComponent(navigationComponents);
  registerComponent(pricingComponents);
  registerComponent(ctaComponents);
  
  console.log('Component registry initialized with all component types and variants');
}

/**
 * Get component from the registry using type
 */
export function getComponentByType(type: string) {
  // Normalize the type string for more flexible matching
  const normalizedType = type.toLowerCase();
  
  // Match both exact types and types with variants (e.g., "pricing-table" matches "pricing")
  if (normalizedType === 'hero' || normalizedType.startsWith('hero-')) {
    return defaultHeroComponent;
  } else if (normalizedType === 'features' || normalizedType === 'feature' || normalizedType.startsWith('feature-')) {
    return defaultFeaturesComponent;
  } else if (normalizedType === 'testimonials' || normalizedType === 'testimonial' || normalizedType.startsWith('testimonial-')) {
    return defaultTestimonialsComponent;
  } else if (normalizedType === 'cta' || normalizedType === 'cta-banner' || normalizedType.startsWith('cta-')) {
    return ctaComponents;
  } else if (normalizedType === 'footer' || normalizedType.startsWith('footer-')) {
    return defaultFooterComponent;
  } else if (normalizedType === 'pricing' || normalizedType === 'pricing-table' || normalizedType.startsWith('pricing-')) {
    return pricingComponents;
  } else if (normalizedType === 'navigation' || normalizedType === 'nav' || normalizedType.startsWith('nav-')) {
    return navigationComponents;
  }
  
  // If no specific match, return null
  return null;
}

/**
 * Create a new component instance
 */
export function createComponent(type: string, data: any = {}) {
  const component = getComponentByType(type);
  if (!component) return null;
  
  // Determine the variant to use (if specified in data)
  let variantToUse = data.componentVariant;
  
  // If no variant specified but component has variants, use the first one
  if (!variantToUse && component.variants && component.variants.length > 0) {
    variantToUse = component.variants[0].id;
  }
  
  return {
    id: uuidv4(),
    type,
    sectionType: type,
    componentVariant: variantToUse,
    ...component.defaultData,
    ...data
  };
}
