
import React, { useState, useEffect } from 'react';
import { VisualPicker, DesignOption } from './VisualPicker';
import { DesignSuggestion } from '@/hooks/wireframe/use-wireframe-variations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export interface EnhancedVisualPickerProps {
  onDesignSelected: (design: DesignSuggestion) => void;
}

// Sample design options (you can expand these or load from an API)
const colorSchemes: DesignOption[] = [
  {
    id: 'modern',
    title: 'Modern & Minimal',
    description: 'Clean, minimal design with soft neutrals and bold accents',
    imageUrl: '/lovable-uploads/0507e956-3bf5-43ba-924e-9d353066ebad.png',
    category: 'color'
  },
  {
    id: 'vibrant',
    title: 'Vibrant & Bold',
    description: 'Energetic colors with high contrast and visual impact',
    imageUrl: '/lovable-uploads/3ffcf93f-2dca-479f-867d-cc445acdac8d.png',
    category: 'color'
  },
  {
    id: 'earthy',
    title: 'Earthy & Natural',
    description: 'Nature-inspired palette with warm, grounding tones',
    imageUrl: '/lovable-uploads/4efe39c0-e0e0-4c25-a11a-d9f9648b0495.png',
    category: 'color'
  }
];

const layoutOptions: DesignOption[] = [
  {
    id: 'minimal',
    title: 'Minimal',
    description: 'Clean, spacious layouts with plenty of whitespace',
    imageUrl: '/lovable-uploads/9d1c9181-4f19-48e3-b424-cbe28ccb9ad1.png',
    category: 'layout'
  },
  {
    id: 'grid',
    title: 'Grid-based',
    description: 'Organized, structured layouts using a consistent grid system',
    imageUrl: '/lovable-uploads/a3b75d3c-550b-44e0-b81b-4d74404d106c.png',
    category: 'layout'
  },
  {
    id: 'asymmetric',
    title: 'Asymmetric',
    description: 'Dynamic, engaging layouts with intentional imbalance',
    imageUrl: '/lovable-uploads/d9eb0f5d-57b5-4d7e-8da0-23bc6c9c83f1.png',
    category: 'layout'
  }
];

const typographyOptions: DesignOption[] = [
  {
    id: 'modern-sans',
    title: 'Modern Sans-Serif',
    description: 'Clean, minimal sans-serif typefaces for a contemporary look',
    imageUrl: '/lovable-uploads/0392ac21-110f-484c-8f3d-5fcbb0dcefc6.png',
    category: 'typography'
  },
  {
    id: 'serif-mix',
    title: 'Serif & Sans Mix',
    description: 'Classic serif headings paired with sans-serif body text',
    imageUrl: '/lovable-uploads/23ecc16f-a53c-43af-8d71-1034d90498b3.png',
    category: 'typography'
  },
  {
    id: 'display-accent',
    title: 'Display Accents',
    description: 'Distinctive display fonts for headings with readable body text',
    imageUrl: '/lovable-uploads/480f7861-cc1e-41e1-9ee1-be7ba9aa52b9.png',
    category: 'typography'
  }
];

// Component style options based on selected styles
const getComponentStyles = (colorSchemeId: string, layoutId: string): Record<string, any> => {
  // This would be more extensive in a real application
  const baseStyles: Record<string, any> = {
    button: {
      borderRadius: '0.375rem',
      padding: '0.75rem 1.5rem',
    },
    card: {
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    }
  };
  
  // Adjust styles based on color scheme
  if (colorSchemeId === 'modern') {
    baseStyles.button.backgroundColor = '#3b82f6';
  } else if (colorSchemeId === 'vibrant') {
    baseStyles.button.backgroundColor = '#8b5cf6';
  } else if (colorSchemeId === 'earthy') {
    baseStyles.button.backgroundColor = '#65a30d';
  }
  
  // Adjust styles based on layout
  if (layoutId === 'minimal') {
    baseStyles.card.padding = '2rem';
  } else if (layoutId === 'grid') {
    baseStyles.card.padding = '1.5rem';
  } else if (layoutId === 'asymmetric') {
    baseStyles.card.padding = '1rem 2rem';
  }
  
  return baseStyles;
};

