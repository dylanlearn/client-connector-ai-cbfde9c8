
import { useState, useCallback, useEffect } from 'react';
import { WireframeData, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { toast } from 'sonner';
import { ResizeConfig } from '@/types/wireframe-component';

export interface ComponentRelationship {
  targetId: string;
  type: 'alignment' | 'distance' | 'proportion' | 'grouping';
  behavior: 'maintain' | 'responsive' | 'fixed';
  value?: number | string;
}

export interface ComponentConstraints {
  componentId?: string;
  maintainAspectRatio?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizeStrategy?: 'fixed' | 'auto-height' | 'stretch-children';
  positionLocked?: boolean;
  horizontalAlignment?: 'left' | 'center' | 'right' | 'stretch';
  verticalAlignment?: 'top' | 'middle' | 'bottom' | 'stretch';
  centerInParent?: boolean;
  relationships?: ComponentRelationship[];
  responsive?: {
    mobile?: Partial<ComponentConstraints>;
    tablet?: Partial<ComponentConstraints>;
  };
}

export function useComponentConstraints(
  wireframe: WireframeData,
  onUpdateWireframe?: (updated: WireframeData) => void
) {
  const [elements, setElements] = useState<WireframeComponent[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [constraints, setConstraints] = useState<ComponentConstraints>({
    relationships: []
  });
  
  // Collect all components from wireframe
  useEffect(() => {
    if (wireframe && wireframe.sections) {
      const allComponents: WireframeComponent[] = [];
      
      // Recursively collect all components
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
      
      setElements(allComponents);
    }
  }, [wireframe]);
  
  // When selected element changes, load its constraints
  useEffect(() => {
    if (selectedElement) {
      // Find the selected component
      const component = elements.find(el => el.id === selectedElement);
      
      if (component) {
        // Extract constraint information from component
        setConstraints({
          componentId: component.id,
          maintainAspectRatio: component.resizeStrategy?.maintainAspectRatio,
          minWidth: component.resizeStrategy?.minWidth,
          minHeight: component.resizeStrategy?.minHeight,
          maxWidth: component.resizeStrategy?.maxWidth,
          maxHeight: component.resizeStrategy?.maxHeight,
          resizeStrategy: component.resizeStrategy?.strategy,
          positionLocked: component.locked,
          // Include any existing relationships
          relationships: component.data?.relationships || []
        });
      }
    } else {
      // Reset constraints when no element is selected
      setConstraints({ relationships: [] });
    }
  }, [selectedElement, elements]);

  // Add a new constraint
  const addConstraint = useCallback((type: string, value?: any) => {
    if (!selectedElement) return;
    
    if (type === 'relationship') {
      // Add a new empty relationship
      setConstraints(prev => ({
        ...prev,
        relationships: [
          ...(prev.relationships || []),
          {
            targetId: '',
            type: 'alignment',
            behavior: 'maintain'
          }
        ]
      }));
      
      toast.success('Added new relationship constraint');
    }
  }, [selectedElement]);

  // Remove a constraint
  const removeConstraint = useCallback((type: string, index?: number) => {
    if (!selectedElement) return;
    
    if (type === 'relationship' && typeof index === 'number') {
      setConstraints(prev => ({
        ...prev,
        relationships: prev.relationships?.filter((_, i) => i !== index) || []
      }));
      
      toast.success('Removed relationship constraint');
    }
  }, [selectedElement]);

  // Update a constraint value
  const updateConstraint = useCallback((key: string, value: any) => {
    setConstraints(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Apply all constraints to the component in the wireframe
  const applyConstraints = useCallback(() => {
    if (!selectedElement || !wireframe || !onUpdateWireframe) return;

    try {
      const updatedWireframe = { ...wireframe };
      
      // Recursive function to find and update the component
      const updateComponent = (components: WireframeComponent[] | undefined): WireframeComponent[] | undefined => {
        if (!components) return undefined;
        
        return components.map(component => {
          if (component.id === selectedElement) {
            // Update this component with constraints
            return {
              ...component,
              locked: constraints.positionLocked,
              resizeStrategy: {
                strategy: constraints.resizeStrategy || 'fixed',
                maintainAspectRatio: constraints.maintainAspectRatio,
                minWidth: constraints.minWidth,
                minHeight: constraints.minHeight,
                maxWidth: constraints.maxWidth,
                maxHeight: constraints.maxHeight
              } as ResizeConfig,
              data: {
                ...component.data,
                constraints: {
                  horizontalAlignment: constraints.horizontalAlignment,
                  verticalAlignment: constraints.verticalAlignment,
                  centerInParent: constraints.centerInParent
                },
                relationships: constraints.relationships
              }
            };
          }
          
          // Check children recursively
          if (component.children?.length) {
            return {
              ...component,
              children: updateComponent(component.children)
            };
          }
          
          return component;
        });
      };
      
      // Update sections
      updatedWireframe.sections = updatedWireframe.sections.map(section => ({
        ...section,
        components: updateComponent(section.components)
      }));
      
      onUpdateWireframe(updatedWireframe);
      toast.success('Applied constraints');
    } catch (error) {
      toast.error('Failed to apply constraints');
      console.error(error);
    }
  }, [selectedElement, constraints, wireframe, onUpdateWireframe]);

  // Reset all constraints
  const resetConstraints = useCallback(() => {
    if (!selectedElement) return;
    
    setConstraints({
      componentId: selectedElement,
      relationships: []
    });
    
    toast.success('Reset all constraints');
  }, [selectedElement]);
  
  return {
    selectedElement,
    elements,
    constraints,
    addConstraint,
    removeConstraint,
    updateConstraint,
    applyConstraints,
    resetConstraints,
    selectElement: setSelectedElement,
  };
}
