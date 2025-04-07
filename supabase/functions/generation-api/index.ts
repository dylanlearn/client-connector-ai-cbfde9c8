import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get environment variables
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

// Creative enhancements moved directly into this file
const addCreativeEnhancements = (wireframeData: any, creativityLevel: number = 8): any => {
  // Enhanced wireframe data with more creative elements
  const enhancedData = { ...wireframeData };
  
  // Add creative color palettes based on design principles
  if (!enhancedData.designTokens || !enhancedData.designTokens.colors) {
    enhancedData.designTokens = enhancedData.designTokens || {};
    enhancedData.designTokens.colors = {};
  }
  
  // Generate creative color variations
  enhancedData.designTokens.colors = {
    ...enhancedData.designTokens.colors,
    accent: generateCreativeAccentColors(enhancedData.designTokens.colors.primary || '#4F46E5'),
  };
  
  // Add animation suggestions if not present
  if (!enhancedData.animations) {
    enhancedData.animations = generateAnimationSuggestions();
  }
  
  // Add creative typography pairings
  if (!enhancedData.designTokens.typography) {
    enhancedData.designTokens.typography = {};
  }
  
  enhancedData.designTokens.typography = {
    ...enhancedData.designTokens.typography,
    pairings: generateCreativeTypographyPairings(),
  };
  
  // Add creative component variations if sections exist
  if (enhancedData.sections && Array.isArray(enhancedData.sections)) {
    enhancedData.sections = enhancedData.sections.map((section: any) => {
      return {
        ...section,
        styleVariants: generateComponentVariations(section.type),
      };
    });
  }
  
  // Add design rationale for creative choices
  enhancedData.creativeRationale = generateCreativeRationale(
    enhancedData.title, 
    enhancedData.designTokens.colors.primary
  );
  
  return enhancedData;
};

// Helper functions moved from helpers.ts
function generateCreativeAccentColors(primaryColor: string): Record<string, string> {
  // Simple algorithm to generate complementary and analogous colors
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } 
      : { r: 0, g: 0, b: 0 };
  };
  
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  
  const rgb = hexToRgb(primaryColor);
  
  // Generate complementary color
  const complementary = rgbToHex(
    255 - rgb.r,
    255 - rgb.g,
    255 - rgb.b
  );
  
  // Generate analogous colors
  const analogous1 = rgbToHex(
    Math.min(255, rgb.r + 40),
    Math.min(255, rgb.g - 20),
    Math.min(255, rgb.b + 20)
  );
  
  const analogous2 = rgbToHex(
    Math.min(255, rgb.r - 40),
    Math.min(255, rgb.g + 20),
    Math.min(255, rgb.b - 20)
  );
  
  return {
    complementary,
    analogous1,
    analogous2,
    vibrant: selectVibrantAccentColor(primaryColor),
  };
}

function selectVibrantAccentColor(primaryColor: string): string {
  // Vibrant color options for different color families
  const vibrantOptions = {
    blue: ['#00BFFF', '#1E90FF', '#4169E1'],
    red: ['#FF4500', '#FF6347', '#FF7F50'],
    green: ['#32CD32', '#00FA9A', '#00FF7F'],
    purple: ['#9370DB', '#8A2BE2', '#9932CC'],
    yellow: ['#FFD700', '#FFA500', '#FFFF00'],
  };
  
  // Determine color family based on primary color
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } 
      : { r: 0, g: 0, b: 0 };
  };
  
  const rgb = hexToRgb(primaryColor);
  
  if (rgb.r > rgb.g && rgb.r > rgb.b) {
    return vibrantOptions.red[Math.floor(Math.random() * 3)];
  } else if (rgb.g > rgb.r && rgb.g > rgb.b) {
    return vibrantOptions.green[Math.floor(Math.random() * 3)];
  } else if (rgb.b > rgb.r && rgb.b > rgb.g) {
    return vibrantOptions.blue[Math.floor(Math.random() * 3)];
  } else if (rgb.r > 200 && rgb.g > 200) {
    return vibrantOptions.yellow[Math.floor(Math.random() * 3)];
  } else {
    return vibrantOptions.purple[Math.floor(Math.random() * 3)];
  }
}

