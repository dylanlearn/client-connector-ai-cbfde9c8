
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';

interface WireframePreviewSectionProps {
  section: WireframeSection;
  darkMode?: boolean;
  onClick?: () => void;
}

// Helper function to generate placeholder content
const createPlaceholder = (type: string, length: number = 1) => {
  switch (type) {
    case 'heading':
      return 'This is a sample heading';
    case 'paragraph':
      return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.';
    case 'list':
      return Array(length).fill('List item').map((item, i) => `${item} ${i + 1}`);
    case 'image':
      return 'https://via.placeholder.com/800x400?text=Sample+Image';
    case 'button':
      return 'Click Me';
    default:
      return 'Placeholder content';
  }
};

// Generate styles based on section properties
const generateStyles = (section: WireframeSection, darkMode: boolean) => {
  const style = section.style || {};
  const layout = section.layout || {};
  
  return {
    container: cn(
      "section-preview relative",
      {
        "bg-gray-950 text-white": darkMode && !style.backgroundColor,
        "bg-white text-gray-900": !darkMode && !style.backgroundColor
      }
    ),
    innerStyles: {
      backgroundColor: style.backgroundColor || (darkMode ? '#1a1a1a' : '#ffffff'),
      padding: style.padding || '2rem',
      display: layout.type === 'grid' ? 'grid' : 'flex',
      flexDirection: layout.direction || 'column',
      gap: style.gap || '1rem',
      textAlign: style.textAlign as any || 'left',
      alignItems: layout.alignItems || 'stretch',
      justifyContent: layout.justifyContent || 'flex-start',
      minHeight: layout.minHeight || 'auto',
      ...(layout.type === 'grid' && {
        gridTemplateColumns: `repeat(${layout.columns || 1}, 1fr)`,
        gridGap: style.gap || '1rem'
      })
    }
  };
};

const WireframePreviewSection: React.FC<WireframePreviewSectionProps> = ({
  section,
  darkMode = false,
  onClick
}) => {
  const { container, innerStyles } = generateStyles(section, darkMode);
  const copySuggestions = section.copySuggestions || {};
  
  // Handle fallback for incompletely defined sections
  if (!section.sectionType) {
    return (
      <div 
        className={cn("border-2 border-dashed p-6 text-center rounded-md", container)}
        onClick={onClick}
        style={innerStyles}
      >
        <p className="text-muted-foreground">{section.name || 'Unknown section type'}</p>
      </div>
    );
  }
  
  // Render different section types based on sectionType property
  const renderSectionContent = () => {
    switch (section.sectionType.toLowerCase()) {
      case 'hero':
        return (
          <div className="w-full space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold">
              {copySuggestions.heading || createPlaceholder('heading')}
            </h1>
            <p className="text-lg opacity-80">
              {copySuggestions.subheading || createPlaceholder('paragraph')}
            </p>
            {copySuggestions.ctaText && (
              <button 
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                {copySuggestions.ctaText}
              </button>
            )}
          </div>
        );
        
      case 'features':
        return (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                {copySuggestions.heading || "Features"}
              </h2>
              {copySuggestions.subheading && (
                <p className="mt-2 opacity-80">{copySuggestions.subheading}</p>
              )}
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-${section.layout?.columns || 3} gap-6`}>
              {Array(section.layout?.columns || 3).fill(0).map((_, i) => (
                <div key={`feature-${i}`} className="p-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
                  <h3 className="text-lg font-medium mb-2">Feature {i + 1}</h3>
                  <p className="opacity-70">Short description of this feature</p>
                </div>
              ))}
            </div>
          </>
        );
      
      case 'testimonials':
        return (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                {copySuggestions.heading || "Testimonials"}
              </h2>
              {copySuggestions.subheading && (
                <p className="mt-2 opacity-80">{copySuggestions.subheading}</p>
              )}
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-${section.layout?.columns || 2} gap-6`}>
              {Array(section.layout?.columns || 2).fill(0).map((_, i) => (
                <div key={`testimonial-${i}`} className="p-4 border rounded-lg">
                  <p className="italic mb-4">
                    "This is a sample testimonial quote that showcases the product or service."
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">Customer Name</p>
                      <p className="text-sm opacity-70">Position, Company</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      
      case 'cta':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {copySuggestions.heading || "Ready to get started?"}
            </h2>
            {copySuggestions.subheading && (
              <p className="opacity-80">{copySuggestions.subheading}</p>
            )}
            <div className="flex justify-center gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                {copySuggestions.primaryCta || "Get Started"}
              </button>
              {copySuggestions.secondaryCta && (
                <button className="px-6 py-3 bg-transparent border border-current font-medium rounded-md">
                  {copySuggestions.secondaryCta}
                </button>
              )}
            </div>
          </div>
        );
      
      // Add additional section types as needed
        
      default:
        return (
          <div className="w-full text-center">
            <p className="text-muted-foreground">
              Preview not available for {section.sectionType} section type
            </p>
          </div>
        );
    }
  };
  
  return (
    <div 
      className={container}
      onClick={onClick}
      data-section-id={section.id}
      data-section-type={section.sectionType}
    >
      <div style={innerStyles} className="relative w-full">
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default WireframePreviewSection;
