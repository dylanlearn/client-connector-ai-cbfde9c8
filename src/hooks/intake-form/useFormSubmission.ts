
import { useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";
import { TaskStatus } from "@/types/client";
import { ToastAdapter } from "./types";
import { submitCompleteForm } from "./supabase-integration";

/**
 * Hook for handling form submission
 */
export const useFormSubmission = (
  userId: string | undefined,
  formId: string,
  formDataCache: React.MutableRefObject<IntakeFormData>,
  setIsLoading: (loading: boolean) => void,
  toastAdapter: ToastAdapter,
  updateTaskStatus: (taskId: string, status: TaskStatus, data: any) => Promise<void>
) => {
  // Submit the complete form with offline support
  const submitForm = useCallback(async (): Promise<IntakeFormData> => {
    if (!userId) {
      throw new Error("User must be authenticated to submit form");
    }

    setIsLoading(true);
    try {
      // Create an adapter function to match the expected signature
      const adaptedUpdateTaskStatus = async (
        taskId: string, 
        status: string, 
        data: any
      ): Promise<void> => {
        await updateTaskStatus(taskId, status as TaskStatus, data);
      };

      return await submitCompleteForm(
        formDataCache.current, 
        userId, 
        formId, 
        null, // taskId is passed from the parent component
        adaptedUpdateTaskStatus,
        { toast: toastAdapter }
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId, formId, formDataCache, setIsLoading, toastAdapter, updateTaskStatus]);

  return {
    submitForm
  };
};
