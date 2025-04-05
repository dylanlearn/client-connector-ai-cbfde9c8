
import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to update the state based on window width
    const updateSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    updateSize();

    // Add event listener for window resize
    window.addEventListener('resize', updateSize);

    // Clean up
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return isMobile;
};
