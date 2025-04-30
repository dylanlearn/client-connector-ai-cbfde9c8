
import { useState, useEffect, useRef, useCallback } from 'react';
import { ProgressiveLoadingService, ProgressiveLoadingConfig } from '@/services/ProgressiveLoadingService';

interface ProgressiveLoadingOptions {
  wireframeId: string;
  elements: { id: string; [key: string]: any }[];
  defaultStrategy?: 'lazy' | 'progressive' | 'critical-path';
  defaultViewportThreshold?: number;
  defaultChunkSize?: number;
}

export function useProgressiveLoading({
  wireframeId,
  elements,
  defaultStrategy = 'progressive',
  defaultViewportThreshold = 200,
  defaultChunkSize = 5
}: ProgressiveLoadingOptions) {
  const [visibleElements, setVisibleElements] = useState<string[]>([]);
  const [config, setConfig] = useState<ProgressiveLoadingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Load configuration
  useEffect(() => {
    async function loadConfig() {
      const loadedConfig = await ProgressiveLoadingService.getConfig(wireframeId);
      
      if (!loadedConfig) {
        // Create default config if none exists
        const priorityElements = ProgressiveLoadingService.determinePriorityElements({ sections: elements });
        const newConfig = {
          wireframe_id: wireframeId,
          priority_elements: priorityElements,
          loading_strategy: defaultStrategy,
          viewport_threshold: defaultViewportThreshold,
          chunk_size: defaultChunkSize,
          enabled: true,
          configs: {}
        };
        
        const savedConfig = await ProgressiveLoadingService.saveConfig(newConfig);
        setConfig(savedConfig);
      } else {
        setConfig(loadedConfig);
      }
      
      setLoading(false);
    }
    
    loadConfig();
  }, [wireframeId, elements, defaultStrategy, defaultViewportThreshold, defaultChunkSize]);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!config || !config.enabled) {
      // Show all elements if progressive loading is disabled
      setVisibleElements(elements.map(element => element.id));
      return;
    }

    if (config.loading_strategy === 'critical-path') {
      // Only load priority elements initially
      setVisibleElements(config.priority_elements);
      
      // Then load everything else after a delay
      const timer = setTimeout(() => {
        setVisibleElements(elements.map(element => element.id));
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    // For lazy and progressive strategies, use intersection observer
    const threshold = config.viewport_threshold;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target === sentinelRef.current) {
            // Sentinel element is visible, load next chunk
            const visibleIds = new Set(visibleElements);
            const invisibleElements = elements.filter(element => !visibleIds.has(element.id));
            
            if (invisibleElements.length > 0) {
              const nextChunk = invisibleElements.slice(0, config.chunk_size);
              setVisibleElements(prev => [
                ...prev, 
                ...nextChunk.map(element => element.id)
              ]);
            }
          }
        });
      },
      { rootMargin: `${threshold}px` }
    );
    
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
    
    // Always show priority elements first
    setVisibleElements(config.priority_elements);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [config, elements]);

  // Register an element
  const registerElement = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      elementsRef.current.set(id, element);
    } else {
      elementsRef.current.delete(id);
    }
  }, []);
  
  // Register the sentinel element (used to trigger loading more elements)
  const registerSentinel = useCallback((element: HTMLDivElement | null) => {
    sentinelRef.current = element;
    
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  const isVisible = useCallback((id: string) => {
    return visibleElements.includes(id);
  }, [visibleElements]);

  return {
    isVisible,
    registerElement,
    registerSentinel,
    loading,
    config
  };
}
