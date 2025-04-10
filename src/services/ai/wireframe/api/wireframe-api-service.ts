
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeData, 
  WireframeGenerationParams,
  AIWireframe
} from "../wireframe-types";

/**
 * API service for wireframe operations
 */
class WireframeApiService {
  /**
   * Call a Supabase Edge Function
   */
  async callEdgeFunction(
    functionName: string, 
    payload: Record<string, any>
  ): Promise<any> {
    try {
      console.log(`Calling edge function: ${functionName}`, payload);
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error calling edge function ${functionName}:`, error);
      throw error;
    }
  }
  
  /**
   * Get a wireframe by ID
   */
  async getWireframe(wireframeId: string): Promise<AIWireframe | null> {
    try {
      const { data, error } = await supabase
        .from('wireframes')
        .select('*')
        .eq('id', wireframeId)
        .single();
      
      if (error) throw error;
      
      return data as AIWireframe;
    } catch (error) {
      console.error('Error getting wireframe:', error);
      throw error;
    }
  }
  
  /**
   * Save a wireframe
   */
  async saveWireframe(
    wireframeId: string, 
    prompt: string, 
    wireframeData: any,
    params: Record<string, any> = {},
    source: string = 'ai-generated'
  ): Promise<AIWireframe> {
    try {
      const { data, error } = await supabase
        .from('wireframes')
        .upsert({
          id: wireframeId,
          prompt,
          data: wireframeData,
          title: wireframeData.title || 'Untitled Wireframe',
          description: wireframeData.description || '',
          sections: wireframeData.sections || [],
          generation_params: params,
          source
        }, {
          onConflict: 'id'
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data as AIWireframe;
    } catch (error) {
      console.error('Error saving wireframe:', error);
      throw error;
    }
  }
  
  /**
   * Update a wireframe's data
   */
  async updateWireframeData(
    wireframeId: string, 
    wireframeData: WireframeData
  ): Promise<AIWireframe | null> {
    try {
      const { data, error } = await supabase
        .from('wireframes')
        .update({
          data: wireframeData,
          title: wireframeData.title || undefined,
          description: wireframeData.description || undefined,
          sections: wireframeData.sections || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', wireframeId)
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data as AIWireframe;
    } catch (error) {
      console.error('Error updating wireframe:', error);
      throw error;
    }
  }
  
  /**
   * Update wireframe feedback
   */
  async updateWireframeFeedback(
    wireframeId: string,
    feedback: any
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wireframe_feedback')
        .insert({
          wireframe_id: wireframeId,
          feedback,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating wireframe feedback:', error);
      return false;
    }
  }

  /**
   * Create a new version of a wireframe
   */
  async createWireframeVersion(
    wireframeId: string,
    wireframeData: WireframeData,
    options: {
      description?: string;
      userId?: string;
    } = {}
  ): Promise<{
    success: boolean;
    version_id: string;
  }> {
    try {
      // Generate a version ID
      const versionId = crypto.randomUUID();
      
      const { error } = await supabase
        .from('wireframe_versions')
        .insert({
          id: versionId,
          wireframe_id: wireframeId,
          data: wireframeData,
          description: options.description || 'New version',
          created_by: options.userId || null,
          is_current: true
        });
      
      if (error) throw error;
      
      // Set all other versions as not current
      const { error: updateError } = await supabase
        .from('wireframe_versions')
        .update({ is_current: false })
        .eq('wireframe_id', wireframeId)
        .neq('id', versionId);
      
      if (updateError) {
        console.warn('Error updating other versions:', updateError);
      }
      
      return {
        success: true,
        version_id: versionId
      };
    } catch (error) {
      console.error('Error creating wireframe version:', error);
      throw error;
    }
  }
  
  /**
   * Get versions of a wireframe
   */
  async getWireframeVersions(wireframeId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('wireframe_versions')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting wireframe versions:', error);
      throw error;
    }
  }
}

export const wireframeApiService = new WireframeApiService();
export default wireframeApiService;
