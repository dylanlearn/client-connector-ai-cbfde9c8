
import React from "react";
import { Layout } from "lucide-react";

interface LayoutSuggestionsProps {
  layouts: string[];
}

const LayoutSuggestions = ({ layouts }: LayoutSuggestionsProps) => {
  if (!layouts || layouts.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Layout Suggestions</h3>
      <div className="border rounded-md p-4 bg-muted/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {layouts.map((layout, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-3 p-3 border rounded-md bg-background"
            >
              <Layout className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">{layout}</p>
              </div>
            </div>
          ))}
        </div>
        
        {layouts.length === 0 && (
          <p className="text-muted-foreground italic">No specific layout suggestions found.</p>
        )}
      </div>
    </div>
  );
};

export default LayoutSuggestions;
