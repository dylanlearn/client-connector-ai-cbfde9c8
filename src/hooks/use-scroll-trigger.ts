
import { useRef, useState, useEffect, useCallback, RefObject } from 'react';

interface ScrollTriggerOptions {
  /**
   * Element to watch for scroll events (defaults to window)
   */
  target?: RefObject<HTMLElement> | null;
  
  /**
   * Scroll position as percentage (0-100) to trigger the effect
   */
  triggerPoint?: number;
  
  /**
   * Offset in pixels to adjust the trigger point
   */
  offset?: number;
  
  /**
   * Direction to watch for scroll triggers
   */
  direction?: 'vertical' | 'horizontal';
  
  /**
   * If true, trigger will fire only once
   */
  once?: boolean;
  
  /**
   * If true, trigger will reset when scrolling back above the threshold
   */
  resetOnScrollBack?: boolean;
  
  /**
   * If true, trigger will start in active state
   */
  initiallyActive?: boolean;
}

/**
 * Hook for creating scroll-triggered effects
 */
export function useScrollTrigger({
  target = null,
  triggerPoint = 10,
  offset = 0,
  direction = 'vertical',
  once = false,
  resetOnScrollBack = true,
  initiallyActive = false
}: ScrollTriggerOptions = {}) {
  const [triggered, setTriggered] = useState(initiallyActive);
  const hasTriggeredRef = useRef(initiallyActive);
  
  const checkScrollPosition = useCallback(() => {
    if (once && hasTriggeredRef.current) return;
    
    // Calculate current scroll progress
    let scrollPercent: number;
    
    if (target && target.current) {
      // Element scrolling
      const element = target.current;
      
      if (direction === 'vertical') {
        const scrollableDistance = element.scrollHeight - element.clientHeight;
        scrollPercent = (element.scrollTop + offset) / scrollableDistance * 100;
      } else {
        const scrollableDistance = element.scrollWidth - element.clientWidth;
        scrollPercent = (element.scrollLeft + offset) / scrollableDistance * 100;
      }
    } else {
      // Window scrolling
      if (direction === 'vertical') {
        const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
        scrollPercent = (window.scrollY + offset) / scrollableDistance * 100;
      } else {
        const scrollableDistance = document.documentElement.scrollWidth - window.innerWidth;
        scrollPercent = (window.scrollX + offset) / scrollableDistance * 100;
      }
    }
    
    // Check if we've hit the trigger point
    if (scrollPercent >= triggerPoint && !triggered) {
      setTriggered(true);
      hasTriggeredRef.current = true;
    } else if (resetOnScrollBack && scrollPercent < triggerPoint && triggered) {
      setTriggered(false);
      if (once) {
        hasTriggeredRef.current = false;
      }
    }
  }, [target, triggerPoint, offset, direction, once, resetOnScrollBack, triggered]);
  
  useEffect(() => {
    // Set up scroll listener
    const scrollElement = target?.current ?? window;
    const handleScroll = () => {
      requestAnimationFrame(checkScrollPosition);
    };
    
    // Initial check
    checkScrollPosition();
    
    // Add scroll event listener
    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [checkScrollPosition, target]);
  
  return { triggered };
}

/**
 * Hook for creating multiple scroll triggers with different thresholds
 */
export function useMultiScrollTrigger(triggers: {
  id: string;
  triggerPoint: number;
  direction?: 'vertical' | 'horizontal';
  once?: boolean;
}[]) {
  const [triggeredState, setTriggeredState] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLElement | null>(null);
  
  const checkTriggers = useCallback(() => {
    if (!scrollRef.current) return;
    
    const element = scrollRef.current;
    const verticalScrollPercent = element.scrollTop / (element.scrollHeight - element.clientHeight) * 100;
    const horizontalScrollPercent = element.scrollLeft / (element.scrollWidth - element.clientWidth) * 100;
    
    triggers.forEach(trigger => {
      const scrollPercent = trigger.direction === 'horizontal' 
        ? horizontalScrollPercent 
        : verticalScrollPercent;
      
      if (scrollPercent >= trigger.triggerPoint) {
        if (!triggeredState[trigger.id]) {
          setTriggeredState(prev => ({ ...prev, [trigger.id]: true }));
        }
      } else if (triggeredState[trigger.id] && !trigger.once) {
        setTriggeredState(prev => ({ ...prev, [trigger.id]: false }));
      }
    });
  }, [triggers, triggeredState]);
  
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    
    const handleScroll = () => {
      requestAnimationFrame(checkTriggers);
    };
    
    element.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [checkTriggers]);
  
  return { scrollRef, triggeredState };
}
