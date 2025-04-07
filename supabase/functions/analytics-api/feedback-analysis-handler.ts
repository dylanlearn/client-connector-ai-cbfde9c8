
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

interface ActionItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  urgency: number;
}

interface ToneAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  urgent: boolean;
  critical: boolean;
  vague: boolean;
}

export async function handleFeedbackAnalysis(req: Request, payload: any, supabase: any) {
  const { feedbackText } = payload;

  if (!feedbackText || typeof feedbackText !== 'string' || feedbackText.trim().length < 5) {
    throw new Error('Valid feedback text is required (minimum 5 characters)');
  }

  if (!openAIApiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  console.log(`Analyzing feedback: ${feedbackText.substring(0, 50)}${feedbackText.length > 50 ? '...' : ''}`);

  // Prepare the prompt for OpenAI
  const prompt = `
  You are an expert in analyzing client and user feedback for digital products. 
  Analyze the following feedback text:
  
  "${feedbackText}"
  
  Provide the following in your response:
  
  1. Summary: A concise summary of the feedback
  2. Action Items: A list of specific tasks that should be done based on this feedback, each with priority (high, medium, low) and urgency (1-10)
  3. Tone Analysis: Analyze the tone as percentages (positive, neutral, negative adding to 1.0), and indicate if it's urgent, critical, or vague
  
  Format your response as valid JSON with these properties: summary, actionItems (array of objects with task, priority, urgency), and toneAnalysis (object).
  `;

  // Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an AI assistant specialized in analyzing customer feedback.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API error:', errorData);
    throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content returned from OpenAI');
  }

  // Extract JSON from the response
  let parsedResponse;
  try {
    // Attempt to parse directly
    parsedResponse = JSON.parse(content);
  } catch (jsonError) {
    // If direct parsing fails, try to extract JSON from text response
    console.log('Direct JSON parsing failed, attempting to extract JSON from text');
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } catch (extractError) {
        console.error('JSON extraction also failed:', extractError);
        throw new Error('Failed to parse AI response as JSON');
      }
    } else {
      throw new Error('No JSON found in AI response');
    }
  }

  // Validate and normalize the response
  const summary = parsedResponse.summary || '';
  
  // Validate action items
  const actionItems: ActionItem[] = (parsedResponse.actionItems || []).map((item: any) => {
    // Ensure priority is one of the allowed values
    let priority: 'high' | 'medium' | 'low' = 'medium';
    if (item.priority === 'high' || item.priority === 'medium' || item.priority === 'low') {
      priority = item.priority;
    }

    // Ensure urgency is a number between 1-10
    let urgency = Number(item.urgency) || 5;
    urgency = Math.min(Math.max(urgency, 1), 10);

    return {
      task: item.task || 'Unnamed task',
      priority,
      urgency
    };
  });

  // Validate tone analysis
  const defaultToneAnalysis: ToneAnalysis = {
    positive: 0,
    neutral: 1,
    negative: 0,
    urgent: false,
    critical: false,
    vague: false
  };

  const toneAnalysis: ToneAnalysis = {
    positive: Number(parsedResponse.toneAnalysis?.positive) || defaultToneAnalysis.positive,
    neutral: Number(parsedResponse.toneAnalysis?.neutral) || defaultToneAnalysis.neutral,
    negative: Number(parsedResponse.toneAnalysis?.negative) || defaultToneAnalysis.negative,
    urgent: Boolean(parsedResponse.toneAnalysis?.urgent) || defaultToneAnalysis.urgent,
    critical: Boolean(parsedResponse.toneAnalysis?.critical) || defaultToneAnalysis.critical,
    vague: Boolean(parsedResponse.toneAnalysis?.vague) || defaultToneAnalysis.vague
  };

  // Normalize percentages to sum to 1.0
  const toneSum = toneAnalysis.positive + toneAnalysis.neutral + toneAnalysis.negative;
  if (toneSum > 0 && toneSum !== 1) {
    toneAnalysis.positive /= toneSum;
    toneAnalysis.neutral /= toneSum;
    toneAnalysis.negative /= toneSum;
  }

  const result = { summary, actionItems, toneAnalysis };
  console.log('Successfully analyzed feedback');

  return result;
}
