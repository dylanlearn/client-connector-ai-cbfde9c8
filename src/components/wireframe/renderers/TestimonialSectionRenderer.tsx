
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

const TestimonialSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  const handleClick = () => {
    if (onClick && section.id) {
      onClick();
    }
  };
  
  // Sample testimonials
  const testimonials = [
    {
      quote: getSuggestion(section.copySuggestions, 'testimonial1', 'This product has completely transformed how we operate. The efficiency gains alone have paid for the investment many times over.'),
      author: getSuggestion(section.copySuggestions, 'author1', 'Jane Smith'),
      role: getSuggestion(section.copySuggestions, 'role1', 'CEO, Company Name')
    },
    {
      quote: getSuggestion(section.copySuggestions, 'testimonial2', 'The customer support is fantastic. Any time we had questions, the team was immediately responsive and helpful.'),
      author: getSuggestion(section.copySuggestions, 'author2', 'Michael Johnson'),
      role: getSuggestion(section.copySuggestions, 'role2', 'Director of Operations, Company Name')
    },
    {
      quote: getSuggestion(section.copySuggestions, 'testimonial3', 'We evaluated several solutions before choosing this one. Three years later, we couldn\'t be happier with our decision.'),
      author: getSuggestion(section.copySuggestions, 'author3', 'Sarah Williams'),
      role: getSuggestion(section.copySuggestions, 'role3', 'CTO, Company Name')
    }
  ];
  
  // Create properly typed style object
  const styles = createStyleObject(section.style);
  
  return (
    <div 
      className={cn(
        'px-6 py-16 w-full',
        darkMode ? 'bg-gray-900' : 'bg-gray-50',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={cn(
            'text-3xl font-bold mb-4',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            {getSuggestion(section.copySuggestions, 'heading', 'What Our Customers Say')}
          </h2>
          
          <p className={cn(
            'max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {getSuggestion(section.copySuggestions, 'subheading', 'Don\'t just take our word for it. See what our satisfied customers have to say.')}
          </p>
        </div>
        
        <div className={cn(
          'grid gap-8',
          deviceType === 'mobile' ? 'grid-cols-1' : 
          deviceType === 'tablet' ? 'grid-cols-2' : 
          'grid-cols-3'
        )}>
          {testimonials.map((testimonial, i) => (
            <div 
              key={i} 
              className={cn(
                'p-6 rounded-lg',
                darkMode ? 'bg-gray-800' : 'bg-white shadow-md'
              )}
            >
              <div className={cn(
                'text-4xl mb-4',
                darkMode ? 'text-gray-500' : 'text-gray-300'
              )}>
                "
              </div>
              <p className={cn(
                'mb-6 italic',
                darkMode ? 'text-gray-300' : 'text-gray-600'
              )}>
                {testimonial.quote}
              </p>
              <div>
                <p className={cn(
                  'font-semibold',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {testimonial.author}
                </p>
                <p className={cn(
                  'text-sm',
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSectionRenderer;
