
import { supabase } from '@/integrations/supabase/client';

export interface DesignMemoryData {
  projectId: string;
  blueprintId?: string;
  layoutPatterns?: any;
  stylePreferences?: any;
  componentPreferences?: any;
}

export interface DesignMemoryResponse {
  id: string;
  project_id: string;
  blueprint_id?: string;
  layout_patterns?: any;
  style_preferences?: any;
  component_preferences?: any;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface DesignMemoryUpdate {
  memoryId: string;
  updates: Partial<Omit<DesignMemoryResponse, 'id' | 'project_id' | 'created_at' | 'updated_at' | 'user_id'>>;
}

/**
 * Service for managing wireframe design memory
 */
export const WireframeMemoryService = {
  /**
   * Store design memory for a project
   */
  storeDesignMemory: async (data: DesignMemoryData): Promise<DesignMemoryResponse | null> => {
    try {
      const { data: responseData, error } = await supabase.functions.invoke('wireframe-design-memory', {
        body: { 
          action: 'store', 
          projectId: data.projectId,
          blueprintId: data.blueprintId,
          layoutPatterns: data.layoutPatterns,
          stylePreferences: data.stylePreferences,
          componentPreferences: data.componentPreferences
        }
      });
      
      if (error) throw error;
      
      return responseData?.data?.[0] || null;
    } catch (error) {
      console.error('Error storing design memory:', error);
      throw error;
    }
  },
  
  /**
   * Retrieve design memory for a project
   */
  getDesignMemory: async (projectId: string): Promise<DesignMemoryResponse | null> => {
    try {
      const { data: responseData, error } = await supabase.functions.invoke('wireframe-design-memory', {
        body: { 
          action: 'retrieve', 
          projectId 
        }
      });
      
      if (error) throw error;
      
      return responseData?.data || null;
    } catch (error) {
      console.error('Error retrieving design memory:', error);
      throw error;
    }
  },
  
  /**
   * Update existing design memory
   */
  updateDesignMemory: async (updateData: DesignMemoryUpdate): Promise<DesignMemoryResponse | null> => {
    try {
      const { data: responseData, error } = await supabase.functions.invoke('wireframe-design-memory', {
        body: { 
          action: 'update', 
          memoryId: updateData.memoryId,
          updates: updateData.updates
        }
      });
      
      if (error) throw error;
      
      return responseData?.data || null;
    } catch (error) {
      console.error('Error updating design memory:', error);
      throw error;
    }
  },
};
