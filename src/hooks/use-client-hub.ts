
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
    accessDenied,
    error: accessError 
  } = useClientAccess();
  
  // Get client tasks
  const { 
    tasks, 
    isLoadingTasks, 
    taskStatus, 
    markTaskCompleted,
    error: tasksError,
    isUpdating
  } = useClientTasks(clientToken, designerId);
  
  // Set up state for realtime updates
  const [updatedTasks, setUpdatedTasks] = useState(tasks);
  const [updatedTaskStatus, setUpdatedTaskStatus] = useState(taskStatus);
  
  // Handle realtime updates
  const { realtimeError, isConnected } = useRealtimeUpdates(
    clientToken,
    designerId,
    tasks,
    setUpdatedTasks as any, // Cast needed due to null type
    taskStatus,
    setUpdatedTaskStatus
  );
  
  // Handle navigation
  const { navigateTo, navigationError } = useNavigation();

  // Unified error state
  const [errors, setErrors] = useState<{[key: string]: Error | null}>({});
  
  // Update unified error state
  useEffect(() => {
    const currentErrors = {
      access: accessError,
      tasks: tasksError,
      realtime: realtimeError,
      navigation: navigationError
    };
    
    setErrors(currentErrors);
    
    // Log errors for monitoring
    Object.entries(currentErrors).forEach(([key, error]) => {
      if (error) {
        console.error(`Client hub error (${key}):`, error);
      }
    });
    
    // Show toast for new errors (but avoid flooding)
    if (accessError && accessError !== errors.access) {
      toast.error("Access validation error. Please check your link and try again.");
    }
    
    if (tasksError && tasksError !== errors.tasks) {
      toast.error("Error loading your tasks. Please refresh the page.");
    }
    
    if (realtimeError && realtimeError !== errors.realtime) {
      toast.warning("Real-time updates unavailable. You may need to refresh to see changes.");
    }
    
    if (navigationError && navigationError !== errors.navigation) {
      toast.error("Navigation error. Please try again.");
    }
  }, [accessError, tasksError, realtimeError, navigationError, errors]);

  // Handle task button click
  const handleTaskButtonClick = async (taskType: string, path: string) => {
    if (!clientToken || !designerId) {
      toast.error("Unable to access this feature. Missing authorization.");
      return;
    }
    
    try {
      const task = tasks?.find(t => t.taskType === taskType);
      if (!task) {
        console.error(`Task not found for ${taskType}`);
        toast.error(`Task information not available. Please refresh the page.`);
        return;
      }
      
      if (task.status !== 'completed') {
        try {
          await updateTaskStatus(task.id, 'in_progress');
        } catch (error) {
          console.error("Error updating task status:", error);
          // Continue with navigation despite the error
        }
      }
      
      navigateTo(path, clientToken, designerId, task.id);
      
      try {
        await markTaskCompleted(taskType);
      } catch (error) {
        console.error("Error marking task as completed:", error);
        // Don't block the user experience if this fails
      }
    } catch (error) {
      console.error("Error in handleTaskButtonClick:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return {
    clientToken,
    designerId,
    isValidatingAccess,
    taskStatus: updatedTaskStatus || taskStatus,
    tasks: updatedTasks || tasks,
    isLoadingTasks,
    accessDenied,
    handleTaskButtonClick,
    isUpdating,
    errors,
    isRealtimeConnected: isConnected
  };
}
