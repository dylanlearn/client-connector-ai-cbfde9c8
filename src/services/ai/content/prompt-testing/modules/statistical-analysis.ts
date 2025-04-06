
/**
 * Statistical analysis module for A/B testing with robust significance calculations
 */

/**
 * Result of a statistical significance test
 */
export interface SignificanceResult {
  isSignificant: boolean;
  confidenceLevel: number;
  pValue: number;
  effectSize: number; // Cohen's d
  recommendation: string;
  winningVariantId?: string;
  marginOfVictory?: number; // percentage points
  sampleSizeNeeded?: number; // if not significant
  powerAnalysis?: {
    currentPower: number;
    requiredSampleA: number;
    requiredSampleB: number;
  };
}

/**
 * Variant conversion data for analysis
 */
export interface VariantData {
  id: string;
  name: string;
  impressions: number;
  successes: number;
  latencyMs?: number[];
}

/**
 * Calculate z-score for the difference in proportions test
 */
function calculateZScore(
  p1: number, 
  n1: number, 
  p2: number, 
  n2: number
): number {
  const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2);
  const standardError = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
  
  // Avoid division by zero
  if (standardError === 0) return 0;
  
  return Math.abs(p1 - p2) / standardError;
}

/**
 * Convert z-score to p-value
 */
function zScoreToPValue(z: number): number {
  // Simple approximation of the cumulative normal distribution function
  if (z < 0) return 0.5;
  
  const t = 1 / (1 + 0.2316419 * z);
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return 1 - (0.5 - probability);
}

/**
 * Calculate Cohen's d effect size
 */
function calculateEffectSize(p1: number, p2: number): number {
  // Calculate Cohen's h (arc-sine transformation for proportions)
  const h = 2 * Math.abs(Math.asin(Math.sqrt(p1)) - Math.asin(Math.sqrt(p2)));
  return h;
}

/**
 * Calculate required sample size for detecting effect
 */
function calculateRequiredSampleSize(
  p1: number,
  p2: number,
  power: number = 0.8,
  alpha: number = 0.05
): number {
  const effect = calculateEffectSize(p1, p2);
  if (effect === 0) return Infinity;
  
  // Approximation based on effect size
  const z_alpha = 1.96; // For alpha = 0.05
  const z_beta = 0.84; // For power = 0.8
  
  const n = 2 * Math.pow(z_alpha + z_beta, 2) / Math.pow(effect, 2);
  return Math.ceil(n);
}

/**
 * Calculate statistical power
 */
function calculateStatisticalPower(
  p1: number,
  n1: number,
  p2: number,
  n2: number,
  alpha: number = 0.05
): number {
  const effect = calculateEffectSize(p1, p2);
  const pooledN = (n1 + n2) / 2;
  
  // Simple approximation
  const power = 1 - zScoreToPValue(1.96 - effect * Math.sqrt(pooledN / 2));
  
  return Math.max(0, Math.min(1, power));
}

