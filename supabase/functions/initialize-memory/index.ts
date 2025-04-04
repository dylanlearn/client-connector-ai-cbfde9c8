
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Initialize Supabase client
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
      throw new Error('Missing authorization header');
    }

    // Get the user from the authorization header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error(userError?.message || 'Unauthorized');
    }

    // Get the project ID from the request body
    const { projectId } = await req.json();
    
    if (!projectId) {
      throw new Error('Missing project ID');
    }

    // Initialize project memory
    await initializeProjectMemory(user.id, projectId);
    
    return new Response(
      JSON.stringify({ success: true, message: "Memory initialized successfully" }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error initializing memory:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to initialize memory" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

/**
 * Initializes memory for a project by storing essential context and preferences
 */
async function initializeProjectMemory(userId: string, projectId: string) {
  // First, get project details
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  if (projectError) {
    throw new Error(`Failed to retrieve project: ${projectError.message}`);
  }

  // Next, store project context in project_memories table
  await supabase
    .from('project_memories')
    .insert([
      {
        project_id: projectId,
        user_id: userId,
        category: 'project_context',
        content: `Project title: ${project.title}. Client: ${project.client_name}. Type: ${project.project_type}. Description: ${project.description || 'No description provided'}`,
        metadata: {
          source: 'initialization',
          project_data: {
            title: project.title,
            client: project.client_name,
            type: project.project_type
          }
        }
      }
    ]);
  
  // Record user preferences if they exist
  const { data: preferences } = await supabase
    .from('design_preferences')
    .select('*')
    .eq('user_id', userId)
    .limit(5);
  
  if (preferences && preferences.length > 0) {
    await supabase
      .from('project_memories')
      .insert([
        {
          project_id: projectId,
          user_id: userId,
          category: 'design_preferences',
          content: `User prefers design options: ${preferences.map(p => p.title).join(', ')}`,
          metadata: {
            source: 'initialization',
            preference_data: preferences
          }
        }
      ]);
  }
  
  return true;
}
