
/**
 * Types for the Design Principle Analysis Engine
 */

export type CompositionPrinciple = 
  | 'ruleOfThirds'
  | 'goldenRatio'
  | 'visualBalance'
  | 'symmetry'
  | 'asymmetry'
  | 'contrast'
  | 'rhythm'
  | 'emphasis'
  | 'proximity'
  | 'alignment';

export type PrincipleScore = {
  principle: CompositionPrinciple;
  score: number;  // 0-100
  feedback: string;
  suggestions: string[];
};

export interface DesignPrincipleAnalysis {
  overallScore: number;  // 0-100
  principleScores: PrincipleScore[];
  summary: string;
  topIssues: string[];
  topStrengths: string[];
}

export interface DesignPrincipleRequest {
  wireframeData: any;
  principleFilters?: CompositionPrinciple[];
  scoringThreshold?: number; // Only return issues below this score
  detailedFeedback?: boolean;
}
