
export interface CallOpenAIOptions {
  temperature?: number;
  maxTokens?: number;
  systemMessage?: string;
  model?: string;
}

/**
 * Helper function to call OpenAI API with input validation and error handling
 */
export async function callOpenAI(prompt: string, options: CallOpenAIOptions = {}): Promise<string> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.error('OpenAI API key is not configured');
    throw new Error('OpenAI API key is not configured in Supabase environment variables');
  }
  
  if (!prompt || typeof prompt !== 'string') {
    console.error('Invalid prompt provided:', prompt);
    throw new Error('Valid prompt is required for OpenAI API call');
  }

  const {
    temperature = 0.7,
    maxTokens = 4000,
    systemMessage = 'You are an expert UI/UX designer and wireframe generator.',
    model = 'gpt-4o'
  } = options;

  console.log(`Calling OpenAI API with model: ${model}, prompt length: ${prompt.length}`);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error ${response.status}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json().catch(err => {
      console.error('Error parsing OpenAI response:', err);
      throw new Error('Failed to parse OpenAI API response');
    });
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenAI response format:', data);
      throw new Error('Unexpected response format from OpenAI API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error(`Failed to get response from OpenAI: ${error.message}`);
  }
}
