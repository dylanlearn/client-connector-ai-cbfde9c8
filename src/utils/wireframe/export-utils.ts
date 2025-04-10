
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

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
            
            <!-- Section content would be rendered here -->
            <div class="section-content">
              <p>This is a placeholder for the actual content of the ${section.name || section.sectionType || 'section'}.</p>
            </div>
          </div>
        </section>
      `;
    }).join('\n');
    
    // Create the full HTML document
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
    
    /* Responsive design */
    @media (max-width: 768px) {
      .section {
        padding: 3rem 1rem;
      }
      
      .section-title {
        font-size: 1.75rem;
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
