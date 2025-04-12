
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';

const TestimonialsSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  // Get copy suggestions or defaults
  const heading = section.copySuggestions?.heading || 'What Our Customers Say';
  const subheading = section.copySuggestions?.subheading || 'Read testimonials from our satisfied clients and discover how we\'ve helped businesses like yours.';
  
  // Get components or create defaults
  const testimonials = section.components?.filter(c => c.type === 'testimonial-card') || [
    {
      props: {
        quote: "This platform has transformed our workflow. Highly recommended!",
        author: "Jane Smith",
        role: "CEO, Acme Inc.",
        rating: 5
      }
    },
    {
      props: {
        quote: "The best SaaS platform we've used. Intuitive and powerful.",
        author: "John Doe",
        role: "CTO, XYZ Corp",
        rating: 5
      }
    },
    {
      props: {
        quote: "Excellent support and feature-rich platform.",
        author: "Sarah Johnson",
        role: "Director, ABC Solutions",
        rating: 4
      }
    }
  ];
  
  // Determine layout columns based on device type
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  
  const handleClick = () => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };

  return (
    <div 
      className={cn(
        'testimonials-section w-full py-16 px-4',
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
        isSelected ? 'ring-2 ring-primary ring-offset-1' : '',
        viewMode === 'edit' ? 'cursor-pointer' : ''
      )}
      onClick={handleClick}
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{heading}</h2>
          <p className={cn(
            'text-lg max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {subheading}
          </p>
        </div>
        
        {/* Testimonials Grid/Slider */}
        <div className={cn(
          'grid gap-8',
          isMobile ? 'grid-cols-1' : 
          isTablet ? 'grid-cols-2' : 
          'grid-cols-3'
        )}>
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={cn(
                'testimonial-card p-6 rounded-lg',
                darkMode ? 'bg-gray-800' : 'bg-gray-50',
                'flex flex-col'
              )}
            >
              {/* Rating Stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={cn(
                      'h-5 w-5',
                      i < (testimonial.props?.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className={cn(
                'text-lg mb-4 flex-grow',
                darkMode ? 'text-gray-200' : 'text-gray-700'
              )}>
                "{testimonial.props?.quote || 'This is an amazing product!'}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center mt-4">
                <div className={cn(
                  'rounded-full bg-gray-300 h-10 w-10 flex items-center justify-center mr-3',
                  darkMode ? 'bg-gray-700' : 'bg-gray-300'
                )}>
                  <span className="text-gray-500">
                    {(testimonial.props?.author?.[0] || 'U').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{testimonial.props?.author || 'User'}</p>
                  <p className={cn(
                    'text-sm',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {testimonial.props?.role || 'Customer'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSectionRenderer;
