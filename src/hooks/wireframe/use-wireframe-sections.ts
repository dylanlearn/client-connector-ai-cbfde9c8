
import { useState, useCallback } from 'react';
import { useWireframeStore, WireframeSection } from '@/stores/wireframe-store';
import { createSectionInstance, getComponentDefinition } from '@/components/wireframe/registry/component-registry';
import { useToast } from '@/hooks/use-toast';

export function useWireframeSections() {
  const { toast } = useToast();
  const [isMoving, setIsMoving] = useState(false);
  
  const wireframe = useWireframeStore(state => state.wireframe);
  const activeSection = useWireframeStore(state => state.activeSection);
  const addSection = useWireframeStore(state => state.addSection);
  const updateSection = useWireframeStore(state => state.updateSection);
  const removeSection = useWireframeStore(state => state.removeSection);
  const reorderSections = useWireframeStore(state => state.reorderSections);
  const setActiveSection = useWireframeStore(state => state.setActiveSection);
  
  const handleAddSection = useCallback((componentType: string, variantId?: string) => {
    const newSectionData = createSectionInstance(componentType, variantId);
    const componentDef = getComponentDefinition(componentType);
    
    if (!componentDef) {
      toast({
        title: "Error",
        description: `Component type '${componentType}' not found`,
        variant: "destructive"
      });
      return;
    }
    
    // Create a section object compatible with the wireframe-store WireframeSection type
    const sectionToAdd: Omit<WireframeSection, 'id'> = {
      name: componentDef.name || 'New Section',
      sectionType: componentType,
      description: componentDef.description || '',
      layoutType: 'default',
      copySuggestions: [] as any[], // Explicitly cast as any[] array type
      ...newSectionData
    };
    
    addSection(sectionToAdd);
    
    toast({
      title: "Section added",
      description: `Added ${componentDef.name} section to wireframe`
    });
  }, [addSection, toast]);
  
  const handleUpdateSection = useCallback((sectionId: string, updates: Partial<WireframeSection>) => {
    if (!sectionId) return;
    
    // Convert copySuggestions from possible object to array if needed
    if (updates.copySuggestions && !Array.isArray(updates.copySuggestions)) {
      const convertedUpdates = {
        ...updates,
        copySuggestions: Object.keys(updates.copySuggestions).length > 0 
          ? [updates.copySuggestions] as any[] // Convert to array with the object as its only item
          : [] as any[] // Empty array if the object is empty
      };
      updateSection(sectionId, convertedUpdates);
    } else {
      updateSection(sectionId, updates);
    }
  }, [updateSection]);
  
  const handleRemoveSection = useCallback((sectionId: string) => {
    if (!sectionId) return;
    
    removeSection(sectionId);
    
    toast({
      title: "Section removed",
      description: "Section has been removed from wireframe"
    });
  }, [removeSection, toast]);
  
  const handleReorderSections = useCallback((fromIndex: number, toIndex: number) => {
    setIsMoving(true);
    reorderSections(fromIndex, toIndex);
    
    // Small delay to prevent UI flicker
    setTimeout(() => setIsMoving(false), 100);
  }, [reorderSections]);
  
  const handleSelectSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
  }, [setActiveSection]);
  
  return {
    sections: wireframe.sections || [],
    activeSection,
    isMoving,
    addSection: handleAddSection,
    updateSection: handleUpdateSection,
    removeSection: handleRemoveSection,
    reorderSections: handleReorderSections,
    selectSection: handleSelectSection
  };
}
