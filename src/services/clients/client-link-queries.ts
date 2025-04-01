
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

    return data.map(link => ({
      id: link.id,
      designerId: link.designer_id,
      projectId: link.project_id,
      projectTitle: link.project_id ? projectTitles[link.project_id] || null : null,
      clientName: link.client_name,
      clientEmail: link.client_email,
      clientPhone: link.client_phone,
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
