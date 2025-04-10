
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { recordClientError } from '@/utils/monitoring/api-usage';
import { toast } from 'sonner';
import { generateHtmlFromWireframe } from '@/components/wireframe/export/html-export';

/**
 * Export formats supported by the wireframe exporter
 */
export type ExportFormat = 'pdf' | 'png' | 'svg' | 'json' | 'html';

/**
 * Options for wireframe export
 */
export interface ExportOptions {
  fileName?: string;
  includeDesignSystem?: boolean;
  includeComponents?: boolean;
  quality?: number;
  scale?: number;
  pageSize?: 'a4' | 'letter' | 'legal';
}

/**
 * Custom error class for export errors
 */
export class ExportError extends Error {
  originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = 'ExportError';
    this.originalError = originalError;
  }
}

/**
 * Helper function to convert data URI to Blob
 */
export function dataURItoBlob(dataURI: string | ArrayBuffer): Blob {
  try {
    if (dataURI instanceof ArrayBuffer) {
      throw new ExportError('Cannot convert ArrayBuffer to Blob');
    }

    const uriString = String(dataURI);
    
    // Handle plain string input (not a data URI)
    if (!uriString.startsWith('data:')) {
      return new Blob([uriString], { type: 'text/plain' });
    }

    // Split the URI to get the data part
    const byteString = atob(uriString.split(',')[1]);
    const mimeString = uriString.split(',')[0].split(':')[1].split(';')[0];
    
    // Write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  } catch (error) {
    console.error('Error converting data URI to Blob:', error);
    throw new ExportError('Failed to convert data URI to Blob', error instanceof Error ? error : undefined);
  }
}

/**
 * Main function to export wireframe in different formats
 */
