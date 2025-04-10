
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { toast } from 'sonner';

/**
 * Export a wireframe to HTML format
 */
export const exportToHTML = async (wireframeData: WireframeData): Promise<string> => {
  try {
    // Create basic styling based on wireframe color scheme
    const colorScheme = wireframeData.colorScheme || {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937'
    };
    
    // Generate HTML for each section
    const sectionsHTML = wireframeData.sections.map((section, index) => {
      const sectionStyle = section.style || {};
      const padding = sectionStyle.padding || '4rem 2rem';
      const bgColor = sectionStyle.backgroundColor || (index % 2 === 0 ? colorScheme.background : '#f9fafb');
      const textColor = sectionStyle.color || colorScheme.text;
      
      // Generate component HTML if components are available
      const componentsHTML = section.components?.map((component, compIndex) => {
        // Basic component rendering - can be expanded based on component types
        return `
          <div class="component component-${component.type || 'default'}" id="component-${compIndex}">
            ${component.content || ''}
          </div>
        `;
      }).join('\n') || '<p>This is a placeholder for the actual content.</p>';
      
      return `
        <!-- ${section.name || section.sectionType || `Section ${index + 1}`} -->
        <section 
          id="${section.id || `section-${index}`}" 
          class="section ${section.sectionType || 'default-section'}"
          style="padding: ${padding}; background-color: ${bgColor}; color: ${textColor};"
        >
          <div class="container">
            <h2 class="section-title">${section.name || section.sectionType || `Section ${index + 1}`}</h2>
            ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
            
            <div class="section-content">
              ${componentsHTML}
            </div>
          </div>
        </section>
      `;
    }).join('\n');
    
    // Create the full HTML document with responsive design
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${wireframeData.title || 'Wireframe Export'}</title>
  <style>
    :root {
      --color-primary: ${colorScheme.primary};
      --color-secondary: ${colorScheme.secondary};
      --color-accent: ${colorScheme.accent};
      --color-background: ${colorScheme.background};
      --color-text: ${colorScheme.text};
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.5;
      color: var(--color-text);
      background-color: var(--color-background);
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .section {
      width: 100%;
    }
    
    .section-title {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    .section-description {
      font-size: 1.125rem;
      margin-bottom: 2rem;
      opacity: 0.8;
    }
    
    .section-content {
      margin-top: 2rem;
    }
    
    /* Component styles */
    .component {
      margin-bottom: 1.5rem;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .section {
        padding: 3rem 1rem;
      }
      
      .section-title {
        font-size: 1.75rem;
      }
    }
    
    @media (max-width: 480px) {
      .section {
        padding: 2rem 0.75rem;
      }
      
      .section-title {
        font-size: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <header style="background-color: ${colorScheme.primary}; color: white; padding: 1rem 0;">
    <div class="container">
      <h1>${wireframeData.title || 'Wireframe Export'}</h1>
      ${wireframeData.description ? `<p>${wireframeData.description}</p>` : ''}
    </div>
  </header>
  
  <main>
    ${sectionsHTML}
  </main>
  
  <footer style="background-color: #333; color: white; padding: 2rem 0; margin-top: 2rem; text-align: center;">
    <div class="container">
      <p>This wireframe was exported from the AI Wireframe Generator.</p>
      <p>© ${new Date().getFullYear()} All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
  } catch (error) {
    console.error('Error exporting wireframe to HTML:', error);
    throw new Error('Failed to export wireframe to HTML');
  }
};

/**
 * Export wireframe to JSON format
 */
export const exportToJSON = (wireframeData: WireframeData): string => {
  try {
    return JSON.stringify(wireframeData, null, 2);
  } catch (error) {
    console.error('Error exporting wireframe to JSON:', error);
    throw new Error('Failed to export wireframe to JSON');
  }
};

/**
 * Export wireframe to PDF format
 * This function prepares HTML and then uses a PDF conversion service or library
 */
export const exportToPDF = async (wireframeData: WireframeData): Promise<ArrayBuffer | null> => {
  try {
    // First generate HTML content
    const htmlContent = await exportToHTML(wireframeData);
    
    // In a real implementation, you would integrate with a PDF generation library
    // For example, using jsPDF, html2pdf.js, or a server-side PDF generation service
    
    console.log('PDF generation would happen here with the HTML content');
    
    // For demonstration purposes, we're just returning null
    // In a real implementation, this would return the PDF as an ArrayBuffer
    return null;
  } catch (error) {
    console.error('Error exporting wireframe to PDF:', error);
    toast(`PDF export failed: ${error.message}`);
    return null;
  }
};

/**
 * Export wireframe to image (PNG) format
 */
export const exportToPNG = async (wireframeData: WireframeData, canvasElement?: HTMLCanvasElement): Promise<string | null> => {
  try {
    if (!canvasElement) {
      throw new Error('Canvas element is required for PNG export');
    }
    
    // Get data URL from canvas
    const dataUrl = canvasElement.toDataURL('image/png');
    return dataUrl;
  } catch (error) {
    console.error('Error exporting wireframe to PNG:', error);
    toast(`PNG export failed: ${error.message}`);
    return null;
  }
};

/**
 * Export wireframe to SVG format
 */
export const exportToSVG = async (wireframeData: WireframeData, svgElement?: SVGElement): Promise<string | null> => {
  try {
    if (!svgElement) {
      throw new Error('SVG element is required for SVG export');
    }
    
    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    
    // Serialize SVG to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    
    // Create data URL
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    return url;
  } catch (error) {
    console.error('Error exporting wireframe to SVG:', error);
    toast(`SVG export failed: ${error.message}`);
    return null;
  }
};

/**
 * Main export function that handles different export formats
 */
export const exportWireframe = async (
  wireframeData: WireframeData, 
  format: 'html' | 'json' | 'pdf' | 'png' | 'svg' = 'html',
  options: { 
    canvasElement?: HTMLCanvasElement; 
    svgElement?: SVGElement;
    fileName?: string;
  } = {}
): Promise<void> => {
  try {
    // Default filename based on wireframe title
    const fileName = options.fileName || `${wireframeData.title || 'wireframe'}-${format}`;
    let result: string | ArrayBuffer | null = null;
    let mimeType = '';
    
    // Generate export based on format
    switch (format) {
      case 'html':
        result = await exportToHTML(wireframeData);
        mimeType = 'text/html';
        break;
      case 'json':
        result = exportToJSON(wireframeData);
        mimeType = 'application/json';
        break;
      case 'pdf':
        result = await exportToPDF(wireframeData);
        mimeType = 'application/pdf';
        break;
      case 'png':
        result = await exportToPNG(wireframeData, options.canvasElement);
        mimeType = 'image/png';
        break;
      case 'svg':
        result = await exportToSVG(wireframeData, options.svgElement);
        mimeType = 'image/svg+xml';
        break;
    }
    
    if (!result) {
      throw new Error(`Export to ${format.toUpperCase()} failed to generate content`);
    }
    
    // Handle download for browser environment
    if (typeof window !== 'undefined') {
      // For data URLs (PNG, SVG)
      if (typeof result === 'string' && result.startsWith('data:') || result.startsWith('blob:')) {
        const link = document.createElement('a');
        link.href = result;
        link.download = `${fileName}.${format}`;
        link.click();
        
        // Clean up blob URL if needed
        if (result.startsWith('blob:')) {
          setTimeout(() => URL.revokeObjectURL(result as string), 100);
        }
      } 
      // For text content (HTML, JSON)
      else if (typeof result === 'string') {
        const blob = new Blob([result], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.${format}`;
        link.click();
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
      } 
      // For binary content (PDF)
      else if (result instanceof ArrayBuffer) {
        const blob = new Blob([result], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.${format}`;
        link.click();
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
      
      toast(`Wireframe exported as ${format.toUpperCase()} successfully`);
    }
  } catch (error) {
    console.error(`Error exporting wireframe to ${format}:`, error);
    toast(`Export failed: ${error.message}`);
  }
};
