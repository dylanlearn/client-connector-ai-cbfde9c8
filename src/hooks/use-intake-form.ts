
import { useState, useEffect, useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";
import { useLocation } from "react-router-dom";
import { updateTaskStatus } from "@/utils/client-service";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

// The key used for storing form data in localStorage
const STORAGE_KEY_FORM_DATA = "intakeFormData";
const STORAGE_KEY_FORM_STEP = "intakeFormStep";
const STORAGE_KEY_FORM_ID = "intakeFormId";

export function useIntakeForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formId, setFormId] = useState<string>(() => {
    // Initialize formId from localStorage or create a new one
    const savedFormId = localStorage.getItem(STORAGE_KEY_FORM_ID);
    return savedFormId || uuidv4();
  });
  
  const [formData, setFormData] = useState<IntakeFormData>(() => {
    // Initialize from localStorage if available
    const savedData = localStorage.getItem(STORAGE_KEY_FORM_DATA);
    return savedData ? JSON.parse(savedData) : { formId };
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const location = useLocation();
  const [taskId, setTaskId] = useState<string | null>(null);

  // Setup realtime subscription for form data changes
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to intake_forms table changes for this specific form
    const channel = supabase.channel('public:intake_forms')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'intake_forms',
          filter: `form_id=eq.${formId}`,
        },
        (payload) => {
          console.log('Form data changed:', payload);
          
          // Only update if the change was made by someone else
          // to avoid circular updates
          if (payload.new && payload.new.last_updated > formData.lastUpdated) {
            const updatedData = {
              ...payload.new,
              lastUpdated: payload.new.last_updated,
            };
            
            // Update local state without triggering another save
            setFormData(updatedData);
            localStorage.setItem(STORAGE_KEY_FORM_DATA, JSON.stringify(updatedData));
            
            toast({
              title: "Form Updated",
              description: "Your form has been updated.",
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, formId, formData.lastUpdated]);

  // Extract task ID from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const taskIdParam = urlParams.get('taskId');
    if (taskIdParam) {
      setTaskId(taskIdParam);
    }
  }, [location.search]);

  // Save form ID to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FORM_ID, formId);
  }, [formId]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FORM_DATA, JSON.stringify(formData));
  }, [formData]);

  // Save form data to Supabase
  const saveFormToSupabase = useCallback(async (data: IntakeFormData) => {
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
      localStorage.setItem(STORAGE_KEY_FORM_DATA, JSON.stringify(formToSave));
      
      // Upsert to Supabase
      const { error } = await supabase
        .from('intake_forms')
        .upsert({
          form_id: formId,
          user_id: user.id,
          form_data: formToSave,
          last_updated: new Date().toISOString(),
        })
        .select();
        
      if (error) throw error;
      
    } catch (error) {
      console.error("Error saving form data:", error);
      toast({
        title: "Sync Error",
        description: "Failed to save your changes. Will retry automatically.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, formId]);

  // Debounced form save - saves 1 second after the last update
  useEffect(() => {
    if (!user || Object.keys(formData).length <= 1) return; // Skip if only formId is present
    
    const timer = setTimeout(() => {
      saveFormToSupabase(formData);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [formData, saveFormToSupabase, user]);

  // Update form data
  const updateFormData = useCallback((data: Partial<IntakeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Clear form data (used after submission or manual reset)
  const clearFormData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_FORM_DATA);
    localStorage.removeItem(STORAGE_KEY_FORM_STEP);
    localStorage.removeItem(STORAGE_KEY_FORM_ID);
    setFormData({});
    setFormId(uuidv4());
  }, []);
  
  // Check if the form has been started
  const hasStartedForm = useCallback(() => {
    return Object.keys(formData).length > 1; // More than just formId
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
      
      // Final save to Supabase
      await saveFormToSupabase({
        ...formData,
        status: 'completed',
      });
      
      // If this was accessed from a client task, update the task status
      if (taskId) {
        await updateTaskStatus(taskId, 'completed', formData);
      }
      
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
    isSaving,
    getSavedStep,
    saveCurrentStep,
    hasInProgressForm,
    formId
  };
}
