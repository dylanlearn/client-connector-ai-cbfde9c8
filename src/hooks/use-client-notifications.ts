
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientNotification } from '@/types/client-notification';
import { toast } from 'sonner';
import { withRetry } from '@/utils/retry-utils';

/**
 * Hook for managing client notifications
 */
export const useClientNotifications = (projectId?: string) => {
  const queryClient = useQueryClient();

  /**
   * Fetch notifications for a project
   */
  const {
    data: notifications,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['client-notifications', projectId],
    queryFn: async () => {
      if (!projectId) return [];

      return withRetry(async () => {
        const { data, error } = await supabase
          .from('client_notifications')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) throw new Error(`Error fetching client notifications: ${error.message}`);
        return data as ClientNotification[];
      });
    },
    enabled: !!projectId,
  });

  /**
   * Create a new client notification
   */
  const createNotification = useMutation({
    mutationFn: async (notification: Omit<ClientNotification, 'id' | 'created_at'>) => {
      return withRetry(async () => {
        const { data, error } = await supabase
          .from('client_notifications')
          .insert(notification)
          .select()
          .single();

        if (error) throw new Error(`Error creating notification: ${error.message}`);
        return data as ClientNotification;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-notifications', projectId] });
      toast.success('Notification created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create notification', {
        description: error.message
      });
    }
  });

  /**
   * Send a notification
   */
  const sendNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      return withRetry(async () => {
        const { data, error } = await supabase.functions.invoke('notifications-api', {
          body: { 
            action: 'send-client-notification',
            notificationId 
          }
        });

        if (error) throw new Error(`Error sending notification: ${error.message}`);
        return data;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-notifications', projectId] });
      toast.success('Notification sent successfully');
    },
    onError: (error) => {
      toast.error('Failed to send notification', {
        description: error.message
      });
    }
  });

  /**
   * Delete a notification
   */
  const deleteNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      return withRetry(async () => {
        const { error } = await supabase
          .from('client_notifications')
          .delete()
          .eq('id', notificationId);

        if (error) throw new Error(`Error deleting notification: ${error.message}`);
        return true;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-notifications', projectId] });
      toast.success('Notification deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete notification', {
        description: error.message
      });
    }
  });

  return {
    notifications,
    isLoading,
    error,
    createNotification,
    sendNotification,
    deleteNotification,
    refetch,
  };
};
