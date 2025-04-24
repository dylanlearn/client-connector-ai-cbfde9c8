
import { useState, useEffect } from 'react';
import { ViewPreferencesService } from '@/services/feedback/viewPreferencesService';
import { UserViewPreferences, ViewRole } from '@/types/feedback';
import { useToast } from '@/hooks/use-toast';

export function useViewPreferences() {
  const [preferences, setPreferences] = useState<UserViewPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const data = await ViewPreferencesService.getUserPreferences();
      setPreferences(data);
    } catch (err) {
      toast({
        title: "Error loading preferences",
        description: "Could not load view preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateViewRole = async (role: ViewRole) => {
    try {
      const updated = await ViewPreferencesService.updateViewRole(role);
      setPreferences(prev => ({ ...prev!, ...updated }));
      toast({
        title: "View role updated",
        description: "Your view role has been updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error updating view role",
        description: "Could not update view role",
        variant: "destructive",
      });
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserViewPreferences>) => {
    try {
      const updated = await ViewPreferencesService.updatePreferences(newPreferences);
      setPreferences(prev => ({ ...prev!, ...updated }));
      toast({
        title: "Preferences updated",
        description: "Your preferences have been updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error updating preferences",
        description: "Could not update preferences",
        variant: "destructive",
      });
    }
  };

  return {
    preferences,
    isLoading,
    updateViewRole,
    updatePreferences
  };
}
