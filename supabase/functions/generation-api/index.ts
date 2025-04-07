
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { OpenAI } from "https://esm.sh/openai@4.0.0";

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

// Helper functions
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

// Define the addCreativeEnhancements function here to fix the import error
function addCreativeEnhancements(wireframeData: any, creativityLevel: number = 7) {
  // Don't modify if no wireframe data
  if (!wireframeData) return wireframeData;
  
  // Enhance sections based on creativity level
  if (wireframeData.sections && Array.isArray(wireframeData.sections)) {
    wireframeData.sections = wireframeData.sections.map(section => {
      // Add animation suggestions for higher creativity levels
      if (creativityLevel >= 6 && !section.animationSuggestions) {
        section.animationSuggestions = generateAnimationSuggestion(section.sectionType);
      }
      
      // Add style variants for higher creativity levels
      if (creativityLevel >= 8 && !section.styleVariants) {
        section.styleVariants = generateStyleVariants(section.sectionType);
      }
      
      return section;
    });
  }
  
  // Add enhanced design tokens based on creativity level
  if (wireframeData.designTokens) {
    wireframeData.designTokens = enhanceDesignTokens(wireframeData.designTokens, creativityLevel);
  }
  
  return wireframeData;
}

// Generate animation suggestions based on section type
function generateAnimationSuggestion(sectionType: string) {
  const baseAnimations = {
    hero: [
      { element: "heading", animation: "fade-in-up", timing: "0.5s ease-out" },
      { element: "subheading", animation: "fade-in-up", timing: "0.7s ease-out", delay: "0.2s" },
      { element: "cta-button", animation: "pulse", timing: "2s infinite" }
    ],
    features: [
      { element: "feature-cards", animation: "fade-in-stagger", timing: "0.5s ease-out", staggerDelay: "0.15s" }
    ],
    testimonials: [
      { element: "testimonial-cards", animation: "slide-in-from-right", timing: "0.6s ease-in-out" }
    ],
    gallery: [
      { element: "images", animation: "zoom-in", timing: "0.4s ease-out" }
    ],
    cta: [
      { element: "cta-container", animation: "pulse", timing: "2s infinite" }
    ],
    footer: [
      { element: "social-icons", animation: "bounce", timing: "0.3s", hoverEffect: true }
    ]
  };
  
  // Default animations for unknown section types
  const defaultAnimations = [
    { element: "container", animation: "fade-in", timing: "0.5s ease-out" }
  ];
  
  return baseAnimations[sectionType.toLowerCase()] || defaultAnimations;
}

// Generate style variants based on section type
function generateStyleVariants(sectionType: string) {
  const variants = [
    {
      name: "Light",
      styles: {
        backgroundColor: "#ffffff",
        textColor: "#333333",
        accentColor: "#3b82f6"
      }
    },
    {
      name: "Dark",
      styles: {
        backgroundColor: "#1f2937",
        textColor: "#f3f4f6",
        accentColor: "#60a5fa"
      }
    },
    {
      name: "Colorful",
      styles: {
        backgroundColor: "#f0f9ff",
        textColor: "#1e3a8a",
        accentColor: "#2dd4bf"
      }
    }
  ];
  
  return variants;
}

// Enhance design tokens with more creative options
function enhanceDesignTokens(tokens: any, creativityLevel: number) {
  if (!tokens) return tokens;
  
  // Only enhance at higher creativity levels
  if (creativityLevel < 5) return tokens;
  
  // Add color palette variations
  if (tokens.colors && creativityLevel >= 7) {
    tokens.colors.variations = [
      { name: "Vibrant", primary: adjustColor(tokens.colors.primary, 20), secondary: adjustColor(tokens.colors.secondary, 20) },
      { name: "Muted", primary: desaturateColor(tokens.colors.primary), secondary: desaturateColor(tokens.colors.secondary) }
    ];
  }
  
  // Add enhanced typography options
  if (tokens.typography && creativityLevel >= 6) {
    tokens.typography.alternativeFonts = [
      { heading: "Montserrat", body: "Open Sans" },
      { heading: "Playfair Display", body: "Source Sans Pro" }
    ];
  }
  
  // Add micro-interactions at highest creativity levels
  if (creativityLevel >= 9) {
    tokens.interactions = {
      hover: { scale: 1.02, transition: "all 0.2s ease" },
      active: { scale: 0.98, transition: "all 0.1s ease" },
      buttonHover: { y: -2, shadow: "0 4px 6px rgba(0,0,0,0.1)" }
    };
  }
  
  return tokens;
}

// Helper function to adjust color brightness
function adjustColor(color: string, percent: number): string {
  // Simple placeholder implementation - in real code would use proper color manipulation
  return color; // In a real implementation, would adjust the brightness
}

// Helper function to desaturate colors
function desaturateColor(color: string): string {
  // Simple placeholder implementation - in real code would use proper color manipulation
  return color; // In a real implementation, would desaturate the color
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
