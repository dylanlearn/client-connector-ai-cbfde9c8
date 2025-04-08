
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
      // Initialize copySuggestions as an empty array to ensure proper typing
      copySuggestions: [],
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
    
    // Create a new updates object with normalized copySuggestions if present
    const normalizedUpdates = { ...updates };
    
    if ('copySuggestions' in updates) {
      // Normalize copySuggestions to always be an array
      normalizedUpdates.copySuggestions = Array.isArray(updates.copySuggestions)
        ? updates.copySuggestions
        : updates.copySuggestions
          ? [updates.copySuggestions]
          : [];
    }
    
    // Apply the normalized updates
    updateSection(sectionId, normalizedUpdates);
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
