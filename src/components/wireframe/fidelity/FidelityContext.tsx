
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { FidelityLevel, FidelitySettings, FIDELITY_PRESETS, getFidelitySettings } from './FidelityLevels';

interface FidelityContextType {
  currentLevel: FidelityLevel;
  settings: FidelitySettings;
  setFidelityLevel: (level: FidelityLevel) => void;
  updateSettings: (updates: Partial<FidelitySettings>) => void;
  isTransitioning: boolean;
}

const FidelityContext = createContext<FidelityContextType | undefined>(undefined);

export interface FidelityProviderProps {
  children: ReactNode;
  initialLevel?: FidelityLevel;
  transitionDuration?: number;
}

export const FidelityProvider: React.FC<FidelityProviderProps> = ({
  children,
  initialLevel = 'medium',
  transitionDuration = 500,
}) => {
  const [currentLevel, setCurrentLevel] = useState<FidelityLevel>(initialLevel);
  const [settings, setSettings] = useState<FidelitySettings>(FIDELITY_PRESETS[initialLevel]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [customSettings, setCustomSettings] = useState<Partial<FidelitySettings>>({});

  // Handle transitions between fidelity levels
  const setFidelityLevel = useCallback((level: FidelityLevel) => {
    if (level === currentLevel) return;
    
    setIsTransitioning(true);
    setCurrentLevel(level);
    
    // Apply settings with any custom overrides
    setSettings(getFidelitySettings(level, customSettings));
    
    // Clear transitioning state after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
    
    return () => clearTimeout(timer);
  }, [currentLevel, customSettings, transitionDuration]);

  // Update custom settings
  const updateSettings = useCallback((updates: Partial<FidelitySettings>) => {
    setCustomSettings(prev => {
      const newSettings = { ...prev, ...updates };
      // Immediately apply the updated settings
      setSettings(getFidelitySettings(currentLevel, newSettings));
      return newSettings;
    });
  }, [currentLevel]);

  // Update document class to enable CSS transitions
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--fidelity-transition-duration', 
      `${transitionDuration}ms`
    );
    
    // Add fidelity level as a data attribute on the document
    document.documentElement.setAttribute('data-fidelity', currentLevel);
    
    return () => {
      document.documentElement.removeAttribute('data-fidelity');
    };
  }, [currentLevel, transitionDuration]);

  return (
    <FidelityContext.Provider
      value={{
        currentLevel,
        settings,
        setFidelityLevel,
        updateSettings,
        isTransitioning
      }}
    >
      {children}
    </FidelityContext.Provider>
  );
};

export const useFidelity = () => {
  const context = useContext(FidelityContext);
  if (!context) {
    throw new Error('useFidelity must be used within a FidelityProvider');
  }
  return context;
};
