
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

export async function verifyUser(req, supabase) {
  // Get the authorization header from the request
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { user: null, error: new Error('No authorization header') };
  }

  // Get the user from the authorization header
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  
  if (userError) {
    return { user: null, error: userError };
  }
  
  return { user, error: null };
}
