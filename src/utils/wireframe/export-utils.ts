
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

/**
 * Export a wireframe as HTML
 */
export const exportWireframeAsHTML = async (wireframe: WireframeData): Promise<string> => {
  try {
    // Generate CSS for the wireframe styles
    const generateCSS = () => {
      const colorScheme = wireframe.colorScheme || {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#111827'
      };
      
      return `
        :root {
          --primary-color: ${colorScheme.primary};
          --secondary-color: ${colorScheme.secondary};
          --accent-color: ${colorScheme.accent};
          --background-color: ${colorScheme.background};
          --text-color: ${colorScheme.text || '#111827'};
          --font-headings: ${wireframe.typography?.headings || 'sans-serif'};
          --font-body: ${wireframe.typography?.body || 'sans-serif'};
        }
        
        body {
          font-family: var(--font-body);
          color: var(--text-color);
          background-color: var(--background-color);
          margin: 0;
          padding: 0;
          line-height: 1.6;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-headings);
          margin-top: 0;
        }
        
        .section {
          padding: 3rem 1.5rem;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .btn {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.25rem;
          cursor: pointer;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-secondary {
          background-color: var(--secondary-color);
        }
        
        .btn-accent {
          background-color: var(--accent-color);
        }
        
        .section-heading {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .section-subheading {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.8;
        }
      `;
    };
    
    // Generate HTML content for each section
    const generateSections = () => {
      return wireframe.sections.map(section => {
        const heading = getSuggestion(section.copySuggestions, 'heading') || section.name || '';
        const subheading = getSuggestion(section.copySuggestions, 'subheading') || '';
        
        return `
          <section class="section section-${section.sectionType || 'default'}">
            <div class="container">
              <h2 class="section-heading">${heading}</h2>
              <p class="section-subheading">${subheading}</p>
              <div class="section-content">
                <!-- Content would be generated for each section type -->
                <p>Section ID: ${section.id}</p>
              </div>
            </div>
          </section>
        `;
      }).join('\n');
    };
    
    // Create full HTML document
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${wireframe.title}</title>
          <style>
            ${generateCSS()}
          </style>
        </head>
        <body>
          <header>
            <div class="container">
              <h1>${wireframe.title}</h1>
            </div>
          </header>
          <main>
            ${generateSections()}
          </main>
          <footer>
            <div class="container">
              <p>Generated from wireframe ID: ${wireframe.id}</p>
            </div>
          </footer>
        </body>
      </html>
    `;
    
    return htmlContent;
  } catch (error) {
    console.error('Error generating HTML:', error);
    throw new Error('Failed to generate HTML');
  }
};

/**
 * Export a wireframe as PDF
 */
export const exportWireframeAsPDF = async (element: HTMLElement, wireframe: WireframeData): Promise<Blob> => {
  try {
    // Convert element to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    // Canvas dimensions
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
    
    // Add additional pages if needed
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Return PDF as blob
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

/**
 * Export a wireframe as Image
 */
export const exportWireframeAsImage = async (element: HTMLElement, wireframe: WireframeData): Promise<Blob> => {
  try {
    // Convert element to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate image blob'));
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
};
