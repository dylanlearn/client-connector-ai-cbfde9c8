
import { supabase } from "@/integrations/supabase/client";
import { AIPromptOptions } from "../types/intake-summary-types";

/**
 * Client for making OpenAI API calls through Supabase Edge Functions
 */
export const callOpenAI = async (options: AIPromptOptions): Promise<string> => {
  const { model, systemPrompt, promptContent, temperature } = options;

  // Call OpenAI via Supabase Edge Function
  const { data, error } = await supabase.functions.invoke("generate-with-openai", {
    body: {
      messages: [{
        role: "user",
        content: promptContent
      }],
      systemPrompt,
      temperature,
      model,
    },
  });
  
  if (error) throw error;
  
  return data.response;
};
