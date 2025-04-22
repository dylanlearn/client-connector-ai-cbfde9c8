
import { useState, useCallback, useEffect } from 'react';
import { WireframeData, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export interface ComponentComposition {
  id: string;
  name: string;
  type: string;
  componentId: string;
  parentId?: string;
  properties: Record<string, any>;
  children?: ComponentComposition[];
  inheritFrom?: string;
  variants?: Record<string, any>[];
}

export function useComponentComposition(
  wireframe: WireframeData,
  onUpdateWireframe?: (updated: WireframeData) => void
) {
  const [compositions, setCompositions] = useState<ComponentComposition[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [componentHierarchy, setComponentHierarchy] = useState<WireframeComponent[]>([]);

  // Build component hierarchy from wireframe
  useEffect(() => {
    if (wireframe && wireframe.sections) {
      const allComponents: WireframeComponent[] = [];
      
      // Recursively collect all components from the wireframe structure
      const collectComponents = (components: WireframeComponent[] | undefined) => {
        if (!components) return;
        
        components.forEach(component => {
          allComponents.push(component);
          if (component.children) {
            collectComponents(component.children);
          }
        });
      };
      
      // Process each section
      wireframe.sections.forEach(section => {
        if (section.components) {
          collectComponents(section.components);
        }
      });
      
      setComponentHierarchy(allComponents);
    }
  }, [wireframe]);

  // Create a new composition
  const createComposition = useCallback((name: string, type: string, properties: Record<string, any> = {}) => {
    setIsCreating(true);
    
    try {
      const newComposition: ComponentComposition = {
        id: uuidv4(),
        name,
        type,
        componentId: uuidv4(), // Generate a new component ID for this composition
        properties,
      };
      
      setCompositions(prev => [...prev, newComposition]);
      toast.success(`Created composition: ${name}`);
    } catch (error) {
      toast.error('Failed to create composition');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Save an existing component as a composition
  const saveAsComposition = useCallback((componentId: string, name: string) => {
    if (!componentId || !name) return;
    
    // Find the component in the hierarchy
    const component = componentHierarchy.find(c => c.id === componentId);
    if (!component) {
      toast.error('Component not found');
      return;
    }
    
    try {
      // Extract key properties
      const { id, type, props, style } = component;
      
      const newComposition: ComponentComposition = {
        id: uuidv4(),
        name,
        type: type || 'unknown',
        componentId: id,
        properties: {
          ...(props || {}),
          ...(style || {})
        },
      };
      
      setCompositions(prev => [...prev, newComposition]);
      toast.success(`Saved as composition: ${name}`);
    } catch (error) {
      toast.error('Failed to save composition');
      console.error(error);
    }
  }, [componentHierarchy]);

  // Apply a composition to the current wireframe
  const applyComposition = useCallback((compositionId: string) => {
    const composition = compositions.find(c => c.id === compositionId);
    if (!composition) {
      toast.error('Composition not found');
      return;
    }
    
    try {
      if (!wireframe || !onUpdateWireframe) return;
      
      const updatedWireframe = { ...wireframe };
      
      // Create a function to apply the composition
      const applyToWireframe = (sections: any[]) => {
        return sections.map(section => ({
          ...section,
          components: section.components?.map((component: WireframeComponent) => {
            if (component.type === composition.type) {
              // Apply composition properties
              return {
                ...component,
                props: {
                  ...component.props,
                  ...composition.properties
                }
              };
            }
            
            // Apply to children recursively
            if (component.children?.length) {
              return {
                ...component,
                children: component.children.map(child => {
                  if (child.type === composition.type) {
                    return {
                      ...child,
                      props: {
                        ...child.props,
                        ...composition.properties
                      }
                    };
                  }
                  return child;
                })
              };
            }
            
            return component;
          }) || []
        }));
      };
      
      // Apply the composition to all sections
      updatedWireframe.sections = applyToWireframe(updatedWireframe.sections);
      
      onUpdateWireframe(updatedWireframe);
      toast.success(`Applied composition: ${composition.name}`);
    } catch (error) {
      toast.error('Failed to apply composition');
      console.error(error);
    }
  }, [compositions, wireframe, onUpdateWireframe]);

  // Delete a composition
  const deleteComposition = useCallback((compositionId: string) => {
    setCompositions(prev => prev.filter(comp => comp.id !== compositionId));
    toast.success('Composition deleted');
  }, []);

  return {
    compositions,
    isCreating,
    selectedComponent,
    createComposition,
    saveAsComposition,
    applyComposition,
    selectComponent: setSelectedComponent,
    deleteComposition,
    componentHierarchy
  };
}
