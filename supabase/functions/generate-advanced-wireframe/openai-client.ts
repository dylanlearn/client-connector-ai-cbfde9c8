
// Type definitions for OpenAI API calls
interface OpenAICallOptions {
  systemMessage?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  functions?: any[];
  responseFormat?: { type: string };
}

interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface OpenAIResponseChoice {
  message: {
    content: string;
    role: string;
  };
  finish_reason: string;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIResponseChoice[];
  usage: TokenUsage;
}

// Track total token usage across all calls
let totalTokenUsage = {
  prompt_tokens: 0,
  completion_tokens: 0,
  total_tokens: 0
};

/**
 * Call OpenAI API with error handling and token tracking
 */
export async function callOpenAI(
  prompt: string, 
  options: OpenAICallOptions = {}
): Promise<string> {
  // Get API key from environment
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }
  
  // Set default options
  const systemMessage = options.systemMessage || 'You are a helpful AI assistant.';
  const temperature = options.temperature !== undefined ? options.temperature : 0.7;
  const maxTokens = options.maxTokens || 4000;
  const model = options.model || 'gpt-4o-mini';
  const functions = options.functions || undefined;
  const responseFormat = options.responseFormat || undefined;
  
  // Create the API request payload
  const payload: any = {
    model: model,
    messages: [
      {
        role: 'system',
        content: systemMessage
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: maxTokens,
    temperature: temperature,
  };
  
  // Add optional parameters if provided
  if (functions) {
    payload.functions = functions;
  }
  
  if (responseFormat) {
    payload.response_format = responseFormat;
  }
  
  try {
    // Make API call with retry logic
    const maxRetries = 3;
    let retries = 0;
    let response: Response | null = null;
    
    while (retries < maxRetries) {
      try {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) break;
        
        // If we get rate limited, wait and retry
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '1');
          console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          retries++;
        } else {
          // For other errors, throw immediately
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        if (retries >= maxRetries - 1) throw error;
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    
    if (!response || !response.ok) {
      throw new Error('Failed to get response from OpenAI API after retries');
    }
    
    // Parse the response
    const data = await response.json() as OpenAIResponse;
    
    // Update token usage
    if (data.usage) {
      totalTokenUsage.prompt_tokens += data.usage.prompt_tokens;
      totalTokenUsage.completion_tokens += data.usage.completion_tokens;
      totalTokenUsage.total_tokens += data.usage.total_tokens;
      
      console.log(`Token usage for this call: ${data.usage.total_tokens} tokens`);
      console.log(`Total token usage so far: ${totalTokenUsage.total_tokens} tokens`);
    }
    
    // Return the assistant's response
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content || '';
    } else {
      throw new Error('No content returned from OpenAI API');
    }
    
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error(`Failed to call OpenAI API: ${error.message}`);
  }
}

// Export token usage function
export function getTokenUsage(): TokenUsage {
  return { ...totalTokenUsage };
}

// Reset token usage (useful for tests)
export function resetTokenUsage(): void {
  totalTokenUsage = {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0
  };
}
