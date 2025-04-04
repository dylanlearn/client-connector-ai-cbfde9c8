
/**
 * Types for client notifications system
 */

/**
 * Notification types supported by the system
 */
export type NotificationType = 'status_change' | 'file_uploaded' | 'comment_added' | 'custom';

/**
 * Status of a notification delivery
 */
export type NotificationStatus = 'pending' | 'sent' | 'failed';

/**
 * Client notification metadata structure
 */
export interface NotificationMetadata {
  fileId?: string;          // For file_uploaded notifications
  fileName?: string;        // For file_uploaded notifications
  commentId?: string;       // For comment_added notifications
  commentAuthor?: string;   // For comment_added notifications
  previousStatus?: string;  // For status_change notifications
  newStatus?: string;       // For status_change notifications
  priority?: 'low' | 'medium' | 'high';  // Optional priority flag
  [key: string]: any;       // Allow additional custom metadata
}

/**
 * Main client notification interface
 */
export interface ClientNotification {
  id: string;
  project_id: string;
  client_email: string;
  notification_type: NotificationType;
  message: string;
  sent_at: string | null;
  created_at: string;
  status: NotificationStatus;
  metadata: NotificationMetadata;
}

/**
 * Input for creating a new notification
 */
export interface CreateClientNotification {
  project_id: string;
  client_email: string;
  notification_type: NotificationType;
  message: string;
  metadata?: NotificationMetadata;
}

/**
 * Response from sending a notification
 */
export interface SendNotificationResponse {
  success: boolean;
  message: string;
  recipient?: string;
  error?: string;
}
