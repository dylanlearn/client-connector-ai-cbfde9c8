
import React from 'react';
import { Button } from '@/components/ui/button';

interface WireframeAISuggestionsProps {
  onClose: () => void;
}

const WireframeAISuggestions: React.FC<WireframeAISuggestionsProps> = ({ onClose }) => {
  // Mock data for AI suggestions
  const sectionSuggestions = [
    {
      name: "Testimonials",
      description: "Customer reviews and testimonials",
      sectionType: "testimonials",
      layoutType: "grid"
    },
    {
      name: "Features Grid",
      description: "Grid layout showcasing key features",
      sectionType: "features",
      layoutType: "grid"
    },
    {
      name: "FAQ Accordion",
      description: "Frequently asked questions in accordion format",
      sectionType: "faq",
      layoutType: "accordion"
    }
  ];

  const componentSuggestions = [
    {
      type: "button",
      content: "Call to Action"
    },
    {
      type: "image",
      content: "Hero Image"
    },
    {
      type: "text",
      content: "Heading Text"
    }
  ];

  const handleUseSuggestion = () => {
    // Mock implementation for using a suggestion
    console.log("Using AI suggestion");
    onClose();
  };

  // Ensure each component has an id
  const componentsWithIds = componentSuggestions.map((component, index) => ({
    ...component,
    id: `suggestion-component-${index}`
  }));

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">AI Suggestions</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium mb-2">Section Suggestions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sectionSuggestions.map((section, index) => (
              <div 
                key={`section-${index}`} 
                className="p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                onClick={handleUseSuggestion}
              >
                <h5 className="font-medium">{section.name}</h5>
                <p className="text-sm text-muted-foreground">{section.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">{section.sectionType}</span>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">{section.layoutType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium mb-2">Component Suggestions</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {componentsWithIds.map((component) => (
              <div 
                key={component.id} 
                className="p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                onClick={handleUseSuggestion}
              >
                <h5 className="font-medium capitalize">{component.type}</h5>
                <p className="text-sm text-muted-foreground">{component.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default WireframeAISuggestions;
