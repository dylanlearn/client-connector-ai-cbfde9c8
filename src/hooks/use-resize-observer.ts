
import { useEffect, useRef } from 'react';

type ObserverCallback = (entry: ResizeObserverEntry) => void;

/**
 * A hook that observes size changes on an element
 */
export function useResizeObserver<T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: ObserverCallback
) {
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    // Clean up previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create a new resize observer
    if (ref.current) {
      observerRef.current = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          callback(entries[0]);
        }
      });

      // Start observing the element
      observerRef.current.observe(ref.current);
    }

    // Clean up on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref, callback]);
}
