
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, model = 'black-forest-labs/FLUX.1-schnell', size = '1024x1024' } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: prompt" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get API tokens from environment
    const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    const openAIKey = Deno.env.get('OPENAI_API_KEY')
    
    // Choose which API to use based on available tokens and model preference
    if (model.includes('dall-e') && openAIKey) {
      // Use OpenAI's DALL-E for generation
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIKey}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: size
        })
      });
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(`OpenAI API error: ${data.error.message}`)
      }
      
      return new Response(
        JSON.stringify({ image: data.data[0].url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } 
    else if (huggingFaceToken) {
      // Use Hugging Face for generation
      console.log("Using Hugging Face API with model:", model)
      
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${huggingFaceToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Hugging Face API error: ${error}`);
      }
      
      // Convert the blob to a base64 string
      const arrayBuffer = await response.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      return new Response(
        JSON.stringify({ image: `data:image/png;base64,${base64}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    else {
      throw new Error("No valid API token found for image generation");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
