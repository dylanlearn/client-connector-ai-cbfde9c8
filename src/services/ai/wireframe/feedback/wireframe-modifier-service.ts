import { v4 as uuidv4 } from 'uuid';
import { DesignFeedbackInterpretation } from './feedback-interpreter-service';
import { 
  WireframeData, 
  WireframeSection, 
  WireframeComponent 
} from '@/services/ai/wireframe/wireframe-types';

/**
 * Interface for modification options
 */
export interface WireframeModificationOptions {
  preserveIds?: boolean;
  applyImmediately?: boolean;
  trackChanges?: boolean;
}

/**
 * Interface for modification result
 */
export interface WireframeModificationResult {
  modified: boolean;
  wireframe: WireframeData;
  modifiedSections: string[];
  addedSections: string[];
  removedSections: string[];
  changeDescription: string;
}

/**
 * Service for modifying wireframes based on feedback interpretations
 */
export class WireframeModifierService {
  /**
   * Apply feedback interpretation to modify a wireframe
   */
  static applyFeedbackToWireframe(
    wireframe: WireframeData,
    interpretation: DesignFeedbackInterpretation,
    options: WireframeModificationOptions = {}
  ): WireframeModificationResult {
    console.log('Applying feedback to wireframe:', interpretation);
    
    // Create a deep copy of the wireframe to work with
    const modifiedWireframe = JSON.parse(JSON.stringify(wireframe)) as WireframeData;
    
    // Track modified sections
    const modifiedSections: string[] = [];
    const addedSections: string[] = [];
    const removedSections: string[] = [];
    
    // Find target section(s) to modify
    let targetSections: WireframeSection[] = [];
    
    if (interpretation.targetSection) {
      // Find sections matching the target type
      targetSections = modifiedWireframe.sections.filter(
        section => section.sectionType.toLowerCase() === interpretation.targetSection?.toLowerCase()
      );
    } else if (interpretation.intent === 'add') {
      // When adding with no specific target, we'll add at the end
      targetSections = [];
    } else {
      // If no specific section targeted, apply to all sections
      targetSections = modifiedWireframe.sections;
    }
    
    // Process based on intent
    switch (interpretation.intent) {
      case 'add':
        this.handleAddIntent(modifiedWireframe, interpretation, addedSections);
        break;
      
      case 'remove':
        this.handleRemoveIntent(modifiedWireframe, interpretation, targetSections, removedSections);
        break;
      
      case 'style':
        this.handleStyleIntent(modifiedWireframe, interpretation, targetSections, modifiedSections);
        break;
      
      case 'layout':
        this.handleLayoutIntent(modifiedWireframe, interpretation, targetSections, modifiedSections);
        break;
      
      case 'modify':
      default:
        this.handleModifyIntent(modifiedWireframe, interpretation, targetSections, modifiedSections);
        break;
    }
    
    // Generate change description
    const changeDescription = this.generateChangeDescription(
      interpretation, 
      modifiedSections, 
      addedSections, 
      removedSections
    );
    
    return {
      modified: modifiedSections.length > 0 || addedSections.length > 0 || removedSections.length > 0,
      wireframe: modifiedWireframe,
      modifiedSections,
      addedSections,
      removedSections,
      changeDescription
    };
  }
  
  /**
   * Handle adding a new section
   */
  private static handleAddIntent(
    wireframe: WireframeData,
    interpretation: DesignFeedbackInterpretation,
    addedSections: string[]
  ): void {
    if (!interpretation.targetSection) return;
    
    // Create a new section based on the target type
    const newSection: WireframeSection = {
      id: uuidv4(),
      name: `${interpretation.targetSection.charAt(0).toUpperCase() + interpretation.targetSection.slice(1)} Section`,
      sectionType: interpretation.targetSection,
      componentVariant: 'default',
      components: [],
    };
    
    // Add default components based on section type
    switch (interpretation.targetSection.toLowerCase()) {
      case 'hero':
        newSection.components = [
          { id: uuidv4(), type: 'heading', content: 'Hero Title' },
          { id: uuidv4(), type: 'paragraph', content: 'Hero subtitle or description text' },
          { id: uuidv4(), type: 'button', content: 'Call to Action' }
        ];
        break;
      
      case 'features':
        newSection.components = [
          { id: uuidv4(), type: 'heading', content: 'Features' },
          { id: uuidv4(), type: 'feature-card', content: 'Feature 1' },
          { id: uuidv4(), type: 'feature-card', content: 'Feature 2' },
          { id: uuidv4(), type: 'feature-card', content: 'Feature 3' }
        ];
        break;
      
      case 'pricing':
        newSection.components = [
          { id: uuidv4(), type: 'heading', content: 'Pricing Plans' },
          { id: uuidv4(), type: 'pricing-card', content: 'Basic' },
          { id: uuidv4(), type: 'pricing-card', content: 'Pro' },
          { id: uuidv4(), type: 'pricing-card', content: 'Enterprise' }
        ];
        break;
      
      // Add more section type defaults as needed
    }
    
    // Add the new section to the wireframe
    wireframe.sections.push(newSection);
    addedSections.push(newSection.id);
    
    console.log('Added new section:', newSection.sectionType);
  }
  
  /**
   * Handle removing sections
   */
  private static handleRemoveIntent(
    wireframe: WireframeData,
    interpretation: DesignFeedbackInterpretation,
    targetSections: WireframeSection[],
    removedSections: string[]
  ): void {
    if (targetSections.length === 0) return;
    
    const sectionIdsToRemove = targetSections.map(section => section.id);
    
    // Update sections array by filtering out sections to be removed
    wireframe.sections = wireframe.sections.filter(section => !sectionIdsToRemove.includes(section.id));
    
    // Track removed sections
    removedSections.push(...sectionIdsToRemove);
    
    console.log('Removed sections:', sectionIdsToRemove);
  }
  
