
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

// Type for export options
interface ExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

/**
 * Generate HTML representation of wireframe
 */
export const generateHtmlFromWireframe = (wireframe: WireframeData): string => {
  const { title, sections } = wireframe;

  // Create basic HTML template
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title || 'Wireframe Export'}</title>
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
          line-height: 1.6;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }
        .wireframe-section {
          margin-bottom: 2rem;
          padding: 1rem;
          border: 1px dashed #ccc;
        }
        h1, h2, h3 {
          margin-top: 0;
        }
        .wireframe-header {
          padding: 1rem 0;
          margin-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="wireframe-header">
          <h1>${title || 'Wireframe Export'}</h1>
        </div>
        ${sections.map((section, index) => `
          <div class="wireframe-section" id="section-${section.id || index}">
            <h2>${section.name || `Section ${index + 1}`}</h2>
            <div class="section-content">
              <pre>${JSON.stringify(section, null, 2)}</pre>
            </div>
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;

  return html;
};

/**
 * Handle export errors with a formatted message
 */
export const handleExportError = (error: string): string => {
  console.error('Export error:', error);
  return `
    <div class="export-error">
      <h3>Export Error</h3>
      <p>${error}</p>
    </div>
  `;
};

/**
 * Export wireframe as HTML file
 */
export const exportWireframeAsHTML = (
  wireframe: WireframeData, 
  options: ExportOptions = {}
): void => {
  try {
    const html = generateHtmlFromWireframe(wireframe);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${options.filename || wireframe.title || 'wireframe'}.html`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error exporting as HTML:', error);
  }
};

/**
 * Export wireframe as PDF file
 */
export const exportWireframeAsPDF = async (
  element: HTMLElement | null,
  wireframe: WireframeData,
  options: ExportOptions = {}
): Promise<void> => {
  if (!element) {
    console.error('No element provided for PDF export');
    return;
  }

  try {
    // Capture canvas from DOM element
    const canvas = await html2canvas(element, {
      scale: options.scale || 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });
    
    const imgData = canvas.toDataURL('image/png', options.quality || 0.92);
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
    });
    
    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add title
    pdf.setFontSize(16);
    pdf.text(wireframe.title || 'Wireframe', 105, 15, { align: 'center' });
    
    // Add image
    pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);
    
    // Save PDF
    pdf.save(`${options.filename || wireframe.title || 'wireframe'}.pdf`);
  } catch (error) {
    console.error('Error exporting as PDF:', error);
  }
};

/**
 * Export wireframe as PNG image
 */
export const exportWireframeAsImage = async (
  element: HTMLElement | null,
  wireframe: WireframeData,
  options: ExportOptions = {}
): Promise<void> => {
  if (!element) {
    console.error('No element provided for image export');
    return;
  }

  try {
    // Capture canvas from DOM element
    const canvas = await html2canvas(element, {
      scale: options.scale || 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });
    
    // Convert to PNG
    const imgData = canvas.toDataURL('image/png', options.quality || 0.92);
    
    // Create download link
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${options.filename || wireframe.title || 'wireframe'}.png`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting as image:', error);
  }
};
