
// Blueprint generator for the advanced wireframe generator
import { OpenAI } from "https://deno.land/x/openai@v4.20.1/mod.ts";

export async function generateLayoutBlueprint(intentData: any): Promise<any> {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error("OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable in your Supabase project settings.");
    }

    const openai = new OpenAI({
      apiKey: openAIApiKey,
    });

    // Create a structured system prompt
    const systemPrompt = `You are an expert UI architect specialized in converting design intents into practical layout blueprints.
Based on the provided design intent data, create a JSON wireframe blueprint with the following structure:
{
  "layout": {
    "type": "responsive",
    "structure": "column/grid/combined/etc",
    "sections": [
      {
        "id": "unique-id",
        "type": "section-type",
        "title": "Section Title",
        "description": "What this section contains",
        "elements": [
          {
            "type": "element-type",
            "purpose": "What this element does",
            "content": "Content description",
            "props": { }
          }
        ],
        "style": { "key properties like spacing, alignment" }
      }
    ]
  },
  "theme": {
    "colorScheme": "light/dark/custom",
    "typography": { "heading": "font-style", "body": "font-style" },
    "spacing": "compact/comfortable/etc"
  },
  "responsive": {
    "breakpoints": ["mobile", "tablet", "desktop"],
    "mobileConsiderations": "Special handling for mobile"
  },
  "accessibility": {
    "level": "AA",
    "considerations": ["contrast", "keyboard navigation", etc]
  }
}

Return ONLY the JSON with no additional text or explanations.`;

    // Convert intent data to string for the user message
    const userMessage = JSON.stringify(intentData, null, 2);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.3,
    });

    // Get the assistant's message content
    const assistantMessage = response.choices[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error("Failed to get a complete blueprint response from OpenAI");
    }

    console.log("Raw blueprint data:", assistantMessage);

    // Parse the JSON response
    try {
      const blueprint = JSON.parse(assistantMessage);
      return blueprint;
    } catch (parseError) {
      console.error("Failed to parse blueprint JSON:", parseError);
      console.log("Raw content that failed parsing:", assistantMessage);
      
      // Return a basic fallback blueprint
      return {
        layout: {
          type: "responsive",
          structure: "column",
          sections: [
            {
              id: "header-section",
              type: "header",
              title: "Header",
              description: "Main navigation and branding",
              elements: [
                {
                  type: "logo",
                  purpose: "branding",
                  content: "Brand logo"
                },
                {
                  type: "navigation",
                  purpose: "site navigation",
                  content: "Main menu items"
                }
              ]
            },
            {
              id: "main-content",
              type: "content",
              title: "Main Content",
              description: "Primary content area",
              elements: [
                {
                  type: "heading",
                  purpose: "title",
                  content: "Main heading"
                },
                {
                  type: "paragraph",
                  purpose: "description",
                  content: "Content description"
                }
              ]
            }
          ]
        },
        theme: {
          colorScheme: "light",
          typography: {
            heading: "sans-serif",
            body: "sans-serif"
          }
        }
      };
    }
  } catch (error) {
    console.error("Error in generateLayoutBlueprint:", error);
    
    // Check for API key related errors
    if (error.message && error.message.includes("API key")) {
      throw error; // Rethrow API key errors for proper handling
    }
    
    // Return a basic fallback blueprint for other errors
    return {
      layout: {
        type: "responsive",
        structure: "column",
        sections: [
          {
            id: "header-section",
            type: "header",
            title: "Header",
            description: "Main navigation and branding",
            elements: [
              {
                type: "logo",
                purpose: "branding",
                content: "Brand logo"
              },
              {
                type: "navigation",
                purpose: "site navigation",
                content: "Main menu items"
              }
            ]
          },
          {
            id: "main-content",
            type: "content",
            title: "Main Content",
            description: "Primary content area",
            elements: [
              {
                type: "heading",
                purpose: "title",
                content: "Main heading"
              },
              {
                type: "paragraph",
                purpose: "description",
                content: "Content description"
              }
            ]
          }
        ]
      },
      theme: {
        colorScheme: "light",
        typography: {
          heading: "sans-serif",
          body: "sans-serif"
        }
      }
    };
  }
}
