
import React from "react";
import { CheckSquare } from "lucide-react";
import { FeatureGridComponentProps } from "@/types/component-library";

interface FeaturesSectionProps {
  sectionIndex: number;
  data?: Partial<FeatureGridComponentProps>;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ sectionIndex, data }) => {
  // Fallback to wireframe display if no specific data is provided
  if (!data) {
    return (
      <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="text-center mb-8">
          <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
          <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <CheckSquare className="w-8 h-8 text-gray-400" />
              </div>
              <div className="w-24 h-6 bg-gray-300 rounded"></div>
              <div className="space-y-2">
                <div className="w-full h-3 bg-gray-200 rounded"></div>
                <div className="w-5/6 h-3 bg-gray-200 rounded mx-auto"></div>
                <div className="w-4/6 h-3 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Function to get Lucide icon component based on icon name string
  const getIcon = (iconName: string) => {
    // Simple mapping, in a real application you might want to use dynamic imports
    // or a more comprehensive mapping of icon names to components
    switch (iconName?.toLowerCase()) {
      case 'check':
      case 'checksquare':
        return <CheckSquare className="w-6 h-6" />;
      default:
        return <CheckSquare className="w-6 h-6" />;
    }
  };
  
  // When actual component data is available, render the real feature grid component
  return (
    <div key={sectionIndex} className={`features-section ${data.backgroundStyle === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'} py-12`}>
      <div className="container mx-auto px-4">
        {(data.title || data.subtitle) && (
          <div className={`text-${data.alignment || 'center'} mb-12`}>
            {data.title && <h2 className="text-3xl font-bold mb-4">{data.title}</h2>}
            {data.subtitle && <p className="text-lg text-gray-500 dark:text-gray-300">{data.subtitle}</p>}
          </div>
        )}
        
        <div className={`grid grid-cols-1 md:grid-cols-${data.columns || 3} gap-8`}>
          {data.features?.map((feature, index) => (
            <div key={index} className={`feature-item text-${data.alignment || 'center'}`}>
              {data.mediaType === 'icon' && feature.icon && (
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                    {getIcon(feature.icon)}
                  </div>
                </div>
              )}
              
              {data.mediaType === 'image' && feature.image && (
                <div className="mb-4">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="mx-auto h-32 object-contain"
                  />
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              {feature.description && (
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              )}
              
              {feature.badge && (
                <span className="inline-block mt-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                  {feature.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
