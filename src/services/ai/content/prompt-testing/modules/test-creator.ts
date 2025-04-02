
import { PromptTestsService, PromptVariantsService } from "../db-service";
import { PromptVariant } from "./types";

/**
 * Functions for creating A/B tests for prompts
 */
export const PromptTestCreator = {
  /**
   * Create a new A/B test
   */
  createTest: async (
    name: string, 
    contentType: string, 
    variants: Omit<PromptVariant, 'id'>[],
    description?: string,
    minSampleSize?: number,
    confidenceThreshold?: number
  ): Promise<string | null> => {
    try {
      // Create the test
      const newTest = await PromptTestsService.createTest({
        name,
        description,
        content_type: contentType,
        min_sample_size: minSampleSize,
        confidence_threshold: confidenceThreshold
      });
      
      if (!newTest) return null;
      
      // Create variants
      const variantsWithTestId = variants.map(variant => ({
        test_id: newTest.id,
        name: variant.name,
        prompt_text: variant.promptText,
        system_prompt: variant.systemPrompt,
        is_control: variant.isControl,
        weight: variant.weight
      }));
      
      const createdVariants = await PromptVariantsService.createVariants(variantsWithTestId);
      
      if (!createdVariants) {
        console.error("Failed to create variants");
        return null;
      }
      
      return newTest.id;
    } catch (error) {
      console.error("Error creating A/B test:", error);
      return null;
    }
  }
};
