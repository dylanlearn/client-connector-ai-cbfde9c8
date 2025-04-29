
import { 
  StorageIntegration, 
  StorageIntegrationType,
  StorageSyncLog,
  BackupSchedule,
  BackupFrequency,
  FileVersion,
  BackupLog
} from '@/types/enterprise-storage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export class EnterpriseStorageService {
  /**
   * Get all storage integrations
   */
  static async getStorageIntegrations(): Promise<StorageIntegration[]> {
    try {
      const { data, error } = await supabase
        .from('storage_integrations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as StorageIntegration[];
    } catch (err) {
      console.error('Error fetching storage integrations:', err);
      return [];
    }
  }
  
  /**
   * Create or update a storage integration
   */
  static async saveStorageIntegration(
    integrationType: StorageIntegrationType, 
    name: string, 
    configuration: Record<string, any>
  ): Promise<StorageIntegration | null> {
    try {
      const { data, error } = await supabase.rpc('create_storage_integration', {
        p_integration_type: integrationType,
        p_name: name,
        p_configuration: configuration
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast.success('Storage integration saved successfully');
        
        // Fetch the created/updated integration
        const { data: integration, error: fetchError } = await supabase
          .from('storage_integrations')
          .select('*')
          .eq('id', data.integration_id)
          .single();
          
        if (fetchError) throw fetchError;
        return integration as StorageIntegration;
      } else {
        toast.error('Failed to save storage integration', { 
          description: data.message || 'Please check your configuration and try again' 
        });
        return null;
      }
    } catch (err) {
      console.error('Error saving storage integration:', err);
      toast.error('Error creating storage integration');
      return null;
    }
  }
  
  /**
   * Create a backup schedule
   */
  static async createBackupSchedule(
    integrationId: string, 
    name: string, 
    frequency: BackupFrequency, 
    retentionDays: number
  ): Promise<BackupSchedule | null> {
    try {
      const { data, error } = await supabase.rpc('create_backup_schedule', {
        p_integration_id: integrationId,
        p_name: name,
        p_frequency: frequency,
        p_retention_days: retentionDays
      });
      
      if (error) throw error;
      
      if (data.success) {
        // Fetch the created schedule
        const { data: schedule, error: fetchError } = await supabase
          .from('backup_schedules')
          .select('*')
          .eq('id', data.schedule_id)
          .single();
          
        if (fetchError) throw fetchError;
        return schedule as BackupSchedule;
      } else {
        toast.error('Failed to create backup schedule');
        return null;
      }
    } catch (err) {
      console.error('Error creating backup schedule:', err);
      toast.error('Error creating backup schedule');
      return null;
    }
  }
  
  /**
   * Get backup schedules for an integration
   */
  static async getBackupSchedules(integrationId?: string): Promise<BackupSchedule[]> {
    try {
      let query = supabase
        .from('backup_schedules')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (integrationId) {
        query = query.eq('integration_id', integrationId);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      return data as BackupSchedule[];
    } catch (err) {
      console.error('Error fetching backup schedules:', err);
      return [];
    }
  }
  
  /**
   * Get backup logs
   */
  static async getBackupLogs(scheduleId?: string, limit: number = 20): Promise<BackupLog[]> {
    try {
      let query = supabase
        .from('backup_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(limit);
        
      if (scheduleId) {
        query = query.eq('schedule_id', scheduleId);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      return data as BackupLog[];
    } catch (err) {
      console.error('Error fetching backup logs:', err);
      return [];
    }
  }
  
  /**
   * Get file versions
   */
  static async getFileVersions(fileId: string): Promise<FileVersion[]> {
    try {
      const { data, error } = await supabase
        .from('file_versions')
        .select('*')
        .eq('file_id', fileId)
        .order('version_number', { ascending: false });
        
      if (error) throw error;
      return data as FileVersion[];
    } catch (err) {
      console.error('Error fetching file versions:', err);
      return [];
    }
  }
  
  /**
   * Sync with external storage
   */
  static async syncStorage(integrationId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('sync_external_service', {
        p_connection_id: integrationId
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast.success('Storage sync initiated successfully');
        return true;
      } else {
        toast.error('Failed to sync with external storage', { description: data.message });
        return false;
      }
    } catch (err) {
      console.error('Error syncing with external storage:', err);
      toast.error('Error syncing with external storage');
      return false;
    }
  }
  
  /**
   * Get storage sync logs
   */
  static async getSyncLogs(integrationId: string): Promise<StorageSyncLog[]> {
    try {
      const { data, error } = await supabase
        .from('storage_sync_logs')
        .select('*')
        .eq('integration_id', integrationId)
        .order('started_at', { ascending: false });
        
      if (error) throw error;
      return data as StorageSyncLog[];
    } catch (err) {
      console.error('Error fetching sync logs:', err);
      return [];
    }
  }
}
