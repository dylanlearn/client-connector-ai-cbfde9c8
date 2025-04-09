
import { useState, useCallback } from "react";
import { useToast } from "./use-toast";
import { 
  WireframeData, 
  WireframeSection,
  WireframeGenerationParams,
  EnhancedWireframeGenerationResult
} from "@/services/ai/wireframe/wireframe-types";
import { EnhancedWireframeGenerator } from "@/services/ai/wireframe/enhanced-wireframe-generator";
import { AdvancedWireframeService } from "@/services/ai/wireframe/advanced-wireframe-service";
import { EnhancedLayoutIntelligenceService } from "@/services/ai/wireframe/layout-intelligence-enhanced";
import { logClientError } from "@/utils/monitoring/client-error-logger";
import { debounce } from "lodash";
import { v4 as uuidv4 } from 'uuid';

export interface UseEnhancedWireframeParams extends WireframeGenerationParams {
  userInput?: string;
  styleToken?: string;
}

export function useEnhancedWireframe() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isApplyingFeedback, setIsApplyingFeedback] = useState<boolean>(false);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState<boolean>(false);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeData | null>(null);
  const [variations, setVariations] = useState<WireframeData[]>([]);
  const [intentData, setIntentData] = useState<any>(null);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [designMemory, setDesignMemory] = useState<any>(null);
  const [layoutAnalysis, setLayoutAnalysis] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadDesignMemory = useCallback(async (projectId?: string) => {
    if (!projectId) return null;
    
    try {
      console.log(`Loading design memory for project: ${projectId}`);
      const memory = await AdvancedWireframeService.retrieveDesignMemory(projectId);
      setDesignMemory(memory);
      return memory;
    } catch (err) {
      console.error("Failed to load design memory:", err);
      return null;
    }
  }, []);

  const generateWireframe = async (params: UseEnhancedWireframeParams) => {
    setIsGenerating(true);
    setError(null);
    setLayoutAnalysis(null);
    setVariations([]);
    
    try {
      toast({
        title: "Generating enhanced wireframe",
        description: "Creating a highly structured design from your input...",
      });
      
      const generationParams: WireframeGenerationParams = {
        description: params.userInput || params.description,
        projectId: params.projectId || uuidv4(),
        style: params.styleToken || params.style || 'modern',
        enableLayoutIntelligence: params.enableLayoutIntelligence || true,
        customParams: params.customParams || {},
        industry: params.industry,
        intakeFormData: params.intakeFormData,
        ...params
      };
      
      const result = await EnhancedWireframeGenerator.generateWireframe(generationParams);
      
      if (!result.wireframe) {
        throw new Error("Failed to generate wireframe");
      }
      
      setCurrentWireframe(result.wireframe);
      
      // Now using the proper EnhancedWireframeGenerationResult type
      if (result.layoutAnalysis) {
        setLayoutAnalysis(result.layoutAnalysis);
      }
      
      toast({
        title: "Wireframe generated",
        description: `Generated "${result.wireframe.title || 'New wireframe'}" successfully`,
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate wireframe";
      console.error("Wireframe generation failed:", err);
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

  const generateVariations = async (count = 2, variationType: 'creative' | 'layout' | 'style' | 'component' = 'creative') => {
    if (!currentWireframe) {
      toast({
        title: "Cannot generate variations",
        description: "Please generate a wireframe first",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingVariations(true);
    
    try {
      toast({
        title: "Generating variations",
        description: `Creating ${count} variations of the current wireframe...`,
      });
      
      const result = await EnhancedWireframeGenerator.generateVariations(
        currentWireframe,
        {
          variationType,
          creativityLevel: 8
        },
        count
      );
      
      // Now using the proper EnhancedWireframeGenerationResult type
      if (result.variations && result.variations.length > 0) {
        setVariations(result.variations);
        
        toast({
          title: "Variations generated",
          description: `Successfully created ${result.variations.length} variations`,
        });
      } else {
        toast({
          title: "Variation generation failed",
          description: "No variations could be generated",
          variant: "destructive",
        });
      }
      
      return result.variations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate variations";
      console.error("Variation generation failed:", err);
      
      toast({
        title: "Variation generation failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  const applyFeedback = async (feedbackText: string) => {
    if (!currentWireframe) {
      toast({
        title: "Cannot apply feedback",
        description: "Please generate a wireframe first",
        variant: "destructive",
      });
      return;
    }
    
    setIsApplyingFeedback(true);
    
    try {
      toast({
        title: "Processing feedback",
        description: "Applying your feedback to the wireframe...",
      });
      
      const result = await EnhancedWireframeGenerator.applyFeedbackToWireframe(
        currentWireframe.id,
        feedbackText
      );
      
      if (result.modified) {
        setCurrentWireframe(result.wireframe);
        
        toast({
          title: "Feedback applied",
          description: result.changeDescription || "Your feedback has been applied to the wireframe",
        });
      } else {
        toast({
          title: "No changes made",
          description: "Your feedback didn't result in any changes to the wireframe",
          variant: "default",
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to apply feedback";
      console.error("Feedback application failed:", err);
      
      toast({
        title: "Failed to apply feedback",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsApplyingFeedback(false);
    }
  };

  const generateFromIntakeData = async (intakeData: any, projectId?: string) => {
    try {
      toast({
        title: "Generating from intake data",
        description: "Creating a wireframe based on your project information...",
      });
      
      return await generateWireframe({
        intakeFormData: intakeData,
        projectId: projectId || uuidv4(),
        description: `Wireframe for ${intakeData.businessName || 'business'}`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate from intake data";
      console.error("Intake data generation failed:", err);
      
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  const analyzeLayout = async () => {
    if (!currentWireframe) {
      toast({
        title: "Cannot analyze layout",
        description: "Please generate a wireframe first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Analyzing layout",
        description: "Analyzing wireframe layout patterns...",
      });
      
      const patterns = await EnhancedLayoutIntelligenceService.identifyLayoutPatterns(
        currentWireframe
      );
      
      const optimizations = await EnhancedLayoutIntelligenceService.getLayoutOptimizationSuggestions(
        currentWireframe
      );
      
      const analysis = {
        patterns,
        optimizations
      };
      
      setLayoutAnalysis(analysis);
      
      toast({
        title: "Layout analysis complete",
        description: "Layout patterns and optimizations identified",
      });
      
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze layout";
      console.error("Layout analysis failed:", err);
      
      toast({
        title: "Layout analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  const saveWireframe = async (projectId: string, title?: string, description?: string) => {
    if (!currentWireframe) {
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
      
      const wireframeToSave = {
        ...currentWireframe,
        title: title || currentWireframe.title,
        description: description || currentWireframe.description
      };
      
      const result = await AdvancedWireframeService.saveWireframe(
        projectId,
        wireframeToSave.description || "Generated wireframe",
        wireframeToSave,
        intentData || {},
        blueprint || {}
      );
      
      toast({
        title: "Wireframe saved",
        description: "Successfully saved to your project",
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save wireframe";
      console.error("Error saving wireframe:", err);
      
      toast({
        title: "Save failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  const selectVariation = (variationIndex: number) => {
    if (variationIndex < 0 || variationIndex >= variations.length) {
      toast({
        title: "Invalid variation",
        description: "The selected variation does not exist",
        variant: "destructive",
      });
      return;
    }
    
    const previousWireframe = currentWireframe;
    if (previousWireframe) {
      setVariations(prev => {
        if (!prev.some(v => v.id === previousWireframe.id)) {
          return [previousWireframe, ...prev.filter(v => v.id !== variations[variationIndex].id)];
        }
        return prev.filter(v => v.id !== variations[variationIndex].id);
      });
    }
    
    setCurrentWireframe(variations[variationIndex]);
    
    toast({
      title: "Variation selected",
      description: "The selected variation is now the current wireframe",
    });
  };

  return {
    isGenerating,
    isApplyingFeedback,
    isGeneratingVariations,
    currentWireframe,
    variations,
    intentData,
    blueprint,
    designMemory,
    layoutAnalysis,
    error,
    
    generateWireframe,
    generateVariations,
    applyFeedback,
    generateFromIntakeData,
    analyzeLayout,
    saveWireframe,
    loadDesignMemory,
    selectVariation,
    
    setCurrentWireframe,
    setVariations,
    setLayoutAnalysis
  };
}
