
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

const TestimonialsSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  const handleClick = () => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };
  
  // Testimonial data
  const testimonials = [
    {
      text: getSuggestion(section.copySuggestions, 'testimonial1', 'This product has completely transformed how we operate. The efficiency gains have been remarkable, and the support team is always responsive and helpful.'),
      author: getSuggestion(section.copySuggestions, 'author1', 'Sarah Johnson'),
      position: getSuggestion(section.copySuggestions, 'position1', 'CEO, TechCorp'),
    },
    {
      text: getSuggestion(section.copySuggestions, 'testimonial2', 'We\'ve tried numerous solutions in the past, but nothing compares to this. It\'s intuitive, powerful, and has become an essential part of our daily operations.'),
      author: getSuggestion(section.copySuggestions, 'author2', 'Michael Chen'),
      position: getSuggestion(section.copySuggestions, 'position2', 'Director of Operations, InnovateCo'),
    },
    {
      text: getSuggestion(section.copySuggestions, 'testimonial3', 'The implementation was seamless, and our team quickly adapted to the new system. The ROI we\'ve seen in just three months has exceeded our expectations.'),
      author: getSuggestion(section.copySuggestions, 'author3', 'Emily Rodriguez'),
      position: getSuggestion(section.copySuggestions, 'position3', 'CTO, FutureTech'),
    },
  ];
  
  // Determine variant
  const variant = section.componentVariant || 'cards';
  
  // Create properly typed style object
  const styles = createStyleObject(section.style);
  
  return (
    <div 
      className={cn(
        'px-6 py-16 w-full',
        darkMode ? 'bg-gray-900' : 'bg-white',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      <div className="max-w-6xl mx-auto">
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
            {getSuggestion(section.copySuggestions, 'subheading', 'Read testimonials from our satisfied clients and discover how we\'ve helped businesses like yours.')}
          </p>
        </div>
        
        {/* Cards layout */}
        {variant === 'cards' && (
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
                  darkMode ? 'bg-gray-800' : 'bg-gray-50',
                  'flex flex-col'
                )}
              >
                <div className="mb-4 text-yellow-500 text-xl">★★★★★</div>
                <p className={cn(
                  'mb-6 flex-grow',
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                )}>
                  "{testimonial.text}"
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
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {testimonial.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Quotes layout */}
        {variant === 'quotes' && (
          <div className="space-y-12">
            {testimonials.map((testimonial, i) => (
              <blockquote 
                key={i} 
                className={cn(
                  'border-l-4 pl-6',
                  darkMode ? 'border-blue-500' : 'border-blue-600'
                )}
              >
                <p className={cn(
                  'text-xl italic mb-4',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  "{testimonial.text}"
                </p>
                <footer>
                  <p className={cn(
                    'font-semibold',
                    darkMode ? 'text-white' : 'text-gray-900'
                  )}>
                    {testimonial.author}
                  </p>
                  <p className={cn(
                    'text-sm',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {testimonial.position}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        )}
        
        {/* Slider layout (simplified version) */}
        {variant === 'slider' && (
          <div className={cn(
            'p-8 rounded-lg',
            darkMode ? 'bg-gray-800' : 'bg-gray-50',
            'relative'
          )}>
            <div className="text-center">
              <div className="mb-6 text-yellow-500 text-xl">★★★★★</div>
              <p className={cn(
                'text-xl italic mb-8 max-w-3xl mx-auto',
                darkMode ? 'text-white' : 'text-gray-700'
              )}>
                "{testimonials[0].text}"
              </p>
              <div>
                <p className={cn(
                  'font-semibold',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {testimonials[0].author}
                </p>
                <p className={cn(
                  'text-sm',
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {testimonials[0].position}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              <button className="w-3 h-3 bg-blue-600 rounded-full"></button>
              <button className="w-3 h-3 bg-gray-300 rounded-full"></button>
              <button className="w-3 h-3 bg-gray-300 rounded-full"></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSectionRenderer;
