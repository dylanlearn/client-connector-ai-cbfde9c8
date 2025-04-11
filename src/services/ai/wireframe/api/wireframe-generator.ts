import { WireframeGenerationParams, WireframeGenerationResult } from '../wireframe-types';
import { generateWireframeWithAI } from './wireframe-ai-service';
import { createWireframeFromTemplate } from './wireframe-template-service';
import { optimizeWireframeForDevice } from './wireframe-optimization-service';
import { generateImagePreview } from './wireframe-preview-service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a wireframe based on the provided parameters
 */
export const generateWireframe = async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
  const startTime = Date.now();
  
  try {
    // Generate the wireframe using AI
    const result = await generateWireframeWithAI(params);
    
    // Ensure the wireframe has an ID
    if (!result.wireframe.id) {
      result.wireframe.id = uuidv4();
    }
    
    // Optimize the wireframe for different devices if needed
    if (params.optimizeForDevices) {
      result.wireframe = await optimizeWireframeForDevice(result.wireframe);
    }
    
    // Generate an image preview if requested
    if (params.generatePreview) {
      const imageUrl = await generateImagePreview(result.wireframe);
      result.imageUrl = imageUrl;
    }
    
    const endTime = Date.now();
    const generationTime = (endTime - startTime) / 1000; // Convert to seconds
    
    return {
      ...result,
      generationTime,
      model: 'gpt-4-turbo', // Add model property
      success: true
    };
  } catch (error) {
    console.error('Error generating wireframe:', error);
    
    const endTime = Date.now();
    const generationTime = (endTime - startTime) / 1000;
    
    return {
      wireframe: {
        id: uuidv4(),
        title: params.description || 'Error Wireframe',
        sections: [],
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false,
      generationTime,
      model: 'gpt-4-turbo'
    };
  }
};

/**
 * Generate a wireframe from a template
 */
export const generateWireframeFromTemplate = async (
  templateId: string,
  params: WireframeGenerationParams
): Promise<WireframeGenerationResult> => {
  const startTime = Date.now();
  
  try {
    // Create wireframe from template
    const wireframe = await createWireframeFromTemplate(templateId, params);
    
    const endTime = Date.now();
    const generationTime = (endTime - startTime) / 1000;
    
    return {
      wireframe,
      success: true,
      generationTime,
      model: 'template-based'
    };
  } catch (error) {
    console.error('Error generating wireframe from template:', error);
    
    const endTime = Date.now();
    const generationTime = (endTime - startTime) / 1000;
    
    return {
      wireframe: {
        id: uuidv4(),
        title: params.description || 'Error Wireframe',
        sections: [],
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false,
      generationTime,
      model: 'template-based'
    };
  }
};

/**
 * Generate a creative variation of an existing wireframe
 */
export const generateWireframeVariation = async (
  baseWireframe: any,
  variationParams: {
    creativityLevel?: number;
    preserveSections?: string[];
    focusAreas?: string[];
    styleChanges?: Record<string, any>;
  }
): Promise<WireframeGenerationResult> => {
  const startTime = Date.now();
  
  try {
    // Implementation would go here in a real service
    // This is a placeholder implementation
    const wireframeCopy = JSON.parse(JSON.stringify(baseWireframe));
    
    // Add some variation to the copy
    wireframeCopy.id = uuidv4();
    wireframeCopy.title = `${baseWireframe.title} (Variation)`;
    
    // Apply style changes if provided
    if (variationParams.styleChanges) {
      wireframeCopy.colorScheme = {
        ...wireframeCopy.colorScheme,
        ...variationParams.styleChanges
      };
    }
    
    const endTime = Date.now();
    const generationTime = (endTime - startTime) / 1000;
    
    return {
      wireframe: wireframeCopy,
      success: true,
      generationTime,
      model: 'variation-generator'
    };
  } catch (error) {
    console.error('Error generating wireframe variation:', error);
    
    const endTime = Date.now();
    const generationTime = (endTime - startTime) / 1000;
    
    return {
      wireframe: baseWireframe,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false,
      generationTime,
      model: 'variation-generator'
    };
  }
};
