
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Generates a PDF from a specified HTML element
 * @param elementId The ID of the HTML element to convert to PDF
 * @param filename The name of the PDF file (without extension)
 * @returns Promise with the PDF document or error
 */
export const generatePDF = async (elementId: string, filename: string): Promise<Blob | null> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add multiple pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error("Failed to generate PDF", {
      description: "Please try again later"
    });
    return null;
  }
};

/**
 * Downloads a PDF file
 * @param blob The PDF blob
 * @param filename The name of the file (without extension)
 */
export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Sends a PDF to an email address
 * @param pdfBlob The PDF blob
 * @param email Recipient email address
 * @param subject Email subject
 * @param message Optional message to include
 * @returns Promise with success status
 */
export const sendPDFByEmail = async (
  pdfBlob: Blob,
  email: string,
  subject: string,
  message?: string
): Promise<boolean> => {
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
    const { error } = await supabase.functions.invoke('send-pdf-export', {
      body: {
        pdfBase64,
        email,
        subject,
        message
      }
    });

    if (error) {
      throw error;
    }

    toast.success("PDF sent successfully", {
      description: `The PDF has been sent to ${email}`
    });
    return true;
  } catch (error) {
    console.error('Error sending PDF:', error);
    toast.error("Failed to send PDF", {
      description: "Please check the email address and try again"
    });
    return false;
  }
};

/**
 * Sends a PDF link via SMS
 * @param pdfBlob The PDF blob
 * @param phoneNumber Recipient phone number
 * @param message Optional message to include
 * @returns Promise with success status
 */
export const sendPDFBySMS = async (
  pdfBlob: Blob,
  phoneNumber: string,
  message?: string
): Promise<boolean> => {
  try {
    // First upload the PDF to Supabase Storage to get a shareable link
    const pdfFile = new File([pdfBlob], `export-${Date.now()}.pdf`, { type: 'application/pdf' });
    
    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('pdf-exports')
      .upload(`${Date.now()}-export.pdf`, pdfFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (storageError) throw storageError;
    
    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('pdf-exports')
      .getPublicUrl(storageData.path);
    
    const pdfUrl = publicUrlData.publicUrl;
    
    // Send SMS with link via Edge Function
    const { error } = await supabase.functions.invoke('send-sms', {
      body: {
        phoneNumber,
        message: message || "Here's your exported PDF:",
        pdfUrl
      }
    });

    if (error) {
      throw error;
    }

    toast.success("SMS sent successfully", {
      description: `The PDF link has been sent to ${phoneNumber}`
    });
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    toast.error("Failed to send SMS", {
      description: "Please check the phone number and try again"
    });
    return false;
  }
};
