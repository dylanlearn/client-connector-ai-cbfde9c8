
// OpenAI API client for the wireframe generation edge function

// Token usage tracking
let tokenUsage = {
  prompt_tokens: 0,
  completion_tokens: 0,
  total_tokens: 0
};

// Reset token usage
export function resetTokenUsage() {
  tokenUsage = {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0
  };
}

// Get current token usage
export function getTokenUsage() {
  return { ...tokenUsage };
}

// Call OpenAI API with the given prompt
export async function callOpenAI(prompt: string, options: {
  systemMessage?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  responseFormat?: { type: string };
}) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  
  const {
    systemMessage = "You are a helpful assistant.",
    temperature = 0.7,
    maxTokens = 1500,
    model = "gpt-4o-mini",
    responseFormat
  } = options;
  
  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: prompt }
  ];
  
  try {
    const requestBody: any = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    };
    
    // Add response format if specified
    if (responseFormat) {
      requestBody.response_format = responseFormat;
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error (${response.status}):`, errorText);
      throw new Error(`OpenAI API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Update token usage
    if (data.usage) {
      tokenUsage.prompt_tokens += data.usage.prompt_tokens;
      tokenUsage.completion_tokens += data.usage.completion_tokens;
      tokenUsage.total_tokens += data.usage.total_tokens;
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}
