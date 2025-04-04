
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
const openAiKey = Deno.env.get("OPENAI_API_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface RequestData {
  content: string;
}

serve(async (req: Request) => {
  try {
    // Check if the request has a valid API key
    if (!openAiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const requestData = await req.json() as RequestData;
    const { content } = requestData;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Missing content parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call OpenAI to generate embedding
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        input: content,
        model: "text-embedding-ada-002",
      }),
    });

    const embeddingData = await embeddingResponse.json();

    if (embeddingData.error) {
      console.error("OpenAI API error:", embeddingData.error);
      return new Response(
        JSON.stringify({ error: "Failed to generate embedding" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract the embedding vector from the response
    const embedding = embeddingData.data[0].embedding;

    // Record metrics about the embedding generation
    const { error: metricsError } = await supabase
      .from('ai_generation_metrics')
      .insert({
        feature_type: 'embedding',
        model_used: 'text-embedding-ada-002',
        prompt_tokens: embeddingData.usage?.prompt_tokens || 0,
        completion_tokens: 0,
        total_tokens: embeddingData.usage?.total_tokens || 0,
        latency_ms: Date.now() - new Date(req.headers.get("date") || Date.now()).getTime(),
      });

    if (metricsError) {
      console.error("Error logging metrics:", metricsError);
    }

    return new Response(
      JSON.stringify({ 
        embedding, 
        usage: embeddingData.usage,
        status: "success" 
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating embedding:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
