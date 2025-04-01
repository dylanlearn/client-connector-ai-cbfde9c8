
import { useState, useEffect, useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";

export function useIntakeForm() {
  const [formData, setFormData] = useState<IntakeFormData>(() => {
    // Initialize from localStorage if available
    const savedData = localStorage.getItem("intakeFormData");
    return savedData ? JSON.parse(savedData) : {};
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("intakeFormData", JSON.stringify(formData));
  }, [formData]);

  // Update form data (debounced to prevent excessive localStorage writes)
  const updateFormData = useCallback((data: Partial<IntakeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Clear form data (used after submission or manual reset)
  const clearFormData = useCallback(() => {
    localStorage.removeItem("intakeFormData");
    localStorage.removeItem("intakeFormStep");
    setFormData({});
  }, []);
  
  // Check if the form has been started
  const hasStartedForm = useCallback(() => {
    return Object.keys(formData).length > 0;
  }, [formData]);

  // Submit the complete form
  const submitForm = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would send the data to your backend
      console.log("Form submitted:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
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
    isLoading
  };
}
