
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Setup Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function verifyAdminUser(authHeader: string | null) {
  if (!authHeader) {
    throw new Error('No authorization header');
  }

  // Get the user from the authorization header
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  
  if (userError || !user) {
    throw new Error('Invalid token or user not found');
  }

  // Check if the user is an admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw new Error(`Error fetching profile: ${profileError.message}`);
  }

  if (profile.role !== 'pro') {
    throw new Error('Unauthorized: Admin access required');
  }

  return user;
}
