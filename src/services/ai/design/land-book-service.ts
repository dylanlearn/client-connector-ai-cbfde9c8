
import { DesignPattern } from './types/design-pattern-types';
import { modernMinimalistLayouts } from './data/modern-minimalist-layouts';
import { DesignInsight } from './types/design-insight-types';

export interface LandBookQueryOptions {
  industry?: string;
  pattern?: string;
  conversionFocus?: boolean;
  tags?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: 'relevance' | 'newest' | 'popularity';
}

export interface LandBookPaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface LandBookAnalysis {
  patterns: DesignPattern[];
  insights: DesignInsight[];
  psychologyPrinciples: {
    principle: string;
    application: string;
    impact: string;
  }[];
  technicalConsiderations: {
    aspect: string;
    implementation: string;
    benefit: string;
  }[];
}

// Cache implementation
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Service for accessing and analyzing web design patterns inspired by Land-book
 * with enhanced performance through caching and pagination
 */
export const LandBookService = {
  // Cache configuration
  _cacheEnabled: true,
  _cacheExpirationMs: 30 * 60 * 1000, // 30 minutes
  _cache: new Map<string, CacheEntry<any>>(),

  /**
   * Enable or disable the cache
   */
  setCacheEnabled(enabled: boolean): void {
    this._cacheEnabled = enabled;
  },

  /**
   * Set cache expiration time
   */
  setCacheExpiration(expirationMs: number): void {
    this._cacheExpirationMs = expirationMs;
  },

  /**
   * Clear the entire cache
   */
  clearCache(): void {
    this._cache.clear();
  },

  /**
   * Query design patterns with specific criteria and pagination
   */
  queryPatterns(options: LandBookQueryOptions = {}): LandBookPaginatedResult<DesignPattern> {
    // Generate cache key based on query options
    const cacheKey = `query_${JSON.stringify(options)}`;
    
    // Check cache if enabled
    if (this._cacheEnabled) {
      const cachedResult = this._getFromCache<LandBookPaginatedResult<DesignPattern>>(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }
    }
    
    let patterns = [...modernMinimalistLayouts];
    
    // Filter by industry
    if (options.industry) {
      patterns = patterns.filter(pattern => 
        pattern.bestFor.some(industry => 
          industry.toLowerCase().includes(options.industry!.toLowerCase())
        )
      );
    }
    
    // Filter by pattern type
    if (options.pattern) {
      patterns = patterns.filter(pattern => 
        pattern.id.includes(options.pattern!) || 
        pattern.name.toLowerCase().includes(options.pattern!.toLowerCase()) ||
        pattern.description.toLowerCase().includes(options.pattern!.toLowerCase())
      );
    }
    
    // Filter by conversion focus
    if (options.conversionFocus !== undefined) {
      patterns = patterns.filter(pattern => 
        pattern.conversionOptimized === options.conversionFocus
      );
    }
    
    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      patterns = patterns.filter(pattern => 
        options.tags!.some(tag => pattern.tags.includes(tag))
      );
    }
    
    // Sort results
    if (options.sortBy) {
      patterns = this._sortPatterns(patterns, options.sortBy);
    }
    
    // Apply pagination
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPatterns = patterns.slice(startIndex, endIndex);
    
    // Create pagination metadata
    const paginationData = {
      currentPage: page,
      pageSize: pageSize,
      totalItems: patterns.length,
      totalPages: Math.ceil(patterns.length / pageSize),
      hasNextPage: endIndex < patterns.length,
      hasPreviousPage: page > 1
    };
    
    // Create result
    const result: LandBookPaginatedResult<DesignPattern> = {
      data: paginatedPatterns,
      pagination: paginationData
    };
    
    // Add to cache
    if (this._cacheEnabled) {
      this._addToCache(cacheKey, result);
    }
    
    return result;
  },
  
  /**
   * Get design patterns specifically for an industry with pagination
   */
  getPatternsForIndustry(industry: string, page: number = 1, pageSize: number = 10): LandBookPaginatedResult<DesignPattern> {
    return this.queryPatterns({ industry, page, pageSize });
  },
  
  /**
   * Get comprehensive analysis of design patterns for specific criteria
   */
  getDesignAnalysis(options: LandBookQueryOptions = {}): LandBookAnalysis {
    // Generate cache key
    const cacheKey = `analysis_${JSON.stringify(options)}`;
    
    // Check cache if enabled
    if (this._cacheEnabled) {
      const cachedResult = this._getFromCache<LandBookAnalysis>(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }
    }
    
    // Get all patterns without pagination for analysis
    const queryResult = this.queryPatterns({
      ...options,
      page: 1,
      pageSize: 1000 // Large number to get all patterns
    });
    
    const patterns = queryResult.data;
    
    // Generate insights based on the patterns
    const insights: DesignInsight[] = generateInsightsFromPatterns(patterns);
    
    // Extract psychology principles
    const psychologyPrinciples = extractPsychologyPrinciples(patterns);
    
    // Extract technical considerations
    const technicalConsiderations = extractTechnicalConsiderations(patterns);
    
    const result = {
      patterns,
      insights,
      psychologyPrinciples,
      technicalConsiderations
    };
    
    // Add to cache
    if (this._cacheEnabled) {
      this._addToCache(cacheKey, result);
    }
    
    return result;
  },
  
  /**
   * Add item to cache with expiration
   */
  _addToCache<T>(key: string, data: T): void {
    const now = Date.now();
    const expiresAt = now + this._cacheExpirationMs;
    
    this._cache.set(key, {
      data,
      timestamp: now,
      expiresAt
    });
    
    // Clean expired entries occasionally
    if (Math.random() < 0.1) { // 10% chance to clean on each write
      this._cleanExpiredCache();
    }
  },
  
  /**
   * Get item from cache if not expired
   */
  _getFromCache<T>(key: string): T | null {
    const entry = this._cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    const now = Date.now();
    
    // Check if expired
    if (now > entry.expiresAt) {
      this._cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  },
  
  /**
   * Clean expired cache entries
   */
  _cleanExpiredCache(): void {
    const now = Date.now();
    
    for (const [key, entry] of this._cache.entries()) {
      if (now > entry.expiresAt) {
        this._cache.delete(key);
      }
    }
  },
  
  /**
   * Sort patterns based on criteria
   */
  _sortPatterns(patterns: DesignPattern[], sortBy: 'relevance' | 'newest' | 'popularity'): DesignPattern[] {
    switch (sortBy) {
      case 'relevance':
        // Sort by relevance (this would use a more complex algorithm in production)
        return [...patterns].sort((a, b) => 
          b.conversionOptimized === true ? 1 : -1
        );
      
      case 'newest':
        // In a real implementation, this would use creation dates
        return patterns;
      
      case 'popularity':
        // In a real implementation, this would use popularity metrics
        return [...patterns].sort((a, b) => 
          b.bestFor.length - a.bestFor.length
        );
      
      default:
        return patterns;
    }
  }
};

