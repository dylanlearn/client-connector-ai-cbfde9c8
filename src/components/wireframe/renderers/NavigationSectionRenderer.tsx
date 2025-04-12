
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

const NavigationSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  // Extract components from section or use defaults
  const logo = section.components?.find(c => c.type === 'logo');
  const navLinks = section.components?.find(c => c.type === 'nav-links');
  const ctaButton = section.components?.find(c => c.type === 'button');
  
  // Determine if we should show mobile navigation
  const isMobile = deviceType === 'mobile';
  const isSticky = section.componentVariant === 'sticky';
  
  const handleClick = () => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };

  return (
    <nav 
      className={cn(
        'navigation-section w-full py-4 px-4 border-b',
        darkMode ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-100',
        isSticky ? 'sticky top-0 z-50' : '',
        isSelected ? 'ring-2 ring-primary ring-offset-1' : '',
        viewMode === 'edit' ? 'cursor-pointer' : ''
      )}
      onClick={handleClick}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className={cn(
              'font-bold text-xl',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              Logo
            </div>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4">
              {(navLinks?.props?.items || ['Features', 'Pricing', 'About', 'Contact']).map((item, index) => (
                <a 
                  href="#" 
                  key={index}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium',
                    darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
          
          {/* CTA and Mobile Menu */}
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <button
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium',
                  darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                {ctaButton?.props?.text || 'Get Started'}
              </button>
            )}
            
            {isMobile && (
              <button
                className={cn(
                  'p-2 rounded-md',
                  darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationSectionRenderer;
