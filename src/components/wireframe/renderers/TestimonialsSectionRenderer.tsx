
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';

const TestimonialsSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  darkMode,
  viewMode,
  deviceType,
  isSelected,
  onClick,
}) => {
  // Extract testimonials from section data with fallbacks
  const testimonials = section.data?.testimonials || [];
  const heading = section.data?.heading || 'What Our Customers Say';
  const subheading = section.data?.subheading || 'Hear from the people who trust us';
  
  // Get section styling with fallbacks
  const sectionStyle = section.style || {};
  const backgroundColor = sectionStyle.backgroundColor || (darkMode ? '#1f2937' : '#f9fafb');
  const textColor = sectionStyle.textColor || (darkMode ? '#ffffff' : '#111827');
  
  // Handle section click
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div
      className={cn(
        'wireframe-section testimonials-section py-12 md:py-16 px-4',
        {
          'border-2 border-blue-500': isSelected,
          'dark': darkMode,
        }
      )}
      style={{
        backgroundColor,
        color: textColor,
      }}
      onClick={handleClick}
      data-section-id={section.id}
      data-section-type={section.sectionType}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={cn(
            'text-2xl md:text-3xl lg:text-4xl font-bold mb-4',
            { 'text-white': darkMode }
          )}>
            {heading}
          </h2>
          <p className={cn(
            'text-lg opacity-80 max-w-3xl mx-auto',
            { 'text-gray-300': darkMode, 'text-gray-600': !darkMode }
          )}>
            {subheading}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.length > 0 ? testimonials.map((testimonial: any, index: number) => (
            <div key={testimonial.id || `testimonial-${index}`} className={cn(
              'testimonial-item p-6 rounded-lg',
              { 'bg-gray-800': darkMode, 'bg-white': !darkMode }
            )}>
              <div className="mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-${i < (testimonial.rating || 5) ? 'yellow' : 'gray'}-400`}>★</span>
                ))}
              </div>
              <p className={cn(
                'italic mb-4',
                { 'text-gray-300': darkMode, 'text-gray-600': !darkMode }
              )}>
                "{testimonial.quote || 'This product/service exceeded my expectations!'}"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  {testimonial.avatar ? (
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name || 'Customer'} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span>{(testimonial.name || 'Customer').charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{testimonial.name || `Customer ${index + 1}`}</h4>
                  <p className={cn(
                    'text-sm',
                    { 'text-gray-400': darkMode, 'text-gray-500': !darkMode }
                  )}>
                    {testimonial.title || testimonial.company || 'Verified Customer'}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            // Display placeholder testimonials if none are defined
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`placeholder-testimonial-${index}`} className={cn(
                'testimonial-item p-6 rounded-lg',
                { 'bg-gray-800': darkMode, 'bg-white': !darkMode }
              )}>
                <div className="mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className={cn(
                  'italic mb-4',
                  { 'text-gray-300': darkMode, 'text-gray-600': !darkMode }
                )}>
                  "This product/service exceeded my expectations! The quality and customer service were outstanding."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    <span>C</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Customer {index + 1}</h4>
                    <p className={cn(
                      'text-sm',
                      { 'text-gray-400': darkMode, 'text-gray-500': !darkMode }
                    )}>
                      Verified Customer
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSectionRenderer;
