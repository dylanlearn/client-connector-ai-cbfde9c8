
import { supabase } from '@/integrations/supabase/client';

export interface DesignToken {
  id: string;
  name: string;
  value: any;
  category: string;
  description?: string;
}

export interface DesignAsset {
  id: string;
  name: string;
  asset_type: string;
  file_path: string;
  file_size: number;
  format: string;
  dimensions?: { width: number; height: number };
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface SyncResult {
  success: boolean;
  message: string;
  syncLogId?: string;
  conflicts?: any[];
  changes?: any;
}

export class DesignSystemService {
  static async getDesignTokens(projectId: string): Promise<DesignToken[]> {
    const { data, error } = await supabase
      .from('design_tokens')
      .select('*')
      .eq('project_id', projectId);
    
    if (error) {
      console.error('Error fetching design tokens:', error);
      throw error;
    }
    
    return data || [];
  }
  
  static async getSyncHistory(projectId: string, wireframeId?: string): Promise<any[]> {
    let query = supabase
      .from('design_system_sync_logs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (wireframeId) {
      query = query.eq('wireframe_id', wireframeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching sync history:', error);
      throw error;
    }
    
    return data || [];
  }
  
  static async syncDesignSystemToWireframe(projectId: string, wireframeId: string, overrideConflicts: boolean = false): Promise<SyncResult> {
    const { data, error } = await supabase
      .rpc('apply_design_system_to_wireframe', {
        p_wireframe_id: wireframeId,
        p_project_id: projectId,
        p_override_conflicts: overrideConflicts
      });
      
    if (error) {
      console.error('Error syncing design system to wireframe:', error);
      throw error;
    }
    
    return data;
  }
  
  static async syncWireframeToDesignSystem(projectId: string, wireframeId: string, overrideConflicts: boolean = false): Promise<SyncResult> {
    const { data, error } = await supabase
      .rpc('apply_wireframe_to_design_system', {
        p_wireframe_id: wireframeId,
        p_project_id: projectId,
        p_override_conflicts: overrideConflicts
      });
      
    if (error) {
      console.error('Error syncing wireframe to design system:', error);
      throw error;
    }
    
    return data;
  }
  
  static async getDesignAssets(projectId: string): Promise<DesignAsset[]> {
    const { data, error } = await supabase
      .from('design_assets')
      .select('*')
      .eq('project_id', projectId);
    
    if (error) {
      console.error('Error fetching design assets:', error);
      throw error;
    }
    
    return data || [];
  }
  
  static async getAssetUsage(assetId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('design_asset_usage')
      .select(`
        *,
        wireframes:wireframe_id (
          id,
          title
        )
      `)
      .eq('asset_id', assetId);
    
    if (error) {
      console.error('Error fetching asset usage:', error);
      throw error;
    }
    
    return data || [];
  }
  
  static async analyzeAssetUsage(projectId: string): Promise<any> {
    const { data, error } = await supabase
      .rpc('analyze_asset_usage', {
        p_project_id: projectId
      });
      
    if (error) {
      console.error('Error analyzing asset usage:', error);
      throw error;
    }
    
    return data;
  }
}
