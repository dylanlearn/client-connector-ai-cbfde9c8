
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WireframeRequest {
  prompt: string;
  projectId: string;
  style?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  pages?: string[];
  industry?: string;
  additionalInstructions?: string;
  moodboardSelections?: {
    layoutPreferences?: string[];
    fonts?: string[];
    colors?: string[];
    tone?: string[];
  };
  intakeResponses?: {
    businessGoals?: string;
    targetAudience?: string;
    siteFeatures?: string[];
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get OpenAI API key from environment variable
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    // Parse request body
    const requestData: WireframeRequest = await req.json();
    const { 
      prompt, 
      projectId, 
      style, 
      complexity, 
      pages = [], 
      industry, 
      additionalInstructions,
      moodboardSelections = {},
      intakeResponses = {}
    } = requestData;
    
    if (!prompt || !projectId) {
      return new Response(
        JSON.stringify({ error: 'Prompt and projectId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startTime = performance.now();
    
    // Construct a detailed system prompt for advanced wireframe generation
    const systemPrompt = `You are an expert senior UX designer specializing in creating professional wireframes for website development. 
    
You are building a world-class wireframe that offers personalized, context-aware, and stylistically intelligent layout output.

Your task is to create structured, section-by-section wireframes based on:
- Project type: ${industry || 'Not specified'}
- Style preferences: ${style || 'Modern and clean'} 
- Complexity level: ${complexity || 'medium'}
- Moodboard selections: ${JSON.stringify(moodboardSelections) || '{}'}
- Client intake responses: ${JSON.stringify(intakeResponses) || '{}'}
${additionalInstructions ? `- Additional requirements: ${additionalInstructions}` : ''}

For each key section of the website (hero, about, features, testimonials, pricing, contact, footer, etc.), generate:
1. Section Name (e.g., "Hero Banner", "Core Feature Grid")
2. Layout Type (e.g., "2-column with text left + image right")
3. Components Used (e.g., button, card, icon, video)
4. Suggested Copy Block (H1, H2, CTA line — placeholder content)
5. Animation Suggestion (specific animation type that would enhance this section)
6. Reasoning (brief insight on why this section/structure fits this brand or goal)
7. Mobile Layout Considerations (how the section will stack or transform on mobile)
8. Dynamic Elements (e.g., "carousel for testimonials", "FAQ accordion")
9. Style Variants (provide 2-3 layout alternatives when appropriate)

Additional requirements:
- Ensure all layout suggestions reflect client style preferences
- Include tone descriptors to align with typography and spacing logic
- Flag any unclear input with specific recommendations
- Provide a color scheme recommendation with primary, secondary, and accent colors
- Suggest typography pairings (headings and body text)
- Consider accessibility best practices

FORMAT YOUR RESPONSE AS VALID JSON with the following structure:
{
  "title": "Brief title for the wireframe",
  "description": "Detailed description of the overall wireframe design and strategy",
  "sections": [
    {
      "name": "Section name (e.g., Hero, Features, etc.)",
      "sectionType": "hero|features|about|testimonials|pricing|contact|footer|etc",
      "description": "Detailed description of this section",
      "layoutType": "Specific layout structure (e.g., 2-column, z-pattern, etc.)",
      "components": [
        {
          "type": "component type (e.g., heading, paragraph, button, image, etc.)",
          "content": "Text content or description of the component",
          "style": "Styling notes for this component",
          "position": "Positioning information (e.g., top-left, centered, etc.)"
        }
      ],
      "copySuggestions": {
        "heading": "Suggested heading text",
        "subheading": "Suggested subheading text",
        "cta": "Call to action text"
      },
      "animationSuggestions": {
        "type": "fade-in|slide-up|parallax|etc",
        "element": "Which elements should be animated",
        "timing": "Animation timing notes"
      },
      "designReasoning": "Explanation of why this design works for this purpose",
      "mobileLayout": {
        "structure": "How the layout changes for mobile",
        "stackOrder": ["element1", "element2", "etc"]
      },
      "dynamicElements": [
        {
          "type": "carousel|accordion|tabs|etc",
          "purpose": "Why this dynamic element is beneficial",
          "implementation": "Implementation notes"
        }
      ],
      "styleVariants": [
        {
          "name": "Variant name",
          "description": "Description of this style variant",
          "keyDifferences": ["difference1", "difference2", "etc"]
        }
      ]
    }
  ],
  "designTokens": {
    "colors": {
      "primary": "Description of primary color",
      "secondary": "Description of secondary color",
      "accent": "Description of accent color",
      "background": "Description of background color",
      "text": "Description of text color"
    },
    "typography": {
      "headings": "Heading font recommendation",
      "body": "Body text font recommendation",
      "fontPairings": ["font1 + font2", "etc"]
    },
    "spacing": {
      "sectionPadding": "Padding recommendation",
      "elementGap": "Gap recommendation"
    }
  },
  "qualityFlags": {
    "unclearInputs": ["input1", "input2", "etc"],
    "recommendedClarifications": ["clarification1", "clarification2", "etc"]
  },
  "mobileConsiderations": "Overall mobile strategy",
  "accessibilityNotes": "Accessibility considerations and recommendations"
}`;

    // Call OpenAI API to generate wireframe description
    console.log(`Generating advanced wireframe for prompt: ${prompt.substring(0, 100)}...`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using gpt-4o-mini for a good balance of capabilities and cost
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    let wireframeData;
    
    try {
      // Parse the response to ensure it's valid JSON
      const content = data.choices[0].message.content;
      wireframeData = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse wireframe JSON:', error);
      wireframeData = { 
        error: 'Failed to generate valid wireframe data',
        rawContent: data.choices[0].message.content
      };
    }

    const endTime = performance.now();
    const generationTime = (endTime - startTime) / 1000; // Convert to seconds

    console.log('Successfully generated advanced wireframe data');

    return new Response(
      JSON.stringify({ 
        wireframe: wireframeData,
        generationTime,
        model: data.model,
        usage: data.usage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-wireframe function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
