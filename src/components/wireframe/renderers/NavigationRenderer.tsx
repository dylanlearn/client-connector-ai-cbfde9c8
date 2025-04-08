
import React from 'react';
import { VariantComponentProps } from '../types';

const NavigationRenderer: React.FC<VariantComponentProps> = ({
  variant,
  viewMode = 'preview',
  darkMode = false,
  data = {}
}) => {
  const {
    logo,
    brandName = 'Brand Name',
    links = [
      { label: 'Features', url: '#' },
      { label: 'Pricing', url: '#' },
      { label: 'About', url: '#' }
    ],
    cta = { label: 'Get Started', url: '#' },
    isSticky = false,
    hasSearch = false
  } = data;

  // Determine if this is a light or dark variant based on component variant or dark mode
  const isLightVariant = !variant?.includes('dark') && !darkMode;
  
  // Style classes based on variant 
  const navClasses = `px-4 sm:px-6 lg:px-8 py-4 ${isSticky ? 'sticky top-0 z-50' : ''} ${
    isLightVariant ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
  }`;

  // Determine layout based on variant
  const isSimple = variant?.includes('simple');
  const isCentered = variant?.includes('centered');
  const isSplit = variant?.includes('split');
  
  return (
    <nav className={navClasses}>
      <div className="container mx-auto">
        <div className={`flex items-center ${isSplit ? 'justify-between' : ''} ${isCentered ? 'justify-center' : ''}`}>
          {/* Brand/Logo */}
          <div className={`${isCentered ? 'absolute left-4' : ''} flex items-center`}>
            {logo ? (
              <img src={logo} alt={brandName || 'Logo'} className="h-8" />
            ) : (
              <div className="text-xl font-bold">{brandName || 'Brand Name'}</div>
            )}
          </div>
          
          {/* Navigation Links */}
          <div className={`${isCentered ? 'mx-auto' : 'ml-auto'} flex items-center gap-6`}>
            {!isSimple && (
              <div className="hidden md:flex space-x-6">
                {links.map((link: any, index: number) => (
                  <a 
                    key={index}
                    href={link.url || '#'} 
                    className={`${link.isActive ? 'font-semibold' : 'font-normal'} hover:text-primary transition-colors`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
            
            {/* Search Input */}
            {hasSearch && !isSimple && (
              <div className="hidden md:block">
                <div className={`flex items-center rounded-full px-3 py-1 ${
                  isLightVariant ? 'bg-gray-100' : 'bg-gray-800'
                }`}>
                  <svg className="w-4 h-4 opacity-50 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm opacity-50">Search</span>
                </div>
              </div>
            )}
            
            {/* CTA Button */}
            {cta && !isSimple && (
              <a 
                href={cta.url || '#'} 
                className={`hidden md:inline-block px-4 py-2 rounded-md ${
                  cta.isPrimary 
                    ? 'bg-primary hover:bg-primary-600 text-white' 
                    : `border ${isLightVariant ? 'border-gray-300 hover:border-gray-400' : 'border-gray-700 hover:border-gray-600'}`
                }`}
              >
                {cta.label}
              </a>
            )}
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2" aria-label="Menu">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationRenderer;
