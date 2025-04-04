
export interface ClientNotification {
  id: string;
  project_id: string;
  client_email: string;
  notification_type: 'status_change' | 'file_uploaded' | 'comment_added' | 'custom';
  message: string;
  sent_at: string | null;
  created_at: string;
  status: 'pending' | 'sent' | 'failed';
  metadata: Record<string, any>;
}
