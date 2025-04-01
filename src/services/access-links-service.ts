
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ClientAccessLink } from "@/types/client";
import { createDefaultClientTasks } from "./client-tasks-service";

// Generate a unique token for client access
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Create a new client access link
export const createClientAccessLink = async (
  designerId: string,
  clientEmail: string,
  clientName: string,
  clientPhone: string | null = null,
  deliveryMethods: { email: boolean, sms: boolean } = { email: true, sms: false },
  projectId: string | null = null
): Promise<{ link: string | null, linkId: string | null }> => {
  try {
    // Create an expiry date 7 days from now (changed from 14 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    const token = generateToken();
    
    const { data, error } = await supabase
      .from('client_access_links')
      .insert({
        designer_id: designerId,
        client_email: clientEmail,
        client_name: clientName,
        client_phone: clientPhone,
        project_id: projectId,
        token: token,
        expires_at: expiresAt.toISOString(),
        status: 'active'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating client access link:', error);
      toast.error('Failed to create client access link');
      return { link: null, linkId: null };
    }

    // Create default tasks for this client
    await createDefaultClientTasks(data.id);
    
    // Record delivery methods
    if (deliveryMethods.email) {
      await recordLinkDelivery(data.id, 'email', clientEmail);
    }
    
    if (deliveryMethods.sms && clientPhone) {
      await recordLinkDelivery(data.id, 'sms', clientPhone);
    }
    
    // Return the sharable link and the link ID
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/client-hub?clientToken=${token}&designerId=${designerId}`;
    return { link, linkId: data.id };
  } catch (error) {
    console.error('Error in createClientAccessLink:', error);
    toast.error('An unexpected error occurred');
    return { link: null, linkId: null };
  }
};

// Record a delivery attempt for a client link
export const recordLinkDelivery = async (
  linkId: string,
  deliveryType: 'email' | 'sms',
  recipient: string,
  status: string = 'pending'
): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc(
      'record_client_link_delivery',
      {
        p_link_id: linkId,
        p_delivery_type: deliveryType,
        p_recipient: recipient,
        p_status: status
      }
    );

    if (error) {
      console.error(`Error recording ${deliveryType} delivery:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in recordLinkDelivery for ${deliveryType}:`, error);
    return false;
  }
};

// Validate a client token and update last accessed timestamp
export const validateClientToken = async (
  token: string,
  designerId: string
): Promise<boolean> => {
  try {
    console.log('Validating token:', token, 'for designer:', designerId);
    
    if (!token || !designerId) {
      console.error('Missing token or designerId');
      return false;
    }
    
    const { data, error } = await supabase
      .from('client_access_links')
      .select('id, expires_at, status')
      .eq('token', token)
      .eq('designer_id', designerId)
      .eq('status', 'active')
      .maybeSingle();
    
    console.log('Token validation result:', data, error);

    if (error || !data) {
      console.error('Error validating client token:', error);
      return false;
    }

    // Check if the link has expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      console.log('Client access link has expired');
      return false;
    }

    // Update last accessed timestamp
    await supabase
      .from('client_access_links')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', data.id);

    return true;
  } catch (error) {
    console.error('Error in validateClientToken:', error);
    return false;
  }
};

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

// Get delivery information for a client link
export const getLinkDeliveries = async (linkId: string): Promise<any[] | null> => {
  try {
    const { data, error } = await supabase
      .from('client_link_deliveries')
      .select('*')
      .eq('link_id', linkId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting link deliveries:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getLinkDeliveries:', error);
    return null;
  }
};

// Resend a client link
export const resendClientLink = async (
  linkId: string,
  deliveryType: 'email' | 'sms',
  recipient: string
): Promise<boolean> => {
  try {
    const response = await supabase.functions.invoke('send-client-link', {
      body: {
        linkId,
        deliveryType,
        recipient
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return true;
  } catch (error) {
    console.error(`Error resending client link via ${deliveryType}:`, error);
    return false;
  }
};
