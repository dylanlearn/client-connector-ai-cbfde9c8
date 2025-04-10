
import { WireframeData, AIWireframe } from './wireframe-types';

export const wireframeService = {
  // Convert AIWireframe to WireframeData
  aiWireframeToWireframeData(aiWireframe: AIWireframe): WireframeData {
    return {
      id: aiWireframe.id || '',
      title: aiWireframe.title || 'Untitled Wireframe',
      description: aiWireframe.description || '',
      sections: aiWireframe.sections || [],
      colorScheme: aiWireframe.design_tokens?.colorScheme || {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff'
      },
      typography: aiWireframe.design_tokens?.typography || {
        headings: 'sans-serif',
        body: 'sans-serif'
      },
      style: aiWireframe.design_tokens?.style || '',
      designTokens: aiWireframe.design_tokens || {},
      mobileLayouts: aiWireframe.mobile_layouts || {},
      styleVariants: aiWireframe.style_variants || {},
      designReasoning: aiWireframe.design_reasoning || {},
      animations: aiWireframe.animations || {},
      imageUrl: aiWireframe.image_url || '',
      lastUpdated: aiWireframe.updated_at || ''
    };
  },
  
  // Convert AIWireframe to WireframeData list
  aiWireframesToWireframeDataList(aiWireframes: AIWireframe[]): WireframeData[] {
    return aiWireframes.map(this.aiWireframeToWireframeData);
  },
  
  // Create a minimal wireframe data object
  createMinimalWireframeData(): WireframeData {
    return {
      id: 'new-wireframe',
      title: 'New Wireframe',
      description: 'This is a new wireframe',
      sections: [],
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff'
      },
      typography: {
        headings: 'sans-serif',
        body: 'sans-serif'
      }
    };
  },
  
  // Format a wireframe for display in a list
  formatWireframeForDisplay(aiWireframe: AIWireframe): any {
    return {
      id: aiWireframe.id,
      title: aiWireframe.title || 'Untitled Wireframe',
      description: aiWireframe.description || 'No description',
      sections: aiWireframe.sections || [],
      sectionCount: (aiWireframe.sections || []).length,
      imageUrl: aiWireframe.image_url || '',
      lastUpdated: aiWireframe.updated_at || ''
    };
  },
  
  // Format wireframes for display in a list
  formatWireframesForDisplay(aiWireframes: AIWireframe[]): any[] {
    return aiWireframes.map(this.formatWireframeForDisplay);
  }
};
