
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Verifies if a user is an admin based on their JWT token
 * @param authHeader Authorization header from the request
 * @returns The user ID if verified, throws error otherwise
 */
export async function verifyAdminUser(authHeader: string | null): Promise<string> {
  if (!authHeader) {
    throw new Error('Authorization header is required');
  }

  // Extract the token from the Authorization header
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Verify the JWT token
    const { data: { user }, error: jwtError } = await supabase.auth.getUser(token);
    
    if (jwtError || !user) {
      console.error('JWT verification failed:', jwtError);
      throw new Error('Invalid authentication token');
    }
    
    const userId = user.id;
    console.log(`User verified successfully`, { userId });
    
    // Check if the user has admin role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role, subscription_status, email')
      .eq('id', userId)
      .single();
      
    if (profileError || !profileData) {
      console.error('Failed to fetch profile data:', profileError);
      throw new Error('Failed to verify user role');
    }
    
    console.log(`Profile data retrieved`, { profileData, userId });
    
    // Check if user is an admin
    if (profileData.role !== 'admin') {
      console.error('User is not an admin', { role: profileData.role });
      throw new Error('Admin access required');
    }
    
    console.log(`User is admin, granting full access`, { userId });
    
    return userId;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}
