
import { jsPDF } from 'jspdf';
import { PDFGenerationOptions } from './types';

/**
 * Applies custom styling to the PDF document
 * @param pdf The PDF document
 * @param options Styling options
 * @param totalPages Total number of pages in the document
 */
export const applyDocumentStyling = (pdf: jsPDF, options: PDFGenerationOptions, totalPages: number) => {
  const styling = options.styling || {};
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Set default font
  pdf.setFont(styling.fontFamily || 'helvetica');
  
  // Add page numbers if enabled
  if (styling.showPageNumbers) {
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(styling.secondaryColor || '#666666');
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10);
    }
  }
  
  // Add date if enabled
  if (styling.showDate) {
    const currentDate = new Date().toLocaleDateString();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(styling.secondaryColor || '#666666');
      pdf.text(currentDate, 10, pageHeight - 10);
    }
  }
  
  // Add footer text if provided
  if (styling.footerText) {
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(styling.secondaryColor || '#666666');
      pdf.text(styling.footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  }
  
  // Add header image if provided
  if (styling.headerImageUrl) {
    // This would require loading the image first
    // For simplicity in this implementation, we'll just note that this would be implemented here
    // A full implementation would require asynchronously loading the image before PDF generation
  }
};
