
import { useState, useEffect, useRef, useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";
import { loadFormData, saveFormData, getFormId } from "./storage-utils";

/**
 * Hook for managing the intake form state with improved performance
 */
export const useIntakeFormState = () => {
  const [formData, setFormData] = useState<IntakeFormData>(() => loadFormData());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const formId = getFormId();
  const formDataCache = useRef<IntakeFormData>(formData);
  
  // Cache the form data
  useEffect(() => {
    formDataCache.current = formData;
  }, [formData]);

  // Load form data from localStorage on initial render only once
  useEffect(() => {
    const initialData = loadFormData();
    setFormData(initialData);
  }, []);

  // Optimized update function with memoization
  const updateFormData = useCallback((data: Partial<IntakeFormData>) => {
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        ...data,
        lastUpdated: new Date().toISOString()
      };
      
      // Only save if there are actual changes
      if (JSON.stringify(prevData) !== JSON.stringify(updatedData)) {
        saveFormData(updatedData);
        formDataCache.current = updatedData;
      }
      
      return updatedData;
    });
    return formDataCache.current;
  }, []);

  return {
    formData,
    formDataCache,
    setFormData,
    updateFormData,
    isLoading,
    setIsLoading,
    isSaving, 
    setIsSaving,
    formId
  };
};
