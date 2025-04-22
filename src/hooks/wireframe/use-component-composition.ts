
import { useState, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface ComponentComposition {
  id: string;
  name: string;
  description: string;
  components: any[]; // Would be more specific in a real implementation
  tags: string[];
  createdAt: string;
}

export function useComponentComposition(
  wireframe: WireframeData,
  onUpdateWireframe?: (updated: WireframeData) => void
) {
  const [compositions, setCompositions] = useState<ComponentComposition[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  // Create a new composition from selected components
  const createComposition = useCallback((name: string, description: string, tags: string[]) => {
    setIsCreating(true);
    
    try {
      // In a real implementation, we would extract the selected components from the wireframe
      // For now, we'll create a mock composition
      const selectedComponentData = wireframe.sections
        .filter(section => selectedComponents.includes(section.id))
        .map(section => ({
          ...section,
          id: `${section.id}-composition`
        }));
      
      const newComposition: ComponentComposition = {
        id: uuidv4(),
        name,
        description,
        components: selectedComponentData,
        tags,
        createdAt: new Date().toISOString()
      };
      
      setCompositions(prev => [...prev, newComposition]);
      setSelectedComponents([]);
      toast.success(`Created "${name}" composition`);
      
      return newComposition;
    } catch (error) {
      toast.error('Error creating composition');
      console.error(error);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [wireframe, selectedComponents]);

  // Apply a composition to the wireframe
  const applyComposition = useCallback((compositionId: string, targetSectionId?: string) => {
    if (!onUpdateWireframe) return;
    
    const composition = compositions.find(c => c.id === compositionId);
    if (!composition) return;
    
    try {
      // In a real implementation, we would insert the composition at the specified location
      // For now, we'll assume it's being added at the end of the wireframe
      const updatedWireframe = { ...wireframe };
      
      if (targetSectionId) {
        // Replace a specific section with the composition
        const targetIndex = updatedWireframe.sections.findIndex(s => s.id === targetSectionId);
        if (targetIndex >= 0) {
          updatedWireframe.sections.splice(targetIndex, 1, ...composition.components);
        }
      } else {
        // Add to the end
        updatedWireframe.sections = [
          ...updatedWireframe.sections,
          ...composition.components
        ];
      }
      
      onUpdateWireframe(updatedWireframe);
      toast.success(`Applied "${composition.name}" composition`);
    } catch (error) {
      toast.error('Error applying composition');
      console.error(error);
    }
  }, [compositions, wireframe, onUpdateWireframe]);

  // Delete a composition
  const deleteComposition = useCallback((compositionId: string) => {
    setCompositions(prev => prev.filter(c => c.id !== compositionId));
    toast.success('Composition deleted');
  }, []);

  // Toggle component selection
  const toggleComponentSelection = useCallback((componentId: string) => {
    setSelectedComponents(prev => {
      if (prev.includes(componentId)) {
        return prev.filter(id => id !== componentId);
      } else {
        return [...prev, componentId];
      }
    });
  }, []);

  // Add example compositions for demonstration
  const loadExampleCompositions = useCallback(() => {
    const exampleCompositions: ComponentComposition[] = [
      {
        id: uuidv4(),
        name: 'Hero Section with CTA',
        description: 'A hero section with heading, subheading, and call-to-action buttons',
        components: [
          {
            id: 'hero-example',
            sectionType: 'hero',
            name: 'Hero Section',
            heading: 'Welcome to Our Platform',
            subheading: 'The best solution for your needs',
            ctaText: 'Get Started'
          }
        ],
        tags: ['hero', 'cta', 'header'],
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Feature Grid',
        description: 'A 3-column grid showcasing product features with icons',
        components: [
          {
            id: 'features-example',
            sectionType: 'features',
            name: 'Features Grid',
            columns: 3,
            features: [
              { title: 'Feature 1', description: 'Description of feature 1' },
              { title: 'Feature 2', description: 'Description of feature 2' },
              { title: 'Feature 3', description: 'Description of feature 3' }
            ]
          }
        ],
        tags: ['features', 'grid', 'product'],
        createdAt: new Date().toISOString()
      }
    ];
    
    setCompositions(exampleCompositions);
  }, []);

  // Load example compositions by default
  useState(() => {
    loadExampleCompositions();
  });

  return {
    compositions,
    isCreating,
    selectedComponents,
    createComposition,
    applyComposition,
    deleteComposition,
    toggleComponentSelection,
    loadExampleCompositions
  };
}
