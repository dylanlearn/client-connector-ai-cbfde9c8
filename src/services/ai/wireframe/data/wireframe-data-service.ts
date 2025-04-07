
import { supabase } from '@/integrations/supabase/client';
import { AIWireframe, WireframeData, WireframeSection } from '../wireframe-types';
import { v4 as uuidv4 } from 'uuid';

export const WireframeDataService = {
  /**
   * Standardize wireframe record structure
   */
  standardizeWireframeRecord: (wireframe: AIWireframe): AIWireframe => {
    if (!wireframe) return wireframe;
    
    // Handle legacy data structure
    if (wireframe.wireframe_data && !wireframe.data) {
      wireframe.data = wireframe.wireframe_data;
    }
    
    // Ensure sections are present
    if (!wireframe.sections && wireframe.data?.sections) {
      wireframe.sections = wireframe.data.sections;
    }
    
    // Ensure title is present
    if (!wireframe.title && wireframe.data?.title) {
      wireframe.title = wireframe.data.title;
    }
    
    return wireframe;
  },
  
  /**
   * Get title of wireframe
   */
  getWireframeTitle: (wireframe: AIWireframe): string => {
    if (wireframe.title) {
      return wireframe.title;
    }
    
    if (wireframe.data?.title) {
      return wireframe.data.title;
    }
    
    if (wireframe.description) {
      return wireframe.description.substring(0, 30) + (wireframe.description.length > 30 ? '...' : '');
    }
    
    return 'Untitled Wireframe';
  },
  
  /**
   * Ensure a section has all required properties
   */
  ensureValidSection: (section: Partial<WireframeSection>): WireframeSection => {
    return {
      id: section.id || uuidv4(),
      name: section.name || 'Untitled Section',
      sectionType: section.sectionType || 'generic',
      layoutType: section.layoutType || 'standard',
      components: section.components || [],
      description: section.description || '',
      ...section
    };
  },
  
  /**
   * Get a wireframe by ID
   */
  getWireframe: async (id: string): Promise<AIWireframe | null> => {
    try {
      const { data, error } = await supabase
        .from('ai_wireframes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching wireframe:', error);
        return null;
      }
      
      return WireframeDataService.standardizeWireframeRecord(data as AIWireframe);
    } catch (error) {
      console.error('Error in getWireframe:', error);
      return null;
    }
  }
};
