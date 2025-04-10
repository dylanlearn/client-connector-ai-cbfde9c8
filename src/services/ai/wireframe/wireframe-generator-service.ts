// src/services/ai/wireframe/wireframe-generator-service.ts

import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeData, 
  WireframeSection, 
  WireframeComponent,
  WireframeGenerationParams
} from '../wireframe-types';

export const WireframeGeneratorService = {
  generateWireframe: async (params: WireframeGenerationParams): Promise<WireframeData> => {
    // Mock data for demonstration purposes
    const sections: WireframeSection[] = [
      {
        id: uuidv4(),
        name: 'Header',
        components: [
          {
            id: uuidv4(),
            type: 'text',
            content: 'Website Title',
            style: {
              fontSize: '24px',
              fontWeight: 'bold'
            }
          },
          {
            id: uuidv4(),
            type: 'navigation',
            content: ['Home', 'About', 'Services', 'Contact'],
            style: {
              display: 'flex',
              justifyContent: 'space-around'
            }
          }
        ]
      },
      {
        id: uuidv4(),
        name: 'Hero Section',
        components: [
          {
            id: uuidv4(),
            type: 'image',
            url: 'https://via.placeholder.com/800x400',
            altText: 'Hero Image',
            style: {
              width: '100%',
              height: 'auto'
            }
          },
          {
            id: uuidv4(),
            type: 'text',
            content: 'Welcome to Our Website',
            style: {
              fontSize: '36px',
              fontWeight: 'bold',
              textAlign: 'center'
            }
          },
          {
            id: uuidv4(),
            type: 'text',
            content: 'A brief description of what we offer.',
            style: {
              fontSize: '18px',
              textAlign: 'center'
            }
          },
          {
            id: uuidv4(),
            type: 'button',
            content: 'Learn More',
            style: {
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '15px 32px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '16px',
              borderRadius: '5px'
            }
          }
        ]
      },
      {
        id: uuidv4(),
        name: 'Content Section',
        components: [
          {
            id: uuidv4(),
            type: 'text',
            content: 'About Us',
            style: {
              fontSize: '24px',
              fontWeight: 'bold'
            }
          },
          {
            id: uuidv4(),
            type: 'text',
            content: 'A detailed description about our company and services.',
            style: {
              fontSize: '16px'
            }
          }
        ]
      },
      {
        id: uuidv4(),
        name: 'Contact Form',
        components: [
          {
            id: uuidv4(),
            type: 'form',
            fields: ['Name', 'Email', 'Message'],
            style: {
              display: 'flex',
              flexDirection: 'column'
            }
          },
          {
            id: uuidv4(),
            type: 'button',
            content: 'Submit',
            style: {
              backgroundColor: '#008CBA',
              color: 'white',
              padding: '15px 32px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '16px',
              borderRadius: '5px'
            }
          }
        ]
      },
      {
        id: uuidv4(),
        name: 'Footer',
        components: [
          {
            id: uuidv4(),
            type: 'text',
            content: '© 2023 My Company',
            style: {
              textAlign: 'center'
            }
          }
        ]
      }
    ];

    // Mock color scheme and typography
    const colorScheme = {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    };

    const typography = {
      headings: 'sans-serif',
      body: 'sans-serif'
    };
    
    // Ensure colorScheme has the required structure
    const safeColorScheme = {
      primary: colorScheme.primary || '#3b82f6',
      secondary: colorScheme.secondary || '#10b981',
      accent: colorScheme.accent || '#f59e0b',
      background: colorScheme.background || '#ffffff',
      text: colorScheme.text || '#111827'
    };

    return {
      id: uuidv4(),
      title: params.title || 'New Wireframe',
      description: params.description || '',
      sections: sections || [],
      style: params.style || {},
      colorScheme: safeColorScheme,
      typography: typography,
      designTokens: {},
      mobileLayouts: {},
      styleVariants: {},
      designReasoning: {},
      animations: {},
      imageUrl: '',
      lastUpdated: new Date().toISOString()
    };
  }
};
