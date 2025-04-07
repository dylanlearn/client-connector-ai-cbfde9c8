
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HeroSectionRendererProps {
  section: WireframeSection;
  viewMode: 'preview' | 'flowchart';
  darkMode?: boolean;
}

const HeroSectionRenderer: React.FC<HeroSectionRendererProps> = ({
  section,
  viewMode,
  darkMode = false,
}) => {
  // Extract section data
  const { name, description, componentVariant, id } = section;
  const headline = section.headline || section.data?.headline || 'Hero Headline';
  const subheadline = section.subheadline || section.data?.subheadline || 'Supporting text for the headline';
  const ctaText = section.ctaText || section.data?.ctaText || 'Get Started';
  const imageUrl = section.imageUrl || section.data?.imageUrl || '';

  // Render different views based on viewMode
  if (viewMode === 'flowchart') {
    return (
      <Card className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} mb-4`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            {name || 'Hero Section'}
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {componentVariant || 'Standard'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm mb-2">{description || 'Hero section with headline, subheadline, and CTA'}</div>
          <div className="grid grid-cols-12 gap-2 p-2 border rounded-md">
            {imageUrl && (
              <div className="col-span-5">
                <div className="aspect-video bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded overflow-hidden">
                  Image
                </div>
              </div>
            )}
            <div className={`${imageUrl ? 'col-span-7' : 'col-span-12'} space-y-2`}>
              <div className="h-6 bg-gray-100 w-3/4 rounded"></div>
              <div className="h-4 bg-gray-100 w-full rounded"></div>
              <div className="h-4 bg-gray-100 w-5/6 rounded"></div>
              <div className="h-8 bg-primary/20 w-1/3 rounded mt-2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preview mode
  return (
    <div className={`hero-section p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{headline}</h1>
            <p className="text-lg text-muted-foreground">{subheadline}</p>
            <button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              {ctaText}
            </button>
          </div>
          {imageUrl ? (
            <div className="md:w-1/2">
              <img src={imageUrl} alt="Hero" className="rounded-lg shadow-md" />
            </div>
          ) : (
            <div className="md:w-1/2 aspect-video bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Hero Image Placeholder</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionRenderer;
