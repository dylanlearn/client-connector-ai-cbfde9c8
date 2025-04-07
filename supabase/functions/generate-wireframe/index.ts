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

// Add new function for advanced creativity enhancements
function enhancePromptCreativity(basePrompt: string, enhancedCreativity: boolean, style?: string): string {
  if (!enhancedCreativity) return basePrompt;
  
  // Creative prefixes to choose from
  const creativeIntros = [
    "Create a bold, innovative design that breaks convention with",
    "Design a visually striking and highly memorable layout featuring",
    "Craft an avant-garde and boundary-pushing interface with",
    "Generate a visually distinctive and artistically innovative layout with",
    "Develop a groundbreaking and visually impressive design incorporating"
  ];
  
  // Creative details to add
  const creativeDetails = [
    "unexpected color juxtapositions and asymmetric balance",
    "creative use of negative space and dynamic visual hierarchy",
    "unconventional typography pairings and striking contrast",
    "distinctive micro-interactions and subtle animation cues",
    "experimental layout structures and novel navigation patterns"
  ];
  
  // Randomly select a creative intro and detail
  const intro = creativeIntros[Math.floor(Math.random() * creativeIntros.length)];
  const detail = creativeDetails[Math.floor(Math.random() * creativeDetails.length)];
  
  // Combine with style if provided
  const stylePhrase = style ? `in a ${style} style, with` : "featuring";
  
  return `${intro} ${basePrompt} ${stylePhrase} ${detail}`;
}

