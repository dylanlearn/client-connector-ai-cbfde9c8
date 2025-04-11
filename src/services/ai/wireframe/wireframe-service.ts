import { supabase } from '@/integrations/supabase/client';
import { AIWireframe, WireframeGenerationParams } from './wireframe-types';

export const getWireframe = async (id: string): Promise<AIWireframe | null> => {
  try {
    const { data, error } = await supabase
      .from('wireframes')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as AIWireframe;
  } catch (error) {
    console.error("Error fetching wireframe:", error);
    return null;
  }
};

export const saveWireframeStyle = async (wireframeId: string, style: string | Record<string, any>): Promise<boolean> => {
  try {
    // Convert object to string if necessary
    const styleValue = typeof style === 'object' ? JSON.stringify(style) : style;
    
    const { error } = await supabase
      .from('wireframes')
      .update({ 
        style: styleValue,
        design_tokens: typeof style === 'object' ? style : {} 
      })
      .eq('id', wireframeId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving wireframe style:", error);
    return false;
  }
};

export const wireframeService = {
  // Convert AIWireframe to WireframeData
  aiWireframeToWireframeData(aiWireframe: AIWireframe): WireframeData {
    return {
      id: aiWireframe.id || '',
      title: aiWireframe.title || 'Untitled Wireframe',
      description: aiWireframe.description || '',
      sections: aiWireframe.sections || [],
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#111827'
      },
      typography: {
        headings: 'sans-serif',
        body: 'sans-serif'
      },
      style: '',
      designTokens: aiWireframe.design_tokens || {},
      imageUrl: aiWireframe.image_url || '',
      lastUpdated: aiWireframe.updated_at ? new Date(aiWireframe.updated_at).toISOString() : new Date().toISOString()
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
        background: '#ffffff',
        text: '#111827'
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
      lastUpdated: aiWireframe.updated_at ? new Date(aiWireframe.updated_at).toISOString() : new Date().toISOString()
    };
  },
  
  // Format wireframes for display in a list
  formatWireframesForDisplay(aiWireframes: AIWireframe[]): any[] {
    return aiWireframes.map(this.formatWireframeForDisplay);
  }
};

export default wireframeService;
