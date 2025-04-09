
export interface WireframeTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
    border: string;
    [key: string]: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontBaseSize: string;
    lineHeight: string;
    fontWeights: {
      light: string;
      normal: string;
      medium: string;
      bold: string;
      [key: string]: string;
    };
  };
  spacing: {
    unit: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    [key: string]: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
    [key: string]: string;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    [key: string]: string;
  };
  darkMode?: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      muted: string;
      border: string;
      [key: string]: string;
    };
  };
}

export const DEFAULT_THEME: WireframeTheme = {
  id: 'default',
  name: 'Default Theme',
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#f97316',
    background: '#ffffff',
    text: '#1e293b',
    muted: '#64748b',
    border: '#e2e8f0',
  },
  typography: {
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    fontBaseSize: '16px',
    lineHeight: '1.5',
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      bold: '700',
    },
  },
  spacing: {
    unit: '4px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  darkMode: {
    colors: {
      primary: '#60a5fa',
      secondary: '#818cf8',
      accent: '#fb923c',
      background: '#1e293b',
      text: '#f1f5f9',
      muted: '#94a3b8',
      border: '#334155',
    },
  },
};

// Predefined themes
export const PREDEFINED_THEMES: WireframeTheme[] = [
  DEFAULT_THEME,
  {
    id: 'minimal',
    name: 'Minimal Light',
    colors: {
      primary: '#000000',
      secondary: '#444444',
      accent: '#888888',
      background: '#ffffff',
      text: '#111111',
      muted: '#777777',
      border: '#dddddd',
    },
    typography: {
      headingFont: 'DM Sans, sans-serif',
      bodyFont: 'DM Sans, sans-serif',
      fontBaseSize: '16px',
      lineHeight: '1.5',
      fontWeights: {
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700',
      },
    },
    spacing: {
      unit: '8px',
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
    },
    borderRadius: {
      none: '0',
      sm: '0',
      md: '0',
      lg: '0',
      full: '9999px',
    },
    shadows: {
      none: 'none',
      sm: 'none',
      md: 'none',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
    },
    darkMode: {
      colors: {
        primary: '#ffffff',
        secondary: '#aaaaaa',
        accent: '#888888',
        background: '#111111',
        text: '#ffffff',
        muted: '#888888',
        border: '#444444',
      },
    },
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#f97316',
      background: '#f8fafc',
      text: '#0f172a',
      muted: '#64748b',
      border: '#e2e8f0',
    },
    typography: {
      headingFont: 'Montserrat, sans-serif',
      bodyFont: 'Open Sans, sans-serif',
      fontBaseSize: '16px',
      lineHeight: '1.6',
      fontWeights: {
        light: '300',
        normal: '400',
        medium: '600',
        bold: '700',
      },
    },
    spacing: {
      unit: '4px',
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    borderRadius: {
      none: '0',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      full: '9999px',
    },
    shadows: {
      none: 'none',
      sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    },
    darkMode: {
      colors: {
        primary: '#60a5fa',
        secondary: '#a78bfa',
        accent: '#fb923c',
        background: '#0f172a',
        text: '#f1f5f9',
        muted: '#94a3b8',
        border: '#334155',
      },
    },
  },
];

/**
 * Apply theme to wireframe elements
 */