function generateAnimationSuggestions(): any {
  // Creative animation suggestions
  return {
    transitions: [
      {
        name: "Subtle Fade",
        description: "Elements fade in with slight upward movement for a clean entrance",
        css: "transition: opacity 0.4s ease-out, transform 0.4s ease-out; transform: translateY(10px); opacity: 0;"
      },
      {
        name: "Elastic Bounce",
        description: "Elements appear with a playful bounce that adds personality",
        css: "transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform: scale(0.8);"
      },
      {
        name: "Staggered Reveal",
        description: "Elements appear in sequence with slight delays between each",
        css: "transition: opacity 0.4s ease, transform 0.4s ease; transform: translateY(15px); opacity: 0;"
      }
    ],
    hover: [
      {
        name: "Depth Shift",
        description: "Elements appear to move forward slightly on hover",
        css: "transition: transform 0.3s ease, box-shadow 0.3s ease; &:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }"
      },
      {
        name: "Color Pulse",
        description: "Background slightly shifts color on hover",
        css: "transition: background-color 0.3s ease; &:hover { background-color: rgba(var(--color-primary-rgb), 0.05); }"
      }
    ]
  };
}

function generateCreativeTypographyPairings(): any {
  // Creative font pairings that work well together
  const pairings = [
    {
      name: "Modern Contrast",
      heading: "Montserrat",
      body: "Merriweather",
      description: "Clean, modern heading with a readable serif body"
    },
    {
      name: "Contemporary Elegance",
      heading: "Playfair Display",
      body: "Source Sans Pro",
      description: "Elegant serif headings with clean sans-serif body"
    },
    {
      name: "Tech Forward",
      heading: "Space Grotesk",
      body: "Inter",
      description: "Modern technical feel with excellent readability"
    },
    {
      name: "Creative Bold",
      heading: "Abril Fatface",
      body: "Poppins",
      description: "Bold, creative headings with a friendly body text"
    },
    {
      name: "Classic Professional",
      heading: "Libre Baskerville",
      body: "Raleway",
      description: "Traditional, trustworthy headings with contemporary body text"
    }
  ];
  
  // Return 3 random pairings
  const shuffled = [...pairings].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

function generateComponentVariations(componentType: string): any[] {
  // Generate creative component variations based on component type
  const variations: any[] = [];
  
  const basicVariations = [
    {
      name: "Standard",
      description: "The standard implementation style"
    },
    {
      name: "Minimal",
      description: "A stripped-back, clean variation with minimal decoration"
    }
  ];
  
  // Add component-specific variations
  switch (componentType) {
    case "hero":
      variations.push(
        {
          name: "Split Content",
          description: "Content and image in a side-by-side layout"
        },
        {
          name: "Gradient Overlay",
          description: "Bold gradient background with text overlay"
        },
        {
          name: "Animated Background",
          description: "Subtle animated elements in the background"
        }
      );
      break;
      
    case "cta":
      variations.push(
        {
          name: "Floating Card",
          description: "CTA in a card that stands out from the background"
        },
        {
          name: "Full Width Banner",
          description: "Bold full-width banner with contrasting background"
        }
      );
      break;
      
    case "feature":
      variations.push(
        {
          name: "Icon Grid",
          description: "Features presented in a grid with prominent icons"
        },
        {
          name: "Alternating Layout",
          description: "Features in an alternating left/right layout"
        },
        {
          name: "Card Collection",
          description: "Each feature in its own distinct card"
        }
      );
      break;
      
    case "testimonial":
      variations.push(
        {
          name: "Quote Carousel",
          description: "Rotating carousel of testimonial quotes"
        },
        {
          name: "Profile Cards",
          description: "Testimonials with prominent customer photos"
        }
      );
      break;
      
    default:
      variations.push(
        {
          name: "Creative Layout",
          description: "Unique layout with visual interest"
        },
        {
          name: "Interactive Elements",
          description: "Interactive elements to engage users"
        }
      );
  }
  
  return [...basicVariations, ...variations];
}

function generateCreativeRationale(title: string, primaryColor: string): any {
  // Generate creative rationale for the design choices
  return {
    colorStrategy: "The color palette is designed to balance brand recognition with emotional impact. " +
      "The primary color establishes the core identity, while complementary and analogous colors " +
      "create visual interest and guide the user's attention through the interface.",
      
    typographyStrategy: "Typography selections prioritize both readability and personality. " +
      "The pairing of distinctive headings with highly legible body text creates a clear " +
      "visual hierarchy while maintaining a cohesive voice throughout the design.",
      
    layoutPrinciples: "The layout employs a balance of white space and content density to create " +
      "breathing room while maintaining engagement. Key elements use strategic positioning to " +
      "draw attention to primary conversion points and core messaging.",
      
    motionPhilosophy: "Animation is employed subtly and purposefully to enhance usability and " +
      "add moments of delight. Transitions are timed to feel responsive without being distracting, " +
      "creating a fluid and polished experience."
  };
}

// Main function to handle requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    if (!action) {
      throw new Error('Missing required parameter: action');
    }

    console.log(`Processing ${action} request`);

    let result;

    // Route to appropriate handler based on action
    switch (action) {
      case 'generate-wireframe':
        result = await handleWireframeGeneration(params);
        break;
        
      case 'generate-advanced-wireframe':
        result = await handleAdvancedWireframeGeneration(params);
        break;
        
      case 'generate-design-image':
        result = await handleDesignImageGeneration(params);
        break;
        
      case 'generate-advanced-image':
        result = await handleAdvancedImageGeneration(params);
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
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Handler for wireframe generation
async function handleWireframeGeneration(params: any) {
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
  } = params;

  if (!openAIApiKey) {
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
      "Authorization": `Bearer ${openAIApiKey}`,
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
  
  return {
    wireframe: wireframeData,
    model,
    generationTime: (Date.now() - startTime) / 1000,
    enhancedCreativity,
    creativityLevel,
    usage: data.usage,
  };
}

// Handler for advanced wireframe generation
async function handleAdvancedWireframeGeneration(params: any) {
  const { userInput, projectId, styleToken, includeDesignMemory = false } = params;
  
  if (!userInput) {
    throw new Error('User input is required');
  }
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key is not configured');
  }
  
  console.log(`Processing wireframe request for input: ${userInput.substring(0, 50)}...`);
  
  // Step 1: Extract intent from user input
  const intentData = await extractIntent(userInput, styleToken);
  console.log("Intent extraction completed");
  
  // Step 2: Generate layout blueprint
  const blueprint = await generateLayoutBlueprint(intentData);
  console.log("Layout blueprint generation completed");
  
  // Step 3: Select component variants
  const wireframeWithComponents = await selectComponentVariants(blueprint);
  console.log("Component variant selection completed");

  // Step 4: Apply style modifiers
  const finalWireframe = await applyStyleModifiers(wireframeWithComponents, styleToken || intentData.visualTone);
  console.log("Style modification completed");
  
  return { 
    success: true, 
    wireframe: finalWireframe,
    intentData,
    blueprint
  };
}

