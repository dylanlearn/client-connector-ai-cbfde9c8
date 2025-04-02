
import { useState, useEffect, useRef, useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";
import { loadFormData, saveFormData, getFormId } from "./storage-utils";

/**
 * Hook for managing the intake form state
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

  // Load form data from localStorage on initial render
  useEffect(() => {
    const initialData = loadFormData();
    setFormData(initialData);
  }, []);

  // Update form data and save to localStorage
  const updateFormData = useCallback((data: Partial<IntakeFormData>) => {
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        ...data,
        lastUpdated: new Date().toISOString()
      };
      saveFormData(updatedData);
      formDataCache.current = updatedData;
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
