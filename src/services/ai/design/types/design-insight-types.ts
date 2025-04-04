
/**
 * Interface for design insights derived from pattern analysis
 */
export interface DesignInsight {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
  applicablePatterns: string[];
  source?: string;
  examples?: string[];
}

/**
 * Interface for psychological design principles
 */
export interface DesignPsychologyPrinciple {
  name: string;
  description: string;
  applications: string[];
  impact: string;
  references?: string[];
}

/**
 * Interface for technical implementation considerations
 */
export interface DesignTechnicalConsideration {
  aspect: string;
  implementation: string;
  benefit: string;
  complexity: 'low' | 'medium' | 'high';
  bestPractices: string[];
}
