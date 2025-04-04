import { supabase } from "@/integrations/supabase/client";
import { MemoryCategory, GlobalMemoryType } from "../memory-types";

/**
 * Base service with utility functions for global memory
 */
export const GlobalMemoryBase = {
  /**
   * Map database response to GlobalMemory object
   */
  mapToGlobalMemory: (data: any): GlobalMemoryType => {
    return {
      id: data.id,
      content: data.content,
      category: data.category as MemoryCategory,
      timestamp: new Date(data.timestamp),
      frequency: data.frequency,
      relevanceScore: data.relevance_score,
      metadata: data.metadata
    };
  },
  
  /**
   * Sanitize and anonymize content for global memory
   * This ensures no personally identifiable information makes it to the global layer
   */
  sanitizeContent: (content: string): string => {
    // Remove potential PII like email addresses
    const sanitized = content
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
      .replace(/\b(?:\d{3}-\d{3}-\d{4}|\(\d{3}\)\s*\d{3}-\d{4}|\d{10})\b/g, '[PHONE]')
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
      .replace(/\b(Mr\.|Mrs\.|Ms\.|Dr\.)\s[A-Z][a-z]+\b/g, '[NAME]');
    
    return sanitized;
  },
  
  /**
   * Calculate a relevance score for new memory entries
   * Higher scores are assigned to more structured, actionable content
   */
  calculateInitialRelevance: (content: string, category: MemoryCategory): number => {
    // Base score
    let score = 0.5;
    
    // Adjust based on content length (longer content typically more valuable, up to a point)
    if (content.length > 10 && content.length < 1000) {
      score += 0.1;
    }
    
    // Adjust based on category (some categories inherently more valuable)
    if (category === MemoryCategory.SuccessfulOutput) {
      score += 0.2;
    } else if (category === MemoryCategory.TonePreference) {
      score += 0.15;
    }
    
    // Cap at 0.9 for initial entries (leaving room for future adjustments)
    return Math.min(score, 0.9);
  },
  
  /**
   * Extract key tone indicators from content
   * Used for anonymized tone analysis
   */
  extractToneIndicators: (content: string): Record<string, number> => {
    const indicators: Record<string, number> = {
      formal: 0,
      casual: 0,
      technical: 0,
      friendly: 0,
      authoritative: 0
    };
    
    // Simple keyword-based tone analysis
    const lowerContent = content.toLowerCase();
    
    // Formal indicators
    if (lowerContent.includes('hereby') || lowerContent.includes('pursuant') || 
        lowerContent.includes('aforementioned') || lowerContent.includes('shall')) {
      indicators.formal += 0.3;
    }
    
    // Casual indicators
    if (lowerContent.includes('hey') || lowerContent.includes('cool') || 
        lowerContent.includes('awesome') || lowerContent.includes('yeah')) {
      indicators.casual += 0.3;
    }
    
    // Technical indicators
    if (lowerContent.includes('specifically') || lowerContent.includes('technical') || 
        lowerContent.includes('implementation') || lowerContent.includes('functionality')) {
      indicators.technical += 0.3;
    }
    
    // Friendly indicators
    if (lowerContent.includes('please') || lowerContent.includes('thank you') || 
        lowerContent.includes('appreciate') || lowerContent.includes('looking forward')) {
      indicators.friendly += 0.3;
    }
    
    // Authoritative indicators
    if (lowerContent.includes('must') || lowerContent.includes('require') || 
        lowerContent.includes('ensure') || lowerContent.includes('necessary')) {
      indicators.authoritative += 0.3;
    }
    
    return indicators;
  }
};
