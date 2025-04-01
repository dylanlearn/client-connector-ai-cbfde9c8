
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
      .eq('status', 'active')
      .maybeSingle();

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
