
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

/**
 * Generates HTML from a wireframe for export
 */
export const exportWireframeAsHTML = async (wireframe: WireframeData): Promise<string> => {
  // This is a simplified implementation
  const { title, sections } = wireframe;
  
  const sectionsHtml = sections.map(section => {
    return `
      <div class="section section-${section.sectionType}" id="${section.id}">
        <div class="section-content">
          <h2>${section.name || section.sectionType}</h2>
          <p>${section.description || ''}</p>
        </div>
      </div>
    `;
  }).join('\n');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${wireframe.title || 'Wireframe'}</title>
      <style>
        body {
          font-family: ${wireframe.typography?.body || 'sans-serif'};
          margin: 0;
          padding: 0;
          background-color: ${wireframe.colorScheme?.background || '#ffffff'};
          color: ${wireframe.colorScheme?.text || '#000000'};
        }
        .section {
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid #eaeaea;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: ${wireframe.typography?.headings || 'sans-serif'};
        }
      </style>
    </head>
    <body>
      <header>
        <h1>${title || 'Wireframe'}</h1>
      </header>
      <main>
        ${sectionsHtml}
      </main>
    </body>
    </html>
  `;

  return html;
};

/**
 * Exports a wireframe as a PDF
 */
export const exportWireframeAsPDF = async (element: HTMLElement): Promise<Blob> => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true
  });
  
  const imgData = canvas.toDataURL('image/png');
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

  const pdfBlob = pdf.output('blob');
  return pdfBlob;
};

/**
 * Exports a wireframe as an image
 */
export const exportWireframeAsImage = async (element: HTMLElement): Promise<Blob> => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true
  });
  
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        // Fallback if toBlob is not supported
        const dataURL = canvas.toDataURL('image/png');
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        resolve(new Blob([ab], { type: mimeString }));
      }
    }, 'image/png', 0.95);
  });
};

/**
 * Generates HTML code from a wireframe design that can be used in web projects
 */
export const generateHtmlFromWireframe = (wireframe: WireframeData): string => {
  const { title, sections } = wireframe;
  
  const sectionsHtml = sections.map(section => {
    return `
      <section class="wireframe-section wireframe-section-${section.sectionType}" id="${section.id}">
        <div class="container">
          <h2>${section.name || section.sectionType}</h2>
          <div class="section-content">
            ${section.description || ''}
          </div>
        </div>
      </section>
    `;
  }).join('\n');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title || 'Wireframe'}</title>
      <style>
        body {
          font-family: ${wireframe.typography?.body || 'sans-serif'};
          margin: 0;
          padding: 0;
          background-color: ${wireframe.colorScheme?.background || '#ffffff'};
          color: ${wireframe.colorScheme?.text || '#000000'};
          line-height: 1.6;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .wireframe-section {
          padding: 4rem 0;
          border-bottom: 1px solid #eaeaea;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: ${wireframe.typography?.headings || 'sans-serif'};
          color: ${wireframe.colorScheme?.primary || '#000000'};
        }
        .button {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: ${wireframe.colorScheme?.primary || '#3182ce'};
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <header class="wireframe-header">
        <div class="container">
          <h1>${title || 'Wireframe'}</h1>
        </div>
      </header>
      <main>
        ${sectionsHtml}
      </main>
      <footer class="wireframe-footer">
        <div class="container">
          <p>&copy; ${new Date().getFullYear()} ${title || 'Wireframe'}</p>
        </div>
      </footer>
    </body>
    </html>
  `;

  return html;
};

/**
 * Error handling utility for export operations
 */
export const handleExportError = (error: unknown): string => {
  console.error('Export error:', error);
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred during export';
};
