
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';
import { Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';

const FooterSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  // Get logo info
  const logoComponent = section.components?.find(c => c.type === 'logo');
  
  // Get navigation link groups
  const navComponents = section.components?.filter(c => c.type === 'nav-links') || [];
  
  // Get newsletter component
  const newsletterComponent = section.components?.find(c => c.type === 'newsletter');
  
  // Get social icons component
  const socialComponent = section.components?.find(c => c.type === 'social-icons');
  
  // Determine layout based on device type
  const isMobile = deviceType === 'mobile';
  
  const handleClick = () => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };

  // Map social icon names to components
  const socialIcons: Record<string, React.ReactNode> = {
    twitter: <Twitter className="h-5 w-5" />,
    facebook: <Facebook className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />
  };

  return (
    <footer 
      className={cn(
        'footer-section w-full py-16 px-4',
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900',
        isSelected ? 'ring-2 ring-primary ring-offset-1' : '',
        viewMode === 'edit' ? 'cursor-pointer' : ''
      )}
      onClick={handleClick}
    >
      <div className="container mx-auto">
        <div className={cn(
          'grid gap-8',
          isMobile ? 'grid-cols-1' : 
          'grid-cols-2 md:grid-cols-4'
        )}>
          {/* Logo and Description Column */}
          <div className="col-span-1">
            <div className={cn(
              'font-bold text-2xl mb-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              Company Logo
            </div>
            <p className={cn(
              'mb-4',
              darkMode ? 'text-gray-300' : 'text-gray-600'
            )}>
              Streamline your workflow and boost productivity with our powerful platform.
            </p>
          </div>
          
          {/* Navigation Columns */}
          {(navComponents.length > 0 ? navComponents : [{props: {title: "Product", links: ["Features", "Pricing", "Roadmap"]}}, {props: {title: "Company", links: ["About", "Careers", "Contact"]}}]).map((navGroup, index) => (
            <div key={index} className="col-span-1">
              <h3 className="font-semibold text-lg mb-4">{navGroup.props?.title || `Links ${index + 1}`}</h3>
              <ul className="space-y-2">
                {(navGroup.props?.links || ["Link 1", "Link 2", "Link 3"]).map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className={cn(
                        darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Newsletter Column */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">
              {newsletterComponent?.props?.title || "Stay Updated"}
            </h3>
            <div className="flex">
              <input 
                type="email" 
                placeholder={newsletterComponent?.props?.placeholder || "Your email address"} 
                className={cn(
                  "flex-grow px-3 py-2 text-sm rounded-l",
                  darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300",
                  "border focus:outline-none"
                )}
              />
              <button
                className={cn(
                  "px-3 py-2 text-sm text-white rounded-r",
                  darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {newsletterComponent?.props?.buttonText || "Subscribe"}
              </button>
            </div>
            
            {/* Social Icons */}
            {socialComponent && (
              <div className="mt-6">
                <div className="flex space-x-4">
                  {(socialComponent.props?.icons || ["twitter", "facebook", "linkedin", "instagram"]).map((icon, i) => (
                    <a 
                      key={i} 
                      href="#" 
                      className={cn(
                        "bg-opacity-20 rounded-full p-2",
                        darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                      )}
                    >
                      {socialIcons[icon.toLowerCase()] || <div className="w-5 h-5" />}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Copyright */}
        <div className={cn(
          "pt-8 mt-8 border-t text-center",
          darkMode ? "border-gray-800 text-gray-400" : "border-gray-200 text-gray-500"
        )}>
          <p>&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSectionRenderer;
