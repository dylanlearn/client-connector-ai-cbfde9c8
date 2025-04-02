
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { createRealtimeSubscription } from '@/utils/realtime-utils';
import { ClientTask, TaskStatus } from '@/types/client';

/**
 * Hook that handles real-time updates for client tasks
 * Improved error handling and reconnection logic
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
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const tasksRef = useRef(tasks);
  const taskStatusRef = useRef(taskStatus);
  
  // Keep refs updated with latest values to avoid stale closures
  useEffect(() => {
    tasksRef.current = tasks;
    taskStatusRef.current = taskStatus;
  }, [tasks, taskStatus]);

  useEffect(() => {
    if (!clientToken || !designerId) return;
    
    let unsubscribeFunction: () => void = () => {};
    let connectionTimeoutId: ReturnType<typeof setTimeout>;
    let reconnectTimeoutId: ReturnType<typeof setTimeout>;
    
    const setupSubscription = () => {
      setRealtimeError(null);
      
      try {
        // Set up real-time subscription for task updates
        const { unsubscribe } = createRealtimeSubscription(
          `client-tasks-updates-${reconnectAttempt}`, // Add reconnect attempt to ensure unique channel name
          'client_tasks',
          `link_id=in.(select id from client_access_links where token='${clientToken}' and designer_id='${designerId}')`, 
          (payload) => {
            console.log('Task updated in real-time:', payload);
            setIsConnected(true);
            
            // Use the latest tasks from ref
            const currentTasks = tasksRef.current;
            if (payload.new && currentTasks) {
              try {
                // Update the tasks array with the new task
                const taskId = payload.new.id;
                const updatedTasks = currentTasks.map(task => 
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
                
                // Update task status if completed
                if (payload.new.status === 'completed') {
                  const taskType = payload.new.task_type;
                  const currentStatus = taskStatusRef.current;
                  
                  if (taskType in currentStatus && !currentStatus[taskType]) {
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
          }
        );
        
        unsubscribeFunction = unsubscribe;
        
        // Set a timeout to check if we've connected successfully
        connectionTimeoutId = setTimeout(() => {
          if (!isConnected) {
            console.warn("Realtime connection not established in expected time");
            
            // Only attempt reconnect if we haven't reached maximum attempts
            if (reconnectAttempt < 3) {
              console.log(`Attempting to reconnect (attempt ${reconnectAttempt + 1})...`);
              unsubscribeFunction();
              setReconnectAttempt(prev => prev + 1);
              reconnectTimeoutId = setTimeout(setupSubscription, 2000);
            } else {
              setRealtimeError(new Error('Failed to establish realtime connection after multiple attempts'));
            }
          }
        }, 5000);
        
      } catch (error) {
        console.error("Error setting up realtime subscription:", error);
        setRealtimeError(error instanceof Error ? error : new Error('Error setting up realtime subscription'));
      }
    };
    
    setupSubscription();
    
    return () => {
      clearTimeout(connectionTimeoutId);
      clearTimeout(reconnectTimeoutId);
      unsubscribeFunction();
    };
  }, [clientToken, designerId, reconnectAttempt, setTasks, setTaskStatus, isConnected]);

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
