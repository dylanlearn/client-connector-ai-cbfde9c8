
import { useCallback } from "react";
import { submitCompleteForm } from "./supabase-integration";
import { useProjects } from "@/hooks/use-projects";
import { useParams } from "react-router-dom";
import { TaskStatus } from "@/types/client";
import { IntakeFormData } from "@/types/intake-form";

/**
 * Hook for handling form submission with enhanced error handling and retry logic
 */
export const useFormSubmission = (
  userId: string | undefined,
  formId: string,
  formDataCache: React.MutableRefObject<IntakeFormData>,
  setIsLoading: (loading: boolean) => void,
  toastAdapter: any,
  updateTaskStatus: (taskId: string, status: TaskStatus, data: any) => Promise<void>
) => {
  const { taskId } = useParams();
  const { createProject } = useProjects();

  const submitForm = useCallback(async () => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    let retryCount = 0;
    const maxRetries = 2;
    
    const attemptSubmission = async (): Promise<any> => {
      try {
        setIsLoading(true);
        
        // Submit form data to Supabase
        const result = await submitCompleteForm(
          formDataCache.current,
          userId,
          formId,
          taskId || null,
          updateTaskStatus,
          toastAdapter
        );

        // Create a new project based on the form data
        if (result.projectName) {
          await createProject.mutateAsync({
            user_id: userId,
            title: result.projectName || "New Website Project",
            client_name: "Self",
            client_email: "",
            project_type: result.siteType || "website",
            description: result.projectDescription || "",
            status: "active",
            // Save the form ID in the metadata to link back to the intake form
            intake_form_id: formId
          });
        }

        return result;
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying submission (${retryCount}/${maxRetries})...`);
          // Exponential backoff: wait longer between each retry
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          return attemptSubmission();
        } else {
          console.error("Error submitting form after retries:", error);
          throw error;
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    return attemptSubmission();
  }, [
    userId,
    formId,
    formDataCache,
    taskId,
    updateTaskStatus,
    setIsLoading,
    toastAdapter,
    createProject
  ]);

  return {
    submitForm
  };
};
