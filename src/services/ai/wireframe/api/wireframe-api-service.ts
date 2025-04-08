
import { WireframeData, WireframeSection } from '../wireframe-types';

export interface WireframeApiService {
  createWireframe: (wireframeData: Partial<WireframeData>) => Promise<WireframeData>;
  getWireframes: () => Promise<WireframeData[]>;
  getWireframeById: (id: string) => Promise<WireframeData>;
  updateWireframe: (id: string, updates: Partial<WireframeData>) => Promise<WireframeData>;
  deleteWireframe: (id: string) => Promise<void>;
  
  // Responsive design generation features
  generateResponsiveAdaptations: (
    wireframeId: string, 
    targetDevices: Array<'desktop' | 'tablet' | 'mobile'>
  ) => Promise<Record<string, WireframeData>>;
  
  // Convert a wireframe section for different device types
  adaptSectionForDevice: (
    section: WireframeSection,
    targetDevice: 'desktop' | 'tablet' | 'mobile'
  ) => Promise<WireframeSection>;

  // Additional methods used in codebase
  getWireframe: (id: string) => Promise<any>;
  generateWireframe: (params: any) => Promise<any>;
  saveWireframe: (projectId: string, prompt: string, data: any, params: any, model?: string) => Promise<any>;
  updateWireframeData: (id: string, data: any) => Promise<any>;
  getLatestWireframe: (projectId: string) => Promise<any>;
  updateWireframeFeedback: (wireframeId: string, feedback: string, rating?: number) => Promise<void>;
}

// Implementation of the wireframe API service with multi-device support
class DeviceAdaptiveWireframeApiService implements WireframeApiService {
  async createWireframe(wireframeData: Partial<WireframeData>): Promise<WireframeData> {
    // Implement API call to create wireframe
    console.log('Creating wireframe', wireframeData);
    return {
      id: 'new-wireframe-id',
      title: wireframeData.title || 'New Wireframe',
      description: wireframeData.description || '',
      sections: wireframeData.sections || [],
      // Add other required properties
    } as WireframeData;
  }
  
  async getWireframes(): Promise<WireframeData[]> {
    // Implementation
    return [];
  }
  
  async getWireframeById(id: string): Promise<WireframeData> {
    // Implementation
    return {} as WireframeData;
  }
  
  async updateWireframe(id: string, updates: Partial<WireframeData>): Promise<WireframeData> {
    // Implementation
    return {} as WireframeData;
  }
  
  async deleteWireframe(id: string): Promise<void> {
    // Implementation
  }
  
  async generateResponsiveAdaptations(
    wireframeId: string, 
    targetDevices: Array<'desktop' | 'tablet' | 'mobile'>
  ): Promise<Record<string, WireframeData>> {
    // In a real implementation, this would call an API
    // For now, we'll return a mock response
    const adaptations: Record<string, WireframeData> = {};
    
    // Get the original wireframe
    const originalWireframe = await this.getWireframeById(wireframeId);
    
    for (const device of targetDevices) {
      // Create a device-specific adaptation
      const adaptedSections = await Promise.all(
        originalWireframe.sections?.map(section => 
          this.adaptSectionForDevice(section, device)
        ) || []
      );
      
      adaptations[device] = {
        ...originalWireframe,
        id: `${originalWireframe.id}-${device}`,
        title: `${originalWireframe.title} (${device})`,
        sections: adaptedSections,
        // Fixed: deviceTarget is not in the WireframeData type, use metadata instead
        metadata: {
          ...originalWireframe.metadata,
          deviceType: device
        }
      };
    }
    
    return adaptations;
  }
  
  async adaptSectionForDevice(
    section: WireframeSection,
    targetDevice: 'desktop' | 'tablet' | 'mobile'
  ): Promise<WireframeSection> {
    // This would be implemented with AI-based adaptation in a real service
    // For now, return a simplified adaptation
    
    // Create a copy to avoid mutating the original
    const adaptedSection: WireframeSection = { ...section };
    
    // Apply device-specific adaptations
    switch (targetDevice) {
      case 'mobile':
        // Simplify components for mobile
        if (adaptedSection.components) {
          adaptedSection.components = adaptedSection.components.map(comp => ({
            ...comp,
            // Simplify component for mobile view
            mobileOptimized: true
          }));
        }
        // Fixed: assign correct type for mobileLayout
        adaptedSection.mobileLayout = {
          structure: 'stacked',
          stackOrder: adaptedSection.components?.map(c => c.id) || []
        };
        break;
        
      case 'tablet':
        // Adjust for tablet
        if (adaptedSection.components) {
          adaptedSection.components = adaptedSection.components.map(comp => ({
            ...comp,
            // Adjust component for tablet view
            tabletOptimized: true
          }));
        }
        // Fixed: add layout info to the existing layout property instead
        adaptedSection.layout = typeof adaptedSection.layout === 'string' 
          ? { type: adaptedSection.layout, tabletGrid: 'grid-2' }
          : { ...adaptedSection.layout, tabletGrid: 'grid-2' };
        break;
        
      case 'desktop':
      default:
        // Full desktop experience
        break;
    }
    
    return adaptedSection;
  }

  // Implement additional methods used in codebase
  async getWireframe(id: string): Promise<any> {
    return this.getWireframeById(id);
  }
  
  async generateWireframe(params: any): Promise<any> {
    console.log('Generating wireframe with params', params);
    return {
      wireframe: {
        id: 'generated-wireframe-id',
        title: params.description ? `Wireframe for: ${params.description.substring(0, 20)}...` : 'Generated Wireframe',
        description: params.description || '',
        sections: []
      }
    };
  }
  
  async saveWireframe(projectId: string, prompt: string, data: any, params: any, model: string = 'default'): Promise<any> {
    console.log('Saving wireframe', { projectId, prompt, data, params, model });
    return { ...data, id: data.id || 'saved-wireframe-id' };
  }
  
  async updateWireframeData(id: string, data: any): Promise<any> {
    console.log('Updating wireframe data', { id, data });
    return { ...data, id };
  }
  
  async getLatestWireframe(projectId: string): Promise<any> {
    console.log('Getting latest wireframe for project', projectId);
    return { id: 'latest-wireframe-id', project_id: projectId };
  }
  
  async updateWireframeFeedback(wireframeId: string, feedback: string, rating?: number): Promise<void> {
    console.log('Updating wireframe feedback', { wireframeId, feedback, rating });
  }
}

// Export a singleton instance
const wireframeApiService = new DeviceAdaptiveWireframeApiService();
export default wireframeApiService;