// Map colorSchemeId to actual color values
const getColorScheme = (colorSchemeId: string): {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
} => {
  switch (colorSchemeId) {
    case 'modern':
      return {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#10b981',
        background: '#ffffff',
        text: '#1e293b'
      };
    case 'vibrant':
      return {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        accent: '#f59e0b',
        background: '#f8fafc',
        text: '#0f172a'
      };
    case 'earthy':
      return {
        primary: '#65a30d',
        secondary: '#854d0e',
        accent: '#d97706',
        background: '#f9fafb',
        text: '#422006'
      };
    default:
      return {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#10b981',
        background: '#ffffff',
        text: '#1e293b'
      };
  }
};

// Map typographyId to actual font values
const getTypography = (typographyId: string): {
  headings: string;
  body: string;
} => {
  switch (typographyId) {
    case 'modern-sans':
      return {
        headings: 'Inter',
        body: 'Inter'
      };
    case 'serif-mix':
      return {
        headings: 'Playfair Display',
        body: 'Source Sans Pro'
      };
    case 'display-accent':
      return {
        headings: 'Montserrat',
        body: 'Open Sans'
      };
    default:
      return {
        headings: 'Inter',
        body: 'Inter'
      };
  }
};

export const EnhancedVisualPicker: React.FC<EnhancedVisualPickerProps> = ({
  onDesignSelected
}) => {
  const [selectedColorScheme, setSelectedColorScheme] = useState<string | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [selectedTypography, setSelectedTypography] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('colors');
  
  // Update the design suggestion whenever a selection changes
  useEffect(() => {
    if (selectedColorScheme && selectedLayout && selectedTypography) {
      const designSuggestion: DesignSuggestion = {
        colorScheme: getColorScheme(selectedColorScheme),
        typography: getTypography(selectedTypography),
        layoutStyle: selectedLayout,
        componentStyles: getComponentStyles(selectedColorScheme, selectedLayout),
        toneDescriptor: selectedColorScheme === 'vibrant' ? 'energetic' : 
                       selectedColorScheme === 'earthy' ? 'warm' : 'clean'
      };
      
      onDesignSelected(designSuggestion);
    }
  }, [selectedColorScheme, selectedLayout, selectedTypography, onDesignSelected]);
  
  return (
    <div className="enhanced-visual-picker">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="colors">Color Scheme</TabsTrigger>
          <TabsTrigger value="layouts">Layout Style</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors">
          <Card>
            <CardContent className="pt-6">
              <VisualPicker 
                options={colorSchemes} 
                selectedId={selectedColorScheme}
                onSelect={setSelectedColorScheme}
                fullWidth
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="layouts">
          <Card>
            <CardContent className="pt-6">
              <VisualPicker 
                options={layoutOptions} 
                selectedId={selectedLayout}
                onSelect={setSelectedLayout}
                fullWidth
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="typography">
          <Card>
            <CardContent className="pt-6">
              <VisualPicker 
                options={typographyOptions} 
                selectedId={selectedTypography}
                onSelect={setSelectedTypography}
                fullWidth
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedColorScheme && selectedLayout && selectedTypography ? (
        <div className="mt-6 p-4 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground mb-1">Selected Design</p>
          <p className="font-medium">Color: {colorSchemes.find(o => o.id === selectedColorScheme)?.title}</p>
          <p className="font-medium">Layout: {layoutOptions.find(o => o.id === selectedLayout)?.title}</p>
          <p className="font-medium">Typography: {typographyOptions.find(o => o.id === selectedTypography)?.title}</p>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-muted rounded-md text-muted-foreground text-center">
          Please select options from each category
        </div>
      )}
    </div>
  );
};
