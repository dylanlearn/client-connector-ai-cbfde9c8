
import React from 'react';
import { SectionComponentProps } from '../types';
import { getBackgroundClass, getAlignmentClass, getFlexAlignmentClass } from '../utils/variant-utils';

const FooterSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { componentVariant, data = {} } = section;
  const {
    logo,
    columns = [],
    backgroundStyle,
    alignment,
    showSocialIcons,
    showLegalLinks,
    newsletter
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'left');
  const flexAlignmentClass = getFlexAlignmentClass(alignment);
  
  // Mock social icons (in a real app, you'd use proper icons)
  const socialIcons = [
    { name: 'Twitter', url: '#' },
    { name: 'Facebook', url: '#' },
    { name: 'Instagram', url: '#' },
    { name: 'LinkedIn', url: '#' },
  ];

  // Mock legal links
  const legalLinks = [
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Terms of Use', url: '/terms' },
    { name: 'Cookie Policy', url: '/cookies' },
  ];

  return (
    <footer className={`footer-section ${backgroundClass} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="container mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and About */}
          <div className="footer-brand">
            {logo && (
              <div className="mb-4">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
              </div>
            )}
            
            <p className="text-sm opacity-80 mb-4">
              We help businesses grow through innovative digital solutions.
            </p>
            
            {showSocialIcons && (
              <div className="social-icons flex gap-4 mt-4">
                {socialIcons.map((social, index) => (
                  <a 
                    key={index}
                    href={social.url}
                    className="text-current opacity-80 hover:opacity-100"
                    aria-label={social.name}
                  >
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                      {social.name.charAt(0)}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer Columns */}
          {columns.map((column, index) => (
            <div key={index} className="footer-links">
              <h4 className="font-semibold text-lg mb-4">{column.heading}</h4>
              
              <ul className="space-y-2">
                {column.links.map((link, i) => (
                  <li key={i}>
                    <a 
                      href={link.url} 
                      className="text-sm hover:underline opacity-80 hover:opacity-100"
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
              <h4 className="font-semibold text-lg mb-4">Stay Updated</h4>
              
              <form className="mt-2">
                <div className="flex max-w-md">
                  <input 
                    type="email" 
                    placeholder={newsletter.placeholder || "Enter your email"} 
                    className="flex-grow px-4 py-2 rounded-l-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  />
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-primary text-white rounded-r-md"
                  >
                    {newsletter.ctaLabel || "Subscribe"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Legal Section */}
        {showLegalLinks && (
          <div className={`legal-section flex ${flexAlignmentClass} flex-wrap gap-4 mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm opacity-70`}>
            <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
            
            <div className="legal-links flex flex-wrap gap-4">
              {legalLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  className="hover:underline"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default FooterSectionRenderer;
