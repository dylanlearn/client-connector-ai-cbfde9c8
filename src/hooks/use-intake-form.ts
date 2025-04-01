
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
    setFormData(prev => {
      // Handle boolean fields correctly
      const updatedData: Partial<IntakeFormData> = { ...data };
      
      // Ensure boolean values are properly typed
      for (const key in updatedData) {
        if (typeof updatedData[key as keyof IntakeFormData] === 'string' && 
            (key === 'userAccountsRequired' || 
             key === 'freeTrialOffered' || 
             key === 'shippingIntegration' || 
             key === 'contactFormRequired' || 
             key === 'hasPhysicalLocation' || 
             key === 'resumeUploadRequired' ||
             key === 'logoUpload' ||
             key === 'existingBranding')) {
          const value = updatedData[key as keyof IntakeFormData];
          updatedData[key as keyof IntakeFormData] = 
            value === 'true' ? true : 
            value === 'false' ? false : 
            Boolean(value);
        }
      }
      
      return { ...prev, ...updatedData };
    });
  }, []);

  // Submit the complete form
  const submitForm = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would send the data to your backend
      console.log("Form submitted:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Clear form data after successful submission
      // localStorage.removeItem("intakeFormData");
      // localStorage.removeItem("intakeFormStep");
      
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
    isLoading
  };
}
