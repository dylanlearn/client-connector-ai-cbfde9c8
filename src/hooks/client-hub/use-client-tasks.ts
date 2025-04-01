
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (clientToken && designerId) {
      loadClientTasks(clientToken, designerId);
    }
  }, [clientToken, designerId]);

  const loadClientTasks = async (token: string, dId: string) => {
    setIsLoadingTasks(true);
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
      }
    } catch (error) {
      console.error("Error loading client tasks:", error);
      toast.error("Failed to load your tasks. Please try again.");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const markTaskCompleted = async (task: string) => {
    const taskObj = tasks?.find(t => t.taskType === task);
    if (!taskObj) {
      toast.error(`Task not found for ${task}`);
      return;
    }
    
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
      toast.error("Failed to update task status. Please try again.");
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
    markTaskCompleted
  };
}
