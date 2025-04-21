
import React, { useRef, useEffect, useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollTriggerEffectProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  effect?: 'fade' | 'slide-up' | 'slide-left' | 'scale' | 'none';
  customEffectClass?: string;
  delay?: number;
  duration?: number;
  triggerOnce?: boolean;
  debugMode?: boolean;
}

type EffectState = 'hidden' | 'visible' | 'triggered';

/**
 * A component that applies effects when elements scroll into view
 */
export const ScrollTriggerEffect: React.FC<ScrollTriggerEffectProps> = ({
  children,
  className,
  threshold = 0.1,
  rootMargin = '0px',
  effect = 'fade',
  customEffectClass,
  delay = 0,
  duration = 500,
  triggerOnce = true,
  debugMode = false
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [effectState, setEffectState] = useState<EffectState>('hidden');
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const [hasTriggered, setHasTriggered] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Handle intersection
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsIntersecting(true);
      
      // Trigger the effect if it hasn't triggered or if we're not using triggerOnce
      if (!hasTriggered || !triggerOnce) {
        setTimeout(() => {
          setEffectState('triggered');
          setHasTriggered(true);
        }, delay);
      }
    } else {
      setIsIntersecting(false);
      
      // Reset effect if triggerOnce is false
      if (!triggerOnce && hasTriggered) {
        setEffectState('hidden');
      }
    }
  }, [hasTriggered, triggerOnce, delay]);
  
  // Set up intersection observer
  useEffect(() => {
    if (!elementRef.current) return;
    
    observer.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin,
      threshold
    });
    
    observer.current.observe(elementRef.current);
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleIntersection, rootMargin, threshold]);
  
  // Generate effect classes
  const getEffectClasses = () => {
    if (customEffectClass) return customEffectClass;
    
    switch (effect) {
      case 'fade':
        return cn(
          'transition-opacity duration-[var(--duration)]',
          effectState === 'hidden' && 'opacity-0',
          effectState === 'triggered' && 'opacity-100'
        );
      case 'slide-up':
        return cn(
          'transition-transform transition-opacity duration-[var(--duration)]',
          effectState === 'hidden' && 'translate-y-8 opacity-0',
          effectState === 'triggered' && 'translate-y-0 opacity-100'
        );
      case 'slide-left':
        return cn(
          'transition-transform transition-opacity duration-[var(--duration)]',
          effectState === 'hidden' && 'translate-x-8 opacity-0',
          effectState === 'triggered' && 'translate-x-0 opacity-100'
        );
      case 'scale':
        return cn(
          'transition-transform transition-opacity duration-[var(--duration)]',
          effectState === 'hidden' && 'scale-95 opacity-0',
          effectState === 'triggered' && 'scale-100 opacity-100'
        );
      case 'none':
        return '';
      default:
        return '';
    }
  };
  
  return (
    <div
      ref={elementRef}
      className={cn(
        "scroll-trigger-effect",
        getEffectClasses(),
        className
      )}
      style={{ 
        '--duration': `${duration}ms`,
        position: 'relative'
      } as React.CSSProperties}
    >
      {children}
      
      {/* Debugging indicator */}
      {debugMode && (
        <div 
          className={cn(
            "absolute -top-6 -right-2 px-2 py-0.5 rounded text-white text-xs font-mono z-50",
            isIntersecting ? "bg-green-500" : "bg-red-500"
          )}
        >
          {isIntersecting ? 'Visible' : 'Hidden'}
        </div>
      )}
    </div>
  );
};

export default ScrollTriggerEffect;
