
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createRealtimeSubscription } from '@/utils/realtime-utils';
import { ClientTask, TaskStatus } from '@/types/client';

/**
 * Hook that handles real-time updates for client tasks
 */
export function useRealtimeUpdates(
  clientToken: string | null, 
  designerId: string | null,
  tasks: ClientTask[] | null,
  setTasks: React.Dispatch<React.SetStateAction<ClientTask[] | null>>,
  taskStatus: { [key: string]: boolean },
  setTaskStatus: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) {
  const [realtimeError, setRealtimeError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!clientToken || !designerId) return;
    
    setRealtimeError(null);
    
    try {
      // Set up real-time subscription for task updates
      const { unsubscribe } = createRealtimeSubscription(
        'client-tasks-updates',
        'client_tasks',
        `link_id=in.(select id from client_access_links where token='${clientToken}' and designer_id='${designerId}')`, 
        (payload) => {
          console.log('Task updated in real-time:', payload);
          setIsConnected(true);
          
          if (payload.new && tasks) {
            try {
              // Update the tasks array with the new task
              const taskId = payload.new.id;
              const updatedTasks = tasks.map(task => 
                task.id === taskId 
                  ? { 
                      ...task, 
                      status: payload.new.status as TaskStatus,
                      completedAt: payload.new.completed_at ? new Date(payload.new.completed_at) : null,
                      designerNotes: payload.new.designer_notes
                    }
                  : task
              );
              
              setTasks(updatedTasks);
              
              // Update task status
              if (payload.new.status === 'completed') {
                const taskType = payload.new.task_type;
                if (taskType in taskStatus) {
                  setTaskStatus(prev => ({
                    ...prev,
                    [taskType]: true
                  }));
                  
                  toast.success(`Task "${getTaskName(taskType)}" completed!`);
                }
              }
            } catch (error) {
              console.error("Error processing realtime update:", error);
              setRealtimeError(error instanceof Error ? error : new Error('Error processing realtime update'));
            }
          }
        },
        (error) => {
          console.error("Realtime subscription error:", error);
          setRealtimeError(error instanceof Error ? error : new Error('Realtime subscription error'));
          setIsConnected(false);
        }
      );
      
      // Set a timeout to check if we've connected successfully
      const connectionTimeout = setTimeout(() => {
        if (!isConnected) {
          console.warn("Realtime connection not established in expected time");
          setRealtimeError(new Error('Realtime connection timeout'));
        }
      }, 5000);
      
      return () => {
        clearTimeout(connectionTimeout);
        unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
      setRealtimeError(error instanceof Error ? error : new Error('Error setting up realtime subscription'));
      return () => {};
    }
  }, [clientToken, designerId, tasks, setTasks, taskStatus, setTaskStatus, isConnected]);

  const getTaskName = (taskType: string): string => {
    switch (taskType) {
      case 'intakeForm': return 'Project Intake Form';
      case 'designPicker': return 'Design Preferences';
      case 'templates': return 'Templates';
      default: return taskType;
    }
  };
  
  return { realtimeError, isConnected };
}
