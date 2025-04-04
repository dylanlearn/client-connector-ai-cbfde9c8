
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { AnimationCategory, AnimationPreference } from "@/types/animations";

// Internal types for the hook
interface PreferenceState {
  loading: boolean;
  preferences: Partial<Record<AnimationCategory, UserAnimationPreference>>;
  error: string | null;
}

interface UserAnimationPreference {
  enabled: boolean;
  speedPreference: 'slow' | 'normal' | 'fast';
  intensityPreference: number;
  reducedMotion: boolean;
}

const DEFAULT_PREFERENCES: UserAnimationPreference = {
  enabled: true,
  speedPreference: 'normal',
  intensityPreference: 5,
  reducedMotion: false
};

/**
 * Hook to manage animation preferences
 */
export const useAnimationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<PreferenceState>({
    loading: true,
    preferences: {},
    error: null
  });
  
  // Load animation preferences
  const loadPreferences = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }
    
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      // For now, use local storage as a temporary solution
      // In a real implementation, this would fetch from a database
      const storedPrefs = localStorage.getItem(`animation_prefs_${user.id}`);
      if (storedPrefs) {
        const parsedPrefs = JSON.parse(storedPrefs);
        setState({
          loading: false,
          preferences: parsedPrefs,
          error: null
        });
      } else {
        // Initialize with defaults if nothing stored
        setState({
          loading: false,
          preferences: {},
          error: null
        });
      }
    } catch (error) {
      console.error('Error loading animation preferences:', error);
      setState({
        loading: false,
        preferences: {},
        error: 'Failed to load animation preferences'
      });
      
      toast({
        title: "Error loading preferences",
        description: "There was a problem loading your animation preferences.",
        variant: "destructive",
      });
    }
  }, [user, toast]);
  
  // Update a specific animation preference
  const updatePreference = useCallback(async (
    animationType: AnimationCategory,
    preferenceUpdate: Partial<UserAnimationPreference>
  ) => {
    if (!user) return;
    
    try {
      setState(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [animationType]: {
            ...(prev.preferences[animationType] || DEFAULT_PREFERENCES),
            ...preferenceUpdate
          }
        }
      }));
      
      // Save to local storage for now
      // In a real implementation, this would save to a database
      const updatedPrefs = {
        ...state.preferences,
        [animationType]: {
          ...(state.preferences[animationType] || DEFAULT_PREFERENCES),
          ...preferenceUpdate
        }
      };
      
      localStorage.setItem(`animation_prefs_${user.id}`, JSON.stringify(updatedPrefs));
      
      toast({
        title: "Preferences updated",
        description: "Your animation preferences have been updated.",
      });
    } catch (error) {
      console.error('Error updating animation preference:', error);
      
      toast({
        title: "Update failed",
        description: "There was a problem updating your animation preferences.",
        variant: "destructive",
      });
    }
  }, [user, state.preferences, toast]);
  
  // Get preference value for a specific animation type
  const getPreference = useCallback((
    animationType: AnimationCategory
  ): UserAnimationPreference => {
    return state.preferences[animationType] || DEFAULT_PREFERENCES;
  }, [state.preferences]);
  
  // Get animation config options based on user preferences
  const getAnimationConfigOptions = useCallback((
    animationType: AnimationCategory
  ) => {
    const prefs = getPreference(animationType);
    
    // Convert speed preference to factor
    const speedFactor = prefs.speedPreference === 'slow' ? 1.5 :
                        prefs.speedPreference === 'fast' ? 0.7 : 1;
    
    // Convert intensity (1-10 scale) to factor
    const intensityFactor = prefs.intensityPreference / 5;
    
    return {
      speedFactor,
      intensityFactor,
      reducedMotion: prefs.reducedMotion
    };
  }, [getPreference]);
  
  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    loading: state.loading,
    preferences: state.preferences,
    error: state.error,
    updatePreference,
    getPreference,
    getAnimationConfigOptions,
    loadPreferences
  };
};

// Export types for consumers of this hook
export type { UserAnimationPreference };
