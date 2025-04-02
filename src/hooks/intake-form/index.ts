
import { useState, useEffect, useCallback, useRef } from "react";
import { IntakeFormData } from "@/types/intake-form";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { TaskStatus } from "@/types/client";
import { updateTaskStatus as clientUpdateTaskStatus } from "@/services/client-tasks-service";
import { 
  loadFormData, 
  saveFormData, 
  saveStep, 
  getSavedStep, 
  clearFormStorage, 
  getFormId,
  hasInProgressForm as checkInProgressForm
} from "./storage-utils";
import { 
  saveFormToSupabase, 
  createRealtimeSubscription,
  submitCompleteForm
} from "./supabase-integration";
import { UseIntakeFormReturn } from "./types";

/**
 * Hook for managing intake form state and persistence with improved caching and error handling
 */
export const useIntakeForm = (): UseIntakeFormReturn => {
  const [formData, setFormData] = useState<IntakeFormData>(() => loadFormData());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { taskId } = useParams();
  const formId = getFormId();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef<boolean>(false);
  const formDataCache = useRef<IntakeFormData>(formData);
  
  // Cache the form data
  useEffect(() => {
    formDataCache.current = formData;
  }, [formData]);

  // Load form data from localStorage on initial render
  useEffect(() => {
    const initialData = loadFormData();
    setFormData(initialData);
  }, []);

  // Setup realtime updates if user is authenticated
  useEffect(() => {
    if (!user) return;

    const toastWrapper = {
      toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => {
        toast(props);
      }
    };

    const subscription = createRealtimeSubscription(
      formId,
      formData.lastUpdated,
      (newData) => setFormData(prevData => ({...prevData, ...newData})),
      { toast: toastWrapper }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [formId, formData.lastUpdated, user, toast]);

  // Scheduler for saving to Supabase - more robust
  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    pendingChangesRef.current = true;
    
    saveTimeoutRef.current = setTimeout(async () => {
      if (!user || Object.keys(formDataCache.current).length <= 1) {
        pendingChangesRef.current = false;
        return;
      }
      
      const toastWrapper = {
        toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => {
          toast(props);
        }
      };
      
      setIsSaving(true);
      try {
        await saveFormToSupabase(formDataCache.current, user.id, formId, { toast: toastWrapper });
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
  }, [user, formId, toast]);

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

  // Update form data and save to localStorage
  const updateFormData = useCallback((data: Partial<IntakeFormData>) => {
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        ...data,
        lastUpdated: new Date().toISOString()
      };
      saveFormData(updatedData);
      formDataCache.current = updatedData;
      scheduleSave();
      return updatedData;
    });
  }, [scheduleSave]);

  // Submit the complete form with offline support
  const submitForm = useCallback(async (): Promise<IntakeFormData> => {
    if (!user) {
      throw new Error("User must be authenticated to submit form");
    }

    setIsLoading(true);
    try {
      const toastWrapper = {
        toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => {
          toast(props);
        }
      };

      // Create an adapter function to match the expected signature
      const adaptedUpdateTaskStatus = async (
        taskId: string, 
        status: string, 
        data: any
      ): Promise<void> => {
        await clientUpdateTaskStatus(taskId, status as TaskStatus, data);
      };

      return await submitCompleteForm(
        formDataCache.current, 
        user.id, 
        formId, 
        taskId || null,
        adaptedUpdateTaskStatus,
        { toast: toastWrapper }
      );
    } finally {
      setIsLoading(false);
    }
  }, [user, formId, taskId, toast]);

  // Clear form data
  const clearFormData = useCallback(() => {
    clearFormStorage();
    const emptyForm = { formId };
    setFormData(emptyForm);
    formDataCache.current = emptyForm;
  }, [formId]);

  // Check if the form has been started
  const hasStartedForm = useCallback(() => {
    return Object.keys(formData).length > 1;
  }, [formData]);

  // Check if there's a form in progress
  const hasInProgressForm = useCallback(() => {
    return checkInProgressForm(formData);
  }, [formData]);

  // Save current step
  const saveCurrentStep = useCallback((step: number) => {
    saveStep(step);
  }, []);

  return {
    formData,
    updateFormData,
    submitForm,
    clearFormData,
    hasStartedForm,
    isLoading,
    isSaving,
    getSavedStep,
    saveCurrentStep,
    hasInProgressForm,
    formId
  };
};
