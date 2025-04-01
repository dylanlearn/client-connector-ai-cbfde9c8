
import { useState, useEffect, useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";
import { useLocation } from "react-router-dom";
import { updateTaskStatus } from "@/utils/client-service";

// The key used for storing form data in localStorage
const STORAGE_KEY_FORM_DATA = "intakeFormData";
const STORAGE_KEY_FORM_STEP = "intakeFormStep";

export function useIntakeForm() {
  const [formData, setFormData] = useState<IntakeFormData>(() => {
    // Initialize from localStorage if available
    const savedData = localStorage.getItem(STORAGE_KEY_FORM_DATA);
    return savedData ? JSON.parse(savedData) : {};
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [taskId, setTaskId] = useState<string | null>(null);

  // Extract task ID from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const taskIdParam = urlParams.get('taskId');
    if (taskIdParam) {
      setTaskId(taskIdParam);
    }
  }, [location.search]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FORM_DATA, JSON.stringify(formData));
  }, [formData]);

  // Update form data
  const updateFormData = useCallback((data: Partial<IntakeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Clear form data (used after submission or manual reset)
  const clearFormData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_FORM_DATA);
    localStorage.removeItem(STORAGE_KEY_FORM_STEP);
    setFormData({});
  }, []);
  
  // Check if the form has been started
  const hasStartedForm = useCallback(() => {
    return Object.keys(formData).length > 0;
  }, [formData]);

  // Get the current form step from localStorage
  const getSavedStep = useCallback(() => {
    const savedStep = localStorage.getItem(STORAGE_KEY_FORM_STEP);
    return savedStep ? parseInt(savedStep) : 1;
  }, []);

  // Save the current form step to localStorage
  const saveCurrentStep = useCallback((step: number) => {
    localStorage.setItem(STORAGE_KEY_FORM_STEP, step.toString());
  }, []);

  // Check if there's a form in progress
  const hasInProgressForm = useCallback(() => {
    return hasStartedForm() && localStorage.getItem(STORAGE_KEY_FORM_STEP) !== null;
  }, [hasStartedForm]);

  // Submit the complete form
  const submitForm = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would send the data to your backend
      console.log("Form submitted:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // If this was accessed from a client task, update the task status
      if (taskId) {
        await updateTaskStatus(taskId, 'completed', formData);
      }
      
      // Clear form data after successful submission
      // Commented out to allow for viewing results after submission
      // clearFormData();
      
      return formData;
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    updateFormData,
    submitForm,
    clearFormData,
    hasStartedForm,
    isLoading,
    getSavedStep,
    saveCurrentStep,
    hasInProgressForm
  };
}