export const applyThemeToElement = (
  element: any,
  theme: WireframeTheme,
  darkMode: boolean = false
): any => {
  if (!element) return element;
  
  const colorPalette = darkMode && theme.darkMode 
    ? theme.darkMode.colors 
    : theme.colors;
  
  // Clone the element to avoid mutating the original
  const themedElement = { ...element };
  
  // Apply colors based on element type
  if (themedElement.type === 'button') {
    themedElement.style = {
      ...themedElement.style,
      backgroundColor: colorPalette.primary,
      color: darkMode ? '#ffffff' : '#ffffff',
      borderRadius: theme.borderRadius.md,
      fontFamily: theme.typography.bodyFont,
    };
  } else if (themedElement.type === 'heading') {
    themedElement.style = {
      ...themedElement.style,
      color: colorPalette.text,
      fontFamily: theme.typography.headingFont,
    };
  } else if (themedElement.type === 'text') {
    themedElement.style = {
      ...themedElement.style,
      color: colorPalette.text,
      fontFamily: theme.typography.bodyFont,
    };
  } else if (themedElement.type === 'card') {
    themedElement.style = {
      ...themedElement.style,
      backgroundColor: colorPalette.background,
      borderColor: colorPalette.border,
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.md,
    };
  }
  
  // Apply theme to nested elements
  if (themedElement.children && Array.isArray(themedElement.children)) {
    themedElement.children = themedElement.children.map((child: any) =>
      applyThemeToElement(child, theme, darkMode)
    );
  }
  
  return themedElement;
};

/**
 * Generate a CSS string from a theme
 */
export const generateCSSFromTheme = (theme: WireframeTheme): string => {
  return `
    :root {
      /* Colors */
      --primary: ${theme.colors.primary};
      --secondary: ${theme.colors.secondary};
      --accent: ${theme.colors.accent};
      --background: ${theme.colors.background};
      --text: ${theme.colors.text};
      --muted: ${theme.colors.muted};
      --border: ${theme.colors.border};
      
      /* Typography */
      --heading-font: ${theme.typography.headingFont};
      --body-font: ${theme.typography.bodyFont};
      --font-base-size: ${theme.typography.fontBaseSize};
      --line-height: ${theme.typography.lineHeight};
      
      /* Font weights */
      --font-light: ${theme.typography.fontWeights.light};
      --font-normal: ${theme.typography.fontWeights.normal};
      --font-medium: ${theme.typography.fontWeights.medium};
      --font-bold: ${theme.typography.fontWeights.bold};
      
      /* Spacing */
      --spacing-unit: ${theme.spacing.unit};
      --spacing-xs: ${theme.spacing.xs};
      --spacing-sm: ${theme.spacing.sm};
      --spacing-md: ${theme.spacing.md};
      --spacing-lg: ${theme.spacing.lg};
      --spacing-xl: ${theme.spacing.xl};
      
      /* Border Radius */
      --radius-none: ${theme.borderRadius.none};
      --radius-sm: ${theme.borderRadius.sm};
      --radius-md: ${theme.borderRadius.md};
      --radius-lg: ${theme.borderRadius.lg};
      --radius-full: ${theme.borderRadius.full};
      
      /* Shadows */
      --shadow-sm: ${theme.shadows.sm};
      --shadow-md: ${theme.shadows.md};
      --shadow-lg: ${theme.shadows.lg};
    }
    
    /* Dark mode overrides */
    .dark {
      --primary: ${theme.darkMode?.colors.primary || theme.colors.primary};
      --secondary: ${theme.darkMode?.colors.secondary || theme.colors.secondary};
      --accent: ${theme.darkMode?.colors.accent || theme.colors.accent};
      --background: ${theme.darkMode?.colors.background || '#1e293b'};
      --text: ${theme.darkMode?.colors.text || '#f1f5f9'};
      --muted: ${theme.darkMode?.colors.muted || '#94a3b8'};
      --border: ${theme.darkMode?.colors.border || '#334155'};
    }
    
    /* Base styles */
    body {
      font-family: var(--body-font);
      font-size: var(--font-base-size);
      line-height: var(--line-height);
      color: var(--text);
      background-color: var(--background);
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--heading-font);
      font-weight: var(--font-bold);
    }
    
    a {
      color: var(--primary);
    }
    
    button, .button {
      background-color: var(--primary);
      color: white;
      border-radius: var(--radius-md);
      padding: var(--spacing-sm) var(--spacing-md);
    }
  `;
};

/**
 * Get a theme by ID
 */
export const getThemeById = (themeId: string): WireframeTheme => {
  const theme = PREDEFINED_THEMES.find(t => t.id === themeId);
  return theme || DEFAULT_THEME;
};
