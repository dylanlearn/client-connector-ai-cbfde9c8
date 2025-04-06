
import { AIGeneratorService } from "@/services/ai";

interface CopyVariant {
  name: string;
  promptText: string;
  systemPrompt?: string;
  isControl: boolean;
  weight: number;
}

interface CreateCopyTestParams {
  name: string;
  contentType: string; // e.g., 'header', 'tagline', 'description', 'cta'
  variants: CopyVariant[];
  description?: string;
}

/**
 * Helper function to create an A/B test for copy variations
 */
export async function createCopyTest({
  name,
  contentType,
  variants,
  description
}: CreateCopyTestParams): Promise<string | null> {
  try {
    // Create the test using the AIGeneratorService
    const testId = await AIGeneratorService.createPromptTest(
      name,
      contentType,
      variants,
      description
    );
    
    return testId;
  } catch (error) {
    console.error("Error creating copy test:", error);
    return null;
  }
}

/**
 * Creates a simple A/B test with two variants
 */
export async function createSimpleABTest(
  name: string,
  contentType: string,
  controlText: string,
  variantText: string,
  description?: string
): Promise<string | null> {
  const variants = [
    {
      name: "Control",
      promptText: controlText,
      isControl: true,
      weight: 1
    },
    {
      name: "Variant A",
      promptText: variantText,
      isControl: false,
      weight: 1
    }
  ];
  
  return createCopyTest({ name, contentType, variants, description });
}
