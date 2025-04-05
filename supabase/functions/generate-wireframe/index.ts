
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { addCreativeEnhancements } from "./helpers.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Redis client for caching if available
import { connect } from "https://deno.land/x/redis@v0.29.0/mod.ts";

const redisUrl = Deno.env.get("REDIS_URL");
let redis;

try {
  if (redisUrl) {
    redis = await connect({
      hostname: new URL(redisUrl).hostname,
      port: Number(new URL(redisUrl).port) || 6379,
      password: new URL(redisUrl).password,
    });
    console.log("Connected to Redis for wireframe generation");
  }
} catch (error) {
  console.error("Failed to connect to Redis:", error);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      description, 
      style, 
      componentTypes = [], 
      colorTheme, 
      complexity = "standard",
      enhancedCreativity = true,
      cacheKey
    } = await req.json();
    
    // Check cache first if Redis is available and cache key is provided
    if (redis && cacheKey) {
      try {
        const cachedWireframe = await redis.get(`wireframe:${cacheKey}`);
        if (cachedWireframe) {
          console.log("Cache hit for wireframe:", cacheKey);
          return new Response(
            cachedWireframe,
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log("Cache miss for wireframe:", cacheKey);
      } catch (redisError) {
        console.error("Redis error:", redisError);
      }
    }

    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Create system prompt with enhanced creativity direction
    const systemPrompt = `
      You are an expert UI/UX designer with deep knowledge of web design patterns and creativity.
      Generate a detailed wireframe based on the user's description.
      Focus on creating a visually appealing and creative layout that follows modern design principles.
      ${enhancedCreativity ? 'Push the boundaries of conventional design while maintaining usability.' : ''}
      ${enhancedCreativity ? 'Incorporate unexpected creative elements, color combinations, or layout arrangements.' : ''}
      Include the following in the wireframe:
      - A descriptive title and high-level description
      - Complete layout details with design tokens for colors, typography, and spacing
      - Detailed component descriptions with hierarchy and relationships
      - Design tokens (colors, typography, spacing) that are cohesive and aligned with the style
      - ${enhancedCreativity ? 'Creative animations and microinteractions' : 'Basic hover states and interactions'}
      - ${enhancedCreativity ? 'Multiple style variants for key components' : 'Standard component variations'}
      - ${complexity === 'advanced' ? 'Responsive layouts for mobile and desktop' : 'Desktop-focused layout'}
      
      The design style should be: ${style || 'modern and clean'}
      ${colorTheme ? `Color theme preference: ${colorTheme}` : ''}
      
      Return the wireframe as a structured JSON object.
    `;

    // Format user prompt with detailed requirements
    const userPrompt = `
      Generate a wireframe for: ${description}
      
      ${componentTypes.length > 0 
        ? `Include these specific components: ${componentTypes.join(', ')}` 
        : 'Include appropriate components based on the description'}
      
      Design style: ${style || 'modern and clean'}
      Complexity level: ${complexity}
      ${colorTheme ? `Color theme: ${colorTheme}` : ''}
      
      Make this design ${enhancedCreativity ? 'highly creative and distinctive' : 'clean and professional'}.
    `;

    // Select appropriate model
    const model = "gpt-4o";

    const startTime = Date.now();
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: enhancedCreativity ? 0.9 : 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    const wireframeText = data.choices[0]?.message?.content;
    
    // Extract JSON from the response
    let wireframeData;
    try {
      // Find JSON content between triple backticks if present
      const jsonMatch = wireframeText.match(/```json([\s\S]*?)```/) || 
                       wireframeText.match(/```([\s\S]*?)```/);
                       
      if (jsonMatch && jsonMatch[1]) {
        wireframeData = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try to parse the entire response as JSON
        wireframeData = JSON.parse(wireframeText);
      }
      
      // Add creative enhancements if requested
      if (enhancedCreativity) {
        wireframeData = addCreativeEnhancements(wireframeData);
      }
      
    } catch (error) {
      console.error("Failed to parse wireframe data:", error);
      throw new Error("Failed to parse wireframe data from AI response");
    }
    
    const responseData = {
      wireframe: wireframeData,
      model,
      generationTime: (Date.now() - startTime) / 1000,
      enhancedCreativity,
      usage: data.usage,
    };
    
    // Cache result if Redis is available and cache key is provided
    if (redis && cacheKey && wireframeData) {
      try {
        await redis.set(
          `wireframe:${cacheKey}`, 
          JSON.stringify(responseData), 
          { ex: 3600 } // Cache for 1 hour
        );
        console.log("Cached wireframe for:", cacheKey);
      } catch (redisError) {
        console.error("Redis caching error:", redisError);
      }
    }

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error generating wireframe:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
