
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWireframeGenerator } from "./wireframe/use-wireframe-generator";
import { useWireframeStorage } from "./wireframe/use-wireframe-storage";
import { useWireframeFeedback } from "./wireframe/use-wireframe-feedback";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  AIWireframe
} from "@/services/ai/wireframe/wireframe-types";

export function useWireframeGeneration() {
  const [creativityLevel, setCreativityLevel] = useState<number>(8);
  const [wireframes, setWireframes] = useState<AIWireframe[]>([]);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeGenerationResult | null>(null);
  const { toast } = useToast();

  // Use the extracted hooks
  const { 
    isGenerating, 
    error,
    generateWireframe: generateWireframeBase,
    generateCreativeVariation 
  } = useWireframeGenerator(creativityLevel, setCurrentWireframe, toast);

  const {
    loadProjectWireframes,
    getWireframe
  } = useWireframeStorage(setWireframes, toast);

  const {
    provideFeedback,
    deleteWireframe
  } = useWireframeFeedback(wireframes, setWireframes, toast);

  // Wrap the generateWireframe function to handle different param formats
  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams | string, 
    projectId?: string
  ) => {
    // Handle string input (convert to params object)
    if (typeof params === 'string') {
      return generateWireframeBase({
        description: params,
        projectId,
        creativityLevel
      });
    }
    
    // Ensure description property exists (it's required)
    const generationParams: WireframeGenerationParams = {
      ...params,
      description: params.description || "New wireframe generation",
    };
    
    // Handle params object directly
    return generateWireframeBase(generationParams);
  }, [generateWireframeBase, creativityLevel]);

  return {
    isGenerating,
    wireframes,
    currentWireframe,
    error,
    creativityLevel,
    generateWireframe,
    generateCreativeVariation,
    setCreativityLevel,
    loadProjectWireframes,
    getWireframe,
    provideFeedback,
    deleteWireframe
  };
}
