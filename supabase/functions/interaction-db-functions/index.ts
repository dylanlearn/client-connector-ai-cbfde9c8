
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Setup table permissions for private data with RLS policies
    const setupTablePermissions = async () => {
      // Ensure RLS is enabled on the interaction_events table
      await supabase.rpc('stored_procedure', {
        sql: `
          -- Enable Row Level Security
          ALTER TABLE IF EXISTS public.interaction_events ENABLE ROW LEVEL SECURITY;
          
          -- Drop any existing policies
          DROP POLICY IF EXISTS "Users can view their own interactions" ON public.interaction_events;
          DROP POLICY IF EXISTS "Users can insert their own interactions" ON public.interaction_events;
          DROP POLICY IF EXISTS "Admins can view all interactions" ON public.interaction_events;
          
          -- Create policy for users to view their own interactions
          CREATE POLICY "Users can view their own interactions" 
            ON public.interaction_events 
            FOR SELECT 
            USING (auth.uid() = user_id);
          
          -- Create policy for users to insert their own interactions
          CREATE POLICY "Users can insert their own interactions" 
            ON public.interaction_events 
            FOR INSERT 
            WITH CHECK (auth.uid() = user_id);
            
          -- Create policy for admins to view all interactions
          CREATE POLICY "Admins can view all interactions" 
            ON public.interaction_events 
            FOR SELECT 
            USING (
              EXISTS (
                SELECT 1 FROM auth.users
                WHERE id = auth.uid() AND (role = 'admin')
              )
            );
        `
      });
    };
    
    await setupTablePermissions();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Interaction table RLS policies configured successfully",
        details: "Policies ensure users can only see their own interaction data, while admins can see all data."
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error configuring interaction tables:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
