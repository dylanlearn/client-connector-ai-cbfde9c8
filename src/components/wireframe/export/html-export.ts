
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

/**
 * Generates HTML from wireframe data for export
 */
export function generateHtmlFromWireframe(wireframe: WireframeData): string {
  const title = wireframe.title || 'Wireframe Export';
  const description = wireframe.description || '';
  const colorScheme = wireframe.colorScheme || {
    background: '#ffffff',
    text: '#333333',
    primary: '#0070f3',
    secondary: '#f5f5f5',
    accent: '#ffa500'
  };
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      --background: ${colorScheme.background};
      --text: ${colorScheme.text || '#333333'};
      --primary: ${colorScheme.primary};
      --secondary: ${colorScheme.secondary || '#f5f5f5'};
      --accent: ${colorScheme.accent || '#ffa500'};
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: var(--background);
      color: var(--text);
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }
    .wireframe-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .wireframe-header {
      margin-bottom: 2rem;
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 1rem;
    }
    .wireframe-title {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--primary);
    }
    .wireframe-description {
      font-size: 1.2rem;
      color: #666;
    }
    .wireframe-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .section-header {
      font-size: 1.8rem;
      color: var(--primary);
      margin-bottom: 1rem;
    }
    .section-description {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
    }
    .component-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .component-item {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      border: 1px solid #eaeaea;
    }
    .meta-info {
      font-size: 0.8rem;
      color: #999;
      margin-top: 4rem;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="wireframe-container">
    <header class="wireframe-header">
      <h1 class="wireframe-title">${title}</h1>
      <p class="wireframe-description">${description}</p>
    </header>
    
    <main>
      ${wireframe.sections?.map(section => `
        <section class="wireframe-section">
          <h2 class="section-header">${section.name || 'Unnamed Section'}</h2>
          ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
          
          ${section.components && section.components.length > 0 ? `
          <div class="component-list">
            ${section.components.map((component, index) => `
              <div class="component-item">
                <h3>${component.type || 'Component ' + (index + 1)}</h3>
                ${component.content ? `<p>${JSON.stringify(component.content)}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : '<p>No components in this section</p>'}
        </section>
      `).join('') || '<p>No sections available</p>'}
    </main>
    
    <footer class="meta-info">
      <p>Exported from Wireframe Studio on ${new Date().toLocaleDateString()}</p>
    </footer>
  </div>
</body>
</html>`;
}
