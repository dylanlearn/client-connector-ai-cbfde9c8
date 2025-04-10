
import React from 'react';
import { cn } from '@/lib/utils';
import { VariantComponentProps } from '../types';

const NavigationRenderer: React.FC<VariantComponentProps> = ({
  component,
  variant = 'default',
  data,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
}) => {
  // Default navigation links
  const navLinks = component?.links || [
    { label: 'Home', url: '#' },
    { label: 'Features', url: '#' },
    { label: 'Pricing', url: '#' },
    { label: 'About', url: '#' },
    { label: 'Contact', url: '#' }
  ];

  // This just renders a basic navigation bar for preview purposes
  return (
    <div className={cn(
      'w-full py-4 px-6',
      darkMode ? 'bg-gray-800' : 'bg-white border-b',
      viewMode === 'flowchart' && 'border-2 border-dashed'
    )}>
      <div className={cn(
        'flex items-center justify-between',
        deviceType === 'mobile' && 'flex-col space-y-4'
      )}>
        <div className="font-bold text-lg">
          {component?.logoText || data?.logoText || 'Brand Logo'}
        </div>
        
        {deviceType !== 'mobile' ? (
          <div className="flex items-center space-x-6">
            {navLinks.map((link, i) => (
              <div key={i} className={cn(
                'text-sm',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                {link.label}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-8 h-8 flex flex-col justify-around">
            <span className={`block h-0.5 w-8 ${darkMode ? 'bg-white' : 'bg-black'}`}></span>
            <span className={`block h-0.5 w-8 ${darkMode ? 'bg-white' : 'bg-black'}`}></span>
            <span className={`block h-0.5 w-8 ${darkMode ? 'bg-white' : 'bg-black'}`}></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationRenderer;
