
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AnimationCategory, AnimationPreference } from "@/types/animations";

export function useAnimationPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<AnimationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user animation preferences
  const fetchPreferences = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('animation_preferences')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      setPreferences(data as AnimationPreference[]);
    } catch (err) {
      console.error('Error fetching animation preferences:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update a preference
  const updatePreference = useCallback(async (
    animationType: AnimationCategory,
    updates: Partial<Omit<AnimationPreference, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ) => {
    if (!user) return null;
    
    try {
      // Check if preference exists for this animation type
      const existingPref = preferences.find(p => p.animation_type === animationType);
      
      if (existingPref) {
        // Update existing preference
        const { data, error } = await supabase
          .from('animation_preferences')
          .update(updates)
          .eq('id', existingPref.id)
          .eq('user_id', user.id)
          .select('*')
          .single();
          
        if (error) throw error;
        
        // Update local state
        setPreferences(prev => 
          prev.map(p => p.id === existingPref.id ? (data as AnimationPreference) : p)
        );
        
        return data as AnimationPreference;
      } else {
        // Create new preference
        const { data, error } = await supabase
          .from('animation_preferences')
          .insert({
            user_id: user.id,
            animation_type: animationType,
            ...updates
          })
          .select('*')
          .single();
          
        if (error) throw error;
        
        // Update local state
        setPreferences(prev => [...prev, data as AnimationPreference]);
        
        return data as AnimationPreference;
      }
    } catch (err) {
      console.error('Error updating animation preference:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  }, [user, preferences]);

  // Get preference for a specific animation type
  const getPreference = useCallback((animationType: AnimationCategory): AnimationPreference | null => {
    return preferences.find(p => p.animation_type === animationType) || null;
  }, [preferences]);

  // Check if animation should be enabled (accounting for reduced motion settings)
  const isAnimationEnabled = useCallback((animationType: AnimationCategory): boolean => {
    const pref = getPreference(animationType);
    
    // Check if browser prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // If user has explicitly set reduced motion preference, use that
    if (pref?.reduced_motion_preference) {
      return false;
    }
    
    // If browser prefers reduced motion and user hasn't opted in, disable
    if (prefersReducedMotion && (!pref || !pref.accessibility_mode)) {
      return false;
    }
    
    // If user has a preference, respect it
    if (pref) {
      return pref.enabled;
    }
    
    // Default to enabled if no preference found
    return true;
  }, [getPreference]);

  // Load preferences on mount
  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user, fetchPreferences]);

  return {
    preferences,
    loading,
    error,
    fetchPreferences,
    updatePreference,
    getPreference,
    isAnimationEnabled
  };
}
