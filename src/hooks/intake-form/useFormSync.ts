
// Create a new useFormSync hook
import { useCallback, useEffect, useRef } from "react";
import { IntakeFormData } from "@/types/intake-form";
import { ToastAdapter } from "./types";

export const useFormSync = (
  userId: string | undefined,
  formId: string,
  formData: IntakeFormData,
  formDataCache: React.MutableRefObject<IntakeFormData>,
  setFormData: (data: IntakeFormData) => void,
  setIsSaving: (saving: boolean) => void,
  { toast }: ToastAdapter
) => {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef(false);

  // Schedule saving
  const scheduleSave = useCallback(() => {
    pendingChangesRef.current = true;
    setIsSaving(true);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // In a real app, this would actually save to a backend
    debounceTimerRef.current = setTimeout(() => {
      pendingChangesRef.current = false;
      setIsSaving(false);
      console.log("Form data saved (simulated):", formData);
    }, 1500);
  }, [formData, setIsSaving]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    scheduleSave,
    hasPendingChanges: () => pendingChangesRef.current
  };
};
