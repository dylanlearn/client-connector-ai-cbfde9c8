
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
    
    // Retry logic for token validation to handle intermittent connection issues
    let attempts = 0;
    let success = false;
    let data = null;
    let error = null;
    
    while (attempts < 3 && !success) {
      const result = await supabase
        .from('client_access_links')
        .select('id, expires_at, status')
        .eq('token', token)
        .eq('designer_id', designerId)
        .eq('status', 'active')
        .maybeSingle();
      
      data = result.data;
      error = result.error;
      
      if (error) {
        console.error(`Error validating client token (attempt ${attempts + 1}):`, error);
        attempts++;
        // Wait a bit before retrying
        if (attempts < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else {
        success = true;
      }
    }
    
    console.log('Token validation result:', data, error);

    if (error || !data) {
      console.error('Error validating client token after retries:', error);
      return false;
    }

    // Check if the link has expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      console.log('Client access link has expired');
      
      // Update the status to expired if it's still active
      if (data.status === 'active') {
        await supabase
          .from('client_access_links')
          .update({ status: 'expired' })
          .eq('id', data.id);
      }
      
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
