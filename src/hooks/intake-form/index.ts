
import { useState, useEffect, useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";
import { useLocation } from "react-router-dom";
import { updateTaskStatus } from "@/utils/client-service";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { UseIntakeFormReturn } from "./types";
import { 
  loadFormData, 
  saveFormData, 
  saveStep, 
  getSavedStep as getStep, 
  clearFormStorage, 
  getFormId,
  hasInProgressForm as hasInProgress
} from "./storage-utils";
import {
  saveFormToSupabase,
  createRealtimeSubscription,
  submitCompleteForm
} from "./supabase-integration";

export function useIntakeForm(): UseIntakeFormReturn {
  const { user } = useAuth();
  const toast = useToast();
  const [formId, setFormId] = useState<string>(() => getFormId());
  
  const [formData, setFormData] = useState<IntakeFormData>(() => loadFormData());
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const location = useLocation();
  const [taskId, setTaskId] = useState<string | null>(null);

  // Setup realtime subscription for form data changes
  useEffect(() => {
    if (!user) return;
    
    const channel = createRealtimeSubscription(
      formId,
      formData.lastUpdated,
      (updatedData) => {
        // Update local state without triggering another save
        setFormData(updatedData);
        saveFormData(updatedData);
      },
      { toast }
    );
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, formId, formData.lastUpdated, toast]);

  // Extract task ID from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const taskIdParam = urlParams.get('taskId');
    if (taskIdParam) {
      setTaskId(taskIdParam);
    }
  }, [location.search]);

  // Save form data to Supabase
  const saveToSupabase = useCallback(async (data: IntakeFormData) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Add timestamps and IDs
      const formToSave = {
        ...data,
        lastUpdated: new Date().toISOString(),
        user_id: user.id,
        form_id: formId,
      };
      
      // Update localStorage with the updated timestamp
      setFormData(formToSave);
      saveFormData(formToSave);
      
      await saveFormToSupabase(formToSave, user.id, formId, { toast });
      
    } finally {
      setIsSaving(false);
    }
  }, [user, formId, toast]);

  // Debounced form save - saves 1 second after the last update
  useEffect(() => {
    if (!user || Object.keys(formData).length <= 1) return; // Skip if only formId is present
    
    const timer = setTimeout(() => {
      saveToSupabase(formData);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [formData, saveToSupabase, user]);

  // Update form data
  const updateFormData = useCallback((data: Partial<IntakeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Clear form data (used after submission or manual reset)
  const clearFormData = useCallback(() => {
    clearFormStorage();
    setFormData({});
    setFormId(uuidv4());
  }, []);
  
  // Check if the form has been started
  const hasStartedForm = useCallback(() => {
    return Object.keys(formData).length > 1; // More than just formId
  }, [formData]);

  // Get the current form step from localStorage
  const getSavedStep = useCallback(() => {
    return getStep();
  }, []);

  // Save the current form step to localStorage
  const saveCurrentStep = useCallback((step: number) => {
    saveStep(step);
  }, []);

  // Check if there's a form in progress
  const hasInProgressForm = useCallback(() => {
    return hasInProgress(formData);
  }, [formData]);

  // Submit the complete form
  const submitForm = async () => {
    setIsLoading(true);
    try {
      return await submitCompleteForm(
        formData, 
        user?.id || '', 
        formId, 
        taskId,
        updateTaskStatus,
        { toast }
      );
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
    isSaving,
    getSavedStep,
    saveCurrentStep,
    hasInProgressForm,
    formId
  };
}
