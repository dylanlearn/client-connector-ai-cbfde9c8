import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { WireframeData, WireframeSection } from "@/services/ai/wireframe/wireframe-types";
import { wireframeMemoryService } from "@/services/ai/wireframe/wireframe-memory-service";
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

  // Replace getProject with direct wireframe loading
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

  // Replace saveProject with wireframe saving
  const saveWireframe = useCallback(async () => {
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

  const {
    wireframe: historyWireframe,
    updateWireframe,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
    saveWireframe: saveHistoryWireframe,
    addSnapshot,
    historySize,
    pastStates,
    futureStates,
  } = useWireframeHistory(wireframe);

  const {
    sections,
    addSection,
    updateSection,
    removeSection,
    moveSectionUp,
    moveSectionDown,
  } = useWireframeSections(wireframe, updateWireframe);

  useEffect(() => {
    loadWireframe();
  }, [loadWireframe]);

  return {
    isLoading,
    wireframe: historyWireframe,
    sections,
    addSection,
    updateSection,
    removeSection,
    moveSectionUp,
    moveSectionDown,
    updateWireframe,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
    saveWireframe,
    addSnapshot,
    historySize,
    pastStates,
    futureStates,
  };
};
