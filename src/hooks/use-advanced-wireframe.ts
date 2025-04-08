
import { useState, useCallback } from "react";
import { useToast } from "./use-toast";
import { AdvancedWireframeService, DesignMemory } from "@/services/ai/wireframe/advanced-wireframe-service";
import { WireframeData } from "@/services/ai/wireframe/wireframe-types";
import { supabase } from "@/integrations/supabase/client";
import { debounce } from "lodash";
import { EnhancedLayoutIntelligenceService } from "@/services/ai/wireframe/layout-intelligence-enhanced";

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

  // Debounce loadDesignMemory to prevent excessive calls
  const debouncedLoadMemory = useCallback(
    debounce(async (projectId: string) => {
      try {
        const memory = await AdvancedWireframeService.retrieveDesignMemory(projectId);
        setDesignMemory(memory);
        return memory;
      } catch (err) {
        console.error("Failed to load design memory:", err);
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
      
      // Call the generation-api with the advanced wireframe action
      const { data, error } = await supabase.functions.invoke('generation-api', {
        body: {
          action: 'generate-advanced-wireframe',
          ...params,
          enableLayoutIntelligence: params.enableLayoutIntelligence || false
        }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.wireframe) {
        throw new Error("No wireframe data returned from API");
      }
      
      // Process the result
      const result = data;
      
      // Ensure the wireframe has the correct type structure
      if (result.wireframe) {
        setCurrentWireframe(result.wireframe);
        
        // Generate layout analysis if layout intelligence is enabled
        if (params.enableLayoutIntelligence && result.wireframe) {
          analyzeLayoutIntelligence(result.wireframe, params.customParams?.targetIndustry);
        }
      }
      setIntentData(result.intentData);
      setBlueprint(result.blueprint);
      
      toast({
        title: "Wireframe generated",
        description: `Generated "${result.wireframe?.title || 'New wireframe'}" successfully`,
      });
      
      return result;
    } catch (err) {
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
      
      // Fixed here - removing extra arguments
      const result = await AdvancedWireframeService.saveWireframe(
        projectId,
        prompt
      );
      
      toast({
        title: "Wireframe saved",
        description: "Successfully saved to your project",
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save wireframe";
      
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
      
      toast({
        title: "Save failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

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
