
import { useState, useCallback } from 'react';
import { Toast } from "@/hooks/use-toast";
import { 
  WireframeGenerationParams,
  WireframeGenerationResult,
  WireframeData,
  normalizeWireframeGenerationParams
} from '@/services/ai/wireframe/wireframe-types';
import { 
  generateWireframe as apiGenerateWireframeService,
  generateWireframeVariationWithStyle 
} from '@/services/ai/wireframe/wireframe-service';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

// Define validation result interface
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Enhanced error handling type
type ErrorWithDetails = Error & { details?: any, code?: string };

export function useWireframeGenerator(
  defaultCreativityLevel: number,
  setCurrentWireframe: React.Dispatch<React.SetStateAction<WireframeGenerationResult | null>>,
  showToast: (props: Toast) => string
) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<ErrorWithDetails | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validate wireframe using edge function
  const validateWireframe = useCallback(async (wireframe: WireframeData): Promise<ValidationResult> => {
    setIsValidating(true);
    setValidationErrors([]);
    
    try {
      console.log("Validating wireframe:", wireframe.id);
      
      const { data, error } = await supabase.functions.invoke('validate-wireframe', {
        body: { wireframe, validateWithDb: false }
      });
      
      if (error) {
        console.error("Validation API error:", error);
        setValidationErrors([`Validation API error: ${error.message}`]);
        return {
          isValid: false,
          errors: [`Validation API error: ${error.message}`]
        };
      }
      
      console.log("Validation result:", data);
      
      if (!data.isValid) {
        setValidationErrors(data.errors);
      }
      
      return {
        isValid: data.isValid,
        errors: data.errors || []
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown validation error";
      console.error("Error validating wireframe:", err);
      setValidationErrors([errorMessage]);
      return {
        isValid: false,
        errors: [errorMessage]
      };
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Generate a wireframe based on a prompt
  const generateWireframe = useCallback(async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
    setIsGenerating(true);
    setError(null);
    setValidationErrors([]);

    try {
      console.log("Starting wireframe generation with params:", params);
      
      // Normalize parameters for consistency
      const normalizedParams = normalizeWireframeGenerationParams(params);
      
      // Extract params that need special processing
      const projectId = normalizedParams.projectId || uuidv4();
      const creativityLevel = normalizedParams.creativityLevel || defaultCreativityLevel;
      const enhancedCreativity = normalizedParams.enhancedCreativity || false;
      
      // Ensure required parameters
      if (!normalizedParams.description && !normalizedParams.baseWireframe) {
        throw Object.assign(
          new Error("Either description or baseWireframe is required for generation"),
          { code: "MISSING_REQUIRED_PARAMS" }
        );
      }
      
      console.log(`Enhanced wireframe generation initiated with creativityLevel: ${creativityLevel}`);

      // Call the service to generate the wireframe
      const result = await apiGenerateWireframeService({
        ...normalizedParams,
        projectId,
        creativityLevel
      });

      if (result.success && result.wireframe) {
        console.log("Wireframe generated successfully:", result.wireframe.id);
        
        // Validate the wireframe
        const validationResult = await validateWireframe(result.wireframe);
        
        // Even if validation fails, we'll return the wireframe but with warnings
        if (!validationResult.isValid) {
          console.warn("Generated wireframe has validation issues:", validationResult.errors);
          result.warnings = validationResult.errors;
        }
        
        // Set the current wireframe
        setCurrentWireframe(result);

        // Show success toast
        showToast({
          title: "Wireframe Generated",
          description: "Your wireframe has been successfully generated"
        });

        return result;
      } else {
        throw Object.assign(
          new Error(result.message || "Failed to generate wireframe"),
          { details: result, code: "GENERATION_FAILED" }
        );
      }
    } catch (err) {
      console.error("Error generating wireframe:", err);
      
      const errorObj = err as ErrorWithDetails;
      const errorMessage = errorObj.message || "Unknown error occurred";
      const errorCode = errorObj.code || "UNKNOWN_ERROR";
      
      setError(Object.assign(
        new Error(errorMessage),
        { details: errorObj.details, code: errorCode }
      ));
      
      // Show error toast
      showToast({
        title: "Wireframe Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Return a default error result
      return {
        wireframe: null,
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [defaultCreativityLevel, setCurrentWireframe, showToast, validateWireframe]);

  // Generate a creative variation of an existing wireframe
  const generateCreativeVariation = useCallback(async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
    setIsGenerating(true);
    setError(null);
    setValidationErrors([]);

    try {
      console.log("Starting wireframe variation generation with params:", params);
      
      // Validate required parameters
      if (!params.baseWireframe && !params.description) {
        throw Object.assign(
          new Error("Either baseWireframe or description is required for variation generation"),
          { code: "MISSING_REQUIRED_PARAMS" }
        );
      }
      
      // Apply creativity level
      const creativityLevel = params.creativityLevel || defaultCreativityLevel;
      
      // Call the service to generate the variation with all required arguments
      const result = await generateWireframeVariationWithStyle(
        params,
        creativityLevel 
      );

      if (result.success && result.wireframe) {
        console.log("Wireframe variation generated successfully:", result.wireframe.id);
        
        // Validate the wireframe
        const validationResult = await validateWireframe(result.wireframe);
        
        // Even if validation fails, we'll return the wireframe but with warnings
        if (!validationResult.isValid) {
          console.warn("Generated variation has validation issues:", validationResult.errors);
          result.warnings = validationResult.errors;
        }
        
        // Set the current wireframe
        setCurrentWireframe(result);

        // Show success toast
        showToast({
          title: "Variation Generated",
          description: "A new creative variation has been generated"
        });

        return result;
      } else {
        throw Object.assign(
          new Error(result.message || "Failed to generate variation"),
          { details: result, code: "VARIATION_GENERATION_FAILED" }
        );
      }
    } catch (err) {
      console.error("Error generating variation:", err);
      
      const errorObj = err as ErrorWithDetails;
      const errorMessage = errorObj.message || "Unknown error occurred";
      const errorCode = errorObj.code || "UNKNOWN_ERROR";
      
      setError(Object.assign(
        new Error(errorMessage),
        { details: errorObj.details, code: errorCode }
      ));
      
      // Show error toast
      showToast({
        title: "Variation Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Return a default error result
      return {
        wireframe: null,
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [defaultCreativityLevel, setCurrentWireframe, showToast, validateWireframe]);

  return {
    isGenerating,
    isValidating,
    error,
    validationErrors,
    generateWireframe,
    generateCreativeVariation,
    validateWireframe
  };
}
