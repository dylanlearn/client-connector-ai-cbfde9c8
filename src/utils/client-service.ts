
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ClientAccessLink, ClientTask, TaskStatus } from "@/types/client";

// Generate a unique token for client access
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Create a new client access link
export const createClientAccessLink = async (
  designerId: string,
  clientEmail: string,
  clientName: string
): Promise<string | null> => {
  try {
    // Create an expiry date 14 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);
    
    const token = generateToken();
    
    const { data, error } = await supabase
      .from('client_access_links')
      .insert({
        designer_id: designerId,
        client_email: clientEmail,
        client_name: clientName,
        token: token,
        expires_at: expiresAt.toISOString(),
        status: 'active'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating client access link:', error);
      toast.error('Failed to create client access link');
      return null;
    }

    // Create default tasks for this client
    await createDefaultClientTasks(data.id);
    
    // Return the sharable link
    const baseUrl = window.location.origin;
    return `${baseUrl}/client-hub?clientToken=${token}&designerId=${designerId}`;
  } catch (error) {
    console.error('Error in createClientAccessLink:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Create default tasks for a new client
const createDefaultClientTasks = async (linkId: string): Promise<void> => {
  try {
    const defaultTasks = [
      { task_type: 'intakeForm', designer_notes: 'Please complete the intake form to help us understand your project needs.' },
      { task_type: 'designPicker', designer_notes: 'Select design elements that match your style preferences.' },
      { task_type: 'templates', designer_notes: 'Browse our template marketplace for inspiration.' }
    ];
    
    const { error } = await supabase
      .from('client_tasks')
      .insert(defaultTasks.map(task => ({
        link_id: linkId,
        task_type: task.task_type,
        designer_notes: task.designer_notes,
        status: 'pending'
      })));

    if (error) {
      console.error('Error creating default client tasks:', error);
    }
  } catch (error) {
    console.error('Error in createDefaultClientTasks:', error);
  }
};

// Validate a client token and update last accessed timestamp
export const validateClientToken = async (
  token: string,
  designerId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('client_access_links')
      .select('id, expires_at, status')
      .eq('token', token)
      .eq('designer_id', designerId)
      .eq('status', 'active');

    if (error || !data || data.length === 0) {
      console.error('Error validating client token:', error);
      return false;
    }

    // Check if the link has expired
    const expiresAt = new Date(data[0].expires_at);
    if (expiresAt < new Date()) {
      console.log('Client access link has expired');
      return false;
    }

    // Update last accessed timestamp
    await supabase
      .from('client_access_links')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', data[0].id);

    return true;
  } catch (error) {
    console.error('Error in validateClientToken:', error);
    return false;
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
      .eq('designer_id', designerId);

    if (linkError || !linkData || linkData.length === 0) {
      console.error('Error getting client link:', linkError);
      return null;
    }

    // Then get the tasks
    const { data, error } = await supabase
      .from('client_tasks')
      .select('*')
      .eq('link_id', linkData[0].id);

    if (error) {
      console.error('Error getting client tasks:', error);
      return null;
    }

    return data.map(task => ({
      id: task.id,
      linkId: task.link_id,
      taskType: task.task_type as 'intakeForm' | 'designPicker' | 'templates',
      status: task.status as TaskStatus,
      completedAt: task.completed_at ? new Date(task.completed_at) : null,
      designerNotes: task.designer_notes,
      clientResponse: task.client_response,
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.updated_at)
    }));
  } catch (error) {
    console.error('Error in getClientTasks:', error);
    return null;
  }
};

// Update task status
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

// Get all client links for a designer
export const getClientLinks = async (designerId: string): Promise<ClientAccessLink[] | null> => {
  try {
    const { data, error } = await supabase
      .from('client_access_links')
      .select('*')
      .eq('designer_id', designerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting client links:', error);
      return null;
    }

    return data.map(link => ({
      id: link.id,
      designerId: link.designer_id,
      clientEmail: link.client_email,
      clientName: link.client_name,
      token: link.token,
      createdAt: new Date(link.created_at),
      expiresAt: new Date(link.expires_at),
      lastAccessedAt: link.last_accessed_at ? new Date(link.last_accessed_at) : null,
      status: link.status
    }));
  } catch (error) {
    console.error('Error in getClientLinks:', error);
    return null;
  }
};

// Get client tasks progress for a specific link
export const getClientTasksProgress = async (linkId: string): Promise<Record<string, boolean> | null> => {
  try {
    const { data, error } = await supabase
      .from('client_tasks')
      .select('task_type, status')
      .eq('link_id', linkId);

    if (error) {
      console.error('Error getting client tasks progress:', error);
      return null;
    }

    const progress: Record<string, boolean> = {};
    data.forEach(task => {
      progress[task.task_type] = task.status === 'completed';
    });

    return progress;
  } catch (error) {
    console.error('Error in getClientTasksProgress:', error);
    return null;
  }
};
