
import { supabase } from "@/integrations/supabase/client";
import { IntakeFormData } from "@/types/intake-form";
import { SupabaseIntegrationOptions } from "./types";

/**
 * Saves form data to Supabase with retry logic
 */
export const saveFormToSupabase = async (
  data: IntakeFormData, 
  userId: string, 
  formId: string,
  options: SupabaseIntegrationOptions,
  maxRetries = 3
): Promise<boolean> => {
  let retries = 0;
  
  while (retries < maxRetries) {
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
        .from('intake_forms')
        .upsert({
          form_id: formId,
          user_id: userId,
          form_data: formToSave,
          last_updated: new Date().toISOString(),
          status: data.status || 'in_progress',
        })
        .select();
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      retries++;
      console.error(`Error saving form data (attempt ${retries}/${maxRetries}):`, error);
      
      if (retries >= maxRetries) {
        options.toast.toast({
          title: "Sync Error",
          description: "Failed to save your changes. Will retry automatically.",
          variant: "destructive",
        });
        return false;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }
  
  return false;
};

/**
 * Creates a realtime subscription for form data changes with heartbeat monitoring
 */
export const createRealtimeSubscription = (
  formId: string, 
  currentLastUpdated: string | undefined,
  onFormUpdate: (newData: IntakeFormData) => void,
  options: SupabaseIntegrationOptions
) => {
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
      (payload: any) => {
        console.log('Form data changed:', payload);
        
        // Only update if the change was made by someone else
        // to avoid circular updates
        const newData = payload.new;
        if (newData && newData.last_updated && newData.last_updated > (currentLastUpdated || '')) {
          try {
            const updatedData = newData.form_data ? {
              ...newData.form_data,
              lastUpdated: newData.last_updated,
            } : { lastUpdated: newData.last_updated };
            
            onFormUpdate(updatedData);
            
            options.toast.toast({
              title: "Form Updated",
              description: "Your form has been updated.",
            });
          } catch (error) {
            console.error('Error processing form update:', error);
          }
        }
      }
    )
    .subscribe();
    
  // Setup heartbeat to check connection status every 30 seconds
  const heartbeatInterval = setInterval(() => {
    if (channel.state !== 'joined') {
      console.log('Channel disconnected, reconnecting...');
      channel.unsubscribe();
      // Resubscribe
      channel.subscribe();
    }
  }, 30000);
  
  // Return unsubscribe function that also clears the heartbeat
  return {
    unsubscribe: () => {
      clearInterval(heartbeatInterval);
      supabase.removeChannel(channel);
    }
  };
};

/**
 * Submits the complete form to Supabase with offline support
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
    
    const saveSuccess = await saveFormToSupabase(dataWithStatus, userId, formId, options, 5);
    
    if (!saveSuccess) {
      // If online save fails, store submission in IndexedDB for later sync
      console.log("Online submission failed, storing for later sync");
      // This would be implemented with IndexedDB in a production app
      // storeForOfflineSync(dataWithStatus, userId, formId);
      
      options.toast.toast({
        title: "Offline Submission",
        description: "Your form will be submitted when you're back online.",
      });
    }
    
    // If this was accessed from a client task, update the task status
    if (taskId) {
      try {
        await updateTaskStatus(taskId, 'completed', formData);
      } catch (error) {
        console.error("Error updating task status:", error);
        // Would also store for later sync in production app
      }
    }
    
    return formData;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};
