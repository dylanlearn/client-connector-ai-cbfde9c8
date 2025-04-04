
import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Animation preference type
export interface AnimationPreference {
  animation_type: string;
  enabled: boolean;
  intensity_preference: number;
  speed_preference: 'slow' | 'normal' | 'fast';
  reduced_motion_preference: boolean;
}

/**
 * Hook to manage user's animation preferences
 */
export const useAnimationPreferences = () => {
  const [preferences, setPreferences] = useState<AnimationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check for system-level reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  // Load preferences from local storage on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const savedPrefs = localStorage.getItem('animation-preferences');
        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs));
        } else {
          // Initialize with default preferences if none exist
          initializeDefaultPreferences();
        }
      } catch (error) {
        console.error('Error loading animation preferences:', error);
        initializeDefaultPreferences();
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, []);
  
  // Initialize default preferences
  const initializeDefaultPreferences = () => {
    const defaultTypes = [
      'morphing_shape',
      'progressive_disclosure',
      'intent_based_motion',
      'glassmorphism',
      'hover_effect',
      'modal_dialog',
      'custom_cursor',
      'scroll_animation',
      'drag_interaction',
      'magnetic_element',
      'color_shift',
      'parallax_tilt'
    ];
    
    const defaults = defaultTypes.map(type => ({
      animation_type: type,
      enabled: !prefersReducedMotion,
      intensity_preference: 5,
      speed_preference: 'normal' as const,
      reduced_motion_preference: prefersReducedMotion
    }));
    
    setPreferences(defaults);
    savePreferences(defaults);
  };
  
  // Save preferences to local storage
  const savePreferences = (prefs: AnimationPreference[]) => {
    try {
      localStorage.setItem('animation-preferences', JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving animation preferences:', error);
    }
  };
  
  /**
   * Check if an animation type is enabled based on user preferences
   */
  const isAnimationEnabled = useCallback((type: string): boolean => {
    const pref = preferences.find(p => p.animation_type === type);
    if (!pref) {
      return !prefersReducedMotion;
    }
    return pref.enabled && !pref.reduced_motion_preference;
  }, [preferences, prefersReducedMotion]);
  
  /**
   * Get specific animation preferences for a type
   */
  const getPreference = useCallback((type: string) => {
    const pref = preferences.find(p => p.animation_type === type);
    if (!pref) {
      return {
        intensity_preference: 5,
        speed_preference: 'normal' as 'slow' | 'normal' | 'fast',
        accessibility_mode: false,
        reduced_motion_preference: prefersReducedMotion
      };
    }
    
    return {
      intensity_preference: pref.intensity_preference,
      speed_preference: pref.speed_preference,
      accessibility_mode: false,
      reduced_motion_preference: pref.reduced_motion_preference
    };
  }, [preferences, prefersReducedMotion]);
  
  /**
   * Update preference for a specific animation type
   */
  const updatePreference = useCallback(async (
    type: string, 
    updates: Partial<Omit<AnimationPreference, 'animation_type'>>
  ): Promise<boolean> => {
    try {
      const newPreferences = [...preferences];
      const index = newPreferences.findIndex(p => p.animation_type === type);
      
      if (index >= 0) {
        // Update existing preference
        newPreferences[index] = {
          ...newPreferences[index],
          ...updates
        };
      } else {
        // Create new preference if it doesn't exist
        newPreferences.push({
          animation_type: type,
          enabled: updates.enabled ?? !prefersReducedMotion,
          intensity_preference: updates.intensity_preference ?? 5,
          speed_preference: updates.speed_preference ?? 'normal',
          reduced_motion_preference: updates.reduced_motion_preference ?? prefersReducedMotion
        });
      }
      
      setPreferences(newPreferences);
      savePreferences(newPreferences);
      return true;
    } catch (error) {
      console.error('Error updating animation preference:', error);
      toast.error('Failed to update preference');
      return false;
    }
  }, [preferences, prefersReducedMotion]);
  
  return {
    preferences,
    loading,
    isAnimationEnabled,
    getPreference,
    updatePreference,
    prefersReducedMotion
  };
};

// Removed the duplicate export to fix the conflict
