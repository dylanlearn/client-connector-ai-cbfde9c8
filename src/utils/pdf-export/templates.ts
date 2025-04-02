
import { supabase } from "@/integrations/supabase/client";
import { PDFGenerationOptions } from "./types";
import { toast } from "sonner";

/**
 * Interface for a saved PDF styling template
 */
export interface PDFStylingTemplate {
  id: string;
  name: string;
  description?: string;
  is_company_default?: boolean;
  styling: PDFGenerationOptions['styling'];
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches all available PDF styling templates for the current user
 * @returns Array of PDF styling templates
 */
export const fetchPDFTemplates = async (): Promise<PDFStylingTemplate[]> => {
  try {
    // Use type assertion to tell TypeScript this table exists
    const { data, error } = await supabase
      .from('pdf_styling_templates' as any)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as PDFStylingTemplate[] || [];
  } catch (error) {
    console.error('Error fetching PDF templates:', error);
    toast.error("Failed to load templates", {
      description: "Please try again later"
    });
    return [];
  }
};

/**
 * Saves a new PDF styling template
 * @param template Template to save
 * @returns Saved template with ID if successful
 */
export const savePDFTemplate = async (
  name: string,
  description: string | undefined,
  styling: PDFGenerationOptions['styling'],
  isCompanyDefault: boolean = false
): Promise<PDFStylingTemplate | null> => {
  try {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Use type assertion to tell TypeScript this table exists
    const { data, error } = await supabase
      .from('pdf_styling_templates' as any)
      .insert({
        user_id: userId,
        name,
        description,
        styling,
        is_company_default: isCompanyDefault
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Template saved", {
      description: `"${name}" is now available in your templates`
    });
    
    return data as PDFStylingTemplate;
  } catch (error) {
    console.error('Error saving PDF template:', error);
    toast.error("Failed to save template", {
      description: "Please check your connection and try again"
    });
    return null;
  }
};

/**
 * Updates an existing PDF styling template
 * @param templateId ID of the template to update
 * @param updates Updates to apply to the template
 * @returns Updated template if successful
 */
export const updatePDFTemplate = async (
  templateId: string,
  updates: Partial<Omit<PDFStylingTemplate, 'id' | 'created_at' | 'updated_at'>>
): Promise<PDFStylingTemplate | null> => {
  try {
    // Use type assertion to tell TypeScript this table exists
    const { data, error } = await supabase
      .from('pdf_styling_templates' as any)
      .update(updates)
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Template updated", {
      description: `Changes to "${updates.name || 'template'}" have been saved`
    });
    
    return data as PDFStylingTemplate;
  } catch (error) {
    console.error('Error updating PDF template:', error);
    toast.error("Failed to update template", {
      description: "Please check your permissions and try again"
    });
    return null;
  }
};

/**
 * Deletes a PDF styling template
 * @param templateId ID of the template to delete
 * @returns Success status
 */
export const deletePDFTemplate = async (templateId: string): Promise<boolean> => {
  try {
    // Use type assertion to tell TypeScript this table exists
    const { error } = await supabase
      .from('pdf_styling_templates' as any)
      .delete()
      .eq('id', templateId);
    
    if (error) throw error;
    
    toast.success("Template deleted", {
      description: "The template has been removed"
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting PDF template:', error);
    toast.error("Failed to delete template", {
      description: "Please check your permissions and try again"
    });
    return false;
  }
};

/**
 * Applies a template's styling to the current PDF generation options
 * @param options Current PDF generation options
 * @param template Template to apply
 * @returns Updated PDF generation options
 */
export const applyPDFTemplate = (
  options: PDFGenerationOptions,
  template: PDFStylingTemplate
): PDFGenerationOptions => {
  return {
    ...options,
    styling: {
      ...options.styling,
      ...template.styling
    }
  };
};
