
import { supabase } from "@/integrations/supabase/client";

export async function exportToNotion(pdfBase64: string, title: string, description?: string) {
  try {
    const { data, error } = await supabase.functions.invoke('export-to-notion', {
      body: {
        pdfBase64,
        title,
        description
      }
    });

    if (error) {
      throw new Error(error.message || 'Failed to export to Notion');
    }

    return data;
  } catch (error: any) {
    console.error('Error invoking export-to-notion function:', error);
    throw error;
  }
}
