
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

interface ExportOptions {
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  darkMode?: boolean;
  fileName?: string;
}

/**
 * Export a wireframe as an HTML file
 */
export const exportWireframeAsHTML = async (
  wireframe: WireframeData,
  options: ExportOptions = {}
): Promise<boolean> => {
  try {
    const {
      deviceType = 'desktop',
      darkMode = false,
      fileName = `wireframe-${wireframe.id?.substring(0, 8) || 'export'}`
    } = options;

    // Generate the HTML content (simplified version)
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${wireframe.title || 'Wireframe Export'}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body {
      background-color: ${darkMode ? '#111827' : '#ffffff'};
      color: ${darkMode ? '#ffffff' : '#111827'};
    }
    .wireframe-section {
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid ${darkMode ? '#374151' : '#e5e7eb'};
      border-radius: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">${wireframe.title || 'Untitled Wireframe'}</h1>
    
    ${wireframe.sections?.map(section => `
      <div class="wireframe-section" data-section-type="${section.sectionType || 'section'}">
        <h2 class="text-xl font-semibold mb-2">${section.name || section.sectionType || 'Unnamed Section'}</h2>
        <div class="section-content">
          ${section.copySuggestions?.heading ? `<h3 class="text-lg font-medium">${section.copySuggestions.heading}</h3>` : ''}
          ${section.copySuggestions?.subheading ? `<p class="text-gray-500 dark:text-gray-400">${section.copySuggestions.subheading}</p>` : ''}
          <!-- More section content would be rendered here -->
        </div>
      </div>
    `).join('') || '<p>No sections available</p>'}
  </div>
</body>
</html>
    `.trim();

    // Create a download link and trigger it
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error exporting wireframe as HTML:", error);
    return false;
  }
};

/**
 * Export a wireframe as a PDF document
 * This is a simplified implementation - a real one would use a PDF generation library
 */
export const exportWireframeAsPDF = async (
  wireframe: WireframeData,
  options: ExportOptions = {}
): Promise<boolean> => {
  try {
    const {
      fileName = `wireframe-${wireframe.id?.substring(0, 8) || 'export'}`
    } = options;

    console.log(`Export wireframe as PDF with options:`, options);
    
    // In a real implementation, this would use a library like jsPDF or
    // a server-side API to generate the PDF
    
    // For now, we'll just show a message in the console and return success
    console.log(`Exported ${fileName}.pdf`);
    
    // Mock the download for demonstration purposes
    setTimeout(() => {
      alert(`PDF export functionality would normally create ${fileName}.pdf`);
    }, 500);
    
    return true;
  } catch (error) {
    console.error("Error exporting wireframe as PDF:", error);
    return false;
  }
};

/**
 * Export a wireframe as a PNG image
 * This is a simplified implementation - a real one would use html2canvas or similar
 */
export const exportWireframeAsImage = async (
  wireframe: WireframeData,
  options: ExportOptions = {}
): Promise<boolean> => {
  try {
    const {
      fileName = `wireframe-${wireframe.id?.substring(0, 8) || 'export'}`
    } = options;

    console.log(`Export wireframe as image with options:`, options);
    
    // In a real implementation, this would use html2canvas to capture the wireframe display,
    // then convert that to an image file
    
    // For now, we'll just show a message in the console and return success
    console.log(`Exported ${fileName}.png`);
    
    // Mock the download for demonstration purposes
    setTimeout(() => {
      alert(`Image export functionality would normally create ${fileName}.png`);
    }, 500);
    
    return true;
  } catch (error) {
    console.error("Error exporting wireframe as image:", error);
    return false;
  }
};

/**
 * Get the mime type for an export format
 */
export function getExportMimeType(format: string): string {
  switch (format.toLowerCase()) {
    case 'html':
      return 'text/html';
    case 'pdf':
      return 'application/pdf';
    case 'png':
    case 'image':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    case 'json':
      return 'application/json';
    default:
      return 'text/plain';
  }
}

/**
 * Prepare a filename for download (adds extension if needed)
 */
export function prepareExportFilename(
  wireframe: WireframeData,
  format: string,
  suggestedName?: string
): string {
  // Generate a base filename from the wireframe info
  const baseFileName = suggestedName || 
    (wireframe.title ? 
      wireframe.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 
      `wireframe-${wireframe.id?.substring(0, 8) || 'export'}`);
  
  // Add the appropriate extension if not already present
  const extension = format.toLowerCase();
  if (baseFileName.endsWith(`.${extension}`)) {
    return baseFileName;
  }
  return `${baseFileName}.${extension}`;
}
