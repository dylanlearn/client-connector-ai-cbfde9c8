
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function handleDesignPatterns(req: Request, payload: any, supabase: any) {
  // Check if OpenAI API key is available
  if (!openAIApiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  // Extract parameters from payload
  const { promptOrDescription, context = {}, industry, category } = payload;

  console.log("Processing design analysis request:", { promptOrDescription, industry, category });

  // Prepare system prompt
  const systemPrompt = `
    You are a world-class design expert with deep knowledge of web UI/UX design, visual aesthetics, and design systems.
    Your task is to analyze design concepts and provide detailed, structured insights.
    Focus on practical, implementable design patterns, not theoretical concepts.
    Always consider visual hierarchy, color theory, typography principles, and accessibility.
    
    ${industry ? `The target industry is ${industry}.` : ''}
    ${category ? `This analysis belongs to the ${category} design category.` : ''}
  `;

  // Prepare user prompt
  const userPrompt = `
    Analyze the following design concept or description and provide detailed insights:
    "${promptOrDescription}"
    
    Respond with a structured JSON object containing the following:
    - A concise title for this design pattern
    - A detailed description of the design pattern
    - A specific design category and subcategory
    - Visual elements breakdown (hierarchy, whitespace, contrast)
    - A color scheme with specific HEX codes for primary, secondary, accent, and background colors
    - Typography recommendations with specific font pairings
    - Layout pattern information
    - Relevant tags for this design pattern (5-10 tags)
    - A relevance score between 0-1 indicating how useful this pattern is
    
    Only include the JSON response, no additional text.
  `;

  // Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI API error:", errorText);
    
    throw new Error(`Failed to process design analysis: ${errorText}`);
  }

  const data = await response.json();
  console.log("OpenAI API response received");

  // Extract and parse the AI response
  try {
    const responseText = data.choices[0].message.content;
    
    // Attempt to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : responseText;
    
    const analysisResult = JSON.parse(jsonString);
    console.log("Successfully parsed design analysis result");
    
    return { 
      success: true, 
      analysis: analysisResult
    };
  } catch (parseError) {
    console.error("Error parsing AI response:", parseError);
    throw new Error('Failed to parse AI response');
  }
}
