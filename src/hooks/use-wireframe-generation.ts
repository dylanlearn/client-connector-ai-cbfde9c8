
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { WireframeService } from "@/services/ai/wireframe/wireframe-service";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult, 
  AIWireframe, 
  WireframeData 
} from "@/services/ai/wireframe/wireframe-types";

export function useWireframeGeneration() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [wireframes, setWireframes] = useState<AIWireframe[]>([]);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeGenerationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [creativityLevel, setCreativityLevel] = useState<number>(8); // Default high creativity
  const { toast } = useToast();

  // Function to enhance a prompt with more specific design guidance
  const enhancePrompt = (prompt: string): string => {
    // Only enhance if the prompt doesn't already have detailed design instructions
    if (prompt.length < 100 && 
        !prompt.toLowerCase().includes('layout') && 
        !prompt.toLowerCase().includes('section')) {
      return `${prompt} 
Include clear content sections with appropriate hierarchy. 
Design with responsive layouts in mind. 
Use consistent spacing and alignment throughout.
Include intuitive navigation and clear call-to-action elements.`;
    }
    return prompt;
  };

  const generateWireframe = async (params: WireframeGenerationParams) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      toast({
        title: "Generating wireframe",
        description: "Creating a highly creative design, this might take a moment...",
      });
      
      // Enhance the prompt for better results
      const enhancedParams = {
        ...params,
        enhancedCreativity: true,
        creativityLevel: params.creativityLevel || creativityLevel,
        description: enhancePrompt(params.description || '')
      };
      
      // Call the wireframe generation service
      console.log("Calling wireframe service with enhanced params:", enhancedParams);
      const result = await WireframeService.generateWireframe(enhancedParams);
      console.log("Generated wireframe result:", result);
      
      // Process and validate the wireframe data
      if (result && result.wireframe) {
        // Ensure wireframe has proper structure with sections/pages
        if (!result.wireframe.sections && !result.wireframe.pages) {
          console.log("Adding default empty sections array to wireframe");
          result.wireframe.sections = [];
        }
        
        // Process pages if they exist
        if (Array.isArray(result.wireframe.pages) && result.wireframe.pages.length > 0) {
          console.log("Processing wireframe pages:", result.wireframe.pages.length);
          // Make sure each page has a sections array
          result.wireframe.pages = result.wireframe.pages.map(page => {
            console.log("Processing page:", page.name || "Unnamed page");
            return {
              ...page,
              sections: Array.isArray(page.sections) ? page.sections : []
            };
          });
        } else if (!result.wireframe.pages) {
          // If no pages defined but sections exist, create a default page
          if (Array.isArray(result.wireframe.sections) && result.wireframe.sections.length > 0) {
            console.log("Creating default page structure with existing sections");
            result.wireframe.pages = [{
              id: "default-page",
              name: result.wireframe.title || "Home",
              sections: result.wireframe.sections,
              pageType: "home"
            }];
          }
        }
        
        // Set a fallback style if none provided
        if (!result.wireframe.style) {
          result.wireframe.style = params.style || "modern";
        }
        
        // Add design tokens if missing
        if (!result.wireframe.designTokens) {
          result.wireframe.designTokens = {
            colors: {
              primary: "#4361ee",
              secondary: "#3f37c9",
              accent: "#4cc9f0",
              background: "#ffffff",
              text: "#1a1a1a"
            },
            typography: {
              headingFont: "Inter, sans-serif",
              bodyFont: "Inter, sans-serif",
              baseFontSize: "16px",
              scaleRatio: 1.2
            },
            spacing: {
              unit: "1rem",
              sectionPadding: "2rem 0"
            }
          };
        }
      } else {
        console.error("Invalid wireframe data structure received");
        throw new Error("Invalid wireframe data structure received");
      }
      
      console.log("Final processed wireframe:", result);
      setCurrentWireframe(result);
      setCreativityLevel(result.creativityLevel || creativityLevel); // Update creativity level if returned
      
      toast({
        title: "Creative wireframe generated",
        description: `Generated "${result.wireframe.title || 'New wireframe'}" in ${result.generationTime.toFixed(2)}s`,
      });
      
      return result;
    } catch (err) {
      console.error("Error generating wireframe:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate wireframe";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Wireframe generation failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCreativeVariation = async (baseWireframe: WireframeData, projectId?: string) => {
    if (!baseWireframe) return null;
    
    try {
      toast({
        title: "Generating creative variation",
        description: "Creating an alternative design concept...",
      });
      
      // Create a new variation with increased creativity
      const params: WireframeGenerationParams = {
        description: `Creative variation of: ${baseWireframe.title || 'Existing wireframe'}`,
        enhancedCreativity: true,
        creativityLevel: Math.min(creativityLevel + 2, 10), // Increase creativity but cap at 10
        baseWireframe,
        projectId
      };
      
      return await generateWireframe(params);
    } catch (error) {
      console.error("Error generating variation:", error);
      toast({
        title: "Variation generation failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const loadProjectWireframes = useCallback(async (projectId: string) => {
    try {
      const results = await WireframeService.getProjectWireframes(projectId);
      setWireframes(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load wireframes";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Failed to load wireframes",
        description: errorMessage,
        variant: "destructive",
      });
      
      return [];
    }
  }, [toast]);

  const getWireframe = async (wireframeId: string) => {
    try {
      return await WireframeService.getWireframe(wireframeId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get wireframe";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Failed to load wireframe",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  const provideFeedback = async (wireframeId: string, feedback: string, rating?: number) => {
    try {
      await WireframeService.updateWireframeFeedback(wireframeId, feedback, rating);
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback",
      });
      
      // Refresh the wireframes list if we have them loaded
      if (wireframes.length > 0) {
        const projectId = wireframes[0].project_id;
        await loadProjectWireframes(projectId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit feedback";
      
      toast({
        title: "Failed to submit feedback",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const deleteWireframe = async (wireframeId: string) => {
    try {
      await WireframeService.deleteWireframe(wireframeId);
      
      // Update the local state by removing the deleted wireframe
      setWireframes(prevWireframes => 
        prevWireframes.filter(wireframe => wireframe.id !== wireframeId)
      );
      
      toast({
        title: "Wireframe deleted",
        description: "The wireframe has been removed",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete wireframe";
      
      toast({
        title: "Failed to delete wireframe",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
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
