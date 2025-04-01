
import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { setupRealtimeForClientTables } from "@/utils/realtime-utils";

export function useRealtimeSubscriptions(
  userId: string | undefined, 
  onLinkChange: () => void
) {
  useEffect(() => {
    if (!userId) return;
    
    // Initialize realtime setup
    setupRealtimeForClientTables().catch(error => {
      console.error("Error setting up realtime:", error);
    });
    
    // Set up real-time subscription for client links changes
    const linksChannel = supabase.channel('public:client_access_links')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_access_links',
          filter: `designer_id=eq.${userId}`
        },
        (payload) => {
          console.log('Client links changed:', payload);
          // Reload links when changes occur
          onLinkChange();
          
          // Show toast notification based on the event
          if (payload.eventType === 'INSERT') {
            toast.info(`New client link created`);
          } else if (payload.eventType === 'UPDATE') {
            // Only show toast if status changed (e.g., from active to expired)
            const oldStatus = (payload.old as any).status;
            const newStatus = (payload.new as any).status;
            if (oldStatus !== newStatus) {
              toast.info(`Client link status changed to ${newStatus}`);
            }
          }
        }
      )
      .subscribe();
      
    // Set up real-time subscription for client tasks changes
    const tasksChannel = supabase.channel('public:client_tasks')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'client_tasks',
          filter: `status=eq.completed`
        },
        async (payload) => {
          // We need to check if this task belongs to one of our clients
          try {
            const { data: linkData, error } = await supabase
              .from('client_access_links')
              .select('client_name, client_email, project_id')
              .eq('id', (payload.new as any).link_id)
              .eq('designer_id', userId)
              .single();
              
            if (error) {
              console.error("Error fetching link data:", error);
              return;
            }
              
            if (linkData) {
              const taskType = (payload.new as any).task_type;
              const taskName = taskType === 'intakeForm' 
                ? 'Project Intake Form' 
                : taskType === 'designPicker' 
                  ? 'Design Preferences' 
                  : 'Template Selection';
              
              let notificationMessage = `${linkData.client_name} completed ${taskName}`;
              
              if (linkData.project_id) {
                const { data: projectData, error: projectError } = await supabase
                  .from('projects')
                  .select('title')
                  .eq('id', linkData.project_id)
                  .single();
                  
                if (!projectError && projectData) {
                  notificationMessage += ` for project "${projectData.title}"`;
                }
              }
              
              toast.success(notificationMessage);
            }
          } catch (error) {
            // Silently fail - likely means this task isn't related to this designer
            console.log('Task update not relevant to current user or error occurred:', error);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(linksChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [userId, onLinkChange]);
}
