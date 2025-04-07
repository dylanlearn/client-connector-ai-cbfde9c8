
import { WireframeDataService } from '../data/wireframe-data-service';
import { AIWireframe } from '../wireframe-types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for managing wireframes in the application
 */
export const WireframeManagementService = {
  /**
   * Get a wireframe by ID
   */
  getWireframe: async (id: string): Promise<AIWireframe | null> => {
    try {
      return await WireframeDataService.getWireframe(id);
    } catch (error) {
      console.error('Error in getWireframe:', error);
      return null;
    }
  },
  
  /**
   * Get all wireframes for a project
   */
  getAllWireframes: async (projectId: string): Promise<AIWireframe[]> => {
    try {
      const { data, error } = await supabase
        .from('ai_wireframes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching wireframes:', error);
        return [];
      }
      
      return (data as AIWireframe[]).map(wireframe => 
        WireframeDataService.standardizeWireframeRecord(wireframe)
      );
    } catch (error) {
      console.error('Error in getAllWireframes:', error);
      return [];
    }
  },
  
  /**
   * Update wireframe feedback
   */
  updateWireframeFeedback: async (wireframeId: string, feedback: string, rating?: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('ai_wireframes')
        .update({ 
          feedback,
          rating,
          updated_at: new Date().toISOString()
        })
        .eq('id', wireframeId);
        
      if (error) {
        console.error('Error updating wireframe feedback:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateWireframeFeedback:', error);
      return false;
    }
  },
  
  /**
   * Delete a wireframe
   */
  deleteWireframe: async (wireframeId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('ai_wireframes')
        .delete()
        .eq('id', wireframeId);
        
      if (error) {
        console.error('Error deleting wireframe:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteWireframe:', error);
      return false;
    }
  }
};
