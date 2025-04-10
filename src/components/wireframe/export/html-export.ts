
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

/**
 * Generates a standalone HTML file from wireframe data
 */
export function generateHtmlFromWireframe(wireframe: WireframeData): string {
  const colorScheme = wireframe.colorScheme || {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#111827'
  };
  
  const typography = wireframe.typography || {
    headings: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif'
  };
  
  // Generate CSS variables from the color scheme and typography
  const cssVariables = `
    :root {
      --color-primary: ${colorScheme.primary};
      --color-secondary: ${colorScheme.secondary};
      --color-accent: ${colorScheme.accent};
      --color-background: ${colorScheme.background};
      --color-text: ${colorScheme.text};
      --font-headings: ${typography.headings};
      --font-body: ${typography.body};
    }
  `;
  
  // Generate HTML sections from the wireframe sections
  const sectionHtml = wireframe.sections.map(section => {
    // Generate component HTML for each section
    const componentsHtml = section.components?.map(component => {
      // Handle different component types
      switch (component.type) {
        case 'heading':
          return `<h2 class="component heading">${component.content || 'Heading'}</h2>`;
        case 'subheading':
          return `<h3 class="component subheading">${component.content || 'Subheading'}</h3>`;
        case 'text':
          return `<p class="component text">${component.content || 'Text content'}</p>`;
        case 'button':
          return `<button class="component button">${component.content || 'Button'}</button>`;
        case 'image':
          return `<div class="component image"><div class="placeholder-image">${component.content || 'Image'}</div></div>`;
        case 'form':
          return `<div class="component form">
            <form>
              <div class="form-field">
                <label>Name</label>
                <input type="text" placeholder="Name">
              </div>
              <div class="form-field">
                <label>Email</label>
                <input type="email" placeholder="Email">
              </div>
              <div class="form-field">
                <label>Message</label>
                <textarea placeholder="Message"></textarea>
              </div>
              <button type="button">Submit</button>
            </form>
          </div>`;
        case 'navigation':
          // Handle navigation items if provided
          const navItems = Array.isArray(component.content) 
            ? component.content.map(item => `<li class="nav-item">${item}</li>`).join('')
            : '<li class="nav-item">Home</li><li class="nav-item">About</li><li class="nav-item">Contact</li>';
          return `<nav class="component navigation"><ul class="nav-list">${navItems}</ul></nav>`;
        default:
          // Generic component
          return `<div class="component ${component.type || 'generic'}">${
            typeof component.content === 'string' ? component.content : 'Component'
          }</div>`;
      }
    }).join('') || '';
    
    // Generate the section HTML with components
    return `
      <section class="wireframe-section ${section.sectionType || 'generic'}" data-section-id="${section.id}">
        <div class="section-header">
          <h2 class="section-name">${section.name || 'Section'}</h2>
          <span class="section-type">${section.sectionType || 'generic'}</span>
        </div>
        <div class="section-content">
          ${componentsHtml}
        </div>
      </section>
    `;
  }).join('');
  
  // Create the full HTML document
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${wireframe.title || 'Wireframe Export'}</title>
  <style>
    ${cssVariables}
    
    body {
      font-family: var(--font-body);
      color: var(--color-text);
      background-color: var(--color-background);
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-headings);
    }
    
    .wireframe-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .wireframe-header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .wireframe-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      background-color: white;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .section-name {
      font-size: 1.5rem;
      margin: 0;
      color: var(--color-primary);
    }
    
    .section-type {
      font-size: 0.8rem;
      background-color: #f0f0f0;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
    }
    
    .section-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .component {
      padding: 1rem;
      border: 1px dashed #e0e0e0;
      border-radius: 3px;
    }
    
    .heading {
      font-size: 2rem;
      margin: 0;
      color: var(--color-text);
    }
    
    .subheading {
      font-size: 1.5rem;
      margin: 0;
      color: var(--color-text);
      opacity: 0.9;
    }
    
    .text {
      margin: 0;
    }
    
    .button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: var(--color-primary);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      text-align: center;
    }
    
    .placeholder-image {
      width: 100%;
      height: 200px;
      background-color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      border-radius: 4px;
    }
    
    .form {
      width: 100%;
    }
    
    .form-field {
      margin-bottom: 1rem;
    }
    
    .form-field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .form-field input,
    .form-field textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: var(--font-body);
      font-size: 1rem;
    }
    
    .form-field textarea {
      min-height: 100px;
    }
    
    .navigation {
      padding: 1rem 0;
    }
    
    .nav-list {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 1.5rem;
    }
    
    .nav-item {
      cursor: pointer;
      color: var(--color-primary);
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .wireframe-container {
        padding: 1rem;
      }
      
      .nav-list {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="wireframe-container">
    <header class="wireframe-header">
      <h1>${wireframe.title || 'Wireframe Export'}</h1>
      ${wireframe.description ? `<p>${wireframe.description}</p>` : ''}
    </header>
    <main class="wireframe-content">
      ${sectionHtml}
    </main>
    <footer>
      <p>Exported from Wireframe Studio</p>
    </footer>
  </div>
</body>
</html>`;

  return html;
}
