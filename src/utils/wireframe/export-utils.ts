// Fix the specific type issues in export-utils.ts

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export type ExportFormat = 'pdf' | 'png' | 'svg' | 'html';

export interface ExportOptions {
  filename?: string;
  format?: ExportFormat;
  includeStyles?: boolean;
  includeInteractivity?: boolean;
  canvasElement?: HTMLCanvasElement;
}

export class ExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExportError';
  }
}

// Fix ExportError usage in error handling
export const handleExportError = (error: ExportError | string): string => {
  const errorMessage = typeof error === 'string' 
    ? error 
    : `Export error: ${error.message || 'Unknown error'}`;
  
  console.error(errorMessage);
  return errorMessage;
};

// Fix type conversion issues
export const calculatePageSize = (width: number | string, height: number | string): {width: number, height: number} => {
  const widthNum = typeof width === 'string' ? parseFloat(width) : width;
  const heightNum = typeof height === 'string' ? parseFloat(height) : height;
  
  return {
    width: widthNum || 800,
    height: heightNum || 600
  };
};

// Fix the += operator issue
export const incrementTotal = (total: number, value: string | number): number => {
  const valueNum = typeof value === 'string' ? parseFloat(value) : value;
  return total + (isNaN(valueNum) ? 0 : valueNum);
};

// Helper function to convert CSS styles to inline styles
export const cssToInlineStyles = (element: HTMLElement): void => {
  const computedStyle = window.getComputedStyle(element);
  for (let i = 0; i < computedStyle.length; i++) {
    const property = computedStyle[i];
    element.style.setProperty(property, computedStyle.getPropertyValue(property));
  }
  
  // Remove classes to ensure only inline styles are used
  element.removeAttribute('class');
  
  // Recursively apply to children
  Array.from(element.children).forEach((child: Element) => {
    cssToInlineStyles(child as HTMLElement);
  });
};

// Helper function to clone node with inline styles
export const cloneNodeWithInlineStyles = (node: HTMLElement): HTMLElement => {
  const clone = node.cloneNode(true) as HTMLElement;
  cssToInlineStyles(clone);
  return clone;
};

// Function to export wireframe as PDF
export const exportWireframeAsPDF = async (wireframe: WireframeData, options: ExportOptions = {}): Promise<void> => {
  try {
    const { filename = 'wireframe-export' } = options;
    
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });
    
    let totalHeight = 0;
    
    // Iterate through each section and add it to the PDF
    for (const section of wireframe.sections) {
      const sectionElement = document.querySelector(`[data-section-id="${section.id}"]`) as HTMLElement;
      
      if (!sectionElement) {
        console.warn(`Section with ID ${section.id} not found in the DOM.`);
        continue;
      }
      
      // Clone the section element to apply inline styles without modifying the original
      const clonedSection = cloneNodeWithInlineStyles(sectionElement);
      document.body.appendChild(clonedSection);
      
      // Get the dimensions of the cloned section
      const width = clonedSection.offsetWidth;
      const height = clonedSection.offsetHeight;
      
      // Calculate the page size based on content dimensions
      const pageSize = calculatePageSize(width, height);
      
      // Convert the HTML element to a canvas
      const canvas = await html2canvas(clonedSection, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Enable cross-origin image loading
      });
      
      // Convert the canvas to a data URL
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate the position to add the image to the PDF
      const x = 0;
      const y = totalHeight;
      
      // Add a page to the PDF for each section
      if (totalHeight > 0) {
        pdf.addPage();
        totalHeight = 0;
      }
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', x, y, pageSize.width, pageSize.height);
      
      // Increment the total height for the next section
      totalHeight = incrementTotal(totalHeight, height);
      
      // Remove the cloned section from the DOM
      document.body.removeChild(clonedSection);
    }
    
    // Save the PDF with the specified filename
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    const errorMessage = handleExportError(error instanceof Error ? error : new Error('Failed to export as PDF.'));
    throw new ExportError(errorMessage);
  }
};

// Function to export wireframe as image (PNG or SVG)
export const exportWireframeAsImage = async (wireframe: WireframeData, options: ExportOptions = {}): Promise<void> => {
  try {
    const { filename = 'wireframe-export', format = 'png', canvasElement } = options;
    
    if (!canvasElement) {
      throw new ExportError('Canvas element is required to export as image.');
    }
    
    // Convert the canvas to a data URL
    const dataURL = canvasElement.toDataURL({
      format: format,
      quality: 1
    });
    
    // Create a download link
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    const errorMessage = handleExportError(error instanceof Error ? error : new Error('Failed to export as image.'));
    throw new ExportError(errorMessage);
  }
};

// Fix the + operator issue
export const combineValues = (base: string | number, addition: number): number => {
  const baseNum = typeof base === 'string' ? parseFloat(base) : base;
  return (isNaN(baseNum) ? 0 : baseNum) + addition;
};

// Function to generate HTML from wireframe data
export const generateHtmlFromWireframe = (wireframe: any): string => {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${wireframe.title || 'Wireframe'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .wireframe-container { width: 100%; max-width: 1200px; margin: 20px auto; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .wireframe-section { padding: 20px; border-bottom: 1px solid #ddd; }
        .wireframe-section:last-child { border-bottom: none; }
        .section-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
        .section-description { color: #666; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="wireframe-container">`;

  wireframe.sections.forEach((section: WireframeSection) => {
    html += `
        <div class="wireframe-section">
            <h2 class="section-title">${section.name || 'Section'}</h2>
            <p class="section-description">${section.description || 'A description of this section.'}</p>
            </div>`;
  });

  html += `
    </div>
</body>
</html>`;
  return html;
};

// Function to export wireframe as HTML
export const exportWireframeAsHTML = async (wireframe: WireframeData, options: ExportOptions = {}): Promise<void> => {
  try {
    const { filename = 'wireframe-export', includeStyles = true, includeInteractivity = false } = options;
    
    // Generate the HTML content
    let htmlContent = generateHtmlFromWireframe(wireframe);
    
    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    const errorMessage = handleExportError(error instanceof Error ? error : new Error('Failed to export as HTML.'));
    throw new ExportError(errorMessage);
  }
};
