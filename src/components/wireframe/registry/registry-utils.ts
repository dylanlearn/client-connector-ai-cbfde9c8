
import { ComponentDefinition } from './component-registry';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Helper function to create component definitions with proper typing
 */
export function createComponentDefinition(componentDef: ComponentDefinition): ComponentDefinition {
  return componentDef;
}

/**
 * Helper function to create default data that conforms to WireframeSection
 */
export function createSectionData(sectionData: Partial<WireframeSection>): Partial<WireframeSection> {
  return sectionData;
}
