import { useState, useCallback } from 'react';
import { WireframeColorScheme } from '@/services/ai/wireframe/wireframe-types';

/**
 * Hook for managing design memory and preferences
 */
export function useDesignMemory() {
  const [recentColorSchemes, setRecentColorSchemes] = useState<WireframeColorScheme[]>([]);
  const [favoriteColorSchemes, setFavoriteColorSchemes] = useState<WireframeColorScheme[]>([]);
  const [designPreferences, setDesignPreferences] = useState<Record<string, any>>({});

  /**
   * Convert WireframeColorScheme to Record<string, string>
   */
  const convertColorSchemeToRecord = (colorScheme: WireframeColorScheme): Record<string, string> => {
    // Convert WireframeColorScheme to Record<string, string>
    return {
      primary: colorScheme.primary,
      secondary: colorScheme.secondary,
      accent: colorScheme.accent,
      background: colorScheme.background,
      text: colorScheme.text
    };
  };

  /**
   * Add a color scheme to recent history
   */
  const addRecentColorScheme = useCallback((colorScheme: WireframeColorScheme) => {
    setRecentColorSchemes(prev => {
      // Convert to record for comparison
      const recordColorScheme = convertColorSchemeToRecord(colorScheme);
      
      // Remove duplicates
      const filtered = prev.filter(scheme => 
        JSON.stringify(convertColorSchemeToRecord(scheme)) !== JSON.stringify(recordColorScheme)
      );
      
      // Add to beginning and limit to 10 items
      return [colorScheme, ...filtered].slice(0, 10);
    });
  }, []);

  /**
   * Toggle a color scheme as favorite
   */
  const toggleFavoriteColorScheme = useCallback((colorScheme: WireframeColorScheme) => {
    const recordColorScheme = convertColorSchemeToRecord(colorScheme);
    
    setFavoriteColorSchemes(prev => {
      // Check if already in favorites
      const exists = prev.some(scheme => 
        JSON.stringify(convertColorSchemeToRecord(scheme)) === JSON.stringify(recordColorScheme)
      );
      
      if (exists) {
        // Remove from favorites
        return prev.filter(scheme => 
          JSON.stringify(convertColorSchemeToRecord(scheme)) !== JSON.stringify(recordColorScheme)
        );
      } else {
        // Add to favorites
        return [...prev, colorScheme];
      }
    });
  }, []);

  /**
   * Update design preferences
   */
  const updateDesignPreferences = useCallback((preferences: Record<string, any>) => {
    setDesignPreferences(prev => ({
      ...prev,
      ...preferences
    }));
  }, []);

  /**
   * Check if a color scheme is in favorites
   */
  const isFavoriteColorScheme = useCallback((colorScheme: WireframeColorScheme) => {
    const recordColorScheme = convertColorSchemeToRecord(colorScheme);
    
    return favoriteColorSchemes.some(scheme => 
      JSON.stringify(convertColorSchemeToRecord(scheme)) === JSON.stringify(recordColorScheme)
    );
  }, [favoriteColorSchemes]);

  return {
    recentColorSchemes,
    favoriteColorSchemes,
    designPreferences,
    addRecentColorScheme,
    toggleFavoriteColorScheme,
    updateDesignPreferences,
    isFavoriteColorScheme
  };
}
