
import { useCallback } from 'react';
import { useWireframeStudio } from '@/contexts/WireframeStudioContext';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export function useSectionInteractions() {
  const { 
    selectedSection,
    setSelectedSection,
    wireframeData,
    updateWireframe
  } = useWireframeStudio();

  const handleSectionClick = useCallback((sectionId: string) => {
    setSelectedSection(sectionId);
  }, [setSelectedSection]);

  const handleSectionUpdate = useCallback((sectionId: string, updates: Partial<WireframeSection>) => {
    const updatedWireframe = {
      ...wireframeData,
      sections: wireframeData.sections.map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      )
    };
    updateWireframe(updatedWireframe);
  }, [wireframeData, updateWireframe]);

  return {
    selectedSection,
    handleSectionClick,
    handleSectionUpdate
  };
}

