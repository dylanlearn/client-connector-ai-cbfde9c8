
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Redis client for Deno
import { connect } from "https://deno.land/x/redis@v0.29.0/mod.ts";

// Initialize Redis client
const redisUrl = Deno.env.get("REDIS_URL");
let redis;

try {
  if (redisUrl) {
    redis = await connect({
      hostname: new URL(redisUrl).hostname,
      port: Number(new URL(redisUrl).port) || 6379,
      password: new URL(redisUrl).password,
    });
    console.log("Connected to Redis");
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
    const { messages, systemPrompt, model, temperature, cacheKey } = await req.json();
    
    // If Redis is connected and cacheKey provided, check cache first
    if (redis && cacheKey) {
      try {
        const cachedResponse = await redis.get(cacheKey);
        if (cachedResponse) {
          console.log("Cache hit for:", cacheKey);
          return new Response(
            JSON.stringify({ 
              response: cachedResponse,
              cached: true,
              model 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log("Cache miss for:", cacheKey);
      } catch (redisError) {
        console.error("Redis error:", redisError);
      }
    }

    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Create chat completion request
    const payload = {
      model: model || "gpt-4o-mini",
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        ...messages,
      ],
      temperature: temperature || 0.7,
    };

    const startTime = Date.now();
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const latencyMs = Date.now() - startTime;
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || "Unknown error"}`);
    }

    const completion = data.choices[0]?.message?.content;
    
    // Cache the result if Redis is connected and cacheKey provided
    if (redis && cacheKey && completion) {
      try {
        // Cache for 1 hour by default
        await redis.set(cacheKey, completion, { ex: 3600 });
        console.log("Cached response for:", cacheKey);
      } catch (redisError) {
        console.error("Redis caching error:", redisError);
      }
    }

    // Log generation metrics
    console.log({
      model: model || "gpt-4o-mini",
      latencyMs,
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    });

    return new Response(
      JSON.stringify({
        response: completion,
        model: model || "gpt-4o-mini",
        usage: data.usage,
        latencyMs,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
