
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get the user from the authorization header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid token or user not found');
    }

    // Check if the request is for upgrading team members (should only be done once)
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role: 'pro',
        subscription_status: 'pro'  
      })
      .eq('subscription_status', 'free');

    if (error) {
      throw error;
    }

    // Also update the subscriptions table to ensure subscription data is consistent
    await supabase
      .from('subscriptions')
      .upsert(
        await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'pro')
          .then(({ data }) => 
            data?.map(profile => ({
              user_id: profile.id,
              subscription_status: 'pro',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
              cancel_at_period_end: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })) || []
          )
      );

    return new Response(JSON.stringify({ success: true, message: "Team members upgraded to pro" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error upgrading team members:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