/**
 * Generate design insights from patterns
 */
function generateInsightsFromPatterns(patterns: DesignPattern[]): DesignInsight[] {
  const insights: DesignInsight[] = [];
  
  // Add common layout insights
  if (patterns.some(p => p.tags.includes('split-screen'))) {
    insights.push({
      id: 'split-screen-effectiveness',
      title: 'Split-Screen Layout Effectiveness',
      description: 'Split-screen layouts create visual balance while clearly separating content and visuals, making them highly effective for showcasing products or services alongside their benefits.',
      impact: 'high',
      category: 'layout',
      applicablePatterns: patterns.filter(p => p.tags.includes('split-screen')).map(p => p.id)
    });
  }
  
  // Add typography insights
  if (patterns.some(p => p.elements.typography.includes('bold'))) {
    insights.push({
      id: 'typography-hierarchy',
      title: 'Bold Typography Hierarchy',
      description: 'Bold, varied typography creates clear visual hierarchy, guiding users through content while establishing brand personality and improving information retention.',
      impact: 'medium',
      category: 'typography',
      applicablePatterns: patterns.filter(p => p.elements.typography.includes('bold')).map(p => p.id)
    });
  }
  
  // Add spacing insights
  if (patterns.some(p => p.elements.spacing.includes('white'))) {
    insights.push({
      id: 'whitespace-clarity',
      title: 'Strategic Whitespace',
      description: 'Generous whitespace improves content legibility, creates visual breathing room, and helps establish content priority, leading to better user comprehension and engagement.',
      impact: 'high',
      category: 'spacing',
      applicablePatterns: patterns.filter(p => p.elements.spacing.includes('white')).map(p => p.id)
    });
  }
  
  // Add CTA insights
  if (patterns.some(p => p.elements.cta.includes('contrast'))) {
    insights.push({
      id: 'high-contrast-cta',
      title: 'High-Contrast Call to Action',
      description: 'High-contrast CTAs create visual prominence and clear action paths, significantly improving conversion rates by making desired actions immediately obvious to users.',
      impact: 'high',
      category: 'conversion',
      applicablePatterns: patterns.filter(p => p.elements.cta.includes('contrast')).map(p => p.id)
    });
  }
  
  return insights;
}

