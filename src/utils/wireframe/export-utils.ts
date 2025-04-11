
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

// Helper to download a file
const downloadFile = (content: string | Blob, fileName: string, mimeType: string) => {
  const blob = typeof content === 'string' 
    ? new Blob([content], { type: mimeType }) 
    : content;
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export wireframe as PNG image
export const exportWireframeAsImage = async (
  element: HTMLElement | null,
  wireframe: WireframeData,
  options: {
    scale?: number;
    backgroundColor?: string;
    filename?: string;
  } = {}
): Promise<string | null> => {
  if (!element) return null;

  const { scale = 2, backgroundColor = '#ffffff', filename = 'wireframe' } = options;
  
  try {
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor,
      logging: false,
      allowTaint: true,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    downloadFile(imgData, `${filename}.png`, 'image/png');
    
    return imgData;
  } catch (error) {
    console.error('Error exporting wireframe as image:', error);
    return null;
  }
};

// Export wireframe as PDF document
export const exportWireframeAsPDF = async (
  element: HTMLElement | null,
  wireframe: WireframeData,
  options: {
    scale?: number;
    filename?: string;
    pageSize?: [number, number];
    margin?: number;
  } = {}
): Promise<string | null> => {
  if (!element) return null;
  
  const { 
    scale = 2, 
    filename = 'wireframe', 
    pageSize = [595.28, 841.89], // A4 size
    margin = 20
  } = options;
  
  try {
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [pageSize[0], pageSize[1]]
    });
    
    // Add wireframe title as header
    pdf.setFontSize(16);
    pdf.text(wireframe.title || 'Wireframe', margin, margin);
    
    // Add wireframe description if available
    if (wireframe.description) {
      pdf.setFontSize(12);
      pdf.text(wireframe.description, margin, margin + 20);
    }
    
    const imageWidth = pageSize[0] - (margin * 2);
    const imageHeight = (canvas.height * imageWidth) / canvas.width;
    
    // Add the wireframe image
    pdf.addImage(imgData, 'PNG', margin, margin + 40, imageWidth, imageHeight);
    
    // Save PDF
    pdf.save(`${filename}.pdf`);
    
    return imgData;
  } catch (error) {
    console.error('Error exporting wireframe as PDF:', error);
    return null;
  }
};

// Generate HTML from wireframe data
export const exportWireframeAsHTML = (
  wireframe: WireframeData,
  options: {
    includeCSS?: boolean;
    includeJS?: boolean;
    filename?: string;
    responsive?: boolean;
  } = {}
): void => {
  const { 
    includeCSS = true, 
    includeJS = true, 
    filename = 'wireframe',
    responsive = true
  } = options;
  
  // Generate HTML content
  const html = generateHtmlFromWireframe(wireframe, {
    includeCSS,
    includeJS,
    responsive
  });

  // Download the HTML file
  downloadFile(html, `${filename}.html`, 'text/html');
};

