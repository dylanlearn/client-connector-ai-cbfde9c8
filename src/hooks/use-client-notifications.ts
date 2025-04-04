
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientNotification } from '@/types/client-notification';
import { toast } from 'sonner';
import { Project } from '@/types/project';

export const useClientNotifications = (projectId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['client-notifications', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('client_notifications')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching client notifications:', error);
        throw error;
      }
      
      return data as ClientNotification[];
    },
    enabled: !!projectId,
  });

  const createNotification = useMutation({
    mutationFn: async ({
      project, 
      type, 
      message,
      metadata
    }: {
      project: Project;
      type: ClientNotification['notification_type'];
      message: string;
      metadata?: Record<string, any>;
    }) => {
      const { data, error } = await supabase
        .from('client_notifications')
        .insert({
          project_id: project.id,
          client_email: project.client_email,
          notification_type: type,
          message: message,
          metadata: metadata || {},
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }

      // Here we would typically call an edge function to send the actual email
      // For now, we'll just update the notification as "sent" for demo purposes
      await supabase
        .from('client_notifications')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', data.id);
      
      return data as ClientNotification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-notifications', projectId] });
      toast.success('Client notification sent successfully');
    },
    onError: (error) => {
      console.error('Create notification error:', error);
      toast.error('Failed to send client notification');
    }
  });

  const notifyStatusChange = async (project: Project, previousStatus: string) => {
    return createNotification.mutateAsync({
      project,
      type: 'status_change',
      message: `Your project "${project.title}" status has been updated from ${previousStatus} to ${project.status}.`,
      metadata: { previousStatus, newStatus: project.status }
    });
  };

  const notifyFileUploaded = async (project: Project, fileName: string) => {
    return createNotification.mutateAsync({
      project,
      type: 'file_uploaded',
      message: `A new file "${fileName}" has been added to your project "${project.title}".`,
      metadata: { fileName }
    });
  };

  return {
    notifications,
    isLoading,
    error,
    createNotification,
    notifyStatusChange,
    notifyFileUploaded,
  };
};
