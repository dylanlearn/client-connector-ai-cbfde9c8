import { useState } from 'react';
import { toast } from 'sonner';
import { TaskStatus } from "@/types/client";

interface UseFormSubmissionProps {
  taskId: string;
  onSubmit: (data: any) => Promise<boolean>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useFormSubmission = ({ taskId, onSubmit, onSuccess, onError }: UseFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<Error | null>(null);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const success = await onSubmit(data);

      if (success) {
        toast.success("Form submitted successfully!");
        onSuccess?.();
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      setSubmissionError(error instanceof Error ? error : new Error("Form submission failed"));
      toast.error(error.message || "Failed to submit the form. Please try again.");
      onError?.(error instanceof Error ? error : new Error("Form submission failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submissionError,
    handleSubmit,
  };
};
