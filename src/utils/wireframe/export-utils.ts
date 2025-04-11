
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

/**
 * Export wireframe as HTML
 */
export const exportWireframeAsHTML = async (wireframe: WireframeData): Promise<string> => {
  try {
    const html = generateHtmlFromWireframe(wireframe);
    return html;
  } catch (error) {
    return handleExportError(error);
  }
};

/**
 * Export wireframe as PDF
 */
export const exportWireframeAsPDF = async (element: HTMLElement): Promise<Blob> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    return pdf.output('blob');
  } catch (error) {
    console.error('Error exporting as PDF:', error);
    throw error;
  }
};

/**
 * Export wireframe as image (PNG)
 */
export const exportWireframeAsImage = async (element: HTMLElement): Promise<Blob> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate image'));
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error exporting as image:', error);
    throw error;
  }
};

/**
 * Generate HTML code for wireframe
 */
export const generateHtmlFromWireframe = (wireframe: WireframeData): string => {
  // Generate basic HTML structure based on wireframe data
  const title = wireframe.title || 'Untitled Wireframe';
  const colorScheme = wireframe.colorScheme || {
    primary: '#3182ce',
    secondary: '#805ad5',
    accent: '#ed8936',
    background: '#ffffff',
    text: '#1a202c'
  };
  
  // Create HTML sections from wireframe sections
  const sectionsHtml = wireframe.sections.map((section) => {
    const sectionType = section.sectionType || 'generic';
    return `
      <div class="wireframe-section wireframe-section-${sectionType}" id="${section.id}">
        <div class="section-content">
          <h2>${section.name || sectionType + ' Section'}</h2>
          <p>${section.description || ''}</p>
        </div>
      </div>
    `;
  }).join('\n');
  
  // Create full HTML document
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          color: ${colorScheme.text};
          background-color: ${colorScheme.background};
          margin: 0;
          padding: 0;
        }
        .wireframe-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        .wireframe-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .wireframe-section {
          padding: 2rem;
          margin-bottom: 2rem;
          border-radius: 0.5rem;
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1, h2, h3 {
          color: ${colorScheme.primary};
        }
      </style>
    </head>
    <body>
      <div class="wireframe-container">
        <div class="wireframe-header">
          <h1>${title}</h1>
          ${wireframe.description ? `<p>${wireframe.description}</p>` : ''}
        </div>
        
        ${sectionsHtml}
      </div>
    </body>
    </html>
  `;
};

/**
 * Handle export errors
 */
export const handleExportError = (error: unknown): string => {
  console.error('Error during export:', error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown export error occurred';
  return errorMessage;
};
