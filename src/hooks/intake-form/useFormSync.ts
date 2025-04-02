
import { useEffect, useRef, useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";
import { ToastAdapter } from "./types";
import { saveFormToSupabase, createRealtimeSubscription } from "./supabase-integration";

/**
 * Hook for handling form synchronization with Supabase
 */
export const useFormSync = (
  userId: string | undefined,
  formId: string,
  formData: IntakeFormData,
  formDataCache: React.MutableRefObject<IntakeFormData>,
  setFormData: (data: IntakeFormData) => void,
  setIsSaving: (saving: boolean) => void,
  toastAdapter: ToastAdapter
) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef<boolean>(false);

  // Scheduler for saving to Supabase
  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    pendingChangesRef.current = true;
    
    saveTimeoutRef.current = setTimeout(async () => {
      if (!userId || Object.keys(formDataCache.current).length <= 1) {
        pendingChangesRef.current = false;
        return;
      }
      
      setIsSaving(true);
      try {
        await saveFormToSupabase(formDataCache.current, userId, formId, { toast: toastAdapter });
        pendingChangesRef.current = false;
      } catch (error) {
        console.error("Error saving to Supabase:", error);
        // Reschedule save if it fails
        if (pendingChangesRef.current) {
          saveTimeoutRef.current = setTimeout(() => scheduleSave(), 10000);
        }
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  }, [userId, formId, formDataCache, setIsSaving, toastAdapter]);

  // Setup realtime updates if user is authenticated
  useEffect(() => {
    if (!userId) return;

    const subscription = createRealtimeSubscription(
      formId,
      formData.lastUpdated,
      (newData) => {
        // Fixed error here - we need to call setFormData with a direct object, not with a function
        setFormData({...formData, ...newData});
      },
      { toast: toastAdapter }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [formId, formData, userId, setFormData, toastAdapter]);

  // Watch for beforeunload event to warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingChangesRef.current) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    scheduleSave,
    hasPendingChanges: () => pendingChangesRef.current
  };
};
