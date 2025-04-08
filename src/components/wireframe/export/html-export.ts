
import { WireframeData } from "@/types/wireframe";
import { WireframeSection } from "@/services/ai/wireframe/wireframe-types";

/**
 * Generates an HTML document from wireframe data
 */
export const generateHtmlFromWireframe = (wireframe: WireframeData): string => {
  const {
    title = 'Wireframe',
    description = '',
    sections = [],
    colorScheme = {
      primary: '#4F46E5',
      secondary: '#A855F7',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#111827',
    },
    typography = {
      headings: 'Raleway, sans-serif',
      body: 'Inter, sans-serif'
    }
  } = wireframe;

  // Generate CSS variables from the design tokens
  const cssVariables = `
    :root {
      --color-primary: ${colorScheme.primary};
      --color-secondary: ${colorScheme.secondary};
      --color-accent: ${colorScheme.accent};
      --color-background: ${colorScheme.background};
      --color-text: ${colorScheme.text || '#111827'};
      --font-headings: ${typography.headings};
      --font-body: ${typography.body};
    }
  `;

  // Generate HTML for each section
  const sectionsHtml = sections.map(section => generateSectionHtml(section)).join('\n');

  // Create the full HTML document
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    ${cssVariables}
    
    body {
      font-family: var(--font-body);
      margin: 0;
      padding: 0;
      background-color: var(--color-background);
      color: var(--color-text);
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-headings);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .section {
      padding: 2rem 0;
    }
    
    .hero {
      padding: 4rem 0;
      text-align: center;
      background-color: var(--color-primary);
      color: white;
    }
    
    .cta {
      padding: 3rem 0;
      text-align: center;
      background-color: var(--color-accent);
      color: white;
    }
    
    .feature {
      padding: 2rem;
      margin: 1rem 0;
      border: 1px solid #eee;
      border-radius: 8px;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .button {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      background-color: var(--color-primary);
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 0.5rem;
    }
    
    .faq-item {
      margin-bottom: 1rem;
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 4px;
    }
    
    .faq-question {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
  <!-- Import Google Fonts based on typography settings -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Raleway:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="wireframe-export">
    ${description ? `<div class="container"><p class="description">${escapeHtml(description)}</p></div>` : ''}
    
    ${sectionsHtml}
  </div>
  
  <footer>
    <div class="container">
      <p>Generated from wireframe: ${escapeHtml(title)}</p>
    </div>
  </footer>
</body>
</html>
  `;
};

/**
 * Generates HTML for a specific wireframe section
 */
const generateSectionHtml = (section: WireframeSection): string => {
  const { sectionType, name, data = {}, description = '' } = section;
  
  switch (sectionType) {
    case 'hero':
      return `
        <section class="section hero">
          <div class="container">
            <h1>${escapeHtml(data.headline || name)}</h1>
            ${data.subheadline ? `<p>${escapeHtml(data.subheadline)}</p>` : ''}
            ${data.content ? `<div>${data.content}</div>` : ''}
            ${data.buttonText ? `<a href="#" class="button">${escapeHtml(data.buttonText)}</a>` : ''}
          </div>
        </section>
      `;
    
    case 'cta':
      return `
        <section class="section cta">
          <div class="container">
            <h2>${escapeHtml(data.headline || name)}</h2>
            ${data.content ? `<div>${data.content}</div>` : ''}
            ${data.buttonText ? `<a href="#" class="button">${escapeHtml(data.buttonText)}</a>` : ''}
          </div>
        </section>
      `;
    
    case 'feature':
    case 'feature-grid':
      // For feature sections, check if there are items to display in a grid
      if (Array.isArray(data.items) && data.items.length > 0) {
        const featuresHtml = data.items.map((item: any) => `
          <div class="feature">
            <h3>${escapeHtml(item.title || '')}</h3>
            <p>${escapeHtml(item.description || '')}</p>
          </div>
        `).join('');
        
        return `
          <section class="section">
            <div class="container">
              <h2>${escapeHtml(data.headline || name)}</h2>
              ${data.description ? `<p>${escapeHtml(data.description)}</p>` : ''}
              <div class="features-grid">
                ${featuresHtml}
              </div>
            </div>
          </section>
        `;
      } else {
        return `
          <section class="section">
            <div class="container">
              <h2>${escapeHtml(name)}</h2>
              ${description ? `<p>${escapeHtml(description)}</p>` : ''}
              ${data.content ? `<div>${data.content}</div>` : ''}
            </div>
          </section>
        `;
      }
    
    case 'faq':
      let faqItems = '';
      
      if (Array.isArray(data.items) && data.items.length > 0) {
        faqItems = data.items.map((item: any) => `
          <div class="faq-item">
            <div class="faq-question">${escapeHtml(item.question || '')}</div>
            <div class="faq-answer">${escapeHtml(item.answer || '')}</div>
          </div>
        `).join('');
      }
      
      return `
        <section class="section">
          <div class="container">
            <h2>${escapeHtml(data.headline || name || 'FAQ')}</h2>
            <div class="faq-list">
              ${faqItems}
            </div>
          </div>
        </section>
      `;
    
    default:
      // Generic section for any other type
      return `
        <section class="section">
          <div class="container">
            <h2>${escapeHtml(name)}</h2>
            ${description ? `<p>${escapeHtml(description)}</p>` : ''}
            ${data.content ? `<div>${data.content}</div>` : ''}
          </div>
        </section>
      `;
  }
};

/**
 * Escapes HTML special characters to prevent XSS
 */
const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
