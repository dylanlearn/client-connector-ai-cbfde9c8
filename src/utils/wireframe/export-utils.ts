
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

/**
 * Export wireframe as HTML
 */
export const exportWireframeAsHTML = async (
  wireframe: WireframeData
): Promise<string> => {
  const { title, sections } = wireframe;
  
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-gray-50">
  `;
  
  // Add each section
  sections.forEach((section: WireframeSection) => {
    const sectionType = section.sectionType?.toLowerCase() || 'generic';
    
    switch (sectionType) {
      case 'hero':
        htmlContent += `
  <section class="bg-blue-600 text-white py-20 px-4">
    <div class="max-w-6xl mx-auto text-center">
      <h1 class="text-4xl font-bold mb-6">${getSuggestion(section.copySuggestions, 'heading', 'Welcome to ' + title)}</h1>
      <p class="text-xl mb-8">${getSuggestion(section.copySuggestions, 'subheading', 'This is a wireframe export of your design.')}</p>
      <button class="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium">Get Started</button>
    </div>
  </section>`;
        break;
        
      case 'feature':
      case 'features':
        htmlContent += `
  <section class="py-16 px-4">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">1</div>
          <h3 class="text-xl font-semibold mb-2">Feature One</h3>
          <p class="text-gray-600">Description of the first feature and its benefits.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">2</div>
          <h3 class="text-xl font-semibold mb-2">Feature Two</h3>
          <p class="text-gray-600">Description of the second feature and its benefits.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">3</div>
          <h3 class="text-xl font-semibold mb-2">Feature Three</h3>
          <p class="text-gray-600">Description of the third feature and its benefits.</p>
        </div>
      </div>
    </div>
  </section>`;
        break;
        
      case 'cta':
        htmlContent += `
  <section class="bg-blue-600 text-white py-12 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <p class="text-lg mb-8">Join thousands of satisfied customers using our products.</p>
      <div class="flex flex-wrap justify-center gap-4">
        <button class="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium">Get Started</button>
        <button class="border border-white text-white px-6 py-3 rounded-lg font-medium">Learn More</button>
      </div>
    </div>
  </section>`;
        break;
        
      case 'footer':
        htmlContent += `
  <footer class="bg-gray-800 text-white py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-bold mb-4">About Us</h3>
          <p class="text-gray-400">A brief description of the company and its mission.</p>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-white">Home</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Features</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Pricing</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-4">Support</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-white">Help Center</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Documentation</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">API Reference</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Status</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-4">Contact</h3>
          <p class="text-gray-400 mb-2">info@example.com</p>
          <p class="text-gray-400">+1 (555) 123-4567</p>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-8 text-center">
        <p class="text-gray-400">&copy; ${new Date().getFullYear()} ${title}. All rights reserved.</p>
      </div>
    </div>
  </footer>`;
        break;
        
      default:
        htmlContent += `
  <section class="py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">${section.name || section.sectionType || 'Section'}</h2>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <p>Content for ${section.name || section.sectionType || 'this section'}</p>
      </div>
    </div>
  </section>`;
    }
  });
  
  // Close HTML
  htmlContent += `
</body>
</html>
  `;
  
  return htmlContent;
};

/**
 * Export wireframe as PDF
 */
export const exportWireframeAsPDF = async (
  wireframeContainer: HTMLElement,
  wireframe: WireframeData
): Promise<Blob> => {
  const canvas = await html2canvas(wireframeContainer, {
    scale: 1,
    useCORS: true,
    logging: false,
    allowTaint: true,
  });
  
  // Create PDF with appropriate dimensions
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });
  
  // Add image to PDF
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  
  // Return as blob
  return pdf.output('blob');
};

/**
 * Export wireframe as image (PNG)
 */
export const exportWireframeAsImage = async (
  wireframeContainer: HTMLElement,
  wireframe: WireframeData
): Promise<Blob> => {
  const canvas = await html2canvas(wireframeContainer, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    logging: false,
    allowTaint: true,
  });
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob as Blob);
    }, 'image/png');
  });
};
