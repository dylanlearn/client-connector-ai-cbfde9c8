
import { IntakeFormData } from "@/types/intake-form";

export interface UseIntakeFormReturn {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
  submitForm: () => Promise<IntakeFormData>;
  clearFormData: () => void;
  hasStartedForm: () => boolean;
  isLoading: boolean;
  isSaving: boolean;
  getSavedStep: () => number;
  saveCurrentStep: (step: number) => void;
  hasInProgressForm: () => boolean;
  formId: string;
}

export interface SupabaseIntegrationOptions {
  toast: {
    toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void;
  };
}
