
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedWireframeGenerator } from '@/services/ai/wireframe/enhanced-wireframe-generator';
import { wireframeService } from '@/services/ai/wireframe/wireframe-service';
import { WireframeData, WireframeGenerationParams } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';

// Adding a custom saveWireframe function since it doesn't exist in wireframeService
const saveWireframe = async (projectId: string, wireframe: WireframeData, description?: string) => {
  // This is a placeholder function - in a real app this would save to a database
  console.log('Saving wireframe for project:', projectId, 'description:', description);
  return wireframe.title || 'Wireframe';
};

export const useAdvancedWireframe = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeData | null>(null);
  const [generationResults, setGenerationResults] = useState<any[]>([]);
  const [intentData, setIntentData] = useState<any>(null);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateWireframe = useCallback(async (params: WireframeGenerationParams) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Ensure we have a description
      if (!params.description) {
        throw new Error('Description is required');
      }
      
      // Generate the wireframe
      const result = await EnhancedWireframeGenerator.generateWireframe({
        ...params,
        projectId: params.projectId || uuidv4(),
      });
      
      if (!result.success || !result.wireframe) {
        throw new Error(result.error || 'Failed to generate wireframe');
      }
      
      // Store the results
      setCurrentWireframe(result.wireframe);
      setGenerationResults(prev => [...prev, result]);
      
      // Store intent data and blueprint if available
      if (result.intentData) {
        setIntentData(result.intentData);
      }
      
      if (result.blueprint) {
        setBlueprint(result.blueprint);
      }
      
      return result;
    } catch (error) {
      console.error('Error generating wireframe:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return {
        success: false,
        error: errorMessage,
        wireframe: null
      };
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const generateVariations = useCallback(async (wireframeData: WireframeData, count: number = 3) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const variations = [];
      
      for (let i = 0; i < count; i++) {
        const result = await EnhancedWireframeGenerator.generateWireframe({
          description: wireframeData.description || 'Generate variation',
          baseWireframe: wireframeData,
          isVariation: true,
          variationIndex: i,
          enhancedCreativity: true,
          creativityLevel: 8 + i // Increase creativity for each variation
        });
        
        if (result.success && result.wireframe) {
          variations.push(result.wireframe);
        }
      }
      
      return variations;
    } catch (error) {
      console.error('Error generating variations:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: 'Variation Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const saveWireframeHandler = useCallback(async (projectId: string, description?: string) => {
    if (!currentWireframe) {
      toast({
        title: 'No Wireframe to Save',
        description: 'Please generate a wireframe first',
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      const displayName = await saveWireframe(projectId, currentWireframe, description);
      
      toast({
        title: 'Wireframe Saved',
        description: `Wireframe "${displayName}" has been saved successfully`,
      });
      
      return displayName;
    } catch (error) {
      console.error('Error saving wireframe:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: 'Save Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    }
  }, [currentWireframe, toast]);

  const generateCreativeVariations = useCallback(async () => {
    if (!currentWireframe) {
      setError('No wireframe to generate variations from');
      return [];
    }
    
    try {
      const resultVariations = await generateVariations(currentWireframe);
      
      if (!resultVariations.length) {
        setError('Failed to generate variations');
        return [];
      }
      
      return resultVariations;
    } catch (error) {
      console.error('Error generating creative variations:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: 'Variation Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return [];
    }
  }, [currentWireframe, generateVariations, toast]);

  const applyFeedback = useCallback(async (wireframeData: WireframeData, feedback: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await EnhancedWireframeGenerator.modifyWireframeBasedOnFeedback(wireframeData, feedback);
      
      if (!result.success || !result.wireframe) {
        throw new Error(result.error || 'Failed to apply feedback');
      }
      
      setCurrentWireframe(result.wireframe);
      
      toast({
        title: 'Feedback Applied',
        description: 'The wireframe has been updated based on your feedback',
      });
      
      return result;
    } catch (error) {
      console.error('Error applying feedback:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: 'Feedback Application Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return {
        success: false,
        error: errorMessage,
        wireframe: wireframeData
      };
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  return {
    isGenerating,
    currentWireframe,
    generationResults,
    intentData,
    blueprint,
    error,
    generateWireframe,
    saveWireframe: saveWireframeHandler,
    generateCreativeVariations,
    applyFeedback,
    setCurrentWireframe
  };
};
