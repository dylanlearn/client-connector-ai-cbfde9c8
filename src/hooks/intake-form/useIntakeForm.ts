
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { IntakeFormData } from "@/types/intake-form";
import { useIntakeFormState } from "./useIntakeFormState";
import { useFormSync } from "./useFormSync";
import { 
  clearFormStorage, 
  saveStep, 
  getSavedStep,
  hasInProgressForm as checkInProgressForm 
} from "./storage-utils";

/**
 * Main hook for managing the intake form
 * Combines form state, form submission, and other utilities
 */
export const useIntakeForm = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    formData,
    formDataCache,
    setFormData,
    updateFormData,
    isSaving,
    setIsSaving,
    formId
  } = useIntakeFormState();

  // Setup form sync with Supabase if user is authenticated
  const { scheduleSave, hasPendingChanges } = useFormSync(
    user?.id,
    formId,
    formData,
    formDataCache,
    setFormData,
    setIsSaving,
    toast
  );

  // Watch for formData changes and schedule save operations
  const handleUpdateFormData = useCallback((data: Partial<IntakeFormData>) => {
    const updated = updateFormData(data);
    scheduleSave();
    return updated;
  }, [updateFormData, scheduleSave]);

  // Submit the form
  const submitForm = useCallback(async (): Promise<IntakeFormData> => {
    setIsLoading(true);
    
    try {
      // In a real app, you would submit to an API here
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear the form data after successful submission
      // clearFormStorage(); // Uncomment to clear storage after submission
      
      return formData;
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit the form. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [formData, toast]);

  // Clear form data from storage
  const clearFormData = useCallback(() => {
    clearFormStorage();
    setFormData({});
  }, [setFormData]);

  // Check if form has been started
  const hasStartedForm = useCallback(() => {
    return Object.keys(formData).length > 1;
  }, [formData]);

  // Save current step to localStorage
  const saveCurrentStep = useCallback((step: number) => {
    saveStep(step);
  }, []);

  // Check if there's a form in progress
  const hasInProgressForm = useCallback(() => {
    return checkInProgressForm();
  }, []);

  return {
    formData,
    updateFormData: handleUpdateFormData,
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
