import { useState, useCallback } from "react";
import { useToast, Toast } from "@/hooks/use-toast";
import { useWireframeGenerator } from "./wireframe/use-wireframe-generator";
import { useWireframeStorage } from "./wireframe/use-wireframe-storage";
import { useWireframeFeedback } from "./wireframe/use-wireframe-feedback";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  AIWireframe
} from "@/services/ai/wireframe/wireframe-types";
import { v4 as uuidv4 } from "uuid";

export function useWireframeGeneration() {
  const [creativityLevel, setCreativityLevel] = useState<number>(8);
  const [wireframes, setWireframes] = useState<AIWireframe[]>([]);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeGenerationResult | null>(null);
  const { toast } = useToast();

  // Use the extracted hooks with properly typed toast function
  const { 
    isGenerating, 
    error,
    generateWireframe: generateWireframeBase,
    generateCreativeVariation 
  } = useWireframeGenerator(creativityLevel, setCurrentWireframe, (props: Toast) => {
    toast(props);
    return "";  // Return empty string to satisfy the return type
  });

  const {
    loadProjectWireframes,
    getWireframe
  } = useWireframeStorage(setWireframes, (props: Toast) => {
    toast(props);
    return "";  // Return empty string to satisfy the return type
  });

  const {
    provideFeedback,
    deleteWireframe
  } = useWireframeFeedback(wireframes, setWireframes, (props: Toast) => {
    toast(props);
    return "";  // Return empty string to satisfy the return type
  });

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
    
    // Ensure style is a string if it's an object
    if (generationParams.style && typeof generationParams.style === 'object') {
      generationParams.style = JSON.stringify(generationParams.style);
    }
    
    // Handle params object directly
    return generateWireframeBase(generationParams);
  }, [generateWireframeBase, creativityLevel]);

  // Replace the default wireframe with a properly typed version
  const defaultWireframe = {
    id: uuidv4(),
    title: 'New Wireframe',
    description: 'Generated wireframe from prompt',
    sections: [],
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#000000'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  };

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
