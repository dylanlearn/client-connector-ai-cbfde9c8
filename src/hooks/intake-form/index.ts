
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { updateTaskStatus as clientUpdateTaskStatus } from "@/services/client-tasks-service";
import { TaskStatus } from "@/types/client";
import { 
  saveStep, 
  getSavedStep, 
  clearFormStorage,
  hasInProgressForm
} from "./storage-utils";
import { ToastAdapter } from "./types";
import { useIntakeFormState } from "./useIntakeFormState";
import { useFormSync } from "./useFormSync";
import { useFormSubmission } from "./useFormSubmission";

/**
 * Hook for managing intake form state and persistence with improved caching and error handling
 */
export const useIntakeForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { taskId } = useParams();
  
  // Create a toast adapter to match the expected interface
  const toastAdapter: ToastAdapter = {
    toast: (props) => {
      toast(props);
      return { id: '', dismiss: () => {}, update: () => {} };
    }
  };
  
  // Initialize form state
  const { 
    formData, 
    formDataCache, 
    updateFormData, 
    setFormData,
    isLoading, 
    setIsLoading,
    isSaving, 
    setIsSaving,
    formId 
  } = useIntakeFormState();

  // Initialize form sync
  const { scheduleSave } = useFormSync(
    user?.id,
    formId,
    formData,
    formDataCache,
    setFormData,
    setIsSaving,
    toastAdapter
  );

  // Initialize form submission
  // Create an adapter function for updateTaskStatus to match the expected signature
  const adaptedUpdateTaskStatus = async (
    taskId: string, 
    status: TaskStatus, 
    data: any
  ): Promise<void> => {
    await clientUpdateTaskStatus(taskId, status, data);
  };

  const { submitForm } = useFormSubmission(
    user?.id,
    formId,
    formDataCache,
    setIsLoading,
    toastAdapter,
    adaptedUpdateTaskStatus
  );

  // Override updateFormData to trigger Supabase sync
  const enhancedUpdateFormData = useCallback((data: Partial<any>) => {
    const updatedData = updateFormData(data);
    scheduleSave();
    return updatedData;
  }, [updateFormData, scheduleSave]);

  // Clear form data
  const clearFormData = useCallback(() => {
    clearFormStorage();
    const emptyForm = { formId };
    setFormData(emptyForm);
    formDataCache.current = emptyForm;
  }, [formId, setFormData, formDataCache]);

  // Check if the form has been started
  const hasStartedForm = useCallback(() => {
    return Object.keys(formData).length > 1;
  }, [formData]);

  return {
    formData,
    updateFormData: enhancedUpdateFormData,
    submitForm: async () => {
      if (taskId) {
        return submitForm();
      } else {
        return submitForm();
      }
    },
    clearFormData,
    hasStartedForm,
    isLoading,
    isSaving,
    getSavedStep,
    saveCurrentStep: saveStep,
    hasInProgressForm,
    formId
  };
};
