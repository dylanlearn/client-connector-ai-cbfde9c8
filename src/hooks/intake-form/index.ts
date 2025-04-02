
import { useState, useEffect, useCallback } from "react";
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
 * Hook for managing intake form state and persistence
 */
export const useIntakeForm = (): UseIntakeFormReturn => {
  const [formData, setFormData] = useState<IntakeFormData>(() => loadFormData());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { taskId } = useParams();
  const formId = getFormId();

  // Load form data from localStorage on initial render
  useEffect(() => {
    const initialData = loadFormData();
    setFormData(initialData);
  }, []);

  // Setup realtime updates if user is authenticated
  useEffect(() => {
    if (!user) return;

    const channel = createRealtimeSubscription(
      formId,
      formData.lastUpdated,
      (newData) => setFormData(newData),
      { toast }
    );
    
    return () => {
      channel.unsubscribe();
    };
  }, [formId, formData.lastUpdated, user, toast]);

  // Save form data to Supabase when it changes
  useEffect(() => {
    if (!user || Object.keys(formData).length <= 1) return;

    const saveToSupabase = async () => {
      setIsSaving(true);
      try {
        await saveFormToSupabase(formData, user.id, formId, { toast });
      } finally {
        setIsSaving(false);
      }
    };

    // Debounce saving to Supabase
    const timeoutId = setTimeout(saveToSupabase, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, user, formId, toast]);

  // Update form data and save to localStorage
  const updateFormData = useCallback((data: Partial<IntakeFormData>) => {
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        ...data,
        lastUpdated: new Date().toISOString()
      };
      saveFormData(updatedData);
      return updatedData;
    });
  }, []);

  // Submit the complete form
  const submitForm = useCallback(async (): Promise<IntakeFormData> => {
    if (!user) {
      throw new Error("User must be authenticated to submit form");
    }

    setIsLoading(true);
    try {
      // Adapter function to match the expected signature
      const adaptedUpdateTaskStatus = async (
        taskId: string, 
        status: string, 
        data: any
      ): Promise<void> => {
        await clientUpdateTaskStatus(taskId, status as TaskStatus, data);
      };

      return await submitCompleteForm(
        formData, 
        user.id, 
        formId, 
        taskId || null,
        adaptedUpdateTaskStatus,
        { toast }
      );
    } finally {
      setIsLoading(false);
    }
  }, [formData, user, formId, taskId, toast]);

  // Clear form data
  const clearFormData = useCallback(() => {
    clearFormStorage();
    setFormData({ formId });
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
