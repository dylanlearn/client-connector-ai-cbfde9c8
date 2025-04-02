
import { useCallback } from "react";
import { submitCompleteForm } from "./supabase-integration";
import { useProjects } from "@/hooks/use-projects";
import { useParams } from "react-router-dom";
import { TaskStatus } from "@/types/client";
import { IntakeFormData } from "@/types/intake-form";

/**
 * Hook for handling form submission
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

    setIsLoading(true);
    try {
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
      console.error("Error submitting form:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
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