// Handler for design image generation
async function handleDesignImageGeneration(params: any) {
  const { designType, description, style } = params;
  
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

  return { 
    success: true,
    imageUrl,
    prompt
  };
}

// Handler for advanced image generation
async function handleAdvancedImageGeneration(params: any) {
  const { prompt, model = 'black-forest-labs/FLUX.1-schnell', size = '1024x1024' } = params;

  if (!prompt) {
    return { error: "Missing required parameter: prompt" };
  }
  
  // Choose which API to use based on available tokens and model preference
  if (model.includes('dall-e') && openAIApiKey) {
    // Use OpenAI's DALL-E for generation
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: size
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    return { image: data.data[0].url };
  } 
  else if (huggingFaceToken) {
    // Use Hugging Face for generation
    console.log("Using Hugging Face API with model:", model);
    
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
    
    return { image: `data:image/png;base64,${base64}` };
  } 
  else {
    throw new Error("No valid API token found for image generation");
  }
}

// Helper function to generate multi-page wireframe prompt
function generateMultiPagePrompt(basePrompt: string, pages: number, pageTypes?: string[]): string {
  const defaultPageTypes = ['home', 'about', 'services', 'contact', 'blog'];
  const pagesToGenerate = pageTypes || defaultPageTypes.slice(0, pages);
  
  return `Create a comprehensive multi-page website wireframe with ${pages} pages including: ${pagesToGenerate.join(', ')}. 
  Each page should have its own sections and layout appropriate for its function.
  Create a consistent navigation structure across all pages.
  For the design brief: ${basePrompt}
  
  Return the wireframe with a pages array containing each page with its own sections array.`;
}

// Helper function to enhance prompt creativity
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

// Helper function to extract intent from user input for advanced wireframes
async function extractIntent(userInput: string, styleToken?: string) {
  const prompt = `
Interpret this user request and return a layout blueprint with section types, visual tone, content intent, and component variants.

User input: "${userInput}"

Return a structured JSON object with the following properties:
- structuredIntent: Brief description of what the user wants
- visualTone: Keywords describing the visual style (e.g., modern, sleek, playful)
- contentPurpose: What this wireframe is trying to achieve
- suggestedSections: Array of section types needed
- pageType: What kind of page this is (landing, dashboard, product, etc.)
- audienceLevel: Who this design is for (technical, general, executive, etc.)
- complexity: Suggested complexity level (simple, standard, advanced)
`;

  const response = await callOpenAI(prompt);
  
  try {
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch && jsonMatch[0]) {
      return JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    }
    
    // If we can't extract JSON, return a structured format based on the text
    return {
      structuredIntent: userInput,
      visualTone: styleToken || "modern",
      suggestedSections: ["hero", "features", "footer"],
      pageType: "landing",
      complexity: "standard"
    };
  } catch (error) {
    console.error("Error parsing intent extraction:", error);
    throw new Error("Failed to parse intent extraction results");
  }
}

