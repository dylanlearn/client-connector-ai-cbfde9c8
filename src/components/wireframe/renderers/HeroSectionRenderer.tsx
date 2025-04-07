
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { heroVariants, heroComponents } from '../registry/components/hero-components';
import { HeroComponentProps } from '@/types/component-library';

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
  
  // Get hero data from section
  const data = section.data || {};
  const headline = data.headline || 'Hero Headline';
  const subheadline = data.subheadline || 'Supporting text for the headline';
  const ctaText = data.ctaText || 'Get Started';
  const ctaSecondaryText = data.ctaSecondaryText;
  const imageUrl = data.imageUrl || '/placeholder.svg';
  const alignment = data.alignment || 'left';
  const backgroundType = data.backgroundType || 'light';
  const mediaType = data.mediaType || 'image';
  const badge = data.badge;

  // Find the matching variant from our predefined heroVariants
  let selectedVariant: HeroComponentProps | undefined;
  
  if (componentVariant) {
    selectedVariant = heroVariants.find(v => v.variant === componentVariant);
  }

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
            {(alignment === 'right' || selectedVariant?.alignment === 'right') ? (
              <>
                <div className="col-span-7 space-y-2">
                  <div className="h-6 bg-gray-100 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-100 w-full rounded"></div>
                  <div className="h-4 bg-gray-100 w-5/6 rounded"></div>
                  <div className="h-8 bg-primary/20 w-1/3 rounded mt-2"></div>
                </div>
                <div className="col-span-5">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded overflow-hidden">
                    {mediaType === 'video' ? 'Video' : mediaType === 'illustration' ? 'Illustration' : 'Image'}
                  </div>
                </div>
              </>
            ) : alignment === 'center' || selectedVariant?.alignment === 'center' ? (
              <div className="col-span-12 text-center space-y-2">
                <div className="h-6 bg-gray-100 w-3/4 mx-auto rounded"></div>
                <div className="h-4 bg-gray-100 w-2/3 mx-auto rounded"></div>
                <div className="h-4 bg-gray-100 w-1/2 mx-auto rounded"></div>
                <div className="flex justify-center gap-2 mt-2">
                  <div className="h-8 bg-primary/20 w-24 rounded"></div>
                  {ctaSecondaryText && <div className="h-8 bg-gray-100 w-24 rounded"></div>}
                </div>
                {(mediaType === 'image' || mediaType === 'video' || mediaType === 'illustration') && (
                  <div className="aspect-video mt-4 bg-gray-100 mx-auto w-3/4 flex items-center justify-center text-xs text-gray-400 rounded overflow-hidden">
                    {mediaType === 'video' ? 'Video' : mediaType === 'illustration' ? 'Illustration' : 'Image'}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="col-span-7 space-y-2">
                  <div className="h-6 bg-gray-100 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-100 w-full rounded"></div>
                  <div className="h-4 bg-gray-100 w-5/6 rounded"></div>
                  <div className="flex gap-2 mt-2">
                    <div className="h-8 bg-primary/20 w-24 rounded"></div>
                    {ctaSecondaryText && <div className="h-8 bg-gray-100 w-24 rounded"></div>}
                  </div>
                </div>
                <div className="col-span-5">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded overflow-hidden">
                    {mediaType === 'video' ? 'Video' : mediaType === 'illustration' ? 'Illustration' : 'Image'}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preview mode - determine background class based on backgroundType
  const bgClass = 
    backgroundType === 'dark' || selectedVariant?.backgroundStyle === 'dark'
      ? 'bg-gray-800 text-white'
      : backgroundType === 'image' || selectedVariant?.backgroundStyle === 'image'
      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'
      : 'bg-white';

  // Alignment classes for the layout
  let alignmentClass;
  if (alignment === 'center' || selectedVariant?.alignment === 'center') {
    alignmentClass = 'text-center flex-col items-center';
  } else if (alignment === 'right' || selectedVariant?.alignment === 'right') {
    alignmentClass = 'flex-col md:flex-row-reverse';
  } else {
    alignmentClass = 'flex-col md:flex-row';
  }

  return (
    <div className={`hero-section p-6 ${bgClass} ${darkMode ? 'text-white' : ''}`}>
      <div className="container mx-auto">
        <div className={`flex ${alignmentClass} items-center gap-8`}>
          {badge && (
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              {badge}
            </span>
          )}
          
          <div className={`${alignment !== 'center' ? 'md:w-1/2' : 'max-w-2xl mx-auto'} space-y-4`}>
            <h1 className="text-3xl md:text-4xl font-bold">{headline}</h1>
            <p className="text-lg text-muted-foreground">{subheadline}</p>
            <div className={`flex gap-4 ${alignment === 'center' ? 'justify-center' : ''} mt-4`}>
              <button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                {ctaText}
              </button>
              {ctaSecondaryText && (
                <button className="px-6 py-2 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  {ctaSecondaryText}
                </button>
              )}
            </div>
          </div>
          
          {/* Don't show image for center alignment if it would be below the text content */}
          {(alignment !== 'center' || mediaType !== 'image') && (
            <div className={`${alignment !== 'center' ? 'md:w-1/2' : 'w-full mt-8'}`}>
              {mediaType === 'video' ? (
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Video Placeholder</span>
                </div>
              ) : mediaType === 'illustration' ? (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Illustration Placeholder</span>
                </div>
              ) : imageUrl ? (
                <img src={imageUrl} alt="Hero" className="rounded-lg shadow-md w-full" />
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Hero Image Placeholder</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionRenderer;
