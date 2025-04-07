
import { useState, useEffect, useCallback } from "react";
import { WireframeDataService } from "@/services/ai/wireframe/data/wireframe-data-service";
import { wireframeStorage } from "@/services/ai/wireframe/api/wireframe-storage";
import { AIWireframe } from "@/services/ai/wireframe/wireframe-types";

export function useWireframeStorage(
  setWireframes: (wireframes: AIWireframe[]) => void,
  toast: any
) {
  const loadProjectWireframes = useCallback(async (projectId: string) => {
    try {
      const wireframes = await wireframeStorage.getProjectWireframes(projectId);
      
      // Standardize all wireframe records
      const standardizedWireframes = wireframes.map(wireframe => 
        WireframeDataService.standardizeWireframeRecord(wireframe)
      );
      
      setWireframes(standardizedWireframes);
      
      return standardizedWireframes;
    } catch (error) {
      console.error("Error loading wireframes:", error);
      toast({
        title: "Error loading wireframes",
        description: "Please try again later",
        variant: "destructive"
      });
      return [];
    }
  }, [setWireframes, toast]);

  const getWireframe = useCallback(async (wireframeId: string) => {
    try {
      const wireframe = await WireframeDataService.getWireframe(wireframeId);
      
      if (!wireframe) {
        toast({
          title: "Wireframe not found",
          description: "The requested wireframe could not be found",
          variant: "destructive"
        });
        return null;
      }
      
      return wireframe;
    } catch (error) {
      console.error("Error getting wireframe:", error);
      toast({
        title: "Error loading wireframe",
        description: "Please try again later",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  return {
    loadProjectWireframes,
    getWireframe
  };
}
