
import { useCallback } from "react";
import { submitCompleteForm } from "./supabase-integration";
import { useParams } from "react-router-dom";
import { TaskStatus } from "@/types/client";
import { IntakeFormData } from "@/types/intake-form";
import { ProjectService } from "@/services/project-service";
import { toast } from "sonner";
import { withRetry } from "@/utils/retry-utils";
import { recordClientError } from "@/utils/monitoring/api-usage";

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

  const submitForm = useCallback(async () => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Use the withRetry utility for reliable submissions
    return withRetry(
      async () => {
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
            try {
              await ProjectService.createProject({
                // user_id is handled internally by the service
                title: result.projectName || "New Website Project",
                client_name: "Self",
                client_email: "",
                project_type: result.siteType || "website",
                description: result.projectDescription || null,
                status: "active",
                // Save the form ID in the metadata to link back to the intake form
                intake_form_id: formId
              });
              toast.success("Project created successfully");
            } catch (error) {
              console.error("Error creating project:", error);
              toast.error("Failed to create project");
              
              // Log detailed error for monitoring
              recordClientError(
                "Failed to create project after form submission",
                (error as Error)?.stack || null,
                "ProjectCreation"
              );
              
              // Still return the form result even if project creation failed
            }
          }

          return result;
        } finally {
          setIsLoading(false);
        }
      },
      {
        maxRetries: 2,
        initialDelay: 1000,
        backoffFactor: 2,
        onRetry: (attempt, error) => {
          console.log(`Retrying submission (${attempt}/2)...`);
          toast.error(`Submission failed, retrying (${attempt}/2)`, {
            description: error.message
          });
        }
      }
    );
  }, [
    userId,
    formId,
    formDataCache,
    taskId,
    updateTaskStatus,
    setIsLoading,
    toastAdapter
  ]);

  return {
    submitForm
  };
};
