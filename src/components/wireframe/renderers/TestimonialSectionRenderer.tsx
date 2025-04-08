
import React from 'react';
import { SectionComponentProps } from '../types';
import { getBackgroundClass, getAlignmentClass } from '../utils/variant-utils';

const TestimonialSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { componentVariant, data = {} } = section;
  const {
    title,
    subtitle,
    testimonials = [],
    backgroundStyle,
    alignment,
    mediaType
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'center');

  // Card layout based on number of testimonials
  const gridCols = testimonials?.length === 1 ? 'grid-cols-1' : 
                   testimonials?.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                   'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className={`testimonial-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className={`container mx-auto ${alignmentClass}`}>
        {(title || subtitle) && (
          <div className="section-header mb-12">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>
            )}
            
            {subtitle && (
              <p className="text-lg opacity-80 max-w-3xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}
        
        <div className={`grid ${gridCols} gap-6`}>
          {testimonials && testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="testimonial-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <div className="mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.51.88-3.995 3.356-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.511.88-3.996 3.356-3.996 5.849h4v10h-10z" />
                </svg>
              </div>
              
              <p className="text-lg mb-4">{testimonial.quote}</p>
              
              <div className="flex items-center">
                {mediaType === 'avatar' && testimonial.avatar && (
                  <div className="flex-shrink-0 mr-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                )}
                
                <div>
                  <h4 className="font-bold">{testimonial.author}</h4>
                  {testimonial.role && (
                    <p className="text-sm opacity-70">{testimonial.role}</p>
                  )}
                </div>
                
                {mediaType === 'logo' && testimonial.brandLogo && (
                  <div className="ml-auto">
                    <img 
                      src={testimonial.brandLogo} 
                      alt="Company logo"
                      className="h-8 w-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSectionRenderer;
