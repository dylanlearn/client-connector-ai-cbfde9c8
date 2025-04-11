
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

const FeaturesSectionRenderer: React.FC<SectionComponentProps> = ({
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
  
  // Features data
  const features = [
    {
      icon: '🚀',
      title: getSuggestion(section.copySuggestions, 'feature1Title', 'Lightning Fast Performance'),
      description: getSuggestion(section.copySuggestions, 'feature1Description', 'Our platform is optimized for speed, ensuring your workflow is never interrupted.'),
    },
    {
      icon: '🛡️',
      title: getSuggestion(section.copySuggestions, 'feature2Title', 'Enterprise-Grade Security'),
      description: getSuggestion(section.copySuggestions, 'feature2Description', 'Your data is protected with the latest security measures and encryption.'),
    },
    {
      icon: '📊',
      title: getSuggestion(section.copySuggestions, 'feature3Title', 'Advanced Analytics'),
      description: getSuggestion(section.copySuggestions, 'feature3Description', 'Gain valuable insights with comprehensive reporting and data visualization.'),
    },
    {
      icon: '🔄',
      title: getSuggestion(section.copySuggestions, 'feature4Title', 'Seamless Integration'),
      description: getSuggestion(section.copySuggestions, 'feature4Description', 'Connect with your favorite tools and services without any hassle.'),
    },
    {
      icon: '📱',
      title: getSuggestion(section.copySuggestions, 'feature5Title', 'Mobile Optimized'),
      description: getSuggestion(section.copySuggestions, 'feature5Description', 'Access your dashboard and data from any device, anywhere.'),
    },
    {
      icon: '👥',
      title: getSuggestion(section.copySuggestions, 'feature6Title', 'Team Collaboration'),
      description: getSuggestion(section.copySuggestions, 'feature6Description', 'Work together seamlessly with role-based permissions and real-time updates.'),
    }
  ];
  
  // Determine variant
  const variant = section.componentVariant || 'grid';
  
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
            {getSuggestion(section.copySuggestions, 'heading', 'Powerful Features')}
          </h2>
          
          <p className={cn(
            'max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {getSuggestion(section.copySuggestions, 'subheading', 'Everything you need to streamline your workflow and boost productivity.')}
          </p>
        </div>
        
        {/* Grid layout */}
        {variant === 'grid' && (
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
                  darkMode ? 'bg-gray-800' : 'bg-gray-50'
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
        )}
        
        {/* Cards layout */}
        {variant === 'cards' && (
          <div className="space-y-8">
            <div className={cn(
              'grid gap-8',
              deviceType === 'mobile' ? 'grid-cols-1' : 
              'grid-cols-2'
            )}>
              {features.slice(0, 4).map((feature, i) => (
                <div 
                  key={i} 
                  className={cn(
                    'flex p-6 rounded-lg',
                    darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
                  )}
                >
                  <div className="mr-4 text-4xl">{feature.icon}</div>
                  <div>
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
                </div>
              ))}
            </div>
            
            {features.length > 4 && (
              <div className="text-center">
                <button className={cn(
                  'px-6 py-2 rounded-md font-medium',
                  darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                )}>
                  {getSuggestion(section.copySuggestions, 'viewMoreCta', 'View More Features')}
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Icons layout */}
        {variant === 'icons' && (
          <div className={cn(
            'grid gap-x-12 gap-y-8',
            deviceType === 'mobile' ? 'grid-cols-2' : 
            deviceType === 'tablet' ? 'grid-cols-3' : 
            'grid-cols-6'
          )}>
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="text-center"
              >
                <div className={cn(
                  'text-4xl mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full',
                  darkMode ? 'bg-gray-800' : 'bg-gray-100'
                )}>
                  {feature.icon}
                </div>
                <h3 className={cn(
                  'text-lg font-medium mb-1',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {feature.title}
                </h3>
                {deviceType !== 'mobile' && (
                  <p className={cn(
                    'text-sm',
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturesSectionRenderer;
