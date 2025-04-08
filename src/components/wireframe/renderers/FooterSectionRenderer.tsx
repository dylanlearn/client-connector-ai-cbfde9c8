
import React from 'react';
import { SectionComponentProps } from '../types';
import { getBackgroundClass } from '../utils/variant-utils';

const FooterSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { componentVariant, data = {} } = section;
  const {
    companyName,
    logo,
    tagline,
    columns = [],
    socialLinks = [],
    copyrightText,
    backgroundStyle,
    footerType = 'standard'
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle || 'dark', darkMode);

  return (
    <footer className={`footer-section ${backgroundClass} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="container mx-auto">
        {footerType === 'standard' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <div className="mb-4">
                  {logo ? (
                    <img src={logo} alt={companyName} className="h-8" />
                  ) : (
                    <h2 className="text-xl font-bold">{companyName || 'Company Name'}</h2>
                  )}
                </div>
                
                {tagline && (
                  <p className="mb-4 opacity-80">{tagline}</p>
                )}
                
                <div className="flex space-x-4 mt-4">
                  {socialLinks.map((link: any, index: number) => (
                    <a
                      key={index}
                      href={link.url || '#'}
                      aria-label={link.platform}
                      className="opacity-70 hover:opacity-100"
                    >
                      <div className="w-5 h-5 bg-current rounded-full" />
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Footer Columns */}
              {columns.map((column: any, index: number) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
                  <ul className="space-y-2">
                    {column.links?.map((link: any, linkIndex: number) => (
                      <li key={linkIndex}>
                        <a
                          href={link.url || '#'}
                          className="opacity-70 hover:opacity-100"
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Copyright */}
            <div className="border-t border-gray-700 mt-12 pt-6 opacity-70">
              <p>{copyrightText || `© ${new Date().getFullYear()} ${companyName || 'Company Name'}. All rights reserved.`}</p>
            </div>
          </>
        ) : (
          // Simple Footer
          <div className="text-center">
            <div className="mb-6">
              {logo ? (
                <img src={logo} alt={companyName} className="h-8 mx-auto" />
              ) : (
                <h2 className="text-xl font-bold">{companyName || 'Company Name'}</h2>
              )}
            </div>
            
            <div className="flex justify-center space-x-8 mb-6">
              {columns.map((column: any, index: number) => (
                column.links?.map((link: any, linkIndex: number) => (
                  <a
                    key={`${index}-${linkIndex}`}
                    href={link.url || '#'}
                    className="opacity-70 hover:opacity-100"
                  >
                    {link.text}
                  </a>
                ))
              ))}
            </div>
            
            <div className="flex justify-center space-x-4 mb-6">
              {socialLinks.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url || '#'}
                  aria-label={link.platform}
                  className="opacity-70 hover:opacity-100"
                >
                  <div className="w-5 h-5 bg-current rounded-full" />
                </a>
              ))}
            </div>
            
            <p className="opacity-70">
              {copyrightText || `© ${new Date().getFullYear()} ${companyName || 'Company Name'}. All rights reserved.`}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default FooterSectionRenderer;
