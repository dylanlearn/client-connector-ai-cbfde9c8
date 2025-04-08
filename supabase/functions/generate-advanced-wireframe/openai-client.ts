
interface OpenAIOptions {
  model?: string;
  systemMessage?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Call OpenAI API with proper error handling
 */
export async function callOpenAI(
  prompt: string, 
  options: OpenAIOptions = {}
): Promise<string> {
  // Get OpenAI API key with validation
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable.');
  }

  const {
    model = 'gpt-4o',
    systemMessage = 'You are a helpful assistant.',
    temperature = 0.7,
    maxTokens = 2000
  } = options;

  console.log(`Calling OpenAI API with model: ${model}, prompt length: ${prompt.length}`);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", response.status, response.statusText, errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      console.error("No choices returned from OpenAI:", data);
      throw new Error("No response choices returned from OpenAI API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error(`Failed to call OpenAI API: ${error.message}`);
  }
}
