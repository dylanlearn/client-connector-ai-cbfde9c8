
import React from 'react';
import { NavigationComponentProps } from '@/types/component-library';
import { cn } from '@/lib/utils';

interface NavigationSectionProps {
  sectionIndex?: number;
  data?: NavigationComponentProps;
  variant?: string;
  className?: string;
}

export const NavigationSection: React.FC<NavigationSectionProps> = ({ 
  sectionIndex = 0,
  data,
  variant = 'nav-startup-001',
  className
}) => {
  // Default navigation data if none provided
  const navigationData: Partial<NavigationComponentProps> = data || {
    variant,
    links: [
      { label: "Features", url: "/features" },
      { label: "Pricing", url: "/pricing" },
      { label: "Resources", url: "/resources" }
    ],
    cta: { label: "Get Started", url: "/signup" },
    alignment: 'left',
    backgroundStyle: 'light',
    mobileMenuStyle: 'dropdown',
    sticky: true
  };
  
  // Determine background class based on style
  const getBgClass = () => {
    switch (navigationData.backgroundStyle) {
      case 'dark': 
        return 'bg-gray-900 text-white';
      case 'light': 
        return 'bg-white text-gray-800';
      case 'glass': 
        return 'bg-opacity-50 backdrop-blur-md bg-white text-gray-800';
      case 'transparent': 
        return 'bg-transparent text-gray-800';
      case 'gradient':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
      case 'image':
        return 'bg-gray-800 bg-opacity-75 text-white';
      default:
        return 'bg-white text-gray-800';
    }
  };
  
  // Determine alignment class
  const getAlignmentClass = () => {
    switch (navigationData.alignment) {
      case 'left': return 'justify-start';
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      default: return 'justify-between';
    }
  };
  
  return (
    <div 
      key={sectionIndex} 
      className={cn(
        'border-2 border-dashed border-gray-300 rounded-lg p-2',
        getBgClass(),
        navigationData.sticky ? 'sticky top-0 z-50' : '',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="w-20 h-8 bg-gray-300 rounded flex-shrink-0"></div>
          
          {/* Navigation Links */}
          <div className={`hidden md:flex items-center space-x-4 ${getAlignmentClass()}`}>
            {navigationData.links?.map((link, idx) => (
              <div key={idx} className="px-3 py-1 bg-gray-200 bg-opacity-30 rounded text-sm">{link.label}</div>
            ))}
            
            {/* CTA Button */}
            {navigationData.cta && (
              <div className="px-4 py-2 bg-blue-500 text-white rounded text-sm">{navigationData.cta.label}</div>
            )}
            
            {/* Search */}
            {navigationData.hasSearch && (
              <div className="w-6 h-6 bg-gray-300 bg-opacity-30 rounded-full"></div>
            )}
          </div>
          
          {/* Mobile Menu (simplified representation) */}
          <div className="md:hidden w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
      
      {/* Mobile menu placeholder - would be hidden by default in real implementation */}
      <div className="md:hidden bg-gray-100 bg-opacity-30 p-4 border-t mt-2 hidden">
        {navigationData.links?.map((link, idx) => (
          <div key={idx} className="py-2 border-b border-gray-200 border-opacity-20">{link.label}</div>
        ))}
        {navigationData.cta && (
          <div className="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-sm text-center">{navigationData.cta.label}</div>
        )}
      </div>
    </div>
  );
};

export default NavigationSection;
