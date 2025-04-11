
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

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
      onClick(section.id);
    }
  };
  
  // Use the createStyleObject utility to ensure type safety
  const styles = createStyleObject(section.style);
  const feature = section.data?.feature || {};
  
  return (
    <div 
      className={cn(
        'px-6 py-12 w-full',
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      <div className={cn(
        'max-w-6xl mx-auto',
        deviceType === 'mobile' ? 'block' : 'flex items-center gap-12',
        deviceType === 'mobile' ? 'space-y-8' : ''
      )}>
        <div className={cn(
          deviceType === 'mobile' ? 'w-full' : 'w-1/2',
          'space-y-6'
        )}>
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold">
            {getSuggestion(section.copySuggestions, 'heading', feature.title || 'Feature Title')}
          </h2>
          
          <p className={cn(
            'text-lg',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {getSuggestion(section.copySuggestions, 'subheading', feature.description || 'Feature description explaining the benefits and value of this specific feature to the user.')}
          </p>
          
          {feature.bullets && Array.isArray(feature.bullets) && feature.bullets.length > 0 ? (
            <ul className="space-y-2">
              {feature.bullets.map((bullet: string, i: number) => (
                <li key={i} className="flex items-start">
                  <svg className="w-5 h-5 text-primary mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Benefit one of using this feature</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Benefit two of using this feature</span>
              </li>
            </ul>
          )}
          
          {section.copySuggestions?.ctaText && (
            <div className="pt-4">
              <button className="px-6 py-2.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                {section.copySuggestions.ctaText}
              </button>
            </div>
          )}
        </div>
        
        <div className={cn(
          deviceType === 'mobile' ? 'w-full' : 'w-1/2',
        )}>
          <div className={cn(
            'bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden aspect-video',
            'border border-gray-200 dark:border-gray-700'
          )}>
            {feature.imageUrl ? (
              <img 
                src={feature.imageUrl} 
                alt={feature.title || "Feature illustration"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSectionRenderer;
