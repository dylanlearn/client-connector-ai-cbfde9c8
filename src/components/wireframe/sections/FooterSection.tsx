
import React from 'react';
import { FooterComponentProps } from '@/types/component-library';
import { cn } from '@/lib/utils';

interface FooterSectionProps {
  sectionIndex?: number;
  data?: FooterComponentProps;
  variant?: string;
  className?: string;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ 
  sectionIndex = 0,
  data,
  variant = 'footer-startup-001',
  className
}) => {
  // Default footer data if none provided
  const footerData: Partial<FooterComponentProps> = data || {
    variant,
    columns: [
      {
        heading: "Product",
        links: [
          { label: "Features", url: "/features" },
          { label: "Pricing", url: "/pricing" }
        ]
      },
      {
        heading: "Company",
        links: [
          { label: "About", url: "/about" },
          { label: "Contact", url: "/contact" }
        ]
      }
    ],
    newsletter: {
      placeholder: "Your email",
      ctaLabel: "Subscribe"
    },
    alignment: 'center',
    backgroundStyle: 'light',
    showSocialIcons: true,
    showLegalLinks: true
  };
  
  // Determine background class based on style
  const getBgClass = () => {
    switch (footerData.backgroundStyle) {
      case 'dark': 
        return 'bg-gray-900 text-white';
      case 'light': 
        return 'bg-gray-50 text-gray-800';
      case 'gradient':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
      case 'image':
        return 'bg-gray-800 bg-opacity-75 text-white';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };
  
  // Determine alignment class
  const getAlignmentClass = () => {
    switch (footerData.alignment) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };
  
  return (
    <div 
      key={sectionIndex} 
      className={cn(
        'border-2 border-dashed border-gray-300 rounded-lg p-4',
        getBgClass(),
        getAlignmentClass(),
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo and Company Info */}
          <div className="space-y-4">
            <div className="w-20 h-8 bg-gray-300 rounded mx-auto md:mx-0"></div>
            <div className="space-y-2">
              <div className="w-4/5 h-3 bg-gray-200 bg-opacity-30 rounded mx-auto md:mx-0"></div>
              <div className="w-3/4 h-3 bg-gray-200 bg-opacity-30 rounded mx-auto md:mx-0"></div>
            </div>
            
            {/* Social Icons */}
            {footerData.showSocialIcons && (
              <div className="flex space-x-2 justify-center md:justify-start">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-30"></div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer Columns */}
          {footerData.columns?.map((column, idx) => (
            <div key={idx} className="space-y-3">
              <div className="w-24 h-6 bg-gray-300 bg-opacity-30 rounded mx-auto md:mx-0">{column.heading}</div>
              <div className="space-y-2">
                {column.links.map((link, linkIdx) => (
                  <div key={linkIdx} className="w-4/5 h-3 bg-gray-200 bg-opacity-30 rounded mx-auto md:mx-0"></div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Newsletter */}
          {footerData.newsletter && (
            <div className="space-y-3">
              <div className="w-32 h-6 bg-gray-300 bg-opacity-30 rounded mx-auto md:mx-0">Newsletter</div>
              <div className="flex flex-col space-y-2">
                <div className="w-full h-10 bg-gray-200 bg-opacity-30 rounded"></div>
                <div className="w-24 h-10 bg-blue-500 rounded mx-auto md:mx-0"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Legal Links */}
        {footerData.showLegalLinks && (
          <div className="border-t border-gray-200 border-opacity-20 mt-6 pt-4 text-center">
            <div className="w-48 h-3 bg-gray-200 bg-opacity-30 rounded mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterSection;
