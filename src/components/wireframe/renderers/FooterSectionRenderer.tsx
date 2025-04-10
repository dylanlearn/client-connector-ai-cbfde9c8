
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';

const FooterSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  const handleClick = () => {
    if (onClick && section.id) {
      onClick();
    }
  };
  
  const copySuggestions = section.copySuggestions || {};
  
  // Quick links for the footer
  const quickLinks = [
    { label: 'Home', url: '#' },
    { label: 'About', url: '#' },
    { label: 'Features', url: '#' },
    { label: 'Pricing', url: '#' },
    { label: 'Contact', url: '#' },
  ];
  
  // Resources links
  const resourceLinks = [
    { label: 'Blog', url: '#' },
    { label: 'Documentation', url: '#' },
    { label: 'Support', url: '#' },
    { label: 'FAQ', url: '#' },
  ];
  
  return (
    <footer 
      className={cn(
        'px-6 py-12 w-full',
        darkMode ? 'bg-gray-900' : 'bg-gray-100',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={section.style}
    >
      <div className="max-w-7xl mx-auto">
        <div className={cn(
          deviceType === 'mobile' ? 'grid grid-cols-1 gap-8' : 
          deviceType === 'tablet' ? 'grid grid-cols-2 gap-8' : 
          'grid grid-cols-4 gap-8'
        )}>
          {/* Company info */}
          <div>
            <h3 className={cn(
              'text-lg font-bold mb-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              {copySuggestions.companyName || 'Company Name'}
            </h3>
            <p className={cn(
              'mb-4',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              {copySuggestions.companyDescription || 'A brief description of your company and what you do.'}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className={cn(
              'text-lg font-bold mb-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              {copySuggestions.quickLinksTitle || 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.url} 
                    className={cn(
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className={cn(
              'text-lg font-bold mb-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              {copySuggestions.resourcesTitle || 'Resources'}
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.url} 
                    className={cn(
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className={cn(
              'text-lg font-bold mb-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              {copySuggestions.contactTitle || 'Contact Us'}
            </h3>
            <address className={cn(
              'not-italic',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              {copySuggestions.address || '123 Main Street'}<br />
              {copySuggestions.cityStateZip || 'City, State 12345'}<br />
              <a 
                href={`mailto:${copySuggestions.email || 'info@example.com'}`}
                className={darkMode ? 'text-blue-400' : 'text-blue-600'}
              >
                {copySuggestions.email || 'info@example.com'}
              </a>
            </address>
          </div>
        </div>
        
        {/* Copyright */}
        <div className={cn(
          'mt-12 pt-8 border-t text-center',
          darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'
        )}>
          {copySuggestions.copyright || `© ${new Date().getFullYear()} Company Name. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
};

export default FooterSectionRenderer;
