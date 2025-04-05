
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { designType, description, style } = await req.json();
    
    if (!designType) {
      throw new Error('Design type is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Construct a detailed prompt based on the design type and description
    let prompt = "";
    
    switch(designType) {
      case "hero":
        prompt = `Create a professional website hero section mockup with the following characteristics: ${description}. 
        The design should have modern typography, appropriate call-to-action buttons, and follow current web design trends. 
        Create a clean, minimalist UI design suitable for a website hero section. 
        Style: ${style || 'modern, professional'}. Resolution 1024x576. No watermarks. No text overlays unless specified in the description.`;
        break;
      case "navbar":
        // Enhanced navbar prompt with more specific details
        prompt = `Create a professional website navigation bar mockup for: ${description}. 
        Design a clean, modern ${style || 'minimal'} navigation bar that would appear at the top of a website.
        Show realistic menu items like "Home", "About", "Services", "Portfolio", "Contact" and include proper spacing and alignment.
        Include realistic branding elements like a logo placeholder. 
        Make it look like a real website navigation with proper UI elements and visual hierarchy.
        Resolution 1024x576. No watermarks. The navigation should be the main focus of the image.`;
        break;
      case "about":
        prompt = `Create a professional "About Us" section mockup based on this description: ${description}. 
        Design a visually engaging layout that effectively communicates the company story or team information.
        Include appropriate imagery, text layout, and visual hierarchy based on the specific about section type described.
        Create a clean, minimalist UI design suitable for a website about section.
        Style: ${style || 'informative, clean'}. Resolution 1024x576. No watermarks. No text overlays unless specified in the description.`;
        break;
      case "footer":
        prompt = `Create a professional website footer mockup with: ${description}. 
        Include typical footer elements like copyright info, navigation links, social media icons, and possibly a newsletter signup. 
        Create a clean, minimalist UI design suitable for a website footer section. 
        Style: ${style || 'simple, organized'}. Resolution 1024x576. No watermarks. No text overlays unless specified in the description.`;
        break;
      case "font":
        prompt = `Create a professional typography sample showing: ${description}. 
        Display the font in various sizes and weights, showing headings and body text arrangements. 
        Create a clean layout that showcases the typography system effectively. 
        Style: ${style || 'typographic, clean'}. Resolution 1024x576. No watermarks.`;
        break;
      case "animation":
        prompt = `Create a still frame representing a web animation concept: ${description}. 
        Use visual cues to suggest motion or transitions, possibly with direction indicators or motion blur. 
        Create a clean, minimalist UI design that hints at the animation style. 
        Style: ${style || 'dynamic, modern'}. Resolution 1024x576. No watermarks. No text overlays unless specified in the description.`;
        break;
      case "interaction":
        prompt = `Create a professional UI mockup showing a website interaction pattern: ${description}. 
        Show before/after states or use visual cues to suggest how the interaction works. 
        Create a clean, minimalist UI design that clearly demonstrates the interaction concept. 
        Style: ${style || 'interactive, intuitive'}. Resolution 1024x576. No watermarks. No text overlays unless specified in the description.`;
        break;
      default:
        prompt = `Create a professional website section mockup with: ${description}. 
        Create a clean, minimalist UI design suitable for a modern website. 
        Style: ${style || 'modern, clean'}. Resolution 1024x576. No watermarks. No text overlays unless specified in the description.`;
    }

    console.log(`Generating design image for ${designType} with prompt: ${prompt.substring(0, 50)}...`);

    // Call DALL-E 3 API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",  // Using the standard size from DALL-E 3
        quality: "standard",
        response_format: "url"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl,
        prompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating design image:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
