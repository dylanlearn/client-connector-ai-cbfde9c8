
import { toast } from 'sonner';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ExportOptions {
  canvasElement?: HTMLCanvasElement;
  svgElement?: SVGElement;
  fileName?: string;
}

/**
 * Exports wireframe data in various formats
 * @param wireframeData The wireframe data to export
 * @param format The export format: 'json', 'html', 'pdf', 'png', or 'svg'
 * @param options Additional export options
 */
export const exportWireframe = async (
  wireframeData: WireframeData,
  format: 'html' | 'json' | 'pdf' | 'png' | 'svg',
  options: ExportOptions = {}
): Promise<void> => {
  try {
    const fileName = options.fileName || `${wireframeData.title || 'wireframe'}-export`;
    
    switch (format) {
      case 'json':
        await exportJson(wireframeData, fileName);
        break;
      case 'html':
        await exportHtml(wireframeData, fileName);
        break;
      case 'pdf':
        await exportPdf(wireframeData, fileName, options);
        break;
      case 'png':
        await exportPng(wireframeData, fileName, options);
        break;
      case 'svg':
        await exportSvg(wireframeData, fileName, options);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    toast(`Wireframe exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    console.error('Export error:', error);
    toast(`Export failed: ${error.message}`);
    throw error;
  }
};

/**
 * Export wireframe as JSON
 */
const exportJson = async (wireframeData: WireframeData, fileName: string): Promise<void> => {
  const jsonString = JSON.stringify(wireframeData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadBlob(blob, `${fileName}.json`);
};

/**
 * Export wireframe as HTML
 */
const exportHtml = async (wireframeData: WireframeData, fileName: string): Promise<void> => {
  // Generate HTML from wireframe data
  const htmlContent = generateHtmlFromWireframe(wireframeData);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  downloadBlob(blob, `${fileName}.html`);
};

/**
 * Export wireframe as PDF
 */
const exportPdf = async (
  wireframeData: WireframeData, 
  fileName: string,
  options: ExportOptions
): Promise<void> => {
  // Create PDF with jsPDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px'
  });
  
  let canvas: HTMLCanvasElement;
  
  if (options.canvasElement) {
    // Use provided canvas element
    canvas = options.canvasElement;
  } else {
    // Render wireframe to canvas if canvasElement not provided
    const element = document.getElementById('wireframe-canvas');
    if (!element) {
      throw new Error('Canvas element not found for PDF export');
    }
    
    canvas = await html2canvas(element);
  }
  
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${fileName}.pdf`);
};

/**
 * Export wireframe as PNG
 */
const exportPng = async (
  wireframeData: WireframeData, 
  fileName: string,
  options: ExportOptions
): Promise<void> => {
  let canvas: HTMLCanvasElement;
  
  if (options.canvasElement) {
    // Use provided canvas element
    canvas = options.canvasElement;
  } else {
    // Render wireframe to canvas if canvasElement not provided
    const element = document.getElementById('wireframe-canvas');
    if (!element) {
      throw new Error('Canvas element not found for PNG export');
    }
    
    canvas = await html2canvas(element);
  }
  
  // Convert canvas to PNG and download
  canvas.toBlob((blob) => {
    if (blob) {
      downloadBlob(blob, `${fileName}.png`);
    } else {
      throw new Error('Failed to create PNG blob');
    }
  }, 'image/png');
};

/**
 * Export wireframe as SVG
 */
const exportSvg = async (
  wireframeData: WireframeData, 
  fileName: string,
  options: ExportOptions
): Promise<void> => {
  if (!options.svgElement) {
    throw new Error('SVG element is required for SVG export');
  }
  
  // Clone the SVG element to avoid modifying the original
  const svgClone = options.svgElement.cloneNode(true) as SVGElement;
  
  // Ensure the SVG has width and height
  if (!svgClone.getAttribute('width')) {
    svgClone.setAttribute('width', '800');
  }
  if (!svgClone.getAttribute('height')) {
    svgClone.setAttribute('height', '600');
  }
  
  // Convert SVG to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);
  
  // Create a blob from the SVG string
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  downloadBlob(blob, `${fileName}.svg`);
};

/**
 * Helper function to generate HTML from wireframe data
 */
export const generateHtmlFromWireframe = (wireframeData: WireframeData): string => {
  // Basic HTML template
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${wireframeData.title || 'Wireframe Export'}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.5;
      color: ${wireframeData.colorScheme?.text || '#333'};
      background-color: ${wireframeData.colorScheme?.background || '#fff'};
      margin: 0;
      padding: 20px;
    }
    .wireframe-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .wireframe-header {
      margin-bottom: 40px;
      text-align: center;
    }
    .wireframe-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #eaeaea;
      border-radius: 8px;
    }
    .wireframe-section-header {
      margin-top: 0;
      color: ${wireframeData.colorScheme?.primary || '#0070f3'};
    }
    /* Add more styling based on wireframe data */
  </style>
</head>
<body>
  <div class="wireframe-container">
    <header class="wireframe-header">
      <h1>${wireframeData.title || 'Wireframe Export'}</h1>
      ${wireframeData.description ? `<p>${wireframeData.description}</p>` : ''}
    </header>
    
    ${wireframeData.sections?.map(section => `
      <section class="wireframe-section" data-section-id="${section.id}">
        <h2 class="wireframe-section-header">${section.name || 'Section'}</h2>
        <div class="wireframe-section-content">
          ${section.description ? `<p>${section.description}</p>` : ''}
          <!-- Components would be rendered here in a real implementation -->
        </div>
      </section>
    `).join('') || ''}
  </div>
</body>
</html>`;

  return html;
};

/**
 * Helper function to download a blob as a file
 */
const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Helper function to convert base64 data to a blob
 */
export const dataURItoBlob = (dataURI: string): Blob => {
  // Convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  
  // Fix for the TS errors: Make sure we're working with a string before using string methods
  if (typeof dataURI === 'string') {
    if (dataURI.startsWith('data:')) {
      // Handle data URI
      byteString = dataURI.split(',')[0].indexOf('base64') >= 0 ? 
        atob(dataURI.split(',')[1]) : 
        decodeURIComponent(dataURI.split(',')[1]);
    } else {
      // Handle plain string
      byteString = dataURI;
    }
  } else {
    // Handle ArrayBuffer
    throw new Error('Cannot convert ArrayBuffer to Blob - conversion not implemented');
  }
  
  // Write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ia], { type: 'application/octet-stream' });
};
