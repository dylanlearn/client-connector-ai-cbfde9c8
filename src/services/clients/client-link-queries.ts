
/**
 * Functions for querying client links and related data
 */

import { supabase } from "@/integrations/supabase/client";
import { ClientAccessLink } from "@/types/client";

// Get all client links for a designer
export const getClientLinks = async (designerId: string): Promise<ClientAccessLink[] | null> => {
  try {
    // Use a simpler query first without the join that's causing issues
    const { data, error } = await supabase
      .from('client_access_links')
      .select('*')
      .eq('designer_id', designerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting client links:', error);
      return null;
    }

    // Then for links with project_id, fetch the project titles in a separate query
    const projectIds = data
      .filter(link => link.project_id)
      .map(link => link.project_id);
    
    let projectTitles: Record<string, string> = {};
    
    if (projectIds.length > 0) {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, title')
        .in('id', projectIds);
        
      if (!projectsError && projectsData) {
        projectTitles = projectsData.reduce((acc, project) => {
          acc[project.id] = project.title;
          return acc;
        }, {} as Record<string, string>);
      }
    }

    // Map to our ClientAccessLink interface format with camelCase properties
    return data.map(link => ({
      id: link.id,
      token: link.token,
      status: link.status as 'active' | 'expired' | 'used' | 'completed',
      created_at: link.created_at,
      expires_at: link.expires_at,
      project_id: link.project_id,
      
      // Additional mapped properties with camelCase
      designerId: link.designer_id,
      projectId: link.project_id,
      projectTitle: link.project_id ? projectTitles[link.project_id] || null : null,
      clientName: link.client_name,
      clientEmail: link.client_email,
      clientPhone: link.client_phone,
      createdAt: link.created_at,
      expiresAt: link.expires_at,
      lastAccessedAt: link.last_accessed_at || null,
      personalMessage: link.personal_message
    }));
  } catch (error) {
    console.error('Error in getClientLinks:', error);
    return null;
  }
};
