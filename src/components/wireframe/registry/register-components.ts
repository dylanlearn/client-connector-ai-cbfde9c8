
import { registerComponent } from "./component-registry";
import { v4 as uuidv4 } from 'uuid';
import { defaultComponents, defaultHeroComponent, defaultFeaturesComponent, defaultTestimonialsComponent, defaultCTAComponent, defaultFooterComponent } from "./default-components";

/**
 * Initialize the component registry with default components
 */
export function initializeComponentRegistry() {
  // Register all default components
  defaultComponents.forEach(component => {
    registerComponent(component);
  });
  
  console.log('Component registry initialized with default components');
}

/**
 * Get component from the registry using type
 */
export function getComponentByType(type: string) {
  switch (type) {
    case 'hero':
      return defaultHeroComponent;
    case 'features':
      return defaultFeaturesComponent;
    case 'testimonials':
      return defaultTestimonialsComponent;
    case 'cta':
      return defaultCTAComponent;
    case 'footer':
      return defaultFooterComponent;
    default:
      return null;
  }
}

/**
 * Create a new component instance
 */
export function createComponent(type: string, data: any = {}) {
  const component = getComponentByType(type);
  if (!component) return null;
  
  return {
    id: uuidv4(),
    type,
    ...component.defaultData,
    ...data
  };
}
