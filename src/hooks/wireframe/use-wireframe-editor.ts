
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { WireframeData, WireframeSection } from "@/services/ai/wireframe/wireframe-types";
import { default as wireframeMemoryService } from "@/services/ai/wireframe/wireframe-memory-service";
import { useWireframeHistory } from "./use-wireframe-history";
import { useWireframeSections } from "./use-wireframe-sections";
import { v4 as uuidv4 } from 'uuid';

export const useWireframeEditor = (
  projectId: string,
  initialWireframe?: WireframeData
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<WireframeData>(() => {
    if (initialWireframe) return initialWireframe;
    return {
      id: uuidv4(),
      title: 'New Wireframe',
      description: 'New wireframe description',
      sections: [],
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#000000'
      },
      typography: {
        headings: 'sans-serif',
        body: 'sans-serif'
      }
    };
  });

  // Load wireframe data
  const loadWireframe = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedWireframe = await wireframeMemoryService.getWireframeFromMemory(projectId);
      
      if (loadedWireframe) {
        setWireframe({
          ...loadedWireframe,
          id: loadedWireframe.id || uuidv4(),
          title: loadedWireframe.title || 'Untitled Wireframe',
          description: loadedWireframe.description || '',
          sections: loadedWireframe.sections || [],
          colorScheme: loadedWireframe.colorScheme || {
            primary: '#3b82f6',
            secondary: '#10b981',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#000000'
          },
          typography: loadedWireframe.typography || {
            headings: 'sans-serif',
            body: 'sans-serif'
          }
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading wireframe:', error);
      toast({
        title: "Error",
        description: "Failed to load wireframe",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [projectId, toast]);

  // Save wireframe data
  const saveWireframeData = useCallback(async () => {
    try {
      await wireframeMemoryService.saveWireframeToMemory(projectId, wireframe);
      
      toast({
        title: "Success",
        description: "Wireframe saved successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving wireframe:', error);
      
      toast({
        title: "Error",
        description: "Failed to save wireframe",
        variant: "destructive"
      });
      
      return false;
    }
  }, [projectId, wireframe, toast]);

  // Use the wireframe history hook with our current wireframe
  const historyManager = useWireframeHistory(wireframe);
  
  // Use the wireframe sections hook with the current wireframe from history
  const {
    sections,
    addSection,
    updateSection,
    removeSection,
    moveSectionUp,
    moveSectionDown,
  } = useWireframeSections(historyManager.currentData);

  // Load wireframe on mount
  useEffect(() => {
    loadWireframe();
  }, [loadWireframe]);

  return {
    isLoading,
    wireframe: historyManager.currentData,
    sections,
    addSection,
    updateSection,
    removeSection,
    moveSectionUp,
    moveSectionDown,
    updateWireframe: historyManager.updateWireframe,
    undo: historyManager.undo,
    redo: historyManager.redo,
    canUndo: historyManager.canUndo,
    canRedo: historyManager.canRedo,
    saveWireframe: saveWireframeData,
    historySize: historyManager.history.length,
    pastStates: historyManager.history.slice(0, historyManager.historyIndex),
    futureStates: historyManager.history.slice(historyManager.historyIndex + 1)
  };
};
