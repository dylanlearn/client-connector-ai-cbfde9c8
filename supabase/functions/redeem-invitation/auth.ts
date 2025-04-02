
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Setup Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function verifyUser(authHeader: string | null) {
  if (!authHeader) {
    throw new Error('No authorization header');
  }

  // Get the user from the authorization header
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  
  if (userError || !user) {
    throw new Error('Invalid token or user not found');
  }

  return user;
}

export async function verifyAdmin(userId: string) {
  // Check if the user has admin role
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
    
  if (error || !data) {
    return false;
  }
  
  return data.role === 'admin';
}
