
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { createStyleObject } from './utilities';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

const StatsSectionRenderer: React.FC<SectionComponentProps> = ({
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
  const stats = section.stats || [];
  
  // Calculate grid columns based on device and number of stats
  const getGridCols = () => {
    if (deviceType === 'mobile') return 1;
    if (deviceType === 'tablet') return Math.min(2, stats.length);
    return Math.min(4, stats.length);
  };
  
  return (
    <div 
      className={cn(
        'px-6 py-16 w-full',
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      <div className={cn(
        'max-w-6xl mx-auto',
        deviceType === 'mobile' ? 'px-4' : 'px-8'
      )}>
        {(section.copySuggestions) && (
          <div className="text-center mb-12">
            {getSuggestion(section.copySuggestions, 'heading') && (
              <h2 className={cn(
                'text-3xl font-bold mb-4',
                darkMode ? 'text-white' : 'text-gray-900'
              )}>
                {getSuggestion(section.copySuggestions, 'heading', 'Key Statistics')}
              </h2>
            )}
            
            {getSuggestion(section.copySuggestions, 'subheading') && (
              <p className={cn(
                'text-lg max-w-3xl mx-auto',
                darkMode ? 'text-gray-300' : 'text-gray-600'
              )}>
                {getSuggestion(section.copySuggestions, 'subheading', 'Our impact in numbers')}
              </p>
            )}
          </div>
        )}
        
        <div className={cn(
          'grid gap-8',
          `grid-cols-${getGridCols()}`
        )}>
          {stats.map((stat, index) => (
            <div 
              key={stat.id || index} 
              className={cn(
                'text-center p-6',
                darkMode ? 'bg-gray-800' : 'bg-gray-50',
                'rounded-lg'
              )}
            >
              <div className={cn(
                'text-4xl font-bold mb-2',
                darkMode ? 'text-primary' : 'text-primary'
              )}>
                {stat.value || '100+'}
              </div>
              <div className={cn(
                darkMode ? 'text-gray-300' : 'text-gray-600'
              )}>
                {stat.label || 'Statistic'}
              </div>
            </div>
          ))}
          
          {/* Show placeholder if no stats are defined */}
          {stats.length === 0 && (
            <>
              <div className="text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-4xl font-bold mb-2 text-primary">250+</div>
                <div className="text-gray-600 dark:text-gray-300">Clients</div>
              </div>
              <div className="text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-4xl font-bold mb-2 text-primary">10K+</div>
                <div className="text-gray-600 dark:text-gray-300">Projects</div>
              </div>
              <div className="text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-4xl font-bold mb-2 text-primary">99%</div>
                <div className="text-gray-600 dark:text-gray-300">Satisfaction</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsSectionRenderer;
