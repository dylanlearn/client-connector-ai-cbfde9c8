
import { useEffect, useRef, useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";
import { ToastAdapter } from "./types";
import { saveFormToSupabase, createRealtimeSubscription } from "./supabase-integration";

/**
 * Hook for handling form synchronization with Supabase with improved reliability
 */
export const useFormSync = (
  userId: string | undefined,
  formId: string,
  formData: IntakeFormData,
  formDataCache: React.MutableRefObject<IntakeFormData>,
  setFormData: (data: IntakeFormData | ((prevData: IntakeFormData) => IntakeFormData)) => void,
  setIsSaving: (saving: boolean) => void,
  toastAdapter: ToastAdapter
) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;

  // Improved scheduler for saving to Supabase with retry logic
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
      
      const attemptSave = async (): Promise<void> => {
        setIsSaving(true);
        try {
          await saveFormToSupabase(formDataCache.current, userId, formId, { toast: toastAdapter });
          pendingChangesRef.current = false;
          retryCountRef.current = 0; // Reset retry counter on success
        } catch (error) {
          console.error("Error saving to Supabase:", error);
          // Implement exponential backoff for retries
          if (retryCountRef.current < maxRetries) {
            retryCountRef.current++;
            const backoffTime = 1000 * Math.pow(2, retryCountRef.current);
            console.log(`Retry ${retryCountRef.current}/${maxRetries} in ${backoffTime}ms`);
            
            saveTimeoutRef.current = setTimeout(() => {
              if (pendingChangesRef.current) {
                attemptSave();
              }
            }, backoffTime);
          } else {
            // Max retries reached, notify user
            toastAdapter.toast({
              title: "Sync failed",
              description: "We couldn't save your changes. Please try again later.",
              variant: "destructive"
            });
            retryCountRef.current = 0; // Reset for next sync
          }
        } finally {
          setIsSaving(false);
        }
      };
      
      attemptSave();
    }, 800); // Slightly reduced debounce time for better responsiveness
  }, [userId, formId, formDataCache, setIsSaving, toastAdapter, maxRetries]);

  // Setup realtime updates if user is authenticated
  useEffect(() => {
    if (!userId) return;

    const subscription = createRealtimeSubscription(
      formId,
      formData.lastUpdated,
      (newData) => {
        // Make sure we don't trigger unnecessary rerenders
        setFormData((currentData) => {
          const mergedData = {...currentData, ...newData};
          // Only update if there are actual changes
          if (JSON.stringify(mergedData) !== JSON.stringify(currentData)) {
            return mergedData;
          }
          return currentData;
        });
      },
      { toast: toastAdapter }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [formId, formData.lastUpdated, userId, setFormData, toastAdapter]);

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
