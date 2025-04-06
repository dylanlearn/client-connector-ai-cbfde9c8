
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client using the auth token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Extract the JWT token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Get the user from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid token or user not found');
    }
    
    // Process the request based on the HTTP method
    const { action, ...payload } = await req.json();
    
    switch (action) {
      case 'store':
        return await storeDesignMemory(supabase, user.id, payload);
      case 'retrieve':
        return await retrieveDesignMemory(supabase, user.id, payload.projectId);
      case 'update':
        return await updateDesignMemory(supabase, user.id, payload);
      default:
        throw new Error('Invalid action specified');
    }
  } catch (error) {
    console.error('Error in wireframe-design-memory function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function storeDesignMemory(supabase, userId, payload) {
  const { projectId, blueprintId, layoutPatterns, stylePreferences, componentPreferences } = payload;
  
  if (!projectId) {
    throw new Error('Project ID is required');
  }
  
  // Check if a design memory already exists for this project
  const { data: existingMemory } = await supabase
    .from('wireframe_design_memory')
    .select('id')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .maybeSingle();
  
  let result;
  
  if (existingMemory) {
    // Update existing memory
    result = await supabase
      .from('wireframe_design_memory')
      .update({
        blueprint_id: blueprintId,
        layout_patterns: layoutPatterns,
        style_preferences: stylePreferences,
        component_preferences: componentPreferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingMemory.id)
      .select();
  } else {
    // Insert new memory
    result = await supabase
      .from('wireframe_design_memory')
      .insert({
        user_id: userId,
        project_id: projectId,
        blueprint_id: blueprintId,
        layout_patterns: layoutPatterns,
        style_preferences: stylePreferences,
        component_preferences: componentPreferences
      })
      .select();
  }
  
  if (result.error) {
    throw result.error;
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: result.data 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function retrieveDesignMemory(supabase, userId, projectId) {
  if (!projectId) {
    // Get all design memory for the user
    const { data, error } = await supabase
      .from('wireframe_design_memory')
      .select(`
        id, 
        project_id, 
        blueprint_id, 
        layout_patterns, 
        style_preferences, 
        component_preferences,
        wireframe_blueprints(blueprint_data)
      `)
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Get design memory for a specific project
  const { data, error } = await supabase
    .from('wireframe_design_memory')
    .select(`
      id, 
      project_id, 
      blueprint_id, 
      layout_patterns, 
      style_preferences, 
      component_preferences,
      wireframe_blueprints(blueprint_data)
    `)
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .maybeSingle();
    
  if (error) {
    throw error;
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateDesignMemory(supabase, userId, payload) {
  const { memoryId, updates } = payload;
  
  if (!memoryId) {
    throw new Error('Memory ID is required');
  }
  
  // Verify the memory belongs to the user
  const { data: existingMemory } = await supabase
    .from('wireframe_design_memory')
    .select('id')
    .eq('id', memoryId)
    .eq('user_id', userId)
    .maybeSingle();
    
  if (!existingMemory) {
    throw new Error('Design memory not found or access denied');
  }
  
  // Update the memory
  const { data, error } = await supabase
    .from('wireframe_design_memory')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', memoryId)
    .select();
    
  if (error) {
    throw error;
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
