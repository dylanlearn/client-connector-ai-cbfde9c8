
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';

const FooterSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  darkMode,
  viewMode,
  deviceType,
  isSelected,
  onClick,
}) => {
  // Extract footer data with fallbacks
  const columns = section.data?.columns || [];
  const logoText = section.data?.logoText || 'Company';
  const logoUrl = section.data?.logoUrl;
  const tagline = section.data?.tagline || 'Building better experiences';
  const copyright = section.data?.copyright || `© ${new Date().getFullYear()} ${logoText}. All rights reserved.`;
  const socialLinks = section.data?.socialLinks || [];
  
  // Get section styling with fallbacks
  const sectionStyle = section.style || {};
  const backgroundColor = sectionStyle.backgroundColor || (darkMode ? '#111827' : '#f3f4f6');
  const textColor = sectionStyle.textColor || (darkMode ? '#ffffff' : '#111827');
  
  // Handle section click
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };
  
  // Determine layout
  const isMobile = deviceType === 'mobile';
  
  return (
    <footer
      className={cn(
        'wireframe-section footer-section py-10 px-4',
        {
          'border-2 border-blue-500': isSelected,
          'dark': darkMode,
        }
      )}
      style={{
        backgroundColor,
        color: textColor,
      }}
      onClick={handleClick}
      data-section-id={section.id}
      data-section-type={section.sectionType}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'} gap-8`}>
          {/* Logo and company info */}
          <div className={isMobile ? 'mb-8' : 'col-span-1 lg:col-span-2'}>
            <div className="flex items-center mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt={logoText} className="h-8 w-auto mr-2" />
              ) : (
                <div className="h-8 w-8 bg-blue-600 text-white flex items-center justify-center rounded mr-2">
                  <span className="font-bold">{logoText.charAt(0)}</span>
                </div>
              )}
              <span className="text-lg font-bold">{logoText}</span>
            </div>
            <p className={cn(
              'mb-4 max-w-xs opacity-80',
              { 'text-gray-300': darkMode, 'text-gray-600': !darkMode }
            )}>
              {tagline}
            </p>
            
            {/* Social links */}
            {socialLinks.length > 0 ? (
              <div className="flex space-x-4 mt-4">
                {socialLinks.map((social: any, index: number) => (
                  <a 
                    key={social.id || `social-${index}`} 
                    href={social.url || '#'} 
                    className={cn(
                      'h-8 w-8 flex items-center justify-center rounded-full',
                      { 'bg-gray-800 text-white hover:bg-gray-700': !darkMode, 
                        'bg-gray-700 text-white hover:bg-gray-600': darkMode }
                    )}
                  >
                    <span>{social.icon || social.name?.charAt(0) || '#'}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex space-x-4 mt-4">
                {['X', 'f', 'in', 'ig'].map((icon, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className={cn(
                      'h-8 w-8 flex items-center justify-center rounded-full',
                      { 'bg-gray-800 text-white hover:bg-gray-700': !darkMode, 
                        'bg-gray-700 text-white hover:bg-gray-600': darkMode }
                    )}
                  >
                    <span>{icon}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer columns */}
          {columns.length > 0 ? columns.map((column: any, index: number) => (
            <div key={column.id || `column-${index}`}>
              <h4 className="text-base font-semibold mb-4">{column.title || `Column ${index + 1}`}</h4>
              <ul className="space-y-2">
                {(column.links || []).map((link: any, linkIndex: number) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.url || '#'} 
                      className={cn(
                        'hover:underline',
                        { 'text-gray-300 hover:text-white': darkMode, 'text-gray-600 hover:text-gray-900': !darkMode }
                      )}
                    >
                      {link.text || `Link ${linkIndex + 1}`}
                    </a>
                  </li>
                ))}
                
                {/* Display placeholder links if none are defined */}
                {(!column.links || column.links.length === 0) && (
                  Array.from({ length: 4 }).map((_, i) => (
                    <li key={i}>
                      <a 
                        href="#" 
                        className={cn(
                          'hover:underline',
                          { 'text-gray-300 hover:text-white': darkMode, 'text-gray-600 hover:text-gray-900': !darkMode }
                        )}
                      >
                        Link {i + 1}
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )) : (
            // Display placeholder columns if none are defined
            Array.from({ length: isMobile ? 2 : 3 }).map((_, index) => (
              <div key={`placeholder-column-${index}`}>
                <h4 className="text-base font-semibold mb-4">{
                  index === 0 ? 'Company' : 
                  index === 1 ? 'Resources' : 'Support'
                }</h4>
                <ul className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i}>
                      <a 
                        href="#" 
                        className={cn(
                          'hover:underline',
                          { 'text-gray-300 hover:text-white': darkMode, 'text-gray-600 hover:text-gray-900': !darkMode }
                        )}
                      >
                        {index === 0 && ['About', 'Team', 'Careers', 'Blog'][i]}
                        {index === 1 && ['Docs', 'Help', 'Community', 'Pricing'][i]}
                        {index === 2 && ['Contact', 'FAQ', 'Support', 'Status'][i]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
        
        {/* Copyright section */}
        <div className={cn(
          'border-t pt-6 mt-10',
          { 'border-gray-800': darkMode, 'border-gray-200': !darkMode }
        )}>
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row justify-between items-center'}`}>
            <p className={cn(
              'text-sm',
              { 'text-gray-400': darkMode, 'text-gray-500': !darkMode }
            )}>
              {copyright}
            </p>
            
            <div className="flex space-x-6">
              <a 
                href="#" 
                className={cn(
                  'text-sm hover:underline',
                  { 'text-gray-400 hover:text-gray-300': darkMode, 'text-gray-500 hover:text-gray-700': !darkMode }
                )}
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className={cn(
                  'text-sm hover:underline',
                  { 'text-gray-400 hover:text-gray-300': darkMode, 'text-gray-500 hover:text-gray-700': !darkMode }
                )}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSectionRenderer;
