import { callOpenAI } from "./openai-client.ts";

/**
 * Apply style modifiers to the wireframe blueprint based on style token
 */
export async function applyStyleModifiers(blueprint: any, styleToken?: string): Promise<any> {
  if (!blueprint) {
    return blueprint;
  }
  
  // No style token provided, return the blueprint as is
  if (!styleToken) {
    return blueprint;
  }

  // Map of common style tokens to color schemes and typography
  const styleModifiers: Record<string, any> = {
    'minimal': {
      colorScheme: {
        primary: '#000000',
        secondary: '#404040',
        accent: '#707070',
        background: '#ffffff',
        text: '#202020'
      },
      typography: {
        headings: 'sans-serif',
        body: 'sans-serif'
      }
    },
    'modern': {
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#111827'
      },
      typography: {
        headings: 'sans-serif',
        body: 'sans-serif'
      }
    },
    'elegant': {
      colorScheme: {
        primary: '#6b21a8',
        secondary: '#7e22ce',
        accent: '#c026d3',
        background: '#f9fafb',
        text: '#1f2937'
      },
      typography: {
        headings: 'serif',
        body: 'sans-serif'
      }
    },
    'corporate': {
      colorScheme: {
        primary: '#1e40af',
        secondary: '#1e3a8a',
        accent: '#3b82f6',
        background: '#f9fafb',
        text: '#111827'
      },
      typography: {
        headings: 'sans-serif',
        body: 'sans-serif'
      }
    },
    'bold': {
      colorScheme: {
        primary: '#dc2626',
        secondary: '#b91c1c',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#111827'
      },
      typography: {
        headings: 'sans-serif',
        body: 'sans-serif'
      }
    },
    'playful': {
      colorScheme: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        accent: '#f97316',
        background: '#ffffff',
        text: '#374151'
      },
      typography: {
        headings: 'sans-serif',
        body: 'sans-serif'
      }
    }
  };
  
  // Create a copy of the blueprint to modify
  const styledBlueprint = JSON.parse(JSON.stringify(blueprint));
  
  // Apply the style modifier if it exists, otherwise keep original style
  if (styleModifiers[styleToken]) {
    const modifier = styleModifiers[styleToken];
    
    // Apply color scheme if not already defined
    if (modifier.colorScheme && (!styledBlueprint.colorScheme || Object.keys(styledBlueprint.colorScheme).length === 0)) {
      styledBlueprint.colorScheme = modifier.colorScheme;
    }
    
    // Apply typography if not already defined
    if (modifier.typography && (!styledBlueprint.typography || Object.keys(styledBlueprint.typography).length === 0)) {
      styledBlueprint.typography = modifier.typography;
    }
    
    // Set the style token
    styledBlueprint.styleToken = styleToken;
  }
  
  return styledBlueprint;
}
