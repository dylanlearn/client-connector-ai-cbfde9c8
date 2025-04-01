
/**
 * Functions for validating client access tokens
 */

import { supabase } from "@/integrations/supabase/client";

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
