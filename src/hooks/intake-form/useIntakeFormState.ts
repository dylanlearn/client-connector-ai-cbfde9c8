
// Create a new useIntakeFormState hook
import { useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { IntakeFormData } from "@/types/intake-form";
import { getFormData, saveFormData } from "./storage-utils";

export const useIntakeFormState = () => {
  // Retrieve stored data or create new empty object
  const initialFormData = getFormData();
  const [formData, setFormData] = useState<IntakeFormData>(initialFormData);
  const formDataCache = useRef<IntakeFormData>({...initialFormData});
  const [isSaving, setIsSaving] = useState(false);
  
  // Generate a unique form ID if not exists
  const formId = useRef(initialFormData.formId || uuidv4()).current;
  
  // Update form data - this will be wrapped by the main hook
  const updateFormData = useCallback((data: Partial<IntakeFormData>): IntakeFormData => {
    setFormData(prev => {
      const updated = { ...prev, ...data };
      formDataCache.current = updated;
      saveFormData({...updated, formId});
      return updated;
    });
    return formDataCache.current;
  }, [formId]);
  
  return {
    formData,
    setFormData,
    formDataCache,
    updateFormData,
    isSaving,
    setIsSaving,
    formId
  };
};
