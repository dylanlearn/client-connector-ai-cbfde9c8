
import { ClientTask, ClientTaskProgress, TaskStatus } from "@/types/client";

/**
 * Utility functions for client tasks
 */

/**
 * Calculate the completion percentage for client tasks
 * @param tasks Array of client tasks
 * @returns Completion percentage as a number
 */
export const calculateTaskCompletionPercentage = (tasks: ClientTask[]): number => {
  if (!tasks.length) return 0;
  
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  return Math.round((completedTasks / tasks.length) * 100);
};

/**
 * Get a formatted status label for a client task
 * @param status Task status
 * @returns Formatted status string
 */
export const getTaskStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in_progress':
      return 'In Progress';
    case 'pending':
      return 'To Do';
    default:
      return status;
  }
};

/**
 * Check if a client has completed all required tasks
 * @param progress Client task progress
 * @returns Boolean indicating if all required tasks are complete
 */
export const hasCompletedRequiredTasks = (progress: ClientTaskProgress): boolean => {
  return progress.intakeForm && progress.designPicker;
};

/**
 * Get the next recommended task for a client
 * @param progress Client task progress
 * @returns Description of the next recommended task
 */
export const getNextRecommendedTask = (progress: ClientTaskProgress): string => {
  if (!progress.intakeForm) {
    return 'Complete the intake form';
  } else if (!progress.designPicker) {
    return 'Select design preferences';
  } else if (!progress.templates) {
    return 'Review template options';
  }
  return 'All tasks completed';
};
