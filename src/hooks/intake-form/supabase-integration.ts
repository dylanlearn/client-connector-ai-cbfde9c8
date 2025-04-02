
import { supabase } from "@/integrations/supabase/client";
import { IntakeFormData } from "@/types/intake-form";
import { SupabaseIntegrationOptions } from "./types";

/**
 * Saves form data to Supabase
 */
export const saveFormToSupabase = async (
  data: IntakeFormData, 
  userId: string, 
  formId: string,
  options: SupabaseIntegrationOptions
): Promise<boolean> => {
  try {
    // Add timestamps and IDs
    const formToSave = {
      ...data,
      lastUpdated: new Date().toISOString(),
      user_id: userId,
      form_id: formId,
    };
    
    // Upsert to Supabase
    const { error } = await supabase
      .from('project_intake_forms')
      .upsert({
        form_id: formId,
        user_id: userId,
        form_data: formToSave,
        last_updated: new Date().toISOString(),
      })
      .select();
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error saving form data:", error);
    options.toast.toast({
      title: "Sync Error",
      description: "Failed to save your changes. Will retry automatically.",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Creates a realtime subscription for form data changes
 */
export const createRealtimeSubscription = (
  formId: string, 
  currentLastUpdated: string | undefined,
  onFormUpdate: (newData: IntakeFormData) => void,
  options: SupabaseIntegrationOptions
) => {
  // Subscribe to intake_forms table changes for this specific form
  const channel = supabase.channel('public:project_intake_forms')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'project_intake_forms',
        filter: `form_id=eq.${formId}`,
      },
      (payload) => {
        console.log('Form data changed:', payload);
        
        // Only update if the change was made by someone else
        // to avoid circular updates
        const newData = payload.new as any;
        if (newData && newData.last_updated > (currentLastUpdated || '')) {
          const updatedData = {
            ...newData.form_data,
            lastUpdated: newData.last_updated,
          };
          
          onFormUpdate(updatedData);
          
          options.toast.toast({
            title: "Form Updated",
            description: "Your form has been updated.",
          });
        }
      }
    )
    .subscribe();
    
  return channel;
};

/**
 * Submits the complete form to Supabase
 */
export const submitCompleteForm = async (
  formData: IntakeFormData, 
  userId: string, 
  formId: string,
  taskId: string | null,
  updateTaskStatus: (taskId: string, status: string, data: any) => Promise<void>,
  options: SupabaseIntegrationOptions
): Promise<IntakeFormData> => {
  try {
    // In a real app, this would send the data to your backend
    console.log("Form submitted:", formData);
    
    // Final save to Supabase with completed status
    const dataWithStatus = {
      ...formData,
      status: 'completed'
    };
    
    await saveFormToSupabase(dataWithStatus, userId, formId, options);
    
    // If this was accessed from a client task, update the task status
    if (taskId) {
      await updateTaskStatus(taskId, 'completed', formData);
    }
    
    return formData;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};
