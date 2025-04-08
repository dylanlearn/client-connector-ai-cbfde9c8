
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { SectionComponentProps } from '../types';
import { getBackgroundClass, getAlignmentClass } from '../utils/variant-utils';

const HeroSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { componentVariant, data = {} } = section;
  const {
    headline,
    subheadline,
    cta,
    ctaSecondary,
    backgroundStyle,
    alignment,
    image,
    mediaType
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'center');
  const variantPrefix = componentVariant?.split('-')[0] || 'hero';

  return (
    <div className={`hero-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className={`container mx-auto ${alignmentClass}`}>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className={`hero-content ${mediaType !== 'none' ? 'lg:w-1/2' : 'w-full'}`}>
            {headline && (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{headline}</h1>
            )}
            
            {subheadline && (
              <p className="text-lg sm:text-xl mb-6 opacity-85">{subheadline}</p>
            )}
            
            {(cta || ctaSecondary) && (
              <div className="flex flex-wrap gap-4 mt-6">
                {cta && (
                  <a 
                    href={cta.url || '#'} 
                    className="btn bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-md"
                  >
                    {cta.label || 'Learn More'}
                  </a>
                )}
                
                {ctaSecondary && (
                  <a 
                    href={ctaSecondary.url || '#'} 
                    className="btn border border-primary text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-md"
                  >
                    {ctaSecondary.label || 'Contact Us'}
                  </a>
                )}
              </div>
            )}
          </div>
          
          {mediaType !== 'none' && image && (
            <div className="hero-media lg:w-1/2">
              <img 
                src={image} 
                alt={headline || 'Hero'}
                className="w-full h-auto rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionRenderer;