// Helper function to generate layout blueprint for advanced wireframes
async function generateLayoutBlueprint(intentData: any) {
  const prompt = `
Based on this user vision, output a JSON layout blueprint with the following for each section:
- type
- layout (grid, flex, overlay, etc.)
- key components
- responsive behavior notes
- optional style modifiers (dark, glassy, minimalist)

User vision details:
- Intent: ${intentData.structuredIntent || 'Not specified'}
- Visual tone: ${intentData.visualTone || 'modern'}
- Page type: ${intentData.pageType || 'landing page'}
- Suggested sections: ${JSON.stringify(intentData.suggestedSections || [])}
- Complexity: ${intentData.complexity || 'standard'}

Return the blueprint as a JSON object with a "sections" array containing each section.
`;

  const response = await callOpenAI(prompt);
  
  try {
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch && jsonMatch[0]) {
      return JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    }
    
    throw new Error("Could not extract JSON blueprint from response");
  } catch (error) {
    console.error("Error parsing layout blueprint:", error);
    throw new Error("Failed to parse layout blueprint results");
  }
}

// Helper function to select component variants for advanced wireframes
async function selectComponentVariants(blueprint: any) {
  if (!blueprint || !blueprint.sections || !Array.isArray(blueprint.sections)) {
    throw new Error("Invalid blueprint structure");
  }
  
  const prompt = `
For each section in this layout blueprint, select the most appropriate component variant. Include variant type, layout notes, and tone guidance.

Blueprint sections: ${JSON.stringify(blueprint.sections)}

Example component types: Navbar, Hero, Sidebar, Feature Grid, Testimonials, Pricing Cards, Footer.
Example variants: Transparent, Collapsible, Light/Dark, Overlay, Sticky, Split Grid.

For each section, return:
- sectionType (original type)
- componentVariant (selected variant)
- layoutNotes (specific layout guidance)
- components (array of content components needed)
- responsiveBehavior (how it should adapt)

Return a JSON object with an updated "sections" array containing these enhanced sections.
`;

  const response = await callOpenAI(prompt);
  
  try {
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch && jsonMatch[0]) {
      const variantData = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      
      // Merge the component variants back into the original blueprint
      return {
        ...blueprint,
        sections: variantData.sections || blueprint.sections
      };
    }
    
    return blueprint; // Return original blueprint if parsing fails
  } catch (error) {
    console.error("Error parsing component variants:", error);
    return blueprint; // Return original blueprint if parsing fails
  }
}

// Helper function to apply style modifiers to the wireframe
async function applyStyleModifiers(wireframe: any, styleToken: string = 'modern') {
  const prompt = `
Apply a unified visual style across this layout: ${styleToken}.
Style options include: brutalist, soft, glassy, corporate, playful, editorial, tech-forward.

Current wireframe: ${JSON.stringify(wireframe)}

Adjust layout spacing, text hierarchy, borders, backgrounds, and shadows to match the style.
Return the wireframe with style properties added to each section.

For each section, add:
- styleProperties (color scheme, spacing, typography, shadows, etc.)
- visualPlaceholders (placeholder guidance for images, icons, etc.)
- designTokens (specific CSS-like values that reflect the style)

Return a JSON object with the original wireframe structure but with these style enhancements.
`;

  const response = await callOpenAI(prompt);
  
  try {
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch && jsonMatch[0]) {
      const styledWireframe = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      
      // Add the style token to the wireframe
      return {
        ...styledWireframe,
        styleToken: styleToken,
        title: wireframe.title || `${styleToken.charAt(0).toUpperCase() + styleToken.slice(1)} Wireframe`,
        description: wireframe.description || `A ${styleToken} style wireframe with multiple sections`
      };
    }
    
    // If we can't parse the response, add minimal style information
    return {
      ...wireframe,
      styleToken: styleToken,
      title: wireframe.title || `${styleToken.charAt(0).toUpperCase() + styleToken.slice(1)} Wireframe`,
      description: wireframe.description || `A ${styleToken} style wireframe with multiple sections`
    };
  } catch (error) {
    console.error("Error parsing style modifiers:", error);
    // Return original with minimal style information
    return {
      ...wireframe,
      styleToken: styleToken
    };
  }
}

// Helper function to call OpenAI API
async function callOpenAI(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert UI/UX designer and wireframe generator. Create detailed, structured wireframe specifications based on user input.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
