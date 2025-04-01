
import { useState } from 'react';
import { useClientAccess } from './client-hub/use-client-access';
import { useClientTasks } from './client-hub/use-client-tasks';
import { useRealtimeUpdates } from './client-hub/use-realtime-updates';
import { useNavigation } from './client-hub/use-navigation';
import { updateTaskStatus } from '@/utils/client-service';

/**
 * Main hook for client hub functionality
 * This combines smaller hooks into a complete solution
 */
export function useClientHub() {
  // Get client access information
  const { 
    clientToken, 
    designerId, 
    isValidatingAccess, 
    accessDenied 
  } = useClientAccess();
  
  // Get client tasks
  const { 
    tasks, 
    isLoadingTasks, 
    taskStatus, 
    markTaskCompleted 
  } = useClientTasks(clientToken, designerId);
  
  // Set up state for realtime updates
  const [updatedTasks, setUpdatedTasks] = useState(tasks);
  const [updatedTaskStatus, setUpdatedTaskStatus] = useState(taskStatus);
  
  // Handle realtime updates
  useRealtimeUpdates(
    clientToken,
    designerId,
    tasks,
    setUpdatedTasks as any, // Cast needed due to null type
    taskStatus,
    setUpdatedTaskStatus
  );
  
  // Handle navigation
  const { navigateTo } = useNavigation();

  // Handle task button click
  const handleTaskButtonClick = (taskType: string, path: string) => {
    const task = tasks?.find(t => t.taskType === taskType);
    if (!task) {
      console.error(`Task not found for ${taskType}`);
      return;
    }
    
    if (task.status !== 'completed') {
      updateTaskStatus(task.id, 'in_progress');
    }
    
    navigateTo(path, clientToken, designerId, task.id);
    markTaskCompleted(taskType);
  };

  return {
    clientToken,
    designerId,
    isValidatingAccess,
    taskStatus: updatedTaskStatus || taskStatus,
    tasks: updatedTasks || tasks,
    isLoadingTasks,
    accessDenied,
    handleTaskButtonClick
  };
}
