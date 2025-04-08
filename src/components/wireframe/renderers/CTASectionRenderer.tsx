
import React from 'react';
import { SectionComponentProps } from '../types';
import { getBackgroundClass, getAlignmentClass } from '../utils/variant-utils';

const CTASectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { componentVariant, data = {} } = section;
  const {
    headline,
    subheadline,
    ctaLabel,
    ctaUrl,
    secondaryCtaLabel,
    secondaryCtaUrl,
    backgroundStyle,
    alignment,
    testimonial,
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'center');

  return (
    <section className={`cta-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className={`container mx-auto ${alignmentClass}`}>
        <div className="max-w-4xl mx-auto">
          {headline && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{headline}</h2>
          )}
          
          {subheadline && (
            <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-3xl mx-auto">{subheadline}</p>
          )}
          
          {testimonial && (
            <div className="my-8 p-4 border-l-4 border-primary">
              <p className="italic mb-2">{testimonial.quote}</p>
              <p className="font-medium">{testimonial.author}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            {ctaLabel && (
              <a 
                href={ctaUrl || '#'} 
                className="btn bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-md font-semibold"
              >
                {ctaLabel}
              </a>
            )}
            
            {secondaryCtaLabel && (
              <a 
                href={secondaryCtaUrl || '#'} 
                className="btn border border-current hover:bg-white/10 px-6 py-3 rounded-md font-semibold"
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASectionRenderer;
