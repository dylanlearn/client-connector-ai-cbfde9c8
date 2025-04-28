
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DesignToken {
  id: string;
  project_id: string;
  name: string;
  category: 'color' | 'typography' | 'spacing' | 'sizing' | 'shadow' | 'motion' | 'border' | 'opacity' | 'z-index' | 'other';
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface DesignSystemComponent {
  id: string;
  project_id: string;
  name: string;
  component_type: string;
  design_tokens: Record<string, any>;
  properties: Record<string, any>;
  version: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SyncResult {
  success: boolean;
  message: string;
  syncLogId: string;
  conflicts?: any[];
}

export interface AssetAnalysis {
  unusedAssets: {
    id: string;
    name: string;
    type: string;
    size: number;
    lastUpdated: string;
  }[];
  duplicateAssets: {
    type: string;
    name: string;
    count: number;
    ids: string[];
    sizes: number[];
  }[];
  optimizationSuggestions: {
    id: string;
    name: string;
    type: string;
    currentSize: number;
    suggestion: string;
    potentialSavings: number;
  }[];
  analyzedAt: string;
}

export interface Asset {
  id: string;
  project_id: string;
  name: string;
  file_path: string;
  asset_type: 'image' | 'icon' | 'illustration' | 'animation' | 'video' | 'audio' | 'font' | 'other';
  file_size: number;
  dimensions?: { width: number; height: number };
  format: string;
  tags: string[];
  metadata: Record<string, any>;
  version: string;
  created_at: string;
  updated_at: string;
}

export interface DataSource {
  id: string;
  project_id: string;
  name: string;
  source_type: 'api' | 'database' | 'graphql' | 'mock' | 'file' | 'other';
  connection_details: Record<string, any>;
  schema_definition?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DataMapping {
  id: string;
  data_source_id: string;
  wireframe_id: string;
  element_id: string;
  field_mappings: Record<string, string>;
  transformation_rules?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const DesignSystemService = {
  // Design Token Methods
  async getDesignTokens(projectId: string): Promise<DesignToken[]> {
    try {
      const { data, error } = await supabase
        .from('design_tokens')
        .select('*')
        .eq('project_id', projectId);
        
      if (error) throw error;
      return data as DesignToken[];
    } catch (error) {
      console.error('Error fetching design tokens:', error);
      throw error;
    }
  },
  
  async createDesignToken(token: Omit<DesignToken, 'id' | 'created_at' | 'updated_at'>): Promise<DesignToken> {
    try {
      const { data, error } = await supabase
        .from('design_tokens')
        .insert(token)
        .select()
        .single();
        
      if (error) throw error;
      return data as DesignToken;
    } catch (error) {
      console.error('Error creating design token:', error);
      throw error;
    }
  },
  
  async updateDesignToken(id: string, updates: Partial<DesignToken>): Promise<DesignToken> {
    try {
      const { data, error } = await supabase
        .from('design_tokens')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data as DesignToken;
    } catch (error) {
      console.error('Error updating design token:', error);
      throw error;
    }
  },
  
  async deleteDesignToken(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('design_tokens')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting design token:', error);
      throw error;
    }
  },
  
  // Design System Synchronization Methods
  async syncDesignSystemToWireframe(wireframeId: string, projectId: string, overrideConflicts = false): Promise<SyncResult> {
    try {
      const { data, error } = await supabase
        .rpc('apply_design_system_to_wireframe', {
          p_wireframe_id: wireframeId,
          p_project_id: projectId,
          p_override_conflicts: overrideConflicts
        });
        
      if (error) throw error;
      return data as SyncResult;
    } catch (error) {
      console.error('Error syncing design system to wireframe:', error);
      throw error;
    }
  },
  
  async syncWireframeToDesignSystem(wireframeId: string, projectId: string, overrideConflicts = false): Promise<SyncResult> {
    try {
      const { data, error } = await supabase
        .rpc('apply_wireframe_to_design_system', {
          p_wireframe_id: wireframeId,
          p_project_id: projectId,
          p_override_conflicts: overrideConflicts
        });
        
      if (error) throw error;
      return data as SyncResult;
    } catch (error) {
      console.error('Error syncing wireframe to design system:', error);
      throw error;
    }
  },

  async getSyncLogs(wireframeId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('design_system_sync_logs')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching sync logs:', error);
      throw error;
    }
  },
  
  // Asset Management Methods
  async getAssets(projectId: string): Promise<Asset[]> {
    try {
      const { data, error } = await supabase
        .from('design_assets')
        .select('*')
        .eq('project_id', projectId);
        
      if (error) throw error;
      return data as Asset[];
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },
  
  async createAsset(asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>): Promise<Asset> {
    try {
      const { data, error } = await supabase
        .from('design_assets')
        .insert(asset)
        .select()
        .single();
        
      if (error) throw error;
      return data as Asset;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },
  
  async analyzeAssetUsage(projectId: string, daysThreshold = 30): Promise<AssetAnalysis> {
    try {
      const { data, error } = await supabase
        .rpc('analyze_asset_usage', {
          p_project_id: projectId,
          p_days_threshold: daysThreshold
        });
        
      if (error) throw error;
      return data as AssetAnalysis;
    } catch (error) {
      console.error('Error analyzing assets:', error);
      throw error;
    }
  },
  
  async trackAssetUsage(assetId: string, wireframeId: string, elementId?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('design_asset_usage')
        .insert({
          asset_id: assetId,
          wireframe_id: wireframeId,
          element_id: elementId,
          usage_context: 'wireframe'
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error tracking asset usage:', error);
      // Don't throw on usage tracking - fail silently
    }
  },
  
  // Data Source Methods
  async getDataSources(projectId: string): Promise<DataSource[]> {
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .eq('project_id', projectId);
        
      if (error) throw error;
      return data as DataSource[];
    } catch (error) {
      console.error('Error fetching data sources:', error);
      throw error;
    }
  },
  
  async createDataSource(dataSource: Omit<DataSource, 'id' | 'created_at' | 'updated_at'>): Promise<DataSource> {
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .insert(dataSource)
        .select()
        .single();
        
      if (error) throw error;
      return data as DataSource;
    } catch (error) {
      console.error('Error creating data source:', error);
      throw error;
    }
  },
  
  async createDataMapping(mapping: Omit<DataMapping, 'id' | 'created_at' | 'updated_at'>): Promise<DataMapping> {
    try {
      const { data, error } = await supabase
        .from('data_source_mappings')
        .insert(mapping)
        .select()
        .single();
        
      if (error) throw error;
      return data as DataMapping;
    } catch (error) {
      console.error('Error creating data mapping:', error);
      throw error;
    }
  },
  
  async transformData(mappingId: string, inputData?: Record<string, any>): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase
        .rpc('transform_data_through_mapping', {
          p_mapping_id: mappingId,
          p_input_data: inputData ? inputData : null
        });
        
      if (error) throw error;
      return data as Record<string, any>;
    } catch (error) {
      console.error('Error transforming data:', error);
      throw error;
    }
  }
};
