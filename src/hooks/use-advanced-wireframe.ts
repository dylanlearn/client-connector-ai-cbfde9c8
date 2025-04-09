import { useState, useCallback } from "react";
import { useToast } from "./use-toast";
import { AdvancedWireframeService, DesignMemory } from "@/services/ai/wireframe/advanced-wireframe-service";
import { WireframeData, WireframeSection } from "@/services/ai/wireframe/wireframe-types";
import { supabase } from "@/integrations/supabase/client";
import { debounce } from "lodash";
import { EnhancedLayoutIntelligenceService } from "@/services/ai/wireframe/layout-intelligence-enhanced";
import { logClientError } from "@/utils/monitoring/client-error-logger";

// Required section types for a complete wireframe
const REQUIRED_SECTION_TYPES = [
  'navigation',
  'hero', 
  'features', 
  'testimonials', 
  'pricing', 
  'cta', 
  'footer'
];

export interface UseAdvancedWireframeParams {
  userInput: string;
  projectId: string;
  styleToken: string;
  includeDesignMemory: boolean;
  enableLayoutIntelligence?: boolean;
  customParams?: {
    darkMode?: boolean;
    targetIndustry?: string;
    targetAudience?: string;
    creativityLevel?: number;
    [key: string]: any;
  };
}

export function useAdvancedWireframe() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeData | null>(null);
  const [intentData, setIntentData] = useState<any>(null);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [designMemory, setDesignMemory] = useState<DesignMemory | null>(null);
  const [layoutAnalysis, setLayoutAnalysis] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Validate that a wireframe has all required sections
  const validateWireframe = (wireframe: WireframeData): { isValid: boolean; missingSections: string[] } => {
    if (!wireframe || !wireframe.sections || wireframe.sections.length === 0) {
      return { isValid: false, missingSections: REQUIRED_SECTION_TYPES };
    }

    const generatedSectionTypes = wireframe.sections.map(section => 
      section.sectionType.toLowerCase()
    );
    
    const missingSections = REQUIRED_SECTION_TYPES.filter(
      requiredType => !generatedSectionTypes.some(generatedType => 
        generatedType.includes(requiredType)
      )
    );
    
    return { 
      isValid: missingSections.length === 0,
      missingSections 
    };
  };
  
  // Debounce loadDesignMemory to prevent excessive calls
  const debouncedLoadMemory = useCallback(
    debounce(async (projectId: string) => {
      try {
        console.log(`Loading design memory for project: ${projectId}`);
        const memory = await AdvancedWireframeService.retrieveDesignMemory(projectId);
        setDesignMemory(memory);
        return memory;
      } catch (err) {
        console.error("Failed to load design memory:", err);
        logClientError(err instanceof Error ? err : new Error(String(err)), "useAdvancedWireframe");
        return null;
      }
    }, 1000),
    []
  );

  const generateWireframe = async (params: UseAdvancedWireframeParams) => {
    setIsGenerating(true);
    setError(null);
    setLayoutAnalysis(null);
    
    try {
      toast({
        title: "Generating advanced wireframe",
        description: "Creating a highly structured design from your input...",
      });
      
      // Direct call to the generate-advanced-wireframe function
      console.log("Calling generate-advanced-wireframe with params:", {
        userInput: params.userInput.substring(0, 50) + "...",
        projectId: params.projectId,
        styleToken: params.styleToken,
        includeDesignMemory: params.includeDesignMemory,
        enableLayoutIntelligence: params.enableLayoutIntelligence || false
      });
      
      const { data, error } = await supabase.functions.invoke('generate-advanced-wireframe', {
        body: {
          userInput: params.userInput,
          projectId: params.projectId,
          styleToken: params.styleToken,
          includeDesignMemory: params.includeDesignMemory,
          customParams: params.customParams || {}
        }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data) {
        console.error("No data returned from API");
        throw new Error("No data returned from API");
      }
      
      if (!data.success) {
        console.error("API reported error:", data.error);
        throw new Error(`API error: ${data.error || "Unknown error"}`);
      }
      
      if (!data.wireframe) {
        console.error("No wireframe data in response:", data);
        throw new Error("No wireframe data returned from API");
      }
      
      // Validate the wireframe has all required sections
      const validationResult = validateWireframe(data.wireframe);
      if (!validationResult.isValid) {
        console.warn(`Warning: Wireframe is missing some sections: ${validationResult.missingSections.join(', ')}`);
        toast({
          title: "Wireframe generated with warnings",
          description: `Some sections are missing: ${validationResult.missingSections.join(', ')}`,
          variant: "destructive",
        });
      }
      
      // Process the result
      console.log("Wireframe generated successfully:", data.wireframe.title || "Untitled");
      
      // Ensure the wireframe has the correct type structure
      if (data.wireframe) {
        const wireframeWithPositions = ensureSectionPositions(data.wireframe);
        setCurrentWireframe(wireframeWithPositions);
        
        // Generate layout analysis if layout intelligence is enabled
        if (params.enableLayoutIntelligence && wireframeWithPositions) {
          analyzeLayoutIntelligence(wireframeWithPositions, params.customParams?.targetIndustry);
        }
      }
      
      setIntentData(data.intentData);
      setBlueprint(data.blueprint);
      
      toast({
        title: "Wireframe generated",
        description: `Generated "${data.wireframe?.title || 'New wireframe'}" successfully`,
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate wireframe";
      console.error("Wireframe generation failed:", err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      // Log the error for monitoring
      logClientError(err instanceof Error ? err : new Error(errorMessage), "generateWireframe");
      
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

  // Ensure all sections have proper position and dimensions
  const ensureSectionPositions = (wireframe: WireframeData): WireframeData => {
    if (!wireframe.sections) return wireframe;
    
    const updatedSections = wireframe.sections.map((section, index) => {
      // If section doesn't have position or dimensions, add default values
      if (!section.position) {
        section.position = { x: 0, y: index * 600 };
      }
      
      if (!section.dimensions) {
        // Set different default heights based on section type
        const getDefaultHeight = () => {
          switch(section.sectionType.toLowerCase()) {
            case 'hero': return 500;
            case 'features': return 600;
            case 'testimonials': return 400;
            case 'pricing': return 700;
            case 'cta': return 300;
            case 'footer': return 400;
            case 'navigation': return 100;
            default: return 400;
          }
        };
        
        section.dimensions = { width: 1200, height: getDefaultHeight() };
      }
      
      return section;
    });
    
    return {
      ...wireframe,
      sections: updatedSections
    };
  };

  const analyzeLayoutIntelligence = async (wireframe: WireframeData, targetIndustry?: string) => {
    try {
      if (!wireframe) return;
      
      toast({
        title: "Analyzing layout patterns",
        description: "Generating layout intelligence insights...",
      });
      
      // Get layout pattern recognition
      const patternAnalysis = await EnhancedLayoutIntelligenceService.identifyLayoutPatterns(wireframe);
      
      // Get layout optimization suggestions
      const optimizationAnalysis = await EnhancedLayoutIntelligenceService.getLayoutOptimizationSuggestions(
        wireframe,
        targetIndustry
      );
      
      // Combine analyses
      const combinedAnalysis = {
        patterns: patternAnalysis,
        optimization: optimizationAnalysis
      };
      
      setLayoutAnalysis(combinedAnalysis);
      
      toast({
        title: "Layout analysis complete",
        description: `Identified ${patternAnalysis.detectedPatterns.length} layout patterns`,
      });
      
      return combinedAnalysis;
    } catch (err) {
      console.error("Layout intelligence analysis failed:", err);
      logClientError(err instanceof Error ? err : new Error(String(err)), "analyzeLayoutIntelligence");
      return null;
    }
  };

  const saveWireframe = async (projectId: string, prompt: string) => {
    if (!currentWireframe || !intentData || !blueprint) {
      toast({
        title: "Cannot save wireframe",
        description: "Please generate a wireframe first",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      toast({
        title: "Saving wireframe",
        description: "Storing wireframe in your project...",
      });
      
      // Pass all necessary data to the saveWireframe function
      const result = await AdvancedWireframeService.saveWireframe(
        projectId,
        prompt,
        currentWireframe,
        intentData,
        blueprint
      );
      
      toast({
        title: "Wireframe saved",
        description: "Successfully saved to your project",
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save wireframe";
      console.error("Error saving wireframe:", err);
      
      // Log the error for monitoring
      logClientError(err instanceof Error ? err : new Error(errorMessage), "saveWireframe");
      
      toast({
        title: "Save failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };
  
  const loadDesignMemory = async (projectId?: string) => {
    if (!projectId) return null;
    
    // Use the debounced version to prevent excessive calls
    return debouncedLoadMemory(projectId);
  };
  
  const storeDesignMemory = async (
    projectId: string,
    blueprintId: string,
    layoutPatterns: any,
    stylePreferences: any,
    componentPreferences: any
  ) => {
    try {
      toast({
        title: "Storing design memory",
        description: "Saving your design preferences...",
      });
      
      const result = await AdvancedWireframeService.storeDesignMemory(
        projectId,
        blueprintId,
        layoutPatterns,
        stylePreferences,
        componentPreferences
      );
      
      toast({
        title: "Design memory saved",
        description: "Your preferences will inform future designs",
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to store design memory";
      console.error("Error storing design memory:", err);
      
      // Log the error for monitoring
      logClientError(err instanceof Error ? err : new Error(errorMessage), "storeDesignMemory");
      
      toast({
        title: "Save failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  // Return diagnostic information in the return object
  return {
    isGenerating,
    currentWireframe,
    intentData,
    blueprint,
    designMemory,
    layoutAnalysis,
    error,
    generateWireframe,
    saveWireframe,
    loadDesignMemory,
    storeDesignMemory,
    analyzeLayoutIntelligence
  };
}
