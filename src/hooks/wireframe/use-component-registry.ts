import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WireframeComponent } from '@/types/wireframe-component';
import { ComponentDefinition, ComponentVariant } from '@/components/wireframe/registry/component-types';

/**
 * Hook to manage component registry for wireframe editor
 */
export function useComponentRegistry() {
  // Store for registered components
  const [componentTypes, setComponentTypes] = useState<ComponentDefinition[]>([]);
  
  // Store for user's custom components
  const [customComponents, setCustomComponents] = useState<WireframeComponent[]>([]);
  
  // Initialize with default components
  useEffect(() => {
    // Default component types
    const defaultTypes = [
      {
        type: 'box',
        name: 'Container Box',
        description: 'A flexible container element',
        icon: 'SquareIcon',
        defaultData: {
          id: '',
          type: 'box',
          position: { x: 0, y: 0 },
          size: { width: 200, height: 150 },
          zIndex: 1,
          props: { 
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderColor: '#e2e8f0',
            borderWidth: '1px'
          }
        }
      },
      {
        type: 'text',
        name: 'Text Element',
        description: 'Text content with styling options',
        icon: 'TypeIcon',
        defaultData: {
          id: '',
          type: 'text',
          position: { x: 0, y: 0 },
          size: { width: 200, height: 40 },
          zIndex: 1,
          props: { 
            text: 'Text content',
            fontSize: 16,
            fontFamily: 'sans-serif',
            color: '#1e293b'
          }
        }
      },
      {
        type: 'image',
        name: 'Image',
        description: 'Image placeholder or uploaded image',
        icon: 'ImageIcon',
        defaultData: {
          id: '',
          type: 'image',
          position: { x: 0, y: 0 },
          size: { width: 200, height: 150 },
          zIndex: 1,
          props: { 
            src: '', 
            alt: 'Image placeholder',
            objectFit: 'cover'
          }
        }
      },
      {
        type: 'button',
        name: 'Button',
        description: 'Interactive button element',
        icon: 'MousePointerClickIcon',
        defaultData: {
          id: '',
          type: 'button',
          position: { x: 0, y: 0 },
          size: { width: 120, height: 40 },
          zIndex: 1,
          props: { 
            text: 'Button',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            fontSize: 14,
            borderRadius: '4px'
          }
        }
      }
    ];
    
    setComponentTypes(defaultTypes);
  }, []);
  
  // Register a new component type
  const registerComponent = useCallback((component: ComponentDefinition) => {
    setComponentTypes(prev => {
      // If component with this type already exists, replace it
      const existingIndex = prev.findIndex(c => c.type === component.type);
      
      if (existingIndex > -1) {
        const updatedComponents = [...prev];
        updatedComponents[existingIndex] = component;
        return updatedComponents;
      }
      
      // Otherwise add as new
      return [...prev, component];
    });
  }, []);
  
  // Create a component instance from type
  const createComponent = useCallback((type: string, overrideProps?: Record<string, any>): WireframeComponent | null => {
    const componentType = componentTypes.find(c => c.type === type);
    
    if (!componentType) {
      console.error(`Component type '${type}' not found in registry`);
      return null;
    }
    
    const { defaultData } = componentType;
    
    // Create new instance with unique ID
    return {
      ...defaultData,
      id: uuidv4(),
      props: {
        ...defaultData.props,
        ...overrideProps
      }
    };
  }, [componentTypes]);
  
  // Save a custom component
  const saveCustomComponent = useCallback((component: WireframeComponent) => {
    setCustomComponents(prev => [...prev, {
      ...component,
      id: uuidv4() // Give custom component a new ID
    }]);
  }, []);
  
  return {
    componentTypes,
    customComponents,
    registerComponent,
    createComponent,
    saveCustomComponent
  };
}