// Generate HTML from wireframe data (exportable for testing)
export const generateHtmlFromWireframe = (
  wireframe: WireframeData,
  options: {
    includeCSS?: boolean;
    includeJS?: boolean;
    responsive?: boolean;
  } = {}
): string => {
  const { 
    includeCSS = true, 
    includeJS = true, 
    responsive = true
  } = options;
  
  // Generate CSS variables from wireframe color scheme
  const colorVariables = wireframe.colorScheme ? `
    :root {
      --color-primary: ${wireframe.colorScheme.primary || '#3B82F6'};
      --color-secondary: ${wireframe.colorScheme.secondary || '#10B981'};
      --color-accent: ${wireframe.colorScheme.accent || '#F59E0B'};
      --color-background: ${wireframe.colorScheme.background || '#FFFFFF'};
      --color-text: ${wireframe.colorScheme.text || '#111827'};
    }
  ` : '';
  
  // Basic CSS for the wireframe
  const baseCSS = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: ${wireframe.typography?.body || 'sans-serif'};
      color: var(--color-text, #111827);
      background-color: var(--color-background, #FFFFFF);
      line-height: 1.5;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: ${wireframe.typography?.headings || 'sans-serif'};
      margin-bottom: 0.5rem;
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .btn {
      display: inline-block;
      padding: 0.5rem 1rem;
      background-color: var(--color-primary, #3B82F6);
      color: white;
      text-decoration: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.2s;
    }
    
    .btn:hover {
      background-color: var(--color-primary-dark, #2563EB);
    }
    
    .btn-secondary {
      background-color: transparent;
      color: var(--color-primary, #3B82F6);
      border: 1px solid var(--color-primary, #3B82F6);
    }
    
    .btn-secondary:hover {
      background-color: var(--color-primary-light, #DBEAFE);
    }
    
    ${responsive ? `
    @media (max-width: 768px) {
      .container {
        padding: 0 0.5rem;
      }
    }` : ''}
  `;
  
  // Generate section HTML based on section type
  const generateSectionHTML = (section: WireframeSection): string => {
    const sectionType = section.sectionType?.toLowerCase() || '';
    const sectionData = section.data || {};
    const sectionStyle = section.style || {};
    
    // Common style attributes
    const bgColor = sectionStyle.backgroundColor ? `background-color: ${sectionStyle.backgroundColor};` : '';
    const textAlign = sectionStyle.textAlign ? `text-align: ${sectionStyle.textAlign};` : '';
    const padding = sectionStyle.padding || '2rem 0';
    
    let sectionHTML = '';
    
    // Generate HTML based on section type
    if (sectionType.includes('hero')) {
      sectionHTML = `
        <section id="${section.id}" class="hero" style="padding: ${padding}; ${bgColor} ${textAlign}">
          <div class="container">
            <h1>${sectionData.heading || 'Hero Title'}</h1>
            ${sectionData.subheading ? `<p class="hero-subheading">${sectionData.subheading}</p>` : ''}
            <div class="hero-actions">
              ${sectionData.ctaText ? `<a href="${sectionData.ctaUrl || '#'}" class="btn">${sectionData.ctaText}</a>` : ''}
              ${sectionData.secondaryCtaText ? `<a href="${sectionData.secondaryCtaUrl || '#'}" class="btn btn-secondary">${sectionData.secondaryCtaText}</a>` : ''}
            </div>
          </div>
        </section>
      `;
    } else if (sectionType.includes('feature')) {
      let featuresHTML = '';
      if (Array.isArray(sectionData.features)) {
        featuresHTML = sectionData.features.map((feature: any) => `
          <div class="feature-item">
            ${feature.icon ? `<div class="feature-icon">${feature.icon}</div>` : ''}
            <h3>${feature.title || 'Feature Title'}</h3>
            <p>${feature.description || 'Feature description goes here.'}</p>
          </div>
        `).join('');
      }
      
      sectionHTML = `
        <section id="${section.id}" class="features" style="padding: ${padding}; ${bgColor} ${textAlign}">
          <div class="container">
            ${sectionData.heading ? `<h2>${sectionData.heading}</h2>` : ''}
            ${sectionData.subheading ? `<p>${sectionData.subheading}</p>` : ''}
            <div class="features-grid">
              ${featuresHTML}
            </div>
          </div>
        </section>
      `;
    } else {
      // Generic section for unsupported types
      sectionHTML = `
        <section id="${section.id}" class="${sectionType}" style="padding: ${padding}; ${bgColor} ${textAlign}">
          <div class="container">
            ${sectionData.heading ? `<h2>${sectionData.heading}</h2>` : ''}
            ${sectionData.content ? `<div>${sectionData.content}</div>` : ''}
          </div>
        </section>
      `;
    }
    
    return sectionHTML;
  };
  
  // Generate sections HTML
  const sectionsHTML = wireframe.sections.map(generateSectionHTML).join('\n');
  
  // Create the full HTML document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${wireframe.title || 'Wireframe'}</title>
  ${includeCSS ? `<style>
    ${colorVariables}
    ${baseCSS}
  </style>` : ''}
</head>
<body>
  ${sectionsHTML}
  
  ${includeJS ? `<script>
    // Any JavaScript can go here
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Wireframe loaded');
    });
  </script>` : ''}
</body>
</html>`;
};

// Handle export errors (exportable for testing)
export const handleExportError = (errorMessage: string): string => {
  console.error('Export error:', errorMessage);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Export Error</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      color: #e11d48;
      background-color: #fff1f2;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 1rem;
    }
    
    .error-container {
      max-width: 500px;
      padding: 2rem;
      background-color: white;
      border: 1px solid #fecdd3;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    
    h1 {
      margin-top: 0;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <h1>Export Error</h1>
    <p>${errorMessage}</p>
  </div>
</body>
</html>`;
};
