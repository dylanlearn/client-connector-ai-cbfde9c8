
import { v4 as uuidv4 } from 'uuid';
import { WireframeGenerationParams, WireframeGenerationResult } from './wireframe-types';

interface CachedWireframe {
  id: string;
  params: WireframeGenerationParams;
  result: WireframeGenerationResult;
  timestamp: number;
}

class WireframeCache {
  private cache: Map<string, CachedWireframe> = new Map();
  private readonly MAX_CACHE_SIZE = 50;
  private readonly CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

  // Create a cache key based on generation parameters
  private createCacheKey(params: WireframeGenerationParams): string {
    const {
      description = '',
      projectId = '',
      style = '',
      colorTheme = '',
      industry = '',
      creativityLevel = 0,
      pageType = ''
    } = params;

    // Include additional properties in the cache key if they exist
    let complexityStr = '';
    if ('complexity' in params && params.complexity !== undefined) {
      complexityStr = `_complexity:${params.complexity}`;
    }

    let multiPageStr = '';
    if ('multiPageLayout' in params && params.multiPageLayout) {
      multiPageStr = '_multiPage';
      
      if ('pages' in params && params.pages) {
        multiPageStr += `:${params.pages.length}`;
      }
    }
    
    let componentTypesStr = '';
    if ('componentTypes' in params && params.componentTypes) {
      componentTypesStr = `_components:${params.componentTypes.length}`;
      if (params.componentTypes.length > 0) {
        componentTypesStr += `:${params.componentTypes[0]}`;
      }
    }
    
    let moodboardStr = '';
    if ('moodboardSelections' in params && params.moodboardSelections) {
      moodboardStr = `_mood:${params.moodboardSelections.length}`;
      if (params.moodboardSelections.length > 0) {
        moodboardStr += `:${params.moodboardSelections[0]}`;
      }
    }
    
    // Build the cache key
    const key = `${description.substring(0, 50)}_${projectId}_${style}_${colorTheme}_${industry}_${creativityLevel}_${pageType}${complexityStr}${multiPageStr}${componentTypesStr}${moodboardStr}`;
    return key.replace(/\s+/g, '_').toLowerCase();
  }

  // Check if there's a valid cached wireframe for the given parameters
  getCachedWireframe(params: WireframeGenerationParams): WireframeGenerationResult | null {
    const cacheKey = this.createCacheKey(params);
    const cached = this.cache.get(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.CACHE_EXPIRY_MS) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    // Check if parameters match closely enough
    if (
      params.description !== cached.params.description ||
      params.style !== cached.params.style ||
      params.colorTheme !== cached.params.colorTheme ||
      params.industry !== cached.params.industry ||
      ('complexity' in params && 'complexity' in cached.params && params.complexity !== cached.params.complexity) ||
      ('multiPageLayout' in params && 'multiPageLayout' in cached.params && 
       params.multiPageLayout !== cached.params.multiPageLayout) ||
      ('multiPageLayout' in params && params.multiPageLayout === true && 
       'pages' in params && 'pages' in cached.params && 
       JSON.stringify(params.pages) !== JSON.stringify(cached.params.pages)) ||
      (params.creativityLevel && cached.params.creativityLevel && 
       Math.abs(params.creativityLevel - cached.params.creativityLevel) > 2)
    ) {
      return null;
    }
    
    return cached.result;
  }

  // Store a wireframe in the cache
  cacheWireframe(params: WireframeGenerationParams, result: WireframeGenerationResult): void {
    // Don't cache failed generations
    if (!result.success || !result.wireframe) {
      return;
    }
    
    const cacheKey = this.createCacheKey(params);
    
    this.cache.set(cacheKey, {
      id: uuidv4(),
      params,
      result,
      timestamp: Date.now()
    });
    
    // Clean up if cache is too large
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      this.pruneCache();
    }
  }
  
  // Clean up the oldest entries in the cache
  private pruneCache(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const entriesToRemove = entries.slice(0, Math.floor(this.MAX_CACHE_SIZE / 4));
    entriesToRemove.forEach(([key]) => this.cache.delete(key));
  }
  
  // Clear the entire cache
  clearCache(): void {
    this.cache.clear();
  }
  
  // Get cache stats
  getStats(): { size: number, oldestEntry: Date | null } {
    let oldestTimestamp = Date.now();
    
    for (const entry of this.cache.values()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
      }
    }
    
    return {
      size: this.cache.size,
      oldestEntry: this.cache.size > 0 ? new Date(oldestTimestamp) : null
    };
  }
}

export const wireframeCache = new WireframeCache();
