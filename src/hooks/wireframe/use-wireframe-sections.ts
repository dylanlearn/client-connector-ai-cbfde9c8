
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWireframeStore, WireframeSection } from '@/stores/wireframe-store';
import { v4 as uuidv4 } from 'uuid';

export const useWireframeSections = () => {
  const [isLoading, setIsLoading] = useState(false);
  const wireframe = useWireframeStore();
  const { toast } = useToast();
  
  const addSection = (section: Omit<WireframeSection, "id">) => {
    try {
      wireframe.addSection(section);
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
      wireframe.updateSection(id, updates);
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
      wireframe.removeSection(id);
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
      const section = wireframe.sections.find(s => s.id === id);
      if (!section) {
        throw new Error("Section not found");
      }
      
      const { id: _, ...sectionWithoutId } = section;
      
      const newSection = {
        ...sectionWithoutId,
        name: `${section.name} (Copy)`,
        id: uuidv4()
      };
      
      wireframe.addSection(newSection);
      
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
    sections: wireframe.sections,
    activeSection: wireframe.activeSection,
    setActiveSection: wireframe.setActiveSection,
    addSection,
    updateSection,
    removeSection,
    duplicateSection,
    moveSectionUp: wireframe.moveSectionUp,
    moveSectionDown: wireframe.moveSectionDown,
    isLoading
  };
};

export default useWireframeSections;
