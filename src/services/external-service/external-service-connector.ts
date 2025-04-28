
import { supabase } from "@/integrations/supabase/client";
import type { 
  ExternalServiceConnection, 
  ExternalServiceMapping, 
  ExternalServiceSyncLog 
} from "@/types/external-service";

export class ExternalServiceConnector {
  static async createConnection(
    serviceName: string,
    serviceType: string,
    connectionConfig: Record<string, any>,
    authConfig: Record<string, any>,
    projectId: string,
    syncFrequency?: string
  ): Promise<ExternalServiceConnection> {
    const { data, error } = await supabase
      .from('external_service_connections')
      .insert({
        service_name: serviceName,
        service_type: serviceType,
        connection_config: connectionConfig,
        auth_config: authConfig,
        project_id: projectId,
        sync_frequency: syncFrequency,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating external service connection:", error);
      throw error;
    }

    return data as ExternalServiceConnection;
  }

  static async getConnections(
    projectId: string
  ): Promise<ExternalServiceConnection[]> {
    const { data, error } = await supabase
      .from('external_service_connections')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching external service connections:", error);
      throw error;
    }

    return data as ExternalServiceConnection[];
  }

  static async createFieldMapping(
    connectionId: string,
    sourceField: string,
    targetField: string,
    transformationRule?: string,
    isRequired: boolean = false
  ): Promise<ExternalServiceMapping> {
    const { data, error } = await supabase
      .from('external_service_mappings')
      .insert({
        connection_id: connectionId,
        source_field: sourceField,
        target_field: targetField,
        transformation_rule: transformationRule,
        is_required: isRequired
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating field mapping:", error);
      throw error;
    }

    return data as ExternalServiceMapping;
  }

  static async getFieldMappings(
    connectionId: string
  ): Promise<ExternalServiceMapping[]> {
    const { data, error } = await supabase
      .from('external_service_mappings')
      .select('*')
      .eq('connection_id', connectionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching field mappings:", error);
      throw error;
    }

    return data as ExternalServiceMapping[];
  }

  static async syncExternalService(
    connectionId: string
  ): Promise<ExternalServiceSyncLog> {
    const { data, error } = await supabase
      .rpc('sync_external_service', { p_connection_id: connectionId });

    if (error) {
      console.error("Error syncing external service:", error);
      throw error;
    }

    // Fetch the sync log details
    if (data.log_id) {
      const { data: logData, error: logError } = await supabase
        .from('external_service_sync_logs')
        .select('*')
        .eq('id', data.log_id)
        .single();

      if (logError) {
        console.error("Error fetching sync log:", logError);
        throw logError;
      }

      return logData as ExternalServiceSyncLog;
    }

    throw new Error("No sync log ID returned");
  }

  static async getSyncLogs(
    connectionId: string
  ): Promise<ExternalServiceSyncLog[]> {
    const { data, error } = await supabase
      .from('external_service_sync_logs')
      .select('*')
      .eq('connection_id', connectionId)
      .order('sync_started_at', { ascending: false });

    if (error) {
      console.error("Error fetching sync logs:", error);
      throw error;
    }

    return data as ExternalServiceSyncLog[];
  }
}
