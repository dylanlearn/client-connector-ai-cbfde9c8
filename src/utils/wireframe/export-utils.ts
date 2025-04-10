
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Exports a wireframe to HTML
 * @param wireframe The wireframe data to export
 * @returns HTML string representation of the wireframe
 */
export async function exportToHTML(wireframe: WireframeData): Promise<string> {
  if (!wireframe) {
    throw new Error('No wireframe data provided for export');
  }
  
  const title = wireframe.title || 'Wireframe';
  const colorScheme = wireframe.colorScheme || {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f97316',
    background: '#ffffff',
    text: '#111827'
  };
  
  // Generate HTML for each section
  const sectionsHTML = wireframe.sections.map(section => {
    return generateSectionHTML(section, colorScheme);
  }).join('\n\n');
  
  // Generate complete HTML document
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    :root {
      --color-primary: ${colorScheme.primary};
      --color-secondary: ${colorScheme.secondary};
      --color-accent: ${colorScheme.accent};
      --color-background: ${colorScheme.background};
      --color-text: ${colorScheme.text || '#111827'};
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: var(--color-background);
      color: var(--color-text);
    }
    .btn-primary {
      background-color: var(--color-primary);
      color: white;
    }
    .btn-secondary {
      background-color: var(--color-secondary);
      color: white;
    }
    .section-container {
      margin: 2rem 0;
      padding: 1rem;
      border-radius: 0.375rem;
    }
  </style>
</head>
<body>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center">${title}</h1>
    
    ${sectionsHTML}
  </div>
</body>
</html>`;

  return html;
}

/**
 * Generates HTML for a wireframe section
 * @param section The section data
 * @param colorScheme The wireframe color scheme
 * @returns HTML string for the section
 */
function generateSectionHTML(section: WireframeSection, colorScheme: any): string {
  if (!section) return '';
  
  // Determine section CSS classes based on section type
  let sectionClasses = 'section-container';
  let backgroundStyle = '';
  
  switch (section.sectionType?.toLowerCase()) {
    case 'hero':
      sectionClasses += ' bg-primary bg-opacity-10';
      backgroundStyle = `style="background-color: ${colorScheme.primary}20"`;
      break;
    case 'features':
      sectionClasses += ' bg-secondary bg-opacity-10';
      backgroundStyle = `style="background-color: ${colorScheme.secondary}15"`;
      break;
    case 'footer':
      sectionClasses += ' bg-gray-100';
      break;
    default:
      sectionClasses += ' border border-gray-200';
  }
  
  // Generate components HTML if available
  let componentsHTML = '';
  if (section.components && Array.isArray(section.components) && section.components.length > 0) {
    // Determine layout type
    const layoutType = section.layoutType || 
      (typeof section.layout === 'string' ? section.layout : section.layout?.type) || 
      'vertical';
    
    // Apply layout grid classes
    let layoutClasses = '';
    switch (layoutType.toLowerCase()) {
      case 'grid':
        const columns = section.layout?.columns || 3;
        layoutClasses = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(columns, 12)} gap-6`;
        break;
      case 'horizontal':
        layoutClasses = 'flex flex-col md:flex-row items-center justify-between gap-6 flex-wrap';
        break;
      case 'vertical':
      default:
        layoutClasses = 'flex flex-col gap-6';
    }
    
    // Generate component HTML
    const componentList = section.components.map(component => {
      return generateComponentHTML(component);
    }).join('\n');
    
    componentsHTML = `<div class="${layoutClasses}">\n${componentList}\n</div>`;
  }
  
  // Create section HTML
  return `<!-- ${section.name || section.sectionType || 'Section'} -->
<section class="${sectionClasses}" ${backgroundStyle} id="${section.id}">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">${section.name || ''}</h2>
    ${componentsHTML}
  </div>
</section>`;
}

/**
 * Generates HTML for a wireframe component
 * @param component The component data
 * @returns HTML string for the component
 */
function generateComponentHTML(component: any): string {
  if (!component || !component.type) {
    return '';
  }
  
  const componentType = component.type.toLowerCase();
  const componentContent = component.content || component.props?.content || component.props?.label || '';
  
  // Generate HTML based on component type
  switch (componentType) {
    case 'heading':
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      const level = component.level || component.props?.level || 2;
      return `<h${level} class="font-bold text-${7 - level}xl">${componentContent}</h${level}>`;
    
    case 'text':
    case 'paragraph':
    case 'p':
      return `<p class="text-base leading-relaxed">${componentContent}</p>`;
    
    case 'button':
      return `<button class="btn-primary px-6 py-2 rounded-md font-medium">${componentContent}</button>`;
    
    case 'image':
    case 'img':
      return `<div class="bg-gray-200 rounded-md w-full aspect-video flex items-center justify-center">
  <span class="text-gray-500">Image: ${componentContent || 'Placeholder'}</span>
</div>`;
    
    case 'input':
      return `<div class="w-full">
  ${component.props?.label ? `<label class="block text-sm font-medium mb-1">${component.props.label}</label>` : ''}
  <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="${component.props?.placeholder || 'Enter text...'}">
</div>`;
    
    case 'card':
      return `<div class="bg-white shadow rounded-lg p-6">
  <h3 class="font-bold text-lg mb-2">${component.props?.title || componentContent || 'Card Title'}</h3>
  <p class="text-gray-600 mb-4">${component.props?.content || 'Card content goes here'}</p>
  <button class="btn-primary px-4 py-2 rounded-md text-sm font-medium">${component.props?.buttonText || 'Learn More'}</button>
</div>`;
    
    case 'container':
    case 'div':
    case 'box':
      return `<div class="p-4 border border-gray-200 rounded-md">
  ${component.name || component.props?.label ? `<p class="text-sm text-gray-500 mb-2">${component.name || component.props?.label}</p>` : ''}
  ${componentContent || ''}
</div>`;
    
    case 'nav':
    case 'menu':
    case 'navigation':
      const navItems = component.props?.items || ['Home', 'About', 'Features', 'Contact'];
      const navLinks = navItems.map((item: string) => 
        `<a href="#" class="px-4 py-2 hover:underline">${item}</a>`
      ).join('\n');
      
      return `<nav class="flex flex-wrap gap-2">
  ${navLinks}
</nav>`;
    
    case 'form':
      return `<form class="space-y-4 p-6 border border-gray-200 rounded-lg">
  <h3 class="text-xl font-bold mb-4">${component.props?.title || componentContent || 'Form'}</h3>
  <div>
    <label class="block text-sm font-medium mb-1">Field 1</label>
    <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-md">
  </div>
  <div>
    <label class="block text-sm font-medium mb-1">Field 2</label>
    <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-md">
  </div>
  <button type="submit" class="btn-primary px-6 py-2 rounded-md">Submit</button>
</form>`;
    
    default:
      return `<div class="p-4 border border-gray-200 rounded-md">
  <p>${componentType}: ${componentContent || 'Component'}</p>
</div>`;
  }
}
