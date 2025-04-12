
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';
import { LightbulbIcon, Boxes, BarChart3, RefreshCcw } from 'lucide-react';

const FeaturesSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  // Get copy suggestions or defaults
  const heading = section.copySuggestions?.heading || 'Powerful Features';
  const subheading = section.copySuggestions?.subheading || 'Everything you need to streamline your workflow and boost productivity.';
  
  // Get stats or create defaults
  const stats = section.stats || [
    { id: '1', value: "Feature 1", label: "Description of this amazing feature" },
    { id: '2', value: "Feature 2", label: "Description of this amazing feature" },
    { id: '3', value: "Feature 3", label: "Description of this amazing feature" }
  ];
  
  // Determine layout columns based on device type
  const columns = deviceType === 'mobile' ? 1 : deviceType === 'tablet' ? 2 : 3;
  
  // Component icons
  const icons = [
    <LightbulbIcon className="h-10 w-10 text-blue-500" />,
    <Boxes className="h-10 w-10 text-blue-500" />,
    <BarChart3 className="h-10 w-10 text-blue-500" />,
    <RefreshCcw className="h-10 w-10 text-blue-500" />
  ];
  
  const handleClick = () => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };

  return (
    <div 
      className={cn(
        'features-section w-full py-16 px-4',
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900',
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
        
        {/* Features Grid */}
        <div className={cn(
          'grid gap-8',
          columns === 1 ? 'grid-cols-1' : 
          columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}>
          {stats.map((stat, index) => (
            <div 
              key={stat.id || index}
              className={cn(
                'feature-card p-6 rounded-lg',
                darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'
              )}
            >
              <div className="mb-4">
                {icons[index % icons.length]}
              </div>
              <h3 className="text-xl font-semibold mb-2">{stat.value}</h3>
              <p className={cn(
                darkMode ? 'text-gray-300' : 'text-gray-600'
              )}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSectionRenderer;
