
/**
 * Utility functions for mapping between database objects and application types
 */
import { PromptTest, PromptVariant, PromptTestStatus } from "../modules/types";

/**
 * Maps a database test object to the application PromptTest type
 */
export const mapDbTestToPromptTest = (dbTest: any): PromptTest => {
  return {
    id: dbTest.id,
    name: dbTest.name,
    description: dbTest.description || undefined,
    contentType: dbTest.content_type,
    status: dbTest.status as PromptTestStatus,
    variants: Array.isArray(dbTest.variants) 
      ? dbTest.variants.map(mapDbVariantToPromptVariant)
      : [],
    createdAt: dbTest.created_at,
    updatedAt: dbTest.updated_at,
    minSampleSize: dbTest.min_sample_size,
    confidenceThreshold: dbTest.confidence_threshold,
  };
};

/**
 * Maps a database variant object to the application PromptVariant type
 */
export const mapDbVariantToPromptVariant = (dbVariant: any): PromptVariant => {
  return {
    id: dbVariant.id,
    name: dbVariant.name,
    promptText: dbVariant.prompt_text,
    systemPrompt: dbVariant.system_prompt || undefined,
    isControl: dbVariant.is_control,
    weight: dbVariant.weight,
  };
};
