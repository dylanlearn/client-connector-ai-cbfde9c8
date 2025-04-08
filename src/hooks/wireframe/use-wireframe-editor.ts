
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';

export function useWireframeEditor(initialWireframe?: any) {
  const [wireframe, setWireframe] = useState<any>(initialWireframe || {
    id: uuidv4(),
    title: 'New Wireframe',
    description: 'Created with the Wireframe Editor',
    sections: [],
    version: '1.0',
    lastUpdated: new Date().toISOString()
  });
  
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  // Add a new section to the wireframe
  const addSection = useCallback((section: Partial<WireframeSection>) => {
    const newSection = {
      ...section,
      id: section.id || uuidv4()
    };
    
    setWireframe(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
      lastUpdated: new Date().toISOString()
    }));
    
    return newSection.id;
  }, []);
  
  // Update an existing section
  const updateSection = useCallback((sectionId: string, updates: Partial<WireframeSection>) => {
    setWireframe(prev => {
      const sectionIndex = prev.sections.findIndex((s: any) => s.id === sectionId);
      if (sectionIndex === -1) return prev;
      
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        ...updates
      };
      
      return {
        ...prev,
        sections: updatedSections,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);
  
  // Remove a section from the wireframe
  const removeSection = useCallback((sectionId: string) => {
    setWireframe(prev => ({
      ...prev,
      sections: prev.sections.filter((s: any) => s.id !== sectionId),
      lastUpdated: new Date().toISOString()
    }));
    
    // If the active section was removed, clear the selection
    if (activeSection === sectionId) {
      setActiveSection(null);
    }
    
    // Remove from hidden sections if it was there
    setHiddenSections(prev => prev.filter(id => id !== sectionId));
  }, [activeSection]);
  
  // Reorder sections by swapping positions
  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    setWireframe(prev => {
      const newSections = [...prev.sections];
      const [movedSection] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, movedSection);
      
      return {
        ...prev,
        sections: newSections,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);
  
  // Toggle section visibility
  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setHiddenSections(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
  }, []);
  
  // Show all sections
  const showAllSections = useCallback(() => {
    setHiddenSections([]);
  }, []);
  
  // Save the wireframe
  const saveWireframe = useCallback(async () => {
    try {
      // Save wireframe logic would go here
      // For now, just show a success toast
      toast({
        title: "Wireframe saved",
        description: "Your wireframe has been saved successfully."
      });
      
      return wireframe;
    } catch (error) {
      console.error("Error saving wireframe:", error);
      toast({
        title: "Error",
        description: "Failed to save wireframe.",
        variant: "destructive",
      });
      return null;
    }
  }, [wireframe, toast]);
  
  return {
    wireframe,
    setWireframe,
    activeSection,
    setActiveSection,
    darkMode,
    setDarkMode,
    deviceType,
    setDeviceType,
    hiddenSections,
    toggleSectionVisibility,
    showAllSections,
    addSection,
    updateSection,
    removeSection,
    reorderSections,
    saveWireframe
  };
}
