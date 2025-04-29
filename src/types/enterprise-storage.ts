
export type StorageIntegrationType = 's3' | 'gcs' | 'azure' | 'ftp' | 'sftp' | 'webdav' | 'onedrive' | 'gdrive' | 'dropbox';
export type BackupFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type SyncStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface StorageIntegration {
  id: string;
  integration_type: StorageIntegrationType;
  name: string;
  configuration: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface StorageSyncLog {
  id: string;
  integration_id: string;
  status: SyncStatus;
  started_at: string;
  completed_at?: string | null;
  files_processed: number;
  files_succeeded: number;
  files_failed: number;
  error_details?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
}

export interface FileVersion {
  id: string;
  file_id: string;
  storage_path: string;
  version_number: number;
  size_bytes: number;
  created_at: string;
  created_by?: string | null;
  metadata?: Record<string, any> | null;
  checksum?: string | null;
  integration_id?: string | null;
}

export interface BackupSchedule {
  id: string;
  integration_id: string;
  name: string;
  frequency: BackupFrequency;
  retention_days: number;
  last_backup_at?: string | null;
  next_backup_at?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BackupLog {
  id: string;
  schedule_id?: string | null;
  status: SyncStatus;
  started_at: string;
  completed_at?: string | null;
  backup_size_bytes?: number | null;
  file_count?: number | null;
  storage_location: string;
  error_message?: string | null;
  metadata?: Record<string, any> | null;
}
