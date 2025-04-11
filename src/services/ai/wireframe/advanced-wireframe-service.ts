import { v4 as uuidv4 } from 'uuid';
import { WireframeData, WireframeGenerationParams, WireframeGenerationResult } from './wireframe-types';
import { wireframeService } from './wireframe-service';
import { generateWireframe as baseGenerateWireframe } from './api/wireframe-generator';
import { optimizeWireframeForDevice } from './api/wireframe-optimization-service';
import { generateImagePreview } from './api/wireframe-preview-service';

// Import createMinimalWireframeData (adding it as an export to wireframeService)
import wireframeService from './wireframe-service';

// Add createMinimalWireframeData to the wireframeService export
export const createMinimalWireframeData = (partialData: Partial<any> = {}): any => {
  const defaultWireframe = wireframeService.createDefaultWireframe();
  return {
    ...defaultWireframe,
    ...partialData,
    id: partialData.id || defaultWireframe.id,
    title: partialData.title || defaultWireframe.title,
    description: partialData.description || defaultWireframe.description,
    sections: partialData.sections || defaultWireframe.sections
  };
};

/**
 * Advanced wireframe generation with additional features
 */
export const generateAdvancedWireframe = async (
  params: WireframeGenerationParams
): Promise<WireframeGenerationResult> => {
  try {
    // Generate base wireframe
    const result = await wireframeService.generateWireframe(params);
    
    if (!result.success || !result.wireframe) {
      throw new Error(result.message || 'Failed to generate wireframe');
    }
    
    // Add additional metadata
    const enhancedWireframe: WireframeData = {
      ...result.wireframe,
      metadata: {
        generatedAt: new Date().toISOString(),
        generationParams: params,
        version: '2.0'
      }
    };
    
    return {
      wireframe: enhancedWireframe,
      success: true,
      message: 'Advanced wireframe generated successfully'
    };
  } catch (error) {
    console.error('Error in advanced wireframe generation:', error);
    return {
      wireframe: null,
      success: false,
      message: `Error generating advanced wireframe: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Generate a wireframe optimized for a specific device
 */
export const generateDeviceOptimizedWireframe = async (
  params: WireframeGenerationParams,
  deviceType: 'desktop' | 'tablet' | 'mobile'
): Promise<WireframeGenerationResult> => {
  try {
    // First generate a standard wireframe
    const result = await wireframeService.generateWireframe(params);
    
    if (!result.success || !result.wireframe) {
      throw new Error(result.message || 'Failed to generate wireframe');
    }
    
    // Then optimize it for the target device
    const optimizedWireframe = await optimizeWireframeForDevice(result.wireframe, deviceType);
    
    return {
      wireframe: optimizedWireframe,
      success: true,
      message: `Wireframe optimized for ${deviceType} generated successfully`
    };
  } catch (error) {
    console.error('Error in device-optimized wireframe generation:', error);
    return {
      wireframe: null,
      success: false,
      message: `Error generating device-optimized wireframe: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Generate a wireframe with image preview
 */
export const generateWireframeWithPreview = async (
  params: WireframeGenerationParams
): Promise<WireframeGenerationResult & { previewUrl?: string }> => {
  try {
    // First generate a standard wireframe
    const result = await wireframeService.generateWireframe(params);
    
    if (!result.success || !result.wireframe) {
      throw new Error(result.message || 'Failed to generate wireframe');
    }
    
    // Then generate an image preview
    const previewUrl = await generateImagePreview(result.wireframe);
    
    // Add the preview URL to the wireframe
    const enhancedWireframe: WireframeData = {
      ...result.wireframe,
      imageUrl: previewUrl
    };
    
    return {
      wireframe: enhancedWireframe,
      success: true,
      message: 'Wireframe with preview generated successfully',
      previewUrl
    };
  } catch (error) {
    console.error('Error in wireframe with preview generation:', error);
    return {
      wireframe: null,
      success: false,
      message: `Error generating wireframe with preview: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Create a new wireframe from scratch with minimal data
 */
export const createEmptyWireframe = (title: string = 'New Wireframe'): WireframeData => {
  return {
    id: uuidv4(),
    title,
    description: 'A blank wireframe',
    sections: [],
    colorScheme: {
      primary: '#3182CE',
      secondary: '#805AD5',
      accent: '#ED8936',
      background: '#FFFFFF',
      text: '#1A202C'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  };
};

// Export as a named advancedWireframeService object
export const advancedWireframeService = {
  generateAdvancedWireframe,
  generateDeviceOptimizedWireframe,
  generateWireframeWithPreview,
  createEmptyWireframe,
  createMinimalWireframeData
};

export default advancedWireframeService;
