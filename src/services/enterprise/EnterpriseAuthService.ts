
import { EnterpriseAuthConfiguration } from '@/types/enterprise-auth';
import { supabase } from '@/integrations/supabase/client';

export class EnterpriseAuthService {
  /**
   * Get all authentication configurations
   */
  static async getAuthConfigurations(): Promise<EnterpriseAuthConfiguration[]> {
    try {
      const { data, error } = await supabase
        .from('enterprise_auth_configurations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as EnterpriseAuthConfiguration[];
    } catch (err) {
      console.error('Error fetching auth configurations:', err);
      return [];
    }
  }
  
  /**
   * Get authentication configuration by ID
   */
  static async getAuthConfigurationById(id: string): Promise<EnterpriseAuthConfiguration | null> {
    try {
      const { data, error } = await supabase
        .from('enterprise_auth_configurations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as EnterpriseAuthConfiguration;
    } catch (err) {
      console.error('Error fetching auth configuration:', err);
      return null;
    }
  }
  
  /**
   * Save authentication configuration
   */
  static async saveAuthConfiguration(config: Partial<EnterpriseAuthConfiguration>): Promise<string | null> {
    try {
      if (config.id) {
        // Update existing configuration
        const { data, error } = await supabase
          .from('enterprise_auth_configurations')
          .update({
            auth_type: config.auth_type,
            provider_name: config.provider_name,
            configuration: config.configuration,
            metadata: config.metadata,
            is_default: config.is_default,
            is_active: config.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', config.id)
          .select();
        
        if (error) throw error;
        return data?.[0]?.id || null;
      } else {
        // Create new configuration
        const { data, error } = await supabase
          .from('enterprise_auth_configurations')
          .insert({
            organization_id: config.organization_id,
            auth_type: config.auth_type,
            provider_name: config.provider_name,
            configuration: config.configuration,
            metadata: config.metadata,
            is_default: config.is_default || false,
            is_active: config.is_active || true
          })
          .select();
        
        if (error) throw error;
        return data?.[0]?.id || null;
      }
    } catch (err) {
      console.error('Error saving auth configuration:', err);
      return null;
    }
  }
  
  /**
   * Delete authentication configuration
   */
  static async deleteAuthConfiguration(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('enterprise_auth_configurations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting auth configuration:', err);
      return false;
    }
  }
  
  /**
   * Toggle authentication configuration status
   */
  static async toggleAuthConfigurationStatus(id: string, isActive: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('enterprise_auth_configurations')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error toggling auth configuration status:', err);
      return false;
    }
  }
}
