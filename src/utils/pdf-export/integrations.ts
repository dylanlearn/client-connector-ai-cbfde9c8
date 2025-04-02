
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Interface for third-party integration export response
 */
export interface IntegrationExportResponse {
  success: boolean;
  url?: string;
  message?: string;
}

/**
 * Sends a PDF to Notion as a new page
 * @param pdfBlob The PDF blob
 * @param title The title of the document
 * @param description Optional description to include with the document
 * @returns Promise with the response containing success status and page URL
 */
export const sendPDFToNotion = async (
  pdfBlob: Blob,
  title: string,
  description?: string
): Promise<IntegrationExportResponse> => {
  try {
    // Convert blob to base64
    const reader = new FileReader();
    const pdfBase64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64 = reader.result?.toString().split(',')[1];
        resolve(base64 || '');
      };
      reader.readAsDataURL(pdfBlob);
    });

    // Send to Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('export-to-notion', {
      body: {
        pdfBase64,
        title,
        description
      }
    });

    if (error) {
      throw error;
    }

    toast.success("Exported to Notion", {
      description: `Your document has been added to Notion`
    });
    
    return {
      success: true,
      url: data?.pageUrl,
      message: "Document exported to Notion successfully"
    };
  } catch (error) {
    console.error('Error exporting to Notion:', error);
    toast.error("Failed to export to Notion", {
      description: "Check your Notion integration settings and try again"
    });
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

/**
 * Sends a PDF to Slack as a file in a channel
 * @param pdfBlob The PDF blob
 * @param title The title/filename for the document
 * @param channel Optional channel to send to (defaults to configured default)
 * @param message Optional message to include with the file
 * @returns Promise with the response containing success status
 */
export const sendPDFToSlack = async (
  pdfBlob: Blob,
  title: string,
  channel?: string,
  message?: string
): Promise<IntegrationExportResponse> => {
  try {
    // Convert blob to base64
    const reader = new FileReader();
    const pdfBase64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64 = reader.result?.toString().split(',')[1];
        resolve(base64 || '');
      };
      reader.readAsDataURL(pdfBlob);
    });

    // Send to Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('export-to-slack', {
      body: {
        pdfBase64,
        title,
        channel,
        message
      }
    });

    if (error) {
      throw error;
    }

    toast.success("Sent to Slack", {
      description: `The PDF has been shared in ${data?.channel || 'your Slack workspace'}`
    });
    
    return {
      success: true,
      message: "Document sent to Slack successfully"
    };
  } catch (error) {
    console.error('Error sending to Slack:', error);
    toast.error("Failed to send to Slack", {
      description: "Check your Slack integration settings and try again"
    });
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};
