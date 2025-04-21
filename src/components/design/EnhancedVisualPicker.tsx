
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedVisualPicker from './visual-picker/AnimatedVisualPicker';
import { DesignSuggestion } from '@/hooks/wireframe/use-wireframe-variations';
import { useToast } from '@/hooks/use-toast';

// Define the design options with categories for better organization
const DESIGN_OPTIONS = [
  // Color Scheme Options
  {
    id: 'colors-modern',
    title: 'Modern & Clean',
    description: 'Clean, minimal aesthetic with bold accents',
    imageUrl: '/lovable-uploads/0507e956-3bf5-43ba-924e-9d353066ebad.png',
    category: 'colorScheme',
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    }
  },
  {
    id: 'colors-bold',
    title: 'Bold & Vibrant',
    description: 'High contrast with vivid, attention-grabbing colors',
    imageUrl: '/lovable-uploads/9d1c9181-4f19-48e3-b424-cbe28ccb9ad1.png',
    category: 'colorScheme',
    colorScheme: {
      primary: '#dc2626',
      secondary: '#7c3aed',
      accent: '#fbbf24',
      background: '#ffffff',
      text: '#111827'
    }
  },
  {
    id: 'colors-elegant',
    title: 'Elegant & Sophisticated',
    description: 'Refined palette with muted, sophisticated tones',
    imageUrl: '/lovable-uploads/3ffcf93f-2dca-479f-867d-cc445acdac8d.png',
    category: 'colorScheme',
    colorScheme: {
      primary: '#6b21a8',
      secondary: '#065f46',
      accent: '#d97706',
      background: '#f9fafb',
      text: '#111827'
    }
  },
  // Typography Options
  {
    id: 'type-modern',
    title: 'Modern Sans-Serif',
    description: 'Clean and minimal typography',
    imageUrl: '/lovable-uploads/4efe39c0-e0e0-4c25-a11a-d9f9648b0495.png',
    category: 'typography',
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  },
  {
    id: 'type-classic',
    title: 'Classic Serif',
    description: 'Timeless and elegant typography',
    imageUrl: '/lovable-uploads/23ecc16f-a53c-43af-8d71-1034d90498b3.png',
    category: 'typography',
    typography: {
      headings: 'Merriweather',
      body: 'Georgia'
    }
  },
  {
    id: 'type-playful',
    title: 'Playful Mix',
    description: 'Fun and engaging typography',
    imageUrl: '/lovable-uploads/d9eb0f5d-57b5-4d7e-8da0-23bc6c9c83f1.png',
    category: 'typography',
    typography: {
      headings: 'Montserrat',
      body: 'Open Sans'
    }
  },
  // Layout Options
  {
    id: 'layout-minimal',
    title: 'Minimal & Spacious',
    description: 'Clean layouts with generous whitespace',
    imageUrl: '/lovable-uploads/0392ac21-110f-484c-8f3d-5fcbb0dcefc6.png',
    category: 'layout',
    layoutStyle: 'minimal'
  },
  {
    id: 'layout-dynamic',
    title: 'Dynamic & Bold',
    description: 'Energetic layouts with overlapping elements',
    imageUrl: '/lovable-uploads/a3b75d3c-550b-44e0-b81b-4d74404d106c.png',
    category: 'layout',
    layoutStyle: 'dynamic'
  },
  {
    id: 'layout-grid',
    title: 'Grid-Based',
    description: 'Organized, structured layout system',
    imageUrl: '/lovable-uploads/480f7861-cc1e-41e1-9ee1-be7ba9aa52b9.png',
    category: 'layout',
    layoutStyle: 'grid'
  },
  // Tone Options
  {
    id: 'tone-professional',
    title: 'Professional & Serious',
    description: 'Formal, business-oriented tone',
    imageUrl: '/lovable-uploads/0507e956-3bf5-43ba-924e-9d353066ebad.png',
    category: 'tone',
    toneDescriptor: 'professional'
  },
  {
    id: 'tone-friendly',
    title: 'Friendly & Approachable',
    description: 'Warm, conversational tone',
    imageUrl: '/lovable-uploads/9d1c9181-4f19-48e3-b424-cbe28ccb9ad1.png',
    category: 'tone',
    toneDescriptor: 'friendly'
  },
  {
    id: 'tone-playful',
    title: 'Playful & Energetic',
    description: 'Fun, vibrant, and engaging tone',
    imageUrl: '/lovable-uploads/3ffcf93f-2dca-479f-867d-cc445acdac8d.png',
    category: 'tone',
    toneDescriptor: 'playful'
  },
];

export interface EnhancedVisualPickerProps {
  onDesignSelected: (design: DesignSuggestion) => void;
}

export interface DesignOption {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography?: {
    headings: string;
    body: string;
  };
  layoutStyle?: string;
  toneDescriptor?: string;
}

