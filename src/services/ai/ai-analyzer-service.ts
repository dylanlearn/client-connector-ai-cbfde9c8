
import { AIAnalysis } from "@/types/ai";
import {
  AIResponsesAnalyzerService,
  AIBrandPersonalityService,
  AIContradictionService
} from './analytics';

/**
 * Service for analyzing client responses and extracting insights
 */
export const AIAnalyzerService = {
  // Questionnaire response analysis
  analyzeResponses: AIResponsesAnalyzerService.analyzeResponses,
  
  // Brand personality detection
  detectBrandPersonality: AIBrandPersonalityService.detectBrandPersonality,
  
  // Contradiction identification
  identifyContradictions: AIContradictionService.identifyContradictions
};
