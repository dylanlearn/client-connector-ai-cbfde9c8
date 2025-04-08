
import React from 'react';
import { NavigationComponentProps } from '@/types/component-library';
import { navigationVariants } from '@/data/component-library-variants-navigation';
import { cn } from '@/lib/utils';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationRendererProps {
  variant: string;
  data?: Partial<NavigationComponentProps>;
  className?: string;
  darkMode?: boolean;
}

export const NavigationRenderer: React.FC<NavigationRendererProps> = ({
  variant = 'nav-startup-001',
  data,
  className,
  darkMode = false,
}) => {
  // Find the base variant configuration
  const baseVariant = navigationVariants.find(v => v.variant === variant) || navigationVariants[0];
  
  // Merge provided data with base variant
  const navigationData: NavigationComponentProps = {
    ...baseVariant,
    ...data,
    variant: variant || baseVariant.variant,
    links: data?.links || baseVariant.links,
    cta: data?.cta || baseVariant.cta,
    backgroundStyle: data?.backgroundStyle || baseVariant.backgroundStyle,
    alignment: data?.alignment || baseVariant.alignment,
  };

  // Determine background class based on style
  const getBgClass = () => {
    switch (navigationData.backgroundStyle) {
      case 'dark': 
        return 'bg-gray-900 text-white';
      case 'light': 
        return 'bg-white text-gray-800 border-b border-gray-200';
      case 'glass': 
        return 'bg-white/70 backdrop-blur-md text-gray-800 border-b border-gray-200/50';
      case 'transparent': 
        return 'bg-transparent text-gray-800';
      case 'gradient':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
      case 'image':
        return 'bg-gray-800 bg-opacity-75 text-white';
      default:
        return 'bg-white text-gray-800';
    }
  };
  
  // Determine alignment class for links
  const getAlignmentClass = () => {
    switch (navigationData.alignment) {
      case 'left': return 'justify-start';
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      default: return 'justify-between';
    }
  };

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  return (
    <div 
      className={cn(
        getBgClass(),
        navigationData.sticky ? 'sticky top-0 z-50' : '',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {navigationData.logo ? (
              <img 
                src={navigationData.logo} 
                alt="Logo" 
                className="h-8 w-auto"
              />
            ) : (
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>
          
          {/* Navigation Links - Desktop */}
          <div className={`hidden md:flex items-center space-x-4 ${getAlignmentClass()}`}>
            {navigationData.links?.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  link.isPrimary 
                    ? 'text-white bg-primary hover:bg-primary/90' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {link.label}
              </a>
            ))}
            
            {/* Search */}
            {navigationData.hasSearch && (
              <div className="relative">
                <div className="flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                  <span className="sr-only">Search</span>
                </div>
              </div>
            )}
            
            {/* CTA Button */}
            {navigationData.cta && (
              <Button
                asChild
                variant={
                  navigationData.backgroundStyle === 'dark' ||
                  navigationData.backgroundStyle === 'gradient' ||
                  navigationData.backgroundStyle === 'image'
                    ? 'outline'
                    : 'default'
                }
                className="ml-4"
              >
                <a href={navigationData.cta.url}>{navigationData.cta.label}</a>
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${navigationData.mobileMenuStyle === 'overlay' ? 'fixed inset-0 z-50 bg-black/50' : 'relative'}`}>
          <div className={`
            ${navigationData.mobileMenuStyle === 'drawer' ? 'fixed inset-y-0 left-0 w-64' : 'relative w-full'} 
            ${getBgClass()} p-4
          `}>
            {navigationData.mobileMenuStyle === 'drawer' && (
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
            
            <div className="space-y-2 pt-2 pb-4">
              {navigationData.links?.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {link.label}
                </a>
              ))}
              
              {/* Search */}
              {navigationData.hasSearch && (
                <div className="px-3 py-2">
                  <div className="flex items-center px-2 py-1 border rounded-md">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Search...</span>
                  </div>
                </div>
              )}
              
              {/* CTA Button */}
              {navigationData.cta && (
                <div className="px-3 pt-2">
                  <Button
                    asChild
                    className="w-full"
                  >
                    <a href={navigationData.cta.url}>{navigationData.cta.label}</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationRenderer;
