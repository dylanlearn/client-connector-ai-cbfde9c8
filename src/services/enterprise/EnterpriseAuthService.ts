import { 
  EnterpriseAuthConfiguration, 
  EnterpriseAuthType, 
  MFAConfiguration,
  MFAType, 
  SSOSession,
  SSOUser
} from '@/types/enterprise-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export class EnterpriseAuthService {
  /**
   * Get all enterprise auth configurations
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
      throw err;
    }
  }

  /**
   * Get active auth configuration by provider and type
   */
  static async getAuthConfigByProvider(provider: string, authType: EnterpriseAuthType): Promise<EnterpriseAuthConfiguration | null> {
    try {
      const { data, error } = await supabase
        .from('enterprise_auth_configurations')
        .select('*')
        .eq('provider_name', provider)
        .eq('auth_type', authType)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as EnterpriseAuthConfiguration;
    } catch (err) {
      console.error(`Error fetching auth configuration for ${provider}:`, err);
      return null;
    }
  }

  /**
   * Create or update auth configuration
   */
  static async saveAuthConfiguration(config: Partial<EnterpriseAuthConfiguration>): Promise<EnterpriseAuthConfiguration> {
    try {
      // If ID exists, update existing config
      if (config.id) {
        const { data, error } = await supabase
          .from('enterprise_auth_configurations')
          .update({
            provider_name: config.provider_name,
            auth_type: config.auth_type,
            configuration: config.configuration,
            metadata: config.metadata,
            is_default: config.is_default,
            is_active: config.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', config.id)
          .select()
          .single();

        if (error) throw error;
        return data as EnterpriseAuthConfiguration;
      } 
      // Otherwise create new config
      else {
        const { data, error } = await supabase
          .from('enterprise_auth_configurations')
          .insert({
            organization_id: config.organization_id,
            provider_name: config.provider_name,
            auth_type: config.auth_type,
            configuration: config.configuration,
            metadata: config.metadata,
            is_default: config.is_default,
            is_active: config.is_active
          })
          .select()
          .single();

        if (error) throw error;
        return data as EnterpriseAuthConfiguration;
      }
    } catch (err) {
      console.error('Error saving auth configuration:', err);
      throw err;
    }
  }
  
  /**
   * Verify SAML authentication
   */
  static async verifySAMLAuth(samlResponse: string, configId: string): Promise<SSOUser | null> {
    try {
      const { data, error } = await supabase.rpc('verify_saml_auth', {
        p_saml_response: samlResponse,
        p_config_id: configId
      });
      
      if (error) throw error;
      
      if (data.success) {
        return data.user_data as SSOUser;
      } else {
        toast.error("SAML authentication failed", { 
          description: data.message || "Please check your credentials and try again" 
        });
        return null;
      }
    } catch (err) {
      console.error('SAML verification error:', err);
      toast.error("SAML authentication error", { 
        description: "An unexpected error occurred during authentication" 
      });
      return null;
    }
  }
  
  /**
   * Enable MFA for a user
   */
  static async enableMFA(userId: string, mfaType: MFAType): Promise<{secret: string, backup_codes: string[]} | null> {
    try {
      const { data, error } = await supabase.rpc('enable_mfa', {
        p_user_id: userId,
        p_mfa_type: mfaType
      });
      
      if (error) throw error;
      
      if (data.success) {
        return {
          secret: data.secret,
          backup_codes: data.backup_codes
        };
      } else {
        toast.error("Failed to enable MFA", { description: data.message });
        return null;
      }
    } catch (err) {
      console.error('Error enabling MFA:', err);
      toast.error("MFA configuration error");
      return null;
    }
  }
  
  /**
   * Verify MFA code
   */
  static async verifyMFACode(userId: string, mfaType: MFAType, code: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('verify_mfa_code', {
        p_user_id: userId,
        p_mfa_type: mfaType,
        p_code: code
      });
      
      if (error) throw error;
      return data === true;
    } catch (err) {
      console.error('Error verifying MFA code:', err);
      return false;
    }
  }
  
  /**
   * Get MFA configuration for a user
   */
  static async getUserMFAConfigurations(userId: string): Promise<MFAConfiguration[]> {
    try {
      const { data, error } = await supabase
        .from('mfa_configurations')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      return data as MFAConfiguration[];
    } catch (err) {
      console.error('Error fetching MFA configurations:', err);
      return [];
    }
  }
}