export const EnhancedVisualPicker: React.FC<EnhancedVisualPickerProps> = ({ onDesignSelected }) => {
  const [activeTab, setActiveTab] = useState('colorScheme');
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, string>>({
    colorScheme: '',
    typography: '',
    layout: '',
    tone: ''
  });
  const [previewDesign, setPreviewDesign] = useState<DesignSuggestion | null>(null);
  const { toast } = useToast();

  // Update the combined design whenever selections change
  useEffect(() => {
    if (Object.values(selectedDesigns).some(value => value)) {
      const colorSchemeOption = DESIGN_OPTIONS.find(
        option => option.id === selectedDesigns.colorScheme
      );
      const typographyOption = DESIGN_OPTIONS.find(
        option => option.id === selectedDesigns.typography
      );
      const layoutOption = DESIGN_OPTIONS.find(
        option => option.id === selectedDesigns.layout
      );
      const toneOption = DESIGN_OPTIONS.find(
        option => option.id === selectedDesigns.tone
      );

      const combinedDesign: DesignSuggestion = {
        colorScheme: colorSchemeOption?.colorScheme,
        typography: typographyOption?.typography,
        layoutStyle: layoutOption?.layoutStyle,
        toneDescriptor: toneOption?.toneDescriptor,
      };

      setPreviewDesign(combinedDesign);
    }
  }, [selectedDesigns]);

  const handleOptionSelect = (option: DesignOption) => {
    const category = option.category;
    setSelectedDesigns(prev => ({
      ...prev,
      [category]: option.id
    }));
    
    // Automatically move to next category if not all categories have been selected
    const categories = ['colorScheme', 'typography', 'layout', 'tone'];
    const currentIndex = categories.indexOf(category);
    
    if (currentIndex < categories.length - 1) {
      const nextCategory = categories[currentIndex + 1];
      if (!selectedDesigns[nextCategory]) {
        // Move to the next category that hasn't been selected yet
        setActiveTab(nextCategory);
      }
    } else {
      // If all categories have been selected, complete the process
      completeDesignSelection();
    }
  };

  const completeDesignSelection = () => {
    if (previewDesign) {
      toast({
        title: "Design preferences selected",
        description: "Your choices have been applied to the design system"
      });
      
      onDesignSelected(previewDesign);
    }
  };

  // Filter options by the current category
  const getOptionsByCategory = (category: string) => {
    return DESIGN_OPTIONS.filter(option => option.category === category);
  };

  // Check if all selections have been made
  const allSelectionsComplete = () => {
    return Object.values(selectedDesigns).every(value => value !== '');
  };

  return (
    <div className="enhanced-visual-picker space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="colorScheme" className="relative">
            Colors
            {selectedDesigns.colorScheme && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="typography" className="relative">
            Typography
            {selectedDesigns.typography && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="layout" className="relative">
            Layout
            {selectedDesigns.layout && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="tone" className="relative">
            Tone
            {selectedDesigns.tone && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colorScheme">
          <AnimatedVisualPicker 
            options={DESIGN_OPTIONS}
            onSelect={handleOptionSelect}
            category="colorScheme"
          />
        </TabsContent>

        <TabsContent value="typography">
          <AnimatedVisualPicker 
            options={DESIGN_OPTIONS}
            onSelect={handleOptionSelect}
            category="typography"
          />
        </TabsContent>

        <TabsContent value="layout">
          <AnimatedVisualPicker 
            options={DESIGN_OPTIONS}
            onSelect={handleOptionSelect}
            category="layout"
          />
        </TabsContent>

        <TabsContent value="tone">
          <AnimatedVisualPicker 
            options={DESIGN_OPTIONS}
            onSelect={handleOptionSelect}
            category="tone"
          />
        </TabsContent>
      </Tabs>

      {previewDesign && (
        <Card className="mt-6 bg-gradient-to-br from-slate-50 to-slate-100 shadow-md border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Design Preview</h3>
            
            <div className="space-y-4">
              {previewDesign.colorScheme && (
                <div className="color-preview">
                  <p className="text-sm text-slate-500 mb-2">Color Scheme</p>
                  <div className="flex gap-2">
                    {Object.entries(previewDesign.colorScheme).map(([key, color]) => (
                      <div 
                        key={key} 
                        className="flex flex-col items-center"
                      >
                        <div 
                          className="h-8 w-8 rounded-full shadow-sm" 
                          style={{ backgroundColor: color }} 
                        />
                        <span className="text-xs mt-1">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {previewDesign.typography && (
                <div className="typography-preview">
                  <p className="text-sm text-slate-500 mb-2">Typography</p>
                  <p className="font-bold" style={{ fontFamily: previewDesign.typography.headings }}>
                    Heading Font: {previewDesign.typography.headings}
                  </p>
                  <p style={{ fontFamily: previewDesign.typography.body }}>
                    Body Font: {previewDesign.typography.body}
                  </p>
                </div>
              )}
              
              {previewDesign.layoutStyle && (
                <div className="layout-preview">
                  <p className="text-sm text-slate-500 mb-2">Layout Style</p>
                  <p>{previewDesign.layoutStyle}</p>
                </div>
              )}
              
              {previewDesign.toneDescriptor && (
                <div className="tone-preview">
                  <p className="text-sm text-slate-500 mb-2">Design Tone</p>
                  <p>{previewDesign.toneDescriptor}</p>
                </div>
              )}
            </div>
            
            <button 
              className={`mt-4 px-4 py-2 rounded-md text-white ${allSelectionsComplete() ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300'}`}
              onClick={completeDesignSelection}
              disabled={!allSelectionsComplete()}
            >
              Apply Design Preferences
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedVisualPicker;
