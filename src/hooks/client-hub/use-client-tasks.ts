
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getClientTasks, updateTaskStatus, ClientTask, TaskStatus } from '@/utils/client-service';

/**
 * Hook that handles client tasks operations
 */
export function useClientTasks(clientToken: string | null, designerId: string | null) {
  const [tasks, setTasks] = useState<ClientTask[] | null>(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [taskStatus, setTaskStatus] = useState({
    intakeForm: false,
    designPicker: false,
    templates: false
  });
  const [error, setError] = useState<Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);

  const loadClientTasks = useCallback(async (token: string, dId: string) => {
    // Prevent multiple rapid loads within 2 seconds (debounce)
    const now = Date.now();
    if (now - lastLoadTime < 2000 && tasks !== null) {
      return;
    }
    
    setIsLoadingTasks(true);
    setError(null);
    setLastLoadTime(now);
    
    try {
      const clientTasks = await getClientTasks(token, dId);
      if (clientTasks) {
        setTasks(clientTasks);
        
        const statusMap = {
          intakeForm: false,
          designPicker: false,
          templates: false
        };
        
        clientTasks.forEach(task => {
          if (task.taskType in statusMap && task.status === 'completed') {
            statusMap[task.taskType as keyof typeof statusMap] = true;
          }
        });
        
        setTaskStatus(statusMap);
      } else {
        setError(new Error('No tasks were found'));
      }
    } catch (error) {
      console.error("Error loading client tasks:", error);
      // Only show toast if this is the first load attempt
      if (tasks === null) {
        toast.error("Failed to load your tasks. Please try again later.");
      }
      setError(error instanceof Error ? error : new Error('Unknown error loading tasks'));
    } finally {
      setIsLoadingTasks(false);
    }
  }, [tasks, lastLoadTime]);

  useEffect(() => {
    if (clientToken && designerId) {
      loadClientTasks(clientToken, designerId);
    }
  }, [clientToken, designerId, loadClientTasks]);

  const markTaskCompleted = async (task: string) => {
    if (isUpdating) {
      return; // Silently return to avoid multiple updates
    }
    
    setIsUpdating(true);
    setError(null);
    
    const taskObj = tasks?.find(t => t.taskType === task);
    if (!taskObj) {
      setError(new Error(`Task not found: ${task}`));
      setIsUpdating(false);
      return;
    }
    
    // Don't update if already completed
    if (taskObj.status === 'completed') {
      setIsUpdating(false);
      return;
    }
    
    try {
      const success = await updateTaskStatus(taskObj.id, 'completed');
      if (success) {
        const updatedStatus = { ...taskStatus, [task]: true };
        setTaskStatus(updatedStatus);
        
        if (tasks) {
          const updatedTasks = tasks.map(t => 
            t.id === taskObj.id 
              ? { ...t, status: 'completed' as TaskStatus, completedAt: new Date() } 
              : t
          );
          setTasks(updatedTasks);
        }
        
        toast.success(`Task "${getTaskName(task)}" marked as completed.`);
      } else {
        throw new Error('Failed to update task status');
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status. Please try again later.");
      setError(error instanceof Error ? error : new Error('Unknown error updating task'));
    } finally {
      setIsUpdating(false);
    }
  };

  const getTaskName = (taskType: string): string => {
    switch (taskType) {
      case 'intakeForm': return 'Project Intake Form';
      case 'designPicker': return 'Design Preferences';
      case 'templates': return 'Templates';
      default: return taskType;
    }
  };

  return {
    tasks,
    isLoadingTasks,
    taskStatus,
    loadClientTasks,
    markTaskCompleted,
    error,
    isUpdating
  };
}
