
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import WireframeDataVisualizer from './WireframeDataVisualizer';
import { WireframeData } from '@/types/wireframe';
import { Button } from '@/components/ui/button';
import { heroVariants } from './registry/components/hero-components';
import { getComponentDefinition } from './registry/component-registry';

interface AdvancedWireframeGeneratorProps {
  initialData?: WireframeData;
  projectId?: string;
  onWireframeGenerated?: () => void;
  onWireframeSaved?: () => void;
  darkMode?: boolean;
  viewMode?: 'preview' | 'flowchart';
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  initialData,
  projectId,
  onWireframeGenerated,
  onWireframeSaved,
  darkMode = false,
  viewMode = 'preview'
}) => {
  // Initialize wireframe data state
  const [wireframeData, setWireframeData] = useState<WireframeData>(initialData || {
    id: `wireframe-${Date.now()}`,
    title: 'New Wireframe',
    description: 'Generated wireframe',
    sections: [],
    colorScheme: {
      primary: '#0070f3',
      secondary: '#ff0080',
      accent: '#facc15',
      background: '#ffffff'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  });

  // Function to add a new hero section to the wireframe
  const addHeroSection = (variant: string) => {
    // Get the hero component definition
    const heroComponent = getComponentDefinition('hero');
    
    if (!heroComponent) {
      console.error('Hero component not found in registry');
      return;
    }

    // Find the selected variant
    const selectedVariant = heroComponent.variants.find(v => v.id === variant);
    
    if (!selectedVariant) {
      console.error(`Hero variant ${variant} not found`);
      return;
    }

    // Create a new section based on the hero component default data
    const newSection = {
      id: `section-${Date.now()}`,
      name: `Hero Section`,
      sectionType: 'hero',
      componentVariant: variant,
      description: selectedVariant.description || 'Hero section with headline and CTA',
      data: {
        ...heroComponent.defaultData,
        headline: heroVariants.find(v => v.variant === variant)?.headline || 'Headline',
        subheadline: heroVariants.find(v => v.variant === variant)?.subheadline || 'Subheadline',
        ctaText: heroVariants.find(v => v.variant === variant)?.cta?.label || 'Get Started',
        imageUrl: heroVariants.find(v => v.variant === variant)?.image || '/placeholder.svg',
        alignment: heroVariants.find(v => v.variant === variant)?.alignment || 'left',
        backgroundType: heroVariants.find(v => v.variant === variant)?.backgroundStyle || 'light',
        mediaType: heroVariants.find(v => v.variant === variant)?.mediaType || 'image',
      }
    };

    // Add the section to the wireframe
    setWireframeData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Wireframe Generator</CardTitle>
      </CardHeader>
      <CardContent>
        {wireframeData?.sections?.length > 0 ? (
          <WireframeDataVisualizer 
            wireframeData={wireframeData}
            viewMode={viewMode}
            darkMode={darkMode}
          />
        ) : (
          <div className="border border-dashed rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-4">Your wireframe is empty. Add sections to get started.</p>
            <Button onClick={() => addHeroSection('hero-startup-001')}>
              Add Hero Section
            </Button>
          </div>
        )}
      </CardContent>
      {wireframeData?.sections?.length > 0 && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setWireframeData(prev => ({...prev, sections: []}))}>
            Clear Wireframe
          </Button>
          <div className="space-x-2">
            <Button variant="secondary" onClick={() => onWireframeSaved && onWireframeSaved()}>
              Save Wireframe
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default AdvancedWireframeGenerator;
