
import React from "react";
import { ParsedTypography } from "./types";

interface TypographyDisplayProps {
  typography: ParsedTypography[];
}

const TypographyDisplay = ({ typography }: TypographyDisplayProps) => {
  if (!typography || typography.length === 0) {
    return null;
  }
  
  // Group by type
  const headings = typography.filter(t => t.type === 'heading');
  const bodyFonts = typography.filter(t => t.type === 'body');
  const accentFonts = typography.filter(t => t.type === 'accent');
  
  const renderFontSample = (font: ParsedTypography) => {
    const fontFamily = `${font.name}, ${font.type === 'heading' ? 'sans-serif' : font.type === 'body' ? 'serif' : 'monospace'}`;
    
    if (font.type === 'heading') {
      return (
        <div className="space-y-2">
          <h3 style={{ fontFamily }} className="text-xl font-bold">
            Heading Sample: {font.name}
          </h3>
          <p className="text-sm text-muted-foreground">{font.description}</p>
        </div>
      );
    } else if (font.type === 'body') {
      return (
        <div className="space-y-2">
          <p style={{ fontFamily }} className="text-base">
            Body text sample in {font.name}. This shows how paragraphs will look with this font.
          </p>
          <p className="text-sm text-muted-foreground">{font.description}</p>
        </div>
      );
    } else {
      return (
        <div className="space-y-2">
          <span style={{ fontFamily }} className="text-lg font-medium">
            Accent Text: {font.name}
          </span>
          <p className="text-sm text-muted-foreground">{font.description}</p>
        </div>
      );
    }
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Typography</h3>
      <div className="space-y-4 border rounded-md p-4 bg-muted/20">
        {headings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">HEADINGS</h4>
            <div className="space-y-3">
              {headings.map((font, index) => (
                <div key={index} className="border-l-2 border-primary pl-3">
                  {renderFontSample(font)}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {bodyFonts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">BODY TEXT</h4>
            <div className="space-y-3">
              {bodyFonts.map((font, index) => (
                <div key={index} className="border-l-2 border-primary/70 pl-3">
                  {renderFontSample(font)}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {accentFonts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">ACCENT TEXT</h4>
            <div className="space-y-3">
              {accentFonts.map((font, index) => (
                <div key={index} className="border-l-2 border-primary/50 pl-3">
                  {renderFontSample(font)}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {typography.length === 0 && (
          <p className="text-muted-foreground italic">No specific typography suggestions found.</p>
        )}
      </div>
    </div>
  );
};

export default TypographyDisplay;
