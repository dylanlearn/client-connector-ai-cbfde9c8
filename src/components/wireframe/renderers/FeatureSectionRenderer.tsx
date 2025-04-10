
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';

const FeatureSectionRenderer: React.FC<SectionComponentProps> = ({
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
  
  const copySuggestions = section.copySuggestions || {};
  
  // Generate fake feature items
  const features = Array(6).fill(null).map((_, i) => ({
    title: copySuggestions[`feature${i+1}Title`] || `Feature ${i+1}`,
    description: copySuggestions[`feature${i+1}Description`] || 'Description of this amazing feature and how it benefits the user.',
    icon: '📊'
  }));
  
  return (
    <div 
      className={cn(
        'px-6 py-16 w-full',
        darkMode ? 'bg-gray-800' : 'bg-white',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={section.style}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={cn(
            'text-3xl font-bold mb-4',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            {copySuggestions.heading || section.name || 'Features'}
          </h2>
          
          <p className={cn(
            'max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {copySuggestions.subheading || 'Discover the powerful features that make our product stand out from the competition.'}
          </p>
        </div>
        
        <div className={cn(
          'grid gap-8',
          deviceType === 'mobile' ? 'grid-cols-1' : 
          deviceType === 'tablet' ? 'grid-cols-2' : 
          'grid-cols-3'
        )}>
          {features.map((feature, i) => (
            <div 
              key={i} 
              className={cn(
                'p-6 rounded-lg',
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              )}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className={cn(
                'text-xl font-semibold mb-2',
                darkMode ? 'text-white' : 'text-gray-900'
              )}>
                {feature.title}
              </h3>
              <p className={cn(
                darkMode ? 'text-gray-300' : 'text-gray-600'
              )}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSectionRenderer;
