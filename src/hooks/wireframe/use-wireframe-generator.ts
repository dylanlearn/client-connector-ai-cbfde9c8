
import { useState } from "react";
import { WireframeService } from "@/services/ai/wireframe/wireframe-service";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  WireframeData 
} from "@/services/ai/wireframe/wireframe-types";

export function useWireframeGenerator(
  defaultCreativityLevel: number,
  setCurrentWireframe: (wireframe: WireframeGenerationResult | null) => void,
  toast: any
) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
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
        creativityLevel: params.creativityLevel || defaultCreativityLevel,
        description: enhancePrompt(params.description || '')
      };
      
      // Call the wireframe generation service
      console.log("Calling wireframe service with enhanced params:", enhancedParams);
      const result = await WireframeService.generateWireframe(enhancedParams);
      console.log("Generated wireframe result:", result);
      
      // Process and validate the wireframe data
      if (result && result.wireframe) {
        // Processing wireframe data (structure validation & defaults)
        const processedResult = processWireframeData(result);
        setCurrentWireframe(processedResult);
        
        toast({
          title: "Creative wireframe generated",
          description: `Generated "${result.wireframe.title || 'New wireframe'}" in ${result.generationTime.toFixed(2)}s`,
        });
        
        return processedResult;
      } else {
        console.error("Invalid wireframe data structure received");
        throw new Error("Invalid wireframe data structure received");
      }
    } catch (err) {
      console.error("Error generating wireframe:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate wireframe";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      // Using string-based action instead of JSX since this is a .ts file, not .tsx
      toast({
        title: "Wireframe generation failed",
        description: errorMessage,
        variant: "destructive",
        // Removed JSX-based action that was causing the error
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
        creativityLevel: Math.min(defaultCreativityLevel + 2, 10), // Increase creativity but cap at 10
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
  
  // Helper function to process and validate wireframe data
  const processWireframeData = (result: WireframeGenerationResult): WireframeGenerationResult => {
    const wireframe = result.wireframe;
    
    // Ensure wireframe has proper structure with sections/pages
    if (!wireframe.sections && !wireframe.pages) {
      console.log("Adding default empty sections array to wireframe");
      wireframe.sections = [];
    }
    
    // Process pages if they exist
    if (Array.isArray(wireframe.pages) && wireframe.pages.length > 0) {
      console.log("Processing wireframe pages:", wireframe.pages.length);
      // Make sure each page has a sections array
      wireframe.pages = wireframe.pages.map(page => {
        console.log("Processing page:", page.name || "Unnamed page");
        return {
          ...page,
          sections: Array.isArray(page.sections) ? page.sections : []
        };
      });
    } else if (!wireframe.pages) {
      // If no pages defined but sections exist, create a default page
      if (Array.isArray(wireframe.sections) && wireframe.sections.length > 0) {
        console.log("Creating default page structure with existing sections");
        wireframe.pages = [{
          id: "default-page",
          name: wireframe.title || "Home",
          sections: wireframe.sections,
          pageType: "home"
        }];
      }
    }
    
    // Set a fallback style if none provided
    if (!wireframe.style) {
      wireframe.style = result.wireframe.style || "modern";
    }
    
    // Add design tokens if missing
    if (!wireframe.designTokens) {
      wireframe.designTokens = {
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
    
    return {
      ...result,
      wireframe
    };
  };

  return {
    isGenerating,
    error,
    generateWireframe,
    generateCreativeVariation
  };
}
