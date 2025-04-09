
import React from 'react';
import { cn } from '@/lib/utils';
import { VariantComponentProps } from '../types';

const NavigationRenderer: React.FC<VariantComponentProps> = ({
  variant = 'standard',
  data = {},
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop'
}) => {
  // Determine the renderer based on the variant
  const renderByVariant = () => {
    switch (variant) {
      case 'centered':
        return renderCenteredNav();
      case 'withDropdown':
        return renderNavWithDropdown();
      case 'mobile':
        return renderMobileNav();
      case 'standard':
      default:
        return renderStandardNav();
    }
  };

  // Standard navigation with logo and items
  const renderStandardNav = () => (
    <div className={cn(
      "flex justify-between items-center w-full px-4 py-2",
      darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800",
      { "border-b": viewMode === 'preview' }
    )}>
      <div className="logo font-bold text-xl">
        {data?.logoText || "Logo"}
      </div>
      <div className="nav-items flex space-x-4">
        {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
          <div key={index} className="nav-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  // Centered navigation with logo in center
  const renderCenteredNav = () => (
    <div className={cn(
      "flex flex-col items-center w-full px-4 py-2",
      darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800",
      { "border-b": viewMode === 'preview' }
    )}>
      <div className="logo font-bold text-xl mb-2">
        {data?.logoText || "Logo"}
      </div>
      <div className="nav-items flex space-x-6">
        {['Home', 'About', 'Services', 'Products', 'Contact'].map((item, index) => (
          <div key={index} className="nav-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  // Navigation with dropdown menus
  const renderNavWithDropdown = () => (
    <div className={cn(
      "flex justify-between items-center w-full px-4 py-2",
      darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800",
      { "border-b": viewMode === 'preview' }
    )}>
      <div className="logo font-bold text-xl">
        {data?.logoText || "Logo"}
      </div>
      <div className="nav-items flex space-x-4">
        {['Home', 'Products ▼', 'Services ▼', 'About', 'Contact'].map((item, index) => (
          <div key={index} className="nav-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  // Mobile navigation with hamburger menu
  const renderMobileNav = () => (
    <div className={cn(
      "flex justify-between items-center w-full px-4 py-2",
      darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800",
      { "border-b": viewMode === 'preview' }
    )}>
      <div className="logo font-bold text-xl">
        {data?.logoText || "Logo"}
      </div>
      <div className="hamburger cursor-pointer">
        ☰
      </div>
    </div>
  );

  return renderByVariant();
};

export default NavigationRenderer;
