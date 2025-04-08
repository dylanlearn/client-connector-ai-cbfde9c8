
import React, { useState } from 'react';
import { navigationVariants } from '@/data/component-library-variants-navigation';
import { NavigationComponentProps } from '@/types/component-library';
import { getBackgroundClass, getFlexAlignmentClass } from '../utils/variant-utils';
import { VariantComponentProps } from '../types';

interface NavigationRendererProps extends VariantComponentProps {
  data?: Partial<NavigationComponentProps>;
}

const NavigationRenderer: React.FC<NavigationRendererProps> = ({
  variant,
  viewMode = 'preview',
  darkMode = false,
  data = {}
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Find the base variant from the library
  const baseVariant = navigationVariants.find(v => v.variant === variant) || navigationVariants[0];
  
  // Merge custom data with base variant
  const {
    logo,
    links = baseVariant.links,
    cta,
    backgroundStyle = baseVariant.backgroundStyle,
    alignment = baseVariant.alignment,
    sticky = baseVariant.sticky,
    hasSearch = baseVariant.hasSearch,
    mobileMenuStyle = baseVariant.mobileMenuStyle,
  } = { ...baseVariant, ...data };

  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const flexAlignmentClass = getFlexAlignmentClass(alignment);
  
  return (
    <header className={`navigation-component ${backgroundClass} py-4 px-4 sm:px-6 ${sticky ? 'sticky top-0 z-50' : ''}`}>
      <div className="container mx-auto">
        <div className={`flex items-center ${flexAlignmentClass}`}>
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo ? (
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            ) : (
              <div className="text-xl font-bold">Logo</div>
            )}
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8 ml-10">
            {links.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                className="text-current opacity-80 hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          {/* Right Section: Search, CTA */}
          <div className="flex items-center ml-auto">
            {/* Search */}
            {hasSearch && (
              <div className="mr-4">
                {searchOpen ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    />
                    <button 
                      onClick={() => setSearchOpen(false)}
                      className="ml-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setSearchOpen(true)}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            {/* CTA Button */}
            {cta && (
              <div className="hidden md:block">
                <a 
                  href={cta.url} 
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  {cta.label}
                </a>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <div className="md:hidden ml-4">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden mt-4 py-4 ${mobileMenuStyle === 'overlay' ? 'absolute inset-x-0 top-full bg-white dark:bg-gray-800 shadow-lg' : ''}`}>
            <nav className="flex flex-col space-y-4">
              {links.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  {link.label}
                </a>
              ))}
              
              {cta && (
                <a 
                  href={cta.url} 
                  className="block px-4 py-2 bg-primary text-white rounded-md mt-2"
                >
                  {cta.label}
                </a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationRenderer;
