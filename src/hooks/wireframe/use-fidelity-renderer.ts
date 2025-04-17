
import { useCallback, useEffect } from 'react';
import { useFidelity } from '@/components/wireframe/fidelity/FidelityContext';

export const useFidelityRenderer = () => {
  const { currentLevel, settings, isTransitioning } = useFidelity();
  
  // Apply performance optimizations based on fidelity level
  useEffect(() => {
    // Add data attributes to document for CSS-based optimizations
    document.documentElement.setAttribute('data-fidelity-level', currentLevel);
    document.documentElement.style.setProperty('--fidelity-detail-level', settings.detailLevel.toString());
    document.documentElement.style.setProperty('--fidelity-shadow-strength', settings.shadowIntensity.toString());
    document.documentElement.style.setProperty('--fidelity-render-quality', settings.renderQuality.toString());
    
    // Apply additional settings based on fidelity level
    if (currentLevel === 'wireframe') {
      document.documentElement.style.setProperty('--fidelity-color-depth', 'grayscale');
    } else {
      document.documentElement.style.setProperty('--fidelity-color-depth', settings.colorDepth);
    }
    
    if (!settings.showAnimations) {
      document.documentElement.classList.add('disable-animations');
    } else {
      document.documentElement.classList.remove('disable-animations');
    }
    
    return () => {
      // Clean up when unmounted
      document.documentElement.removeAttribute('data-fidelity-level');
    };
  }, [currentLevel, settings]);
  
  // Calculate the performance impact of current settings
  const getPerformanceImpact = useCallback(() => {
    const baseScore = {
      wireframe: 0.2,
      low: 0.4,
      medium: 0.7,
      high: 1.0
    }[currentLevel];
    
    let total = baseScore;
    
    // Add impact of various features
    if (settings.showShadows) total += 0.2 * settings.shadowIntensity;
    total += settings.renderQuality * 0.3;
    if (settings.showAnimations) total += 0.15;
    
    return Math.min(total, 1.0);
  }, [currentLevel, settings]);
  
  return {
    currentLevel,
    settings,
    isTransitioning,
    performanceImpact: getPerformanceImpact()
  };
};

export default useFidelityRenderer;
