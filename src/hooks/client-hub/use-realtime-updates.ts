
import { useEffect } from 'react';
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
  useEffect(() => {
    if (!clientToken || !designerId) return;
    
    // Set up real-time subscription for task updates
    const { unsubscribe } = createRealtimeSubscription(
      'client-tasks-updates',
      'client_tasks',
      `link_id=in.(select id from client_access_links where token='${clientToken}' and designer_id='${designerId}')`, 
      (payload) => {
        console.log('Task updated in real-time:', payload);
        
        if (payload.new && tasks) {
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
        }
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, [clientToken, designerId, tasks, setTasks, taskStatus, setTaskStatus]);

  const getTaskName = (taskType: string): string => {
    switch (taskType) {
      case 'intakeForm': return 'Project Intake Form';
      case 'designPicker': return 'Design Preferences';
      case 'templates': return 'Templates';
      default: return taskType;
    }
  };
}
