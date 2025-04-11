import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

/**
 * Generates HTML string representation of wireframe for export
 */
export const generateHtmlFromWireframe = (wireframe: WireframeData): string => {
  const { title, sections } = wireframe;
  
  // Generate HTML for each section
  const sectionsHtml = sections.map((section) => {
    const { name, sectionType, components = [] } = section;
    
    // Create HTML representation of components
    const componentsHtml = Array.isArray(components) ? components.map((component) => {
      if (!component) return '';
      
      const { type, content, style = {} } = component;
      const styleString = Object.entries(style || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(';');
      
      // If content is a string, simply render it
      if (typeof content === 'string') {
        return `<div class="component component-${type}" style="${styleString}">${content}</div>`;
      } 
      
      // Otherwise just render a placeholder
      return `<div class="component component-${type}" style="${styleString}">${type} component</div>`;
    }).join('\n') : '';
    
    // Create section HTML
    return `
      <section class="wireframe-section section-${sectionType}" data-section-name="${name}">
        <h2>${name}</h2>
        <div class="components-container">
          ${componentsHtml}
        </div>
      </section>
    `;
  }).join('\n');
  
  // Generate the complete HTML document
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title || 'Wireframe Export'}</title>
      <style>
        body { 
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .wireframe-section {
          margin-bottom: 40px;
          border: 1px solid #eaeaea;
          padding: 20px;
          border-radius: 8px;
        }
        .components-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .component {
          padding: 10px;
          border: 1px dashed #ccc;
          border-radius: 4px;
        }
        h1 { font-size: 2.5rem; margin-bottom: 2rem; }
        h2 { font-size: 1.8rem; margin-bottom: 1rem; }
      </style>
    </head>
    <body>
      <h1>${title || 'Wireframe Export'}</h1>
      ${sectionsHtml}
    </body>
    </html>
  `;
  
  return html;
};

/**
 * Create a downloadable file from data
 */
const downloadFile = (data: string, filename: string, mimeType: string) => {
  // Create a blob with the data and correct MIME type
  const blob = new Blob([data], { type: mimeType });
  
  // Create an object URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append the link to the document
  document.body.appendChild(link);
  
  // Click the link programmatically
  link.click();
  
  // Remove the link from the document
  document.body.removeChild(link);
  
  // Release the object URL
  URL.revokeObjectURL(url);
};

/**
 * Generate an error message for export failures
 */
export const handleExportError = (errorMessage: string): string => {
  return `
    <div style="color: red; padding: 20px; border: 1px solid red; margin: 20px; border-radius: 8px;">
      <h2>Export Error</h2>
      <p>${errorMessage}</p>
    </div>
  `;
};

/**
 * Export wireframe as HTML
 */
export const exportWireframeAsHTML = (
  wireframe: WireframeData,
  options: { filename?: string } = {}
): void => {
  try {
    // Generate HTML representation
    const html = generateHtmlFromWireframe(wireframe);
    
    // Download as HTML file
    downloadFile(
      html, 
      options.filename ? `${options.filename}.html` : `${wireframe.title || 'wireframe'}.html`, 
      'text/html'
    );
  } catch (error) {
    console.error('Error exporting wireframe as HTML:', error);
    alert(`Failed to export HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Export wireframe as PDF
 */
export const exportWireframeAsPDF = async (
  element: HTMLElement | null,
  wireframe: WireframeData,
  options: { filename?: string, scale?: number } = {}
): Promise<void> => {
  try {
    if (!element) {
      throw new Error('No element provided for PDF export');
    }
    
    // Get scale option (default to 2 for better quality)
    const scale = options.scale || 2;
    
    // Create canvas from DOM element
    const canvas = await html2canvas(element, { 
      scale: scale,
      logging: false,
      useCORS: true
    });
    
    // Calculate dimensions
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    // Set font size and add title
    pdf.setFontSize(20);
    pdf.text(wireframe.title || 'Wireframe Export', 40, 40);
    
    // Add the image
    pdf.addImage(imgData, 'PNG', 0, 60, canvas.width, canvas.height - 60);
    
    // Save the PDF
    pdf.save(options.filename ? `${options.filename}.pdf` : `${wireframe.title || 'wireframe'}.pdf`);
  } catch (error) {
    console.error('Error exporting wireframe as PDF:', error);
    alert(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Export wireframe as image (PNG)
 */
export const exportWireframeAsImage = async (
  element: HTMLElement | null,
  wireframe: WireframeData,
  options: { filename?: string, scale?: number, quality?: number } = {}
): Promise<void> => {
  try {
    if (!element) {
      throw new Error('No element provided for image export');
    }
    
    // Get scale and quality options
    const scale = options.scale || 2; // Default to 2x for better quality
    const quality = options.quality !== undefined ? options.quality : 0.9;
    
    // Create canvas from DOM element
    const canvas = await html2canvas(element, { 
      scale: scale,
      logging: false,
      useCORS: true
    });
    
    // Convert canvas to data URL with quality option
    const dataUrl = canvas.toDataURL('image/png', quality);
    
    // Create link for download
    const link = document.createElement('a');
    link.download = options.filename ? `${options.filename}.png` : `${wireframe.title || 'wireframe'}.png`;
    link.href = dataUrl;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting wireframe as image:', error);
    alert(`Failed to export image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
