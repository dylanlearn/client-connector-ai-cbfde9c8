
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { OpenAI } from "https://esm.sh/openai@4.0.0";
// Remove the import from the non-existent helpers file and include the helpers directly in this file

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY') || '',
});

// Setup Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper functions - moved from helpers.ts to here
function generatePrompt(
  description: string,
  style: string = "modern",
  enhancedCreativity: boolean = true,
  colorTheme?: string,
  baseWireframe?: any
) {
  // Base prompt
  let prompt = `Generate a detailed wireframe structure for a ${style} website based on this description: "${description}".\n\n`;
  
  // Add color theme if provided
  if (colorTheme) {
    prompt += `Use this color theme: ${colorTheme}.\n\n`;
  }
  
  // Add base wireframe reference if provided
  if (baseWireframe) {
    prompt += `Use this existing wireframe as a reference, but create a different variation: ${JSON.stringify(baseWireframe)}.\n\n`;
  }
  
  // Enhanced creativity instructions
  if (enhancedCreativity) {
    prompt += `Be creative and innovative with the layout design. Think outside the box and suggest unique UI patterns that would work well for this use case.\n\n`;
  }
  
  // Output format instructions
  prompt += `Return a JSON object with these fields:
  - title: A catchy title for the wireframe
  - description: A brief explanation of the wireframe design
  - sections: An array of sections, each with:
    - name: The section name (e.g., "Hero", "Features", "Testimonials")
    - sectionType: The type of section
    - layout: The layout structure (grid, flex, etc.)
    - components: Array of UI components in this section
    - styleProperties: Visual styling properties
  - pages: (Optional) If multi-page, include different page layouts
  - designTokens: Design tokens like colors, typography, spacing`;
  
  return prompt;
}

async function cacheWireframeResult(
  params: Record<string, any>,
  wireframe: any,
  model: string,
  usage: any
) {
  try {
    // Create a hash key for the cache
    const paramsHash = JSON.stringify({
      description: params.description?.substring(0, 100),
      style: params.style,
      colorTheme: params.colorTheme,
      creativity: params.enhancedCreativity,
    });
    
    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Save to cache
    const { error } = await supabase
      .from('wireframe_cache')
      .insert({
        params_hash: paramsHash,
        generation_params: params,
        wireframe_data: wireframe,
        expires_at: expiresAt.toISOString()
      });
    
    if (error) {
      console.error("Cache error:", error);
    }
  } catch (error) {
    console.error("Failed to cache wireframe result:", error);
  }
}

async function checkWireframeCache(params: Record<string, any>) {
  try {
    if (params.cacheKey) {
      // Try to find by cache key first
      const { data: cacheData, error: cacheError } = await supabase
        .from('wireframe_cache')
        .select('*')
        .eq('params_hash', params.cacheKey)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (!cacheError && cacheData) {
        // Update hit count
        await supabase
          .from('wireframe_cache')
          .update({ hit_count: cacheData.hit_count + 1 })
          .eq('id', cacheData.id);
        
        return cacheData.wireframe_data;
      }
    }
    
    // Create a hash key for checking the cache
    const paramsHash = JSON.stringify({
      description: params.description?.substring(0, 100),
      style: params.style,
      colorTheme: params.colorTheme,
      creativity: params.enhancedCreativity,
    });
    
    // Check cache
    const { data, error } = await supabase
      .from('wireframe_cache')
      .select('*')
      .eq('params_hash', paramsHash)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error("Cache check error:", error);
      return null;
    }
    
    if (data) {
      // Update hit count
      await supabase
        .from('wireframe_cache')
        .update({ hit_count: data.hit_count + 1 })
        .eq('id', data.id);
      
      return data.wireframe_data;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to check wireframe cache:", error);
    return null;
  }
}

// Handler for wireframe generation
async function handleGenerateWireframe(body: any) {
  try {
    const {
      description,
      style = "modern",
      enhancedCreativity = true,
      colorTheme,
      baseWireframe,
      projectId,
      multiPageLayout = false,
      pages = 1,
      cacheKey,
      creativityLevel = 7, // Default to moderate creativity
    } = body;
    
    if (!description) {
      return { error: "Description is required" };
    }
    
    // Check cache first
    const cacheResult = await checkWireframeCache({
      description,
      style,
      colorTheme,
      enhancedCreativity,
      cacheKey
    });
    
    if (cacheResult) {
      console.log("Cache hit! Returning cached wireframe");
      return {
        wireframe: cacheResult,
        cached: true,
        model: "cache"
      };
    }
    
    const prompt = generatePrompt(
      description,
      style,
      enhancedCreativity,
      colorTheme,
      baseWireframe
    );
    
    // Set creativity level through temperature
    const temperature = Math.min(0.5 + (creativityLevel * 0.1), 1.5);
    
    // Call OpenAI to generate the wireframe
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a web designer and UX expert who creates detailed wireframe structures." 
        },
        { role: "user", content: prompt }
      ],
      temperature: temperature,
      max_tokens: multiPageLayout ? 4000 : 2500,
      response_format: { type: "json_object" }
    });
    
    if (!response.choices[0]?.message?.content) {
      throw new Error("No content returned from OpenAI");
    }
    
    // Parse the wireframe JSON from the response
    const wireframeData = JSON.parse(response.choices[0].message.content);
    
    // Save to database if projectId is provided
    if (projectId) {
      const { data: savedWireframe, error } = await supabase
        .from('ai_wireframes')
        .insert({
          project_id: projectId,
          prompt: description,
          wireframe_data: wireframeData,
          generation_params: {
            style,
            enhancedCreativity,
            colorTheme,
            multiPageLayout,
            pages,
            creativityLevel
          }
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error saving wireframe to database:", error);
      } else {
        console.log("Wireframe saved to database with ID:", savedWireframe.id);
        wireframeData.id = savedWireframe.id;
      }
    }
    
    // Cache the result for future use
    await cacheWireframeResult(
      {
        description,
        style,
        colorTheme,
        enhancedCreativity,
        creativityLevel
      },
      wireframeData,
      response.model,
      response.usage
    );
    
    return {
      wireframe: wireframeData,
      model: response.model,
      usage: response.usage,
      creativityLevel
    };
  } catch (error) {
    console.error("Error generating wireframe:", error);
    throw new Error(`Wireframe generation failed: ${error.message}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...body } = await req.json();
    
    let result;
    
    // Route to appropriate handler based on action
    switch (action) {
      case 'generate-wireframe':
        result = await handleGenerateWireframe(body);
        break;
        
      // Add other generation action handlers here as needed
      case 'generate-image':
        // result = await handleGenerateImage(body);
        result = { error: "Image generation not yet implemented" };
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(`Error in generation-api:`, error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
