
import { createParser } from "eventsource-parser";

// Configuration interface for OpenAI calls
interface OpenAICallOptions {
  systemMessage?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  model?: string;
  stream?: boolean;
}

/**
 * Helper function to call OpenAI API
 */
export async function callOpenAI(
  prompt: string,
  options: OpenAICallOptions = {}
): Promise<string> {
  const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openAIApiKey) {
    throw new Error("OpenAI API key is not configured");
  }

  const {
    systemMessage = "You are a helpful AI assistant specialized in UI/UX design and wireframing.",
    temperature = 0.7,
    maxTokens = 2048,
    topP = 1,
    model = "gpt-4o-mini",
    stream = false,
  } = options;

  const messages = [
    {
      role: "system",
      content: systemMessage,
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const requestBody = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
    stream,
  };

  console.log(`Calling OpenAI API with model: ${model}`);

  try {
    if (stream) {
      return streamCompletion(requestBody, openAIApiKey);
    } else {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("OpenAI API error:", errorData);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error(`Failed to call OpenAI: ${error.message}`);
  }
}

/**
 * Stream completion from OpenAI
 */
async function streamCompletion(
  requestBody: any,
  apiKey: string
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ ...requestBody, stream: true }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let fullContent = "";

  // Create parser
  const parser = createParser((event) => {
    if (event.type === "event") {
      if (event.data === "[DONE]") return;
      try {
        const json = JSON.parse(event.data);
        const content = json.choices[0]?.delta?.content || "";
        fullContent += content;
      } catch (e) {
        console.error("Error parsing OpenAI stream:", e);
      }
    }
  });

  // Process the response stream
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Failed to get response reader");
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      parser.feed(decoder.decode(value));
    }
  } catch (error) {
    console.error("Error reading stream:", error);
  } finally {
    reader.releaseLock();
  }

  return fullContent;
}

/**
 * Generate an image using OpenAI's DALL-E
 */
export async function generateImage(
  prompt: string,
  size: "1024x1024" | "1024x1792" | "1792x1024" = "1024x1024"
) {
  const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openAIApiKey) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size,
        quality: "standard",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("DALL-E API error:", errorData);
      throw new Error(`DALL-E API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0]?.url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}