export const StatisticalAnalysis = {
  /**
   * Test for statistical significance between variants
   */
  testSignificance: (
    variants: VariantData[],
    confidenceThreshold: number = 95
  ): SignificanceResult => {
    if (variants.length < 2) {
      return {
        isSignificant: false,
        confidenceLevel: 0,
        pValue: 1,
        effectSize: 0,
        recommendation: "Need at least two variants to compare"
      };
    }
    
    let maxConversionRate = 0;
    let winningVariantId: string | undefined;
    let pairwiseResults: Array<{
      variantA: string;
      variantB: string;
      pValue: number;
      isSignificant: boolean;
    }> = [];
    
    // Find variant with highest conversion rate
    variants.forEach(variant => {
      const conversionRate = variant.impressions > 0 
        ? variant.successes / variant.impressions
        : 0;
        
      if (conversionRate > maxConversionRate) {
        maxConversionRate = conversionRate;
        winningVariantId = variant.id;
      }
    });
    
    // Compare each variant to every other variant
    for (let i = 0; i < variants.length; i++) {
      for (let j = i + 1; j < variants.length; j++) {
        const variantA = variants[i];
        const variantB = variants[j];
        
        const conversionRateA = variantA.impressions > 0 
          ? variantA.successes / variantA.impressions
          : 0;
          
        const conversionRateB = variantB.impressions > 0 
          ? variantB.successes / variantB.impressions
          : 0;
          
        const zScore = calculateZScore(
          conversionRateA, variantA.impressions,
          conversionRateB, variantB.impressions
        );
        
        const pValue = zScoreToPValue(zScore);
        const alpha = (100 - confidenceThreshold) / 100;
        const isSignificant = pValue <= alpha;
        
        pairwiseResults.push({
          variantA: variantA.id,
          variantB: variantB.id,
          pValue,
          isSignificant
        });
      }
    }
    
    // Determine if we have an overall significant winner
    const controlVariant = variants.find(v => v.id === variants[0].id);
    const bestVariant = variants.find(v => v.id === winningVariantId);
    
    if (!controlVariant || !bestVariant) {
      return {
        isSignificant: false,
        confidenceLevel: 0,
        pValue: 1,
        effectSize: 0,
        recommendation: "Missing control or winning variant data"
      };
    }
    
    const controlConversionRate = controlVariant.impressions > 0
      ? controlVariant.successes / controlVariant.impressions
      : 0;
      
    const bestConversionRate = bestVariant.impressions > 0
      ? bestVariant.successes / bestVariant.impressions
      : 0;
    
    const zScore = calculateZScore(
      bestConversionRate, bestVariant.impressions,
      controlConversionRate, controlVariant.impressions
    );
    
    const pValue = zScoreToPValue(zScore);
    const confidenceLevel = (1 - pValue) * 100;
    const alpha = (100 - confidenceThreshold) / 100;
    const isSignificant = pValue <= alpha;
    const effectSize = calculateEffectSize(bestConversionRate, controlConversionRate);
    
    // Calculate power and required sample size
    const power = calculateStatisticalPower(
      bestConversionRate, bestVariant.impressions,
      controlConversionRate, controlVariant.impressions
    );
    
    const requiredSamplePerVariant = calculateRequiredSampleSize(
      bestConversionRate,
      controlConversionRate
    );
    
    let recommendation: string;
    
    if (isSignificant) {
      const marginOfVictory = Math.abs(bestConversionRate - controlConversionRate) * 100;
      
      if (effectSize > 0.5) {
        recommendation = `Strong evidence that "${bestVariant.name}" is superior with ${marginOfVictory.toFixed(1)}% higher conversion rate. Recommend adopting this variant.`;
      } else {
        recommendation = `Evidence suggests "${bestVariant.name}" performs better with ${marginOfVictory.toFixed(1)}% higher conversion rate. Consider adopting this variant or continue testing to confirm.`;
      }
    } else {
      if (bestVariant.impressions < 100) {
        recommendation = `Insufficient data (${bestVariant.impressions} impressions). Continue testing until at least 100 impressions per variant.`;
      } else if (power < 0.8) {
        recommendation = `Test is underpowered (${(power * 100).toFixed(0)}% power). Need approximately ${requiredSamplePerVariant} samples per variant to detect the current difference reliably.`;
      } else if (effectSize < 0.1) {
        recommendation = `Variants show minimal difference (effect size: ${effectSize.toFixed(2)}). Consider ending the test as differences are likely not practically significant.`;
      } else {
        recommendation = `No statistically significant difference yet. Continue testing to reach ${requiredSamplePerVariant} samples per variant.`;
      }
    }
    
    return {
      isSignificant,
      confidenceLevel,
      pValue,
      effectSize,
      recommendation,
      winningVariantId: isSignificant ? winningVariantId : undefined,
      marginOfVictory: Math.abs(bestConversionRate - controlConversionRate) * 100,
      sampleSizeNeeded: !isSignificant ? requiredSamplePerVariant : undefined,
      powerAnalysis: {
        currentPower: power,
        requiredSampleA: requiredSamplePerVariant,
        requiredSampleB: requiredSamplePerVariant
      }
    };
  },
  
  /**
   * Calculate lift percentage between control and variant
   */
  calculateLift: (
    controlConversions: number,
    controlImpressions: number,
    variantConversions: number,
    variantImpressions: number
  ): number => {
    const controlRate = controlImpressions > 0 ? controlConversions / controlImpressions : 0;
    const variantRate = variantImpressions > 0 ? variantConversions / variantImpressions : 0;
    
    if (controlRate === 0) return 0;
    
    return ((variantRate - controlRate) / controlRate) * 100;
  }
};