/**
 * Extract psychology principles from patterns
 */
function extractPsychologyPrinciples(patterns: DesignPattern[]): {
  principle: string;
  application: string;
  impact: string;
}[] {
  return [
    {
      principle: 'Visual Hierarchy Control',
      application: 'Using contrast, scale, and spacing to create deliberate viewing paths that guide users through a predetermined journey.',
      impact: 'Directs user attention to key content and actions in a specific sequence, improving comprehension and conversion rates.'
    },
    {
      principle: 'Cognitive Load Management',
      application: 'Limiting choices to prevent decision fatigue, especially in conversion-focused sections where options are reduced to essential actions.',
      impact: 'Reduces mental effort required to navigate the interface, leading to higher completion rates for desired actions.'
    },
    {
      principle: 'Gestalt Principles Application',
      application: 'Using proximity, similarity, and continuity to organize information in ways that feel intuitive and reduce cognitive processing effort.',
      impact: 'Creates perceived relationships between elements that help users naturally understand the content structure without explicit instructions.'
    },
    {
      principle: 'Social Proof Integration',
      application: 'Strategically placing testimonials, client logos, or usage statistics near decision points to leverage social influence.',
      impact: 'Reduces perceived risk and increases trust at critical conversion moments through demonstrated social validation.'
    }
  ];
}

/**
 * Extract technical considerations from patterns
 */
function extractTechnicalConsiderations(patterns: DesignPattern[]): {
  aspect: string;
  implementation: string;
  benefit: string;
}[] {
  return [
    {
      aspect: 'Performance-Optimized Visuals',
      implementation: 'Implementing lazy loading, responsive image serving, and SVG usage for interface elements.',
      benefit: 'Maintains visual impact while ensuring fast loading times across devices and connection speeds.'
    },
    {
      aspect: 'Purposeful Micro-interactions',
      implementation: 'Adding subtle animations and transitions that serve functional purposes rather than just decoration.',
      benefit: 'Confirms actions, establishes spatial relationships, and maintains context during state changes.'
    },
    {
      aspect: 'Content Priority Shifts',
      implementation: 'Strategically reprioritizing content on mobile rather than simply stacking desktop elements.',
      benefit: 'Delivers optimized experiences for mobile contexts where user needs and behaviors differ from desktop.'
    },
    {
      aspect: 'Accessibility Integration',
      implementation: 'Incorporating WCAG principles through sufficient contrast ratios, keyboard navigation, and semantic structure.',
      benefit: 'Ensures designs are usable by all users while maintaining visual sophistication and conversion effectiveness.'
    }
  ];
}
