
export interface ExternalServiceConnection {
  id: string;
  service_name: string;
  service_type: 'figma' | 'github' | 'jira' | 'slack' | 'custom';
  connection_config: Record<string, any>;
  auth_config: Record<string, any>;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  last_sync_at: string | null;
  sync_frequency: string | null;
  project_id: string;
}

export interface ExternalServiceMapping {
  id: string;
  connection_id: string;
  source_field: string;
  target_field: string;
  transformation_rule: string | null;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExternalServiceSyncLog {
  id: string;
  connection_id: string;
  sync_started_at: string;
  sync_completed_at: string | null;
  status: 'in_progress' | 'completed' | 'failed';
  records_processed: number;
  records_succeeded: number;
  records_failed: number;
  error_details: Record<string, any> | null;
  sync_direction: 'inbound' | 'outbound' | 'bidirectional';
}