// New function to generate multi-page wireframe prompt
function generateMultiPagePrompt(basePrompt: string, pages: number, pageTypes?: string[]): string {
  const defaultPageTypes = ['home', 'about', 'services', 'contact', 'blog'];
  const pagesToGenerate = pageTypes || defaultPageTypes.slice(0, pages);
  
  return `Create a comprehensive multi-page website wireframe with ${pages} pages including: ${pagesToGenerate.join(', ')}. 
  Each page should have its own sections and layout appropriate for its function.
  Create a consistent navigation structure across all pages.
  For the design brief: ${basePrompt}
  
  Return the wireframe with a pages array containing each page with its own sections array.`;
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
      cacheKey,
      creativityLevel = 8,
      detailedComponents = true,
      animationStyle = "subtle",
      multiPageLayout = false,
      pages = 1,
      pageTypes = []
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

    // Enhanced system prompt with more creative direction and multi-page support
    const systemPrompt = `
      You are an elite UI/UX designer with unmatched creativity and technical expertise.
      Generate ${multiPageLayout ? "a multi-page" : "an extraordinary"} wireframe based on the user's description.
      Focus on creating a visually stunning and innovative layout that breaks new ground in design.
      ${enhancedCreativity ? 'Push far beyond conventional design patterns while maintaining usability.' : ''}
      ${enhancedCreativity ? 'Incorporate unexpected, original creative elements that will make this design truly stand out.' : ''}
      
      ${multiPageLayout ? `Create ${pages} interconnected pages with consistent navigation and design language.
      Each page should have appropriate sections for its purpose.
      Include a navigation structure that connects all pages.` : ''}
      
      Include the following in the wireframe:
      - A compelling title and evocative high-level description
      - Complete layout details with innovative design tokens for colors, typography, and spacing
      - ${detailedComponents ? 'Detailed component descriptions with rich visual elements and thoughtful interactions' : 'Component descriptions with clear hierarchy'}
      - Design tokens (colors, typography, spacing) that create a distinctive visual language
      - ${animationStyle === 'bold' ? 'Bold animations and attention-grabbing microinteractions' : 'Subtle yet effective animations and microinteractions'}
      - ${enhancedCreativity ? 'Multiple creative style variants for key components' : 'Standard component variations'}
      - ${complexity === 'advanced' ? 'Responsive layouts with innovative adaptations for different devices' : 'Desktop-focused layout with basic responsiveness'}
      
      The design style should be: ${style || 'modern and distinctive'}
      ${colorTheme ? `Color theme preference: ${colorTheme}, but feel free to suggest creative adaptations` : 'Create a distinctive color palette that stands out'}
      
      Return the wireframe as a structured JSON object with rich details.
    `;

    // Format user prompt with creativity enhancements and multi-page support if needed
    let userPrompt = description;
    
    if (multiPageLayout && pages > 1) {
      userPrompt = generateMultiPagePrompt(description, pages, pageTypes);
    } else {
      userPrompt = enhancePromptCreativity(
        `Generate a wireframe for: ${description}
        
        ${componentTypes.length > 0 
          ? `Include these specific components: ${componentTypes.join(', ')}` 
          : 'Include appropriate components based on the description'}
        
        Design style: ${style || 'modern and creative'}
        Complexity level: ${complexity}
        ${colorTheme ? `Color theme: ${colorTheme}` : ''}`,
        enhancedCreativity,
        style
      );
    }

    // Use GPT-4o for highest creativity
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
        temperature: 0.7 + (creativityLevel * 0.02), // Dynamic temperature based on creativity level
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
      
      // If multi-page was requested but not returned, restructure to multi-page format
      if (multiPageLayout && pages > 1 && !wireframeData.pages) {
        const sections = wireframeData.sections || [];
        const defaultPageNames = ['Home', 'About', 'Services', 'Contact', 'Blog'];
        const actualPageTypes = pageTypes.length > 0 ? pageTypes : defaultPageNames.slice(0, pages);
        
        // Create pages structure
        wireframeData.pages = [];
        wireframeData.isMultiPage = true;
        
        // Home page gets more sections
        const homeSections = sections.slice(0, Math.ceil(sections.length / 2));
        wireframeData.pages.push({
          id: 'page-1',
          name: actualPageTypes[0]?.charAt(0).toUpperCase() + actualPageTypes[0]?.slice(1) || 'Home',
          slug: actualPageTypes[0]?.toLowerCase() || 'home',
          sections: homeSections,
          pageType: actualPageTypes[0]?.toLowerCase() || 'home'
        });
        
        // Distribute remaining sections across other pages
        const remainingSections = sections.slice(Math.ceil(sections.length / 2));
        const sectionsPerPage = Math.max(1, Math.floor(remainingSections.length / (pages - 1)));
        
        for (let i = 1; i < pages; i++) {
          const pageSections = remainingSections.slice((i - 1) * sectionsPerPage, i * sectionsPerPage);
          if (pageSections.length === 0) {
            // Create a default section if none were assigned
            pageSections.push({
              name: `${actualPageTypes[i]?.charAt(0).toUpperCase() + actualPageTypes[i]?.slice(1) || 'Section'} Content`,
              sectionType: "content",
              components: [
                { type: "heading", content: `${actualPageTypes[i]?.charAt(0).toUpperCase() + actualPageTypes[i]?.slice(1) || 'Section'} Content` },
                { type: "paragraph", content: "This is a placeholder section for this page." }
              ]
            });
          }
          
          wireframeData.pages.push({
            id: `page-${i + 1}`,
            name: actualPageTypes[i]?.charAt(0).toUpperCase() + actualPageTypes[i]?.slice(1) || `Page ${i + 1}`,
            slug: actualPageTypes[i]?.toLowerCase() || `page-${i + 1}`,
            sections: pageSections,
            pageType: actualPageTypes[i]?.toLowerCase() || `page-${i + 1}`
          });
        }
        
        // Create navigation structure
        wireframeData.navigationStructure = {
          main: wireframeData.pages.map(page => ({
            label: page.name,
            path: `/${page.slug}`,
          }))
        };
      }
      
      // Add enhanced creative enhancements with higher creativity level
      if (enhancedCreativity) {
        wireframeData = addCreativeEnhancements(wireframeData, creativityLevel);
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
      creativityLevel,
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
