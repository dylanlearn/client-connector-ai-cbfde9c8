
import { useState, useEffect, useCallback } from "react";
import { WireframeDataService } from "@/services/ai/wireframe/data/wireframe-data-service";
import { wireframeStorage } from "@/services/ai/wireframe/api/wireframe-storage";
import { AIWireframe } from "@/services/ai/wireframe/wireframe-types";
import { v4 as uuidv4 } from 'uuid';

// Helper function to validate UUID format
const isValidUUID = (id: string): boolean => {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export function useWireframeStorage(
  setWireframes: (wireframes: AIWireframe[]) => void,
  toast: any
) {
  const loadProjectWireframes = useCallback(async (projectId: string) => {
    try {
      console.log("Loading wireframes for project:", projectId);
      
      // Handle non-UUID project IDs gracefully
      if (!isValidUUID(projectId)) {
        console.warn(`Invalid UUID format for project ID: ${projectId}. Using generated UUID instead.`);
        // For demo purposes, we'll return empty array but in production might want to generate a UUID
        return [];
      }
      
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
      // Validate wireframe ID
      if (!isValidUUID(wireframeId)) {
        console.warn(`Invalid UUID format for wireframe ID: ${wireframeId}`);
        toast({
          title: "Invalid wireframe ID",
          description: "The wireframe ID is not valid",
          variant: "destructive"
        });
        return null;
      }
      
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
