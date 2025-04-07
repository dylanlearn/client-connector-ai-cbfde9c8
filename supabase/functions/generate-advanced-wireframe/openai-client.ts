
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
    throw new Error('OpenAI API key is not configured');
  }
  
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Valid prompt is required');
  }

  const {
    temperature = 0.7,
    maxTokens = 4000,
    systemMessage = 'You are an expert UI/UX designer and wireframe generator.',
    model = 'gpt-4o'
  } = options;

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
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error(`Failed to get response from OpenAI: ${error.message}`);
  }
}
