
/**
 * Service for managing client link statuses
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Updates the status of a client access link
 * @param linkId The ID of the client link to update
 * @param status The new status to set
 * @returns A boolean indicating whether the update was successful
 */
export const updateClientLinkStatus = async (
  linkId: string, 
  status: 'active' | 'completed' | 'expired'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('client_access_links')
      .update({ 
        status,
        // If marking as completed, add completed timestamp
        ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {})
      })
      .eq('id', linkId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating client link status:", error);
    throw error;
  }
};

/**
 * Permanently deletes a client link and all associated data
 * @param linkId The ID of the client link to delete
 * @returns A boolean indicating whether the deletion was successful
 */
export const deleteClientLink = async (linkId: string): Promise<boolean> => {
  try {
    // First delete associated tasks to avoid foreign key constraints
    const { error: tasksError } = await supabase
      .from('client_tasks')
      .delete()
      .eq('link_id', linkId);
    
    if (tasksError) {
      throw tasksError;
    }
    
    // Then delete delivery records
    const { error: deliveryError } = await supabase
      .from('client_link_deliveries')
      .delete()
      .eq('link_id', linkId);
    
    if (deliveryError) {
      throw deliveryError;
    }
    
    // Finally delete the link itself
    const { error } = await supabase
      .from('client_access_links')
      .delete()
      .eq('id', linkId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting client link:", error);
    throw error;
  }
};

/**
 * Soft-deletes a project by setting its status to archived
 * @param projectId The ID of the project to archive
 * @returns A boolean indicating whether the update was successful
 */
export const archiveProject = async (projectId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'archived' })
      .eq('id', projectId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error archiving project:", error);
    throw error;
  }
};

/**
 * Permanently deletes a project and optionally its associated client links
 * @param projectId The ID of the project to delete
 * @param deleteClientLinks Whether to also delete associated client links
 * @returns A boolean indicating whether the deletion was successful
 */
export const deleteProject = async (
  projectId: string, 
  deleteClientLinks: boolean = false
): Promise<boolean> => {
  try {
    if (deleteClientLinks) {
      // First get all client links associated with this project
      const { data: links, error: linksError } = await supabase
        .from('client_access_links')
        .select('id')
        .eq('project_id', projectId);
      
      if (linksError) {
        throw linksError;
      }
      
      // Delete each client link
      for (const link of links || []) {
        await deleteClientLink(link.id);
      }
    } else {
      // Just unlink the project from client links
      const { error: updateError } = await supabase
        .from('client_access_links')
        .update({ project_id: null })
        .eq('project_id', projectId);
      
      if (updateError) {
        throw updateError;
      }
    }
    
    // Finally delete the project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
