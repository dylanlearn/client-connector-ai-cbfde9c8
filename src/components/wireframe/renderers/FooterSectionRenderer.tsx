
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

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
      onClick(section.id);
    }
  };
  
  // Determine variant
  const variant = section.componentVariant || 'simple';
  
  // Create navigation links
  const navLinks = [
    { label: getSuggestion(section.copySuggestions, 'link1', 'Home'), href: '#' },
    { label: getSuggestion(section.copySuggestions, 'link2', 'About'), href: '#' },
    { label: getSuggestion(section.copySuggestions, 'link3', 'Services'), href: '#' },
    { label: getSuggestion(section.copySuggestions, 'link4', 'Contact'), href: '#' },
    { label: getSuggestion(section.copySuggestions, 'link5', 'Blog'), href: '#' }
  ];
  
  // Create properly typed style object
  const styles = createStyleObject(section.style);
  
  return (
    <footer 
      className={cn(
        'w-full',
        darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-800 text-white',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      {variant === 'multi-column' ? (
        <div className="container mx-auto py-12 px-4">
          <div className={cn(
            'grid gap-8',
            deviceType === 'mobile' ? 'grid-cols-1' : 
            deviceType === 'tablet' ? 'grid-cols-2' : 
            'grid-cols-4'
          )}>
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {getSuggestion(section.copySuggestions, 'companyName', 'Company Name')}
              </h3>
              <p className="text-sm mb-4 opacity-75">
                {getSuggestion(section.copySuggestions, 'companyDescription', 'We provide innovative solutions for your business needs.')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="opacity-75 hover:opacity-100">
                  <span role="img" aria-label="facebook">📱</span>
                </a>
                <a href="#" className="opacity-75 hover:opacity-100">
                  <span role="img" aria-label="twitter">📱</span>
                </a>
                <a href="#" className="opacity-75 hover:opacity-100">
                  <span role="img" aria-label="instagram">📱</span>
                </a>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="opacity-75 hover:opacity-100 transition">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="not-italic">
                <p className="mb-2">{getSuggestion(section.copySuggestions, 'address', '123 Street Name, City, Country')}</p>
                <p className="mb-2">{getSuggestion(section.copySuggestions, 'phone', '+1 (555) 123-4567')}</p>
                <p>{getSuggestion(section.copySuggestions, 'email', 'info@example.com')}</p>
              </address>
            </div>
            
            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-sm mb-4 opacity-75">Stay updated with our latest news and offers.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 bg-gray-700 text-white rounded-l-md w-full" 
                />
                <button className="bg-blue-600 py-2 px-4 rounded-r-md font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-75">
              {getSuggestion(section.copySuggestions, 'copyright', '© 2023 Company Name. All rights reserved.')}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm opacity-75 hover:opacity-100">Privacy Policy</a>
              <a href="#" className="text-sm opacity-75 hover:opacity-100">Terms of Service</a>
            </div>
          </div>
        </div>
      ) : (
        // Simple footer
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold">
                {getSuggestion(section.copySuggestions, 'companyName', 'Company Name')}
              </p>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 md:mb-0">
              {navLinks.map((link, i) => (
                <a key={i} href={link.href} className="opacity-75 hover:opacity-100 transition">
                  {link.label}
                </a>
              ))}
            </nav>
            
            <div className="flex space-x-4">
              <a href="#" className="opacity-75 hover:opacity-100">
                <span role="img" aria-label="facebook">📱</span>
              </a>
              <a href="#" className="opacity-75 hover:opacity-100">
                <span role="img" aria-label="twitter">📱</span>
              </a>
              <a href="#" className="opacity-75 hover:opacity-100">
                <span role="img" aria-label="instagram">📱</span>
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-4 pt-4 text-center">
            <p className="text-sm opacity-75">
              {getSuggestion(section.copySuggestions, 'copyright', '© 2023 Company Name. All rights reserved.')}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};

export default FooterSectionRenderer;
