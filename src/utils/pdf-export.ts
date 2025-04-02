
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Configuration options for PDF generation
 */
export interface PDFGenerationOptions {
  /** Quality of the PDF (1-4, where 4 is highest) */
  quality?: 1 | 2 | 3 | 4;
  /** Whether to show a progress toast */
  showProgress?: boolean;
  /** Custom margin in millimeters */
  margin?: number;
  /** Maximum canvas dimension to prevent memory issues */
  maxCanvasDimension?: number;
}

/**
 * Default PDF generation options
 */
const defaultOptions: PDFGenerationOptions = {
  quality: 2,
  showProgress: true,
  margin: 0,
  maxCanvasDimension: 10000 // 10k pixels max dimension to prevent memory issues
};

/**
 * Generates a PDF from a specified HTML element with performance optimizations for large content
 * @param elementId The ID of the HTML element to convert to PDF
 * @param filename The name of the PDF file (without extension)
 * @param options Configuration options
 * @returns Promise with the PDF document or error
 */
export const generatePDF = async (
  elementId: string, 
  filename: string, 
  options?: PDFGenerationOptions
): Promise<Blob | null> => {
  const mergedOptions = { ...defaultOptions, ...options };
  const { quality, showProgress, margin, maxCanvasDimension } = mergedOptions;
  
  let progressToast: string | number | null = null;
  
  try {
    if (showProgress) {
      progressToast = toast.loading("Preparing PDF document...");
    }
    
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }

    // Determine scaling factor based on quality
    const scaleFactor = quality || 2;
    
    // Get computed styles and dimensions
    const computedStyle = window.getComputedStyle(element);
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    
    if (showProgress) {
      toast.loading("Rendering document content...", { id: progressToast });
    }

    // Optimize for large content: if content is very tall, we'll render it in chunks
    const needsChunking = height > maxCanvasDimension!;
    let canvases: HTMLCanvasElement[] = [];

    if (needsChunking) {
      // Render in chunks to handle very large content
      const chunkSize = 5000; // Reasonable chunk size that most browsers can handle
      const chunks = Math.ceil(height / chunkSize);
      
      for (let i = 0; i < chunks; i++) {
        if (showProgress) {
          toast.loading(`Rendering section ${i+1} of ${chunks}...`, { id: progressToast });
        }
        
        const chunkTop = i * chunkSize;
        const chunkHeight = Math.min(chunkSize, height - chunkTop);
        
        const canvas = await html2canvas(element, {
          scale: scaleFactor,
          useCORS: true,
          logging: false,
          width,
          height: chunkHeight,
          windowHeight: chunkHeight,
          y: chunkTop,
          x: 0,
          scrollY: chunkTop,
          windowWidth: width,
        });
        
        canvases.push(canvas);
      }
    } else {
      // Standard rendering for reasonably sized content
      const canvas = await html2canvas(element, {
        scale: scaleFactor,
        useCORS: true,
        logging: false,
      });
      
      canvases.push(canvas);
    }
    
    if (showProgress) {
      toast.loading("Generating PDF...", { id: progressToast });
    }
    
    // Create PDF with appropriate dimensions
    const pdf = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // A4 dimensions in mm
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const effectiveWidth = pdfWidth - (margin! * 2);
    const effectiveHeight = pdfHeight - (margin! * 2);

    // Process all canvases to create the PDF
    for (let i = 0; i < canvases.length; i++) {
      const canvas = canvases[i];
      const imgData = canvas.toDataURL('image/jpeg', 0.95); // Use JPEG with high quality for better compression
      
      // Handle the first chunk or page
      if (i === 0) {
        // Calculate image dimensions to fit within PDF page
        const imgWidth = effectiveWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add first image
        pdf.addImage(
          imgData, 
          'JPEG', 
          margin!, 
          margin!, 
          imgWidth, 
          imgHeight
        );
        
        // If this image extends beyond the first page
        let heightLeft = imgHeight - effectiveHeight;
        let pageOffset = 0;
        
        // Add additional pages if needed for this chunk
        while (heightLeft > 0) {
          pageOffset += effectiveHeight;
          pdf.addPage();
          
          pdf.addImage(
            imgData, 
            'JPEG', 
            margin!, 
            margin! - pageOffset, 
            imgWidth, 
            imgHeight
          );
          
          heightLeft -= effectiveHeight;
        }
      } else {
        // For subsequent chunks, add a new page
        pdf.addPage();
        
        // Calculate image dimensions to fit within PDF page
        const imgWidth = effectiveWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add image
        pdf.addImage(
          imgData, 
          'JPEG', 
          margin!, 
          margin!, 
          imgWidth, 
          imgHeight
        );
        
        // If this image extends beyond the first page
        let heightLeft = imgHeight - effectiveHeight;
        let pageOffset = 0;
        
        // Add additional pages if needed for this chunk
        while (heightLeft > 0) {
          pageOffset += effectiveHeight;
          pdf.addPage();
          
          pdf.addImage(
            imgData, 
            'JPEG', 
            margin!, 
            margin! - pageOffset, 
            imgWidth, 
            imgHeight
          );
          
          heightLeft -= effectiveHeight;
        }
      }
      
      if (showProgress && canvases.length > 1) {
        toast.loading(`Processing section ${i+1} of ${canvases.length}...`, { id: progressToast });
      }
    }
    
    // Save the PDF
    const pdfBlob = pdf.output('blob');
    
    if (showProgress) {
      toast.success("PDF generated successfully!", { id: progressToast });
    }
    
    return pdfBlob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    if (progressToast) {
      toast.error("Failed to generate PDF", { 
        id: progressToast,
        description: "Please try again with a smaller content selection"
      });
    } else {
      toast.error("Failed to generate PDF", {
        description: "Please try again later"
      });
    }
    
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