export async function exportWireframe(
  wireframe: WireframeData,
  format: ExportFormat,
  options: ExportOptions = {}
): Promise<void> {
  try {
    console.log(`Exporting wireframe as ${format}...`);
    
    // Set default options
    const fileName = options.fileName || `wireframe-${wireframe.id.substring(0, 8)}`;
    const includeDesignSystem = options.includeDesignSystem !== false; // Default true
    const includeComponents = options.includeComponents !== false; // Default true
    
    // Handle different export formats
    switch (format) {
      case 'json':
        await exportAsJson(wireframe, fileName, includeDesignSystem);
        break;
        
      case 'html':
        await exportAsHtml(wireframe, fileName);
        break;
        
      case 'pdf':
        await exportAsPdf(wireframe, fileName, options);
        break;
        
      case 'png':
        await exportAsPng(wireframe, fileName, options);
        break;
        
      case 'svg':
        await exportAsSvg(wireframe, fileName);
        break;
        
      default:
        throw new ExportError(`Unsupported export format: ${format}`);
    }
    
    toast.success(`Wireframe exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    console.error(`Error exporting wireframe as ${format}:`, error);
    
    // Use custom ExportError or convert to it
    const exportError = error instanceof ExportError 
      ? error 
      : new ExportError(
          `Failed to export wireframe as ${format}`, 
          error instanceof Error ? error : undefined
        );
    
    // Log the error for monitoring
    recordClientError('wireframe-export', exportError);
    
    // Show user-friendly error toast
    toast.error(`Export failed: ${exportError.message}`);
    
    // Re-throw so calling code can handle it
    throw exportError;
  }
}

/**
 * Export wireframe as JSON
 */
async function exportAsJson(
  wireframe: WireframeData,
  fileName: string,
  includeDesignSystem: boolean
): Promise<void> {
  // Create a clone of the wireframe to avoid modifying the original
  const exportData = { ...wireframe };
  
  // Optionally remove design system data to reduce size
  if (!includeDesignSystem) {
    delete exportData.colorScheme;
    delete exportData.typography;
    delete exportData.designTokens;
    delete exportData.styleVariants;
    delete exportData.designReasoning;
  }
  
  // Convert to string with pretty formatting
  const jsonString = JSON.stringify(exportData, null, 2);
  
  // Create download link
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Export wireframe as HTML
 */
async function exportAsHtml(
  wireframe: WireframeData,
  fileName: string
): Promise<void> {
  // Generate HTML representation of wireframe
  const htmlContent = generateHtmlFromWireframe(wireframe);
  
  // Create download link
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Export wireframe as PDF
 */
async function exportAsPdf(
  wireframe: WireframeData,
  fileName: string,
  options: ExportOptions
): Promise<void> {
  // Find wireframe canvas element
  const element = document.getElementById('wireframe-canvas');
  if (!element) {
    throw new ExportError('Wireframe canvas element not found');
  }
  
  // Convert the element to canvas
  const canvas = await html2canvas(element, {
    scale: options.scale || 2, // Higher scale for better quality
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff'
  });
  
  // Get canvas as image data
  const imgData = canvas.toDataURL('image/jpeg', options.quality || 0.95);
  
  // Set page size
  let pageWidth, pageHeight;
  switch (options.pageSize || 'a4') {
    case 'letter':
      pageWidth = 216;
      pageHeight = 279;
      break;
    case 'legal':
      pageWidth = 216;
      pageHeight = 356;
      break;
    case 'a4':
    default:
      pageWidth = 210;
      pageHeight = 297;
  }
  
  // Create PDF
  const pdf = new jsPDF({
    orientation: canvas.height > canvas.width ? 'portrait' : 'landscape',
    unit: 'mm',
    format: options.pageSize || 'a4'
  });
  
  // Calculate dimensions to fit the page
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  // Add image to PDF (might be multiple pages if the wireframe is long)
  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  
  // Save PDF
  pdf.save(`${fileName}.pdf`);
}

/**
 * Export wireframe as PNG
 */
async function exportAsPng(
  wireframe: WireframeData,
  fileName: string,
  options: ExportOptions
): Promise<void> {
  // Find wireframe canvas element
  const element = document.getElementById('wireframe-canvas');
  if (!element) {
    throw new ExportError('Wireframe canvas element not found');
  }
  
  // Convert the element to canvas
  const canvas = await html2canvas(element, {
    scale: options.scale || 2, // Higher scale for better quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });
  
  // Convert to PNG and trigger download
  canvas.toBlob((blob) => {
    if (!blob) {
      throw new ExportError('Failed to create image blob');
    }
    
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  }, 'image/png', options.quality || 0.95);
}

/**
 * Export wireframe as SVG
 */
async function exportAsSvg(
  wireframe: WireframeData,
  fileName: string
): Promise<void> {
  // Create SVG representation
  const svgContent = generateSvgFromWireframe(wireframe);
  
  // Create download link
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Helper function to generate SVG from wireframe
 */
function generateSvgFromWireframe(wireframe: WireframeData): string {
  // Calculate document dimensions based on sections
  let width = 1200;
  let height = 0;
  
  wireframe.sections.forEach(section => {
    // Estimate section height
    const sectionHeight = section.dimensions?.height || 300;
    height += sectionHeight;
  });
  
  // Ensure minimum height
  height = Math.max(height, 800);
  
  // Start SVG document
  let svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        .section { fill: #f5f5f5; stroke: #e0e0e0; }
        .section-title { font: bold 24px sans-serif; fill: #333; }
        .section-type { font: italic 14px sans-serif; fill: #666; }
        .component { fill: #e9f5ff; stroke: #b3d7ff; }
        .component-text { font: 12px sans-serif; fill: #333; }
      </style>
  `;
  
  // Add wireframe title
  svg += `
    <text x="10" y="30" font-size="24" font-weight="bold">${wireframe.title}</text>
  `;
  
  // Render each section
  let yOffset = 60; // Start after title
  
  wireframe.sections.forEach((section, index) => {
    const sectionHeight = section.dimensions?.height || 300;
    
    // Draw section rectangle
    svg += `
      <rect class="section" x="10" y="${yOffset}" width="${width - 20}" height="${sectionHeight}" rx="5" />
      <text class="section-title" x="20" y="${yOffset + 30}">${section.name || `Section ${index + 1}`}</text>
      <text class="section-type" x="20" y="${yOffset + 50}">${section.sectionType || 'generic'}</text>
    `;
    
    // Draw components
    if (section.components) {
      let componentY = yOffset + 70;
      section.components.forEach((component, componentIndex) => {
        const componentHeight = 40;
        const componentWidth = (width - 60) / (section.components?.length || 1);
        const componentX = 30 + componentIndex * componentWidth;
        
        svg += `
          <rect class="component" x="${componentX}" y="${componentY}" width="${componentWidth - 10}" height="${componentHeight}" rx="3" />
          <text class="component-text" x="${componentX + 5}" y="${componentY + 20}">${component.type || `Component ${componentIndex + 1}`}</text>
        `;
      });
    }
    
    yOffset += sectionHeight + 20; // Add margin between sections
  });
  
  // Close SVG
  svg += '</svg>';
  
  return svg;
}
