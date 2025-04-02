
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from "sonner";
import { PDFGenerationOptions, defaultOptions } from './types';
import { applyDocumentStyling } from './styling';

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
    
    // Apply custom styling to the PDF
    const totalPages = pdf.getNumberOfPages();
    applyDocumentStyling(pdf, mergedOptions, totalPages);
    
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