  /**
   * Handle styling changes
   */
  private static handleStyleIntent(
    wireframe: WireframeData,
    interpretation: DesignFeedbackInterpretation,
    targetSections: WireframeSection[],
    modifiedSections: string[]
  ): void {
    if (targetSections.length === 0) return;
    
    // Apply style changes to each target section
    targetSections.forEach(section => {
      let modified = false;
      
      // Process each suggested change
      interpretation.suggestedChanges.forEach(change => {
        // Apply appropriate style changes based on the property
        switch (change.property) {
          case 'color':
            // Apply color change to section or specific elements
            if (!section.style) section.style = {};
            
            if (interpretation.targetElement) {
              // Apply to specific element types
              const components = section.components || [];
              components.forEach(component => {
                if (component.type === interpretation.targetElement) {
                  if (!component.style) component.style = {};
                  component.style.color = change.value;
                  modified = true;
                }
              });
            } else {
              // Apply to section
              section.style.backgroundColor = change.value;
              modified = true;
            }
            break;
          
          case 'alignment':
            // Apply alignment changes
            if (!section.style) section.style = {};
            section.style.textAlign = change.value;
            modified = true;
            break;
          
          case 'spacing':
            // Apply spacing changes
            if (!section.style) section.style = {};
            if (change.value === 'increase') {
              section.style.padding = '2rem';
              section.style.gap = '1.5rem';
            } else {
              section.style.padding = '0.5rem';
              section.style.gap = '0.5rem';
            }
            modified = true;
            break;
          
          default:
            break;
        }
      });
      
      if (modified) {
        modifiedSections.push(section.id);
        console.log('Modified section style:', section.id);
      }
    });
  }
  
  /**
   * Handle layout changes
   */
  private static handleLayoutIntent(
    wireframe: WireframeData,
    interpretation: DesignFeedbackInterpretation,
    targetSections: WireframeSection[],
    modifiedSections: string[]
  ): void {
    if (targetSections.length === 0) return;
    
    // Apply layout changes to each target section
    targetSections.forEach(section => {
      let modified = false;
      
      // Ensure section.layout is an object, not a string
      if (typeof section.layout === 'string') {
        section.layout = { 
          type: section.layout, 
          direction: 'column',
          alignment: section.layout === 'centered' ? 'center' : 'flex-start'
        };
      } else if (!section.layout) {
        section.layout = { type: 'flex', direction: 'column' };
      }
      
      // Process each suggested change
      interpretation.suggestedChanges.forEach(change => {
        switch (change.property) {
          case 'alignment':
            // Update alignment properties in layout
            if (typeof section.layout === 'object') {
              section.layout.justifyContent = change.value === 'center' ? 'center' : 
                                             change.value === 'left' ? 'flex-start' : 
                                             change.value === 'right' ? 'flex-end' : 
                                             'flex-start';
              modified = true;
            }
            break;
          
          case 'direction':
          case 'orientation':
            // Update flex direction
            if (typeof section.layout === 'object') {
              section.layout.direction = change.value === 'horizontal' ? 'row' : 'column';
              modified = true;
            }
            break;
          
          default:
            break;
        }
      });
      
      if (modified) {
        modifiedSections.push(section.id);
        console.log('Modified section layout:', section.id);
      }
    });
  }
  
  /**
   * Handle general modifications
   */
  private static handleModifyIntent(
    wireframe: WireframeData,
    interpretation: DesignFeedbackInterpretation,
    targetSections: WireframeSection[],
    modifiedSections: string[]
  ): void {
    if (targetSections.length === 0) return;
    
    // Apply general modifications to each target section
    targetSections.forEach(section => {
      let modified = false;
      
      // Apply component-specific modifications if target element is specified
      if (interpretation.targetElement) {
        const components = section.components || [];
        
        components.forEach(component => {
          if (component.type === interpretation.targetElement) {
            // Apply modifications based on the suggested changes
            interpretation.suggestedChanges.forEach(change => {
              switch (change.property) {
                case 'size':
                  if (!component.style) component.style = {};
                  
                  if (change.value === 'larger' || change.value === 'bigger') {
                    component.style.fontSize = 'larger';
                    component.style.padding = '1rem';
                  } else if (change.value === 'smaller') {
                    component.style.fontSize = 'smaller';
                    component.style.padding = '0.25rem';
                  }
                  
                  modified = true;
                  break;
                
                default:
                  break;
              }
            });
          }
        });
      }
      
      if (modified) {
        modifiedSections.push(section.id);
        console.log('Modified section components:', section.id);
      }
    });
  }
  
  /**
   * Generate a human-readable description of the changes
   */
  private static generateChangeDescription(
    interpretation: DesignFeedbackInterpretation,
    modifiedSections: string[],
    addedSections: string[],
    removedSections: string[]
  ): string {
    const changes = [];
    
    if (addedSections.length > 0) {
      changes.push(`Added ${addedSections.length} new ${interpretation.targetSection || 'section'}(s)`);
    }
    
    if (removedSections.length > 0) {
      changes.push(`Removed ${removedSections.length} ${interpretation.targetSection || 'section'}(s)`);
    }
    
    if (modifiedSections.length > 0) {
      const action = interpretation.intent === 'style' ? 'Styled' : 
                     interpretation.intent === 'layout' ? 'Rearranged' : 'Modified';
      
      changes.push(`${action} ${modifiedSections.length} ${interpretation.targetSection || 'section'}(s)`);
    }
    
    if (changes.length === 0) {
      return 'No changes were made to the wireframe';
    }
    
    return changes.join('. ');
  }
}
