
import React from 'react';
import { SectionComponentProps } from '../types';
import { getBackgroundClass, getAlignmentClass } from '../utils/variant-utils';

const FooterSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { componentVariant, data = {} } = section;
  const {
    logo,
    columns = [],
    newsletter,
    socialLinks = [],
    legalLinks = [],
    backgroundStyle = 'dark',
    alignment,
    showSocialIcons,
    showLegalLinks
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'left');

  return (
    <footer className={`footer-section ${backgroundClass} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`container mx-auto ${alignmentClass}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand/Logo Column */}
          <div className="footer-brand">
            {logo ? (
              <img src={logo} alt="Logo" className="h-10 mb-4" />
            ) : (
              <div className="text-xl font-bold mb-4">Brand Name</div>
            )}
            
            <p className="opacity-80 mb-4">
              Short brand description, mission statement or tagline could go here.
            </p>
            
            {showSocialIcons && (
              <div className="social-icons flex space-x-4">
                {socialLinks.map((link: any, i: number) => (
                  <a 
                    key={i} 
                    href={link.url || '#'}
                    className="opacity-80 hover:opacity-100"
                  >
                    <span className="sr-only">{link.platform}</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Link Columns */}
          {columns.map((column: any, index: number) => (
            <div key={index} className="footer-links">
              <h3 className="font-semibold text-lg mb-4">{column.heading}</h3>
              <ul className="space-y-2">
                {column.links?.map((link: any, i: number) => (
                  <li key={i}>
                    <a 
                      href={link.url || '#'} 
                      className="opacity-80 hover:opacity-100 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Newsletter */}
          {newsletter && (
            <div className="footer-newsletter">
              <h3 className="font-semibold text-lg mb-4">Subscribe</h3>
              <p className="opacity-80 mb-4">Stay updated with our latest news</p>
              
              <form className="flex">
                <input
                  type="email"
                  placeholder={newsletter.placeholder || "Email address"}
                  className="py-2 px-3 rounded-l-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-r-md"
                >
                  {newsletter.ctaLabel || "Subscribe"}
                </button>
              </form>
            </div>
          )}
        </div>
        
        {/* Legal Links */}
        {showLegalLinks && (
          <div className="border-t border-gray-700 pt-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm opacity-80">
                &copy; {new Date().getFullYear()} Company Name. All rights reserved.
              </p>
              
              <div className="flex space-x-4 mt-4 md:mt-0">
                {legalLinks.map((link: any, i: number) => (
                  <a 
                    key={i} 
                    href={link.url || '#'} 
                    className="text-sm opacity-80 hover:opacity-100"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default FooterSectionRenderer;
