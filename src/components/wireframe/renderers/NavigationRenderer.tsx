
import React from 'react';
import { cn } from '@/lib/utils';
import { VariantComponentProps } from '../types';
import { getSuggestion } from './utilities';

const NavigationRenderer: React.FC<VariantComponentProps> = ({
  component,
  variant = 'default',
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  onClick
}) => {
  // Handle different navigation variants
  const renderNavigationVariant = () => {
    switch (variant.toLowerCase()) {
      case 'simple':
        return renderSimpleNavigation();
      case 'mega':
        return renderMegaNavigation();
      case 'centered':
        return renderCenteredNavigation();
      default:
        return renderDefaultNavigation();
    }
  };

  // Simple top navigation
  const renderDefaultNavigation = () => {
    const navItems = [
      { label: getSuggestion(component.copySuggestions, 'navItem1', 'Home'), url: '#' },
      { label: getSuggestion(component.copySuggestions, 'navItem2', 'Features'), url: '#' },
      { label: getSuggestion(component.copySuggestions, 'navItem3', 'Pricing'), url: '#' },
      { label: getSuggestion(component.copySuggestions, 'navItem4', 'About'), url: '#' },
      { label: getSuggestion(component.copySuggestions, 'navItem5', 'Contact'), url: '#' },
    ];

    return (
      <div className={cn(
        'px-6 py-4 flex items-center justify-between',
        darkMode ? 'bg-gray-900' : 'bg-white',
        component.style?.className
      )}>
        <div className="flex items-center">
          <div className="text-xl font-bold">
            {getSuggestion(component.copySuggestions, 'brandName', 'Brand')}
          </div>
        </div>
        
        <div className={cn(
          deviceType === 'mobile' ? 'hidden' : 'flex items-center space-x-6'
        )}>
          {navItems.map((item, i) => (
            <a 
              key={i} 
              href={item.url}
              className={cn(
                'text-sm font-medium',
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
        
        <div>
          <button className={cn(
            'px-4 py-2 rounded',
            darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
          )}>
            {getSuggestion(component.copySuggestions, 'ctaButton', 'Sign Up')}
          </button>
          
          {deviceType === 'mobile' && (
            <button className="ml-4 text-gray-500">
              ☰
            </button>
          )}
        </div>
      </div>
    );
  };

  // Simple navigation implementation (placeholder)
  const renderSimpleNavigation = () => {
    return renderDefaultNavigation(); // For now, use the default
  };

  // Mega menu navigation implementation (placeholder)
  const renderMegaNavigation = () => {
    return renderDefaultNavigation(); // For now, use the default
  };

  // Centered navigation implementation (placeholder)
  const renderCenteredNavigation = () => {
    return renderDefaultNavigation(); // For now, use the default
  };

  const styles: React.CSSProperties = {
    ...(component.style || {}),
  };
  
  // If textAlign is present in style, ensure it's a valid CSSProperties value
  if (component.style?.textAlign) {
    styles.textAlign = component.style.textAlign as React.CSSProperties['textAlign'];
  }

  return (
    <div 
      className={cn(
        'wireframe-navigation w-full',
        viewMode === 'flowchart' && 'border-2 border-dashed p-2'
      )}
      onClick={onClick}
      style={styles}
    >
      {renderNavigationVariant()}
    </div>
  );
};

export default NavigationRenderer;
