
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type MemoryCategory = 
  | 'DesignPreference' 
  | 'TonePreference' 
  | 'InteractionPattern'
  | 'LayoutPreference'
  | 'ColorPreference'
  | 'ProjectContext'
  | 'ClientFeedback'
  | 'SuccessfulOutput';

interface InitializeRequest {
  userId: string;
  projectId?: string;
  categories?: MemoryCategory[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request data
    const requestData: InitializeRequest = await req.json();
    const { userId, projectId, categories } = requestData;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId parameter' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Set of memory categories to initialize
    const memoriesToInitialize = categories || [
      'DesignPreference',
      'TonePreference',
      'InteractionPattern'
    ];
    
    // Initialize standard user memories
    const initialMemories = [];
    
    // Design preferences
    if (memoriesToInitialize.includes('DesignPreference')) {
      initialMemories.push({
        user_id: userId,
        content: "User prefers clean and minimal design aesthetics",
        category: 'DesignPreference',
        metadata: {
          preferenceType: 'aesthetic',
          preference: 'clean',
          confidence: 0.8,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Tone preferences
    if (memoriesToInitialize.includes('TonePreference')) {
      initialMemories.push({
        user_id: userId,
        content: "User prefers a professional but friendly communication tone",
        category: 'TonePreference',
        metadata: {
          preferredTone: 'professional-friendly',
          confidence: 0.7,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Store user memories
    if (initialMemories.length > 0) {
      const { error: userMemoriesError } = await supabase
        .from('user_memories')
        .insert(initialMemories);
        
      if (userMemoriesError) {
        console.error('Error storing user memories:', userMemoriesError);
      }
    }
    
    // If project ID is provided, initialize project memories
    if (projectId) {
      const projectMemory = {
        project_id: projectId,
        user_id: userId,
        content: "Initial project context for design approach",
        category: 'ProjectContext',
        metadata: {
          contextType: 'design-approach',
          importance: 'high',
          timestamp: new Date().toISOString()
        }
      };
      
      const { error: projectMemoryError } = await supabase
        .from('project_memories')
        .insert([projectMemory]);
        
      if (projectMemoryError) {
        console.error('Error storing project memory:', projectMemoryError);
      }
    }
    
    // Initialize some global memory insights if needed
    const { error: globalMemoryError } = await supabase
      .from('memory_analysis_results')
      .insert({
        category: 'DesignPreference',
        insights: { 
          results: [
            "Clean, minimal designs are preferred by most users",
            "Professional color schemes perform better for business sites",
            "Clear typography hierarchy improves usability scores"
          ]
        },
        source_count: 10
      });
      
    if (globalMemoryError) {
      console.error('Error storing global memory insights:', globalMemoryError);
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error initializing memory:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
