
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ClientTask, TaskStatus, ClientTaskProgress } from "@/types/client";

// Create default tasks for a new client
export const createDefaultClientTasks = async (linkId: string): Promise<void> => {
  try {
    const defaultTasks = [
      { 
        link_id: linkId, 
        task_type: 'intakeForm', 
        designer_notes: 'Please complete the intake form to help us understand your project needs.',
        status: 'pending'
      },
      { 
        link_id: linkId, 
        task_type: 'designPicker', 
        designer_notes: 'Select design elements that match your style preferences.',
        status: 'pending'
      },
      { 
        link_id: linkId, 
        task_type: 'templates', 
        designer_notes: 'Browse our template marketplace for inspiration.',
        status: 'pending'
      }
    ];
    
    const { error } = await supabase
      .from('client_tasks')
      .insert(defaultTasks);

    if (error) {
      console.error('Error creating default client tasks:', error);
    }
  } catch (error) {
    console.error('Error in createDefaultClientTasks:', error);
  }
};

// Get client tasks from a specific link
export const getClientTasks = async (
  token: string,
  designerId: string
): Promise<ClientTask[] | null> => {
  try {
    // First get the link id
    const { data: linkData, error: linkError } = await supabase
      .from('client_access_links')
      .select('id')
      .eq('token', token)
      .eq('designer_id', designerId)
      .maybeSingle();

    if (linkError || !linkData) {
      console.error('Error getting client link:', linkError);
      return null;
    }

    // Then get the tasks
    const { data, error } = await supabase
      .from('client_tasks')
      .select('*')
      .eq('link_id', linkData.id);

    if (error) {
      console.error('Error getting client tasks:', error);
      return null;
    }

    // Map the data to ClientTask format
    const clientTasks: ClientTask[] = data.map(task => {
      const mappedTask: ClientTask = {
        id: task.id,
        title: getTaskTitle(task.task_type),
        description: getTaskDescription(task.task_type),
        type: task.task_type,
        status: task.status as TaskStatus,
        completionPercentage: task.status === 'completed' ? 100 : 0,
        clientId: linkData.id,
        
        // Additional properties
        linkId: task.link_id,
        taskType: task.task_type as 'intakeForm' | 'designPicker' | 'templates',
        completedAt: task.completed_at ? new Date(task.completed_at) : null,
        designerNotes: task.designer_notes,
        clientResponse: task.client_response,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at)
      };
      
      return mappedTask;
    });
    
    return clientTasks;
  } catch (error) {
    console.error('Error in getClientTasks:', error);
    return null;
  }
};

// Helper functions for task display
function getTaskTitle(taskType: string): string {
  switch (taskType) {
    case 'intakeForm': return 'Complete Project Intake Form';
    case 'designPicker': return 'Select Design Preferences';
    case 'templates': return 'Browse Template Options';
    default: return taskType;
  }
}

function getTaskDescription(taskType: string): string {
  switch (taskType) {
    case 'intakeForm': return 'Tell us about your business and project goals';
    case 'designPicker': return 'Help us understand your design preferences';
    case 'templates': return 'Find templates that match your style';
    default: return '';
  }
}

// Update task status - optimized for speed
export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus,
  clientResponse?: any
): Promise<boolean> => {
  try {
    const updateData: any = { 
      status: status
    };
    
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }
    
    if (clientResponse) {
      updateData.client_response = clientResponse;
    }
    
    const { error } = await supabase
      .from('client_tasks')
      .update(updateData)
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateTaskStatus:', error);
    return false;
  }
};

// Get client tasks progress for a specific link
export const getClientTasksProgress = async (linkId: string): Promise<ClientTaskProgress | null> => {
  try {
    // First get client information from the link
    const { data: linkData, error: linkError } = await supabase
      .from('client_access_links')
      .select('client_name, client_email')
      .eq('id', linkId)
      .maybeSingle();

    if (linkError || !linkData) {
      console.error('Error getting client information:', linkError);
      return null;
    }

    // Then get task information
    const { data, error } = await supabase
      .from('client_tasks')
      .select('task_type, status')
      .eq('link_id', linkId);

    if (error) {
      console.error('Error getting client tasks progress:', error);
      return null;
    }

    const completedTasks = data.filter(task => task.status === 'completed').length;
    const totalTasks = data.length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const progress: ClientTaskProgress = {
      completed: completedTasks,
      total: totalTasks,
      percentage: percentage,
      intakeForm: data.find(t => t.task_type === 'intakeForm')?.status === 'completed',
      designPicker: data.find(t => t.task_type === 'designPicker')?.status === 'completed',
      templates: data.find(t => t.task_type === 'templates')?.status === 'completed',
      clientName: linkData.client_name,
      email: linkData.client_email,
      linkId: linkId
    };

    return progress;
  } catch (error) {
    console.error('Error in getClientTasksProgress:', error);
    return null;
  }
};
