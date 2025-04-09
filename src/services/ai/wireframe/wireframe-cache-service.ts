import { WireframeGenerationParams } from "../wireframe-types";

const cache = new Map<string, any>();

// Replace instances of colorTheme with colorScheme
const getCacheKey = (params: WireframeGenerationParams): string => {
  if (!params.description) {
    return '';
  }

  // Use colorScheme instead of colorTheme (which doesn't exist in the type)
  const style = params.style || 'default';
  const colorScheme = params.colorScheme ? JSON.stringify(params.colorScheme) : 'default';
  return `${params.description.substring(0, 50)}_${style}_${colorScheme}`;
};

// For length property checks, add type guards
const isArrayWithLength = (arr: unknown): arr is any[] => {
  return Array.isArray(arr) && arr.length > 0;
};

const isStringWithLength = (str: unknown): str is string => {
  return typeof str === 'string' && str.length > 0;
};

export const wireframeCacheService = {
  get: (params: WireframeGenerationParams): any | undefined => {
    const key = getCacheKey(params);
    return cache.get(key);
  },

  set: (params: WireframeGenerationParams, data: any): void => {
    const key = getCacheKey(params);
    cache.set(key, data);
  },

  generateCacheKeyFromParams: (params: WireframeGenerationParams): string => {
    let key = 'wireframe_';

    // Add proper type guards before accessing length
    if (params.description && isStringWithLength(params.description)) {
      // Safe to access length now
      key += params.description.substring(0, 50);
    }

    if (params.style) {
      key += `_${params.style}`;
    }

    // Use colorScheme instead of colorTheme everywhere
    if (params.colorScheme) {
      key += `_${JSON.stringify(params.colorScheme)}`;
    }

    return key;
  },

  checkCache: (params: WireframeGenerationParams): any | null => {
    const cacheKey = wireframeCacheService.generateCacheKeyFromParams(params);
    return cache.get(cacheKey) || null;
  },

  storeInCache: (params: WireframeGenerationParams, result: any): void => {
    const cacheKey = wireframeCacheService.generateCacheKeyFromParams(params);
    cache.set(cacheKey, result);
  },

  clearCache: (): void => {
    cache.clear();
  },

  isCacheEnabled: true,

  retrieveCachedWireframe: (params: WireframeGenerationParams): any | null => {
    if (!wireframeCacheService.isCacheEnabled) {
      return null;
    }

    const cacheKey = wireframeCacheService.generateCacheKeyFromParams(params);
    return cache.get(cacheKey) || null;
  },

  cacheWireframe: (params: WireframeGenerationParams, wireframeData: any): void => {
    if (!wireframeCacheService.isCacheEnabled) {
      return;
    }

    const cacheKey = wireframeCacheService.generateCacheKeyFromParams(params);
    cache.set(cacheKey, wireframeData);
  }
};
