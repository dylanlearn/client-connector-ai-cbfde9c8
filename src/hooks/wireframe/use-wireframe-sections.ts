
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWireframeStore } from '@/stores/wireframe-store';
import { v4 as uuidv4 } from 'uuid';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export const useWireframeSections = () => {
  const [isLoading, setIsLoading] = useState(false);
  const wireframeStore = useWireframeStore();
  const { toast } = useToast();
  
  const addSection = (section: Omit<WireframeSection, "id">) => {
    try {
      wireframeStore.addSection(section);
      toast({
        title: "Section added",
        description: `${section.name} section was added successfully.`,
      });
    } catch (error) {
      console.error("Error adding section:", error);
      toast({
        title: "Error adding section",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const updateSection = (id: string, updates: Partial<WireframeSection>) => {
    try {
      wireframeStore.updateSection(id, updates);
      toast({
        title: "Section updated",
        description: "Section was updated successfully.",
      });
    } catch (error) {
      console.error("Error updating section:", error);
      toast({
        title: "Error updating section",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const removeSection = (id: string) => {
    try {
      wireframeStore.removeSection(id);
      toast({
        title: "Section removed",
        description: "Section was removed successfully.",
      });
    } catch (error) {
      console.error("Error removing section:", error);
      toast({
        title: "Error removing section",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const duplicateSection = (id: string) => {
    try {
      const section = wireframeStore.sections.find(s => s.id === id);
      if (!section) {
        throw new Error("Section not found");
      }
      
      const { id: _, ...sectionWithoutId } = section;
      
      const newSection = {
        ...sectionWithoutId,
        name: `${section.name} (Copy)`,
        id: uuidv4()
      };
      
      wireframeStore.addSection(newSection);
      
      toast({
        title: "Section duplicated",
        description: "Section was duplicated successfully.",
      });
    } catch (error) {
      console.error("Error duplicating section:", error);
      toast({
        title: "Error duplicating section",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  return {
    sections: wireframeStore.sections,
    activeSection: wireframeStore.activeSection,
    setActiveSection: wireframeStore.setActiveSection,
    addSection,
    updateSection,
    removeSection,
    duplicateSection,
    moveSectionUp: wireframeStore.moveSectionUp,
    moveSectionDown: wireframeStore.moveSectionDown,
    isLoading
  };
};

export default useWireframeSections;
