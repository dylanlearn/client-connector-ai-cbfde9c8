
import { useState, useCallback } from "react";
import { useToast, Toast } from "@/hooks/use-toast";
import { useWireframeGenerator } from "@/hooks/wireframe/use-wireframe-generator";
import { useWireframeStorage } from "@/hooks/wireframe/use-wireframe-storage";
import { useWireframeFeedback } from "@/hooks/wireframe/use-wireframe-feedback";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  AIWireframe,
  normalizeWireframeGenerationParams
} from "@/services/ai/wireframe/wireframe-types";
import { v4 as uuidv4 } from "uuid";
import { parseError } from "@/utils/error-handling";

export function useWireframeGeneration() {
  const [creativityLevel, setCreativityLevel] = useState<number>(8);
  const [wireframes, setWireframes] = useState<AIWireframe[]>([]);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeGenerationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
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

  // Validate the wireframe generation parameters
  const validateParams = useCallback((params: WireframeGenerationParams): string | null => {
    if (!params.description || params.description.trim().length === 0) {
      return "Description is required";
    }
    
    if (params.description.trim().length < 10) {
      return "Description should be at least 10 characters long for better results";
    }
    
    if (params.creativityLevel !== undefined && (params.creativityLevel < 1 || params.creativityLevel > 10)) {
      return "Creativity level must be between 1 and 10";
    }
    
    return null;
  }, []);

  // Wrap the generateWireframe function to handle different param formats
  const generateWireframe = useCallback(async (
    params: WireframeGenerationParams | string, 
    projectId?: string
  ): Promise<WireframeGenerationResult> => {
    // Reset validation error
    setValidationError(null);
    
    try {
      // Handle string input (convert to params object)
      let generationParams: WireframeGenerationParams;
      
      if (typeof params === 'string') {
        generationParams = {
          description: params,
          projectId: projectId || uuidv4(),
          creativityLevel
        };
      } else {
        // Ensure description property exists (it's required)
        generationParams = {
          ...params,
          description: params.description || "",
          projectId: params.projectId || projectId || uuidv4()
        };
      }
      
      // Validate the parameters
      const validationResult = validateParams(generationParams);
      if (validationResult) {
        setValidationError(validationResult);
        console.error('Wireframe generation parameter validation failed:', validationResult);
        return {
          wireframe: null,
          success: false,
          message: validationResult
        };
      }
      
      // Normalize the parameters to ensure consistency
      const normalizedParams = normalizeWireframeGenerationParams(generationParams);
      
      // Log the parameters for debugging
      console.log('Generating wireframe with normalized parameters:', normalizedParams);
      
      // Handle params object directly
      const result = await generateWireframeBase(normalizedParams);
      
      // Log the result for debugging
      if (!result.success) {
        console.warn('Wireframe generation failed:', result.message);
      }
      
      return result;
    } catch (error) {
      // Parse the error to standardize it
      const parsedError = parseError(error);
      console.error('Unexpected error in wireframe generation:', parsedError);
      
      return {
        wireframe: null,
        success: false,
        message: `Unexpected error: ${parsedError.message}`,
        errors: [parsedError.message]
      };
    }
  }, [generateWireframeBase, creativityLevel, validateParams]);

  return {
    isGenerating,
    wireframes,
    currentWireframe,
    error,
    validationError,
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
