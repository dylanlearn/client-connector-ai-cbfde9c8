
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getScaleName } from './font-constants';

export interface TypographyPreviewProps {
  headingFont: string;
  bodyFont: string;
  scaleRatio: number;
  lineHeights: {
    heading: number;
    body: number;
  };
  className?: string;
}

/**
 * Typography Preview - Shows a comprehensive preview of typography settings
 */
export const TypographyPreview: React.FC<TypographyPreviewProps> = ({
  headingFont,
  bodyFont,
  scaleRatio = 1.25,
  lineHeights = { heading: 1.1, body: 1.5 },
  className
}) => {
  const scaleName = getScaleName(scaleRatio);
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Typography Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <section className="space-y-1">
          <p className="text-muted-foreground text-sm">Headings: {headingFont}</p>
          <p className="text-muted-foreground text-sm">Body: {bodyFont}</p>
          <p className="text-muted-foreground text-sm">Scale: {scaleName} ({scaleRatio})</p>
        </section>
      
        <div className="space-y-6 border-t pt-6">
          <div className="space-y-2">
            <h1 
              style={{ 
                fontFamily: headingFont,
                lineHeight: lineHeights.heading,
              }} 
              className="text-4xl font-bold"
            >
              H1: The Quick Brown Fox
            </h1>
            <div className="text-xs text-muted-foreground">
              Font: {headingFont} | Line-height: {lineHeights.heading}x
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 
              style={{ 
                fontFamily: headingFont,
                lineHeight: lineHeights.heading,
              }} 
              className="text-3xl font-bold"
            >
              H2: The Quick Brown Fox
            </h2>
            <div className="text-xs text-muted-foreground">
              Font: {headingFont} | Line-height: {lineHeights.heading}x
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 
              style={{ 
                fontFamily: headingFont,
                lineHeight: lineHeights.heading,
              }} 
              className="text-2xl font-bold"
            >
              H3: The Quick Brown Fox
            </h3>
            <div className="text-xs text-muted-foreground">
              Font: {headingFont} | Line-height: {lineHeights.heading}x
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 
              style={{ 
                fontFamily: headingFont,
                lineHeight: lineHeights.heading,
              }} 
              className="text-xl font-bold"
            >
              H4: The Quick Brown Fox
            </h4>
            <div className="text-xs text-muted-foreground">
              Font: {headingFont} | Line-height: {lineHeights.heading}x
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6 space-y-6">
          <div className="space-y-2">
            <p 
              style={{ 
                fontFamily: bodyFont,
                lineHeight: lineHeights.body,
              }} 
              className="text-lg"
            >
              Large paragraph: Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing.
            </p>
            <div className="text-xs text-muted-foreground">
              Font: {bodyFont} | Line-height: {lineHeights.body}x
            </div>
          </div>
          
          <div className="space-y-2">
            <p 
              style={{ 
                fontFamily: bodyFont,
                lineHeight: lineHeights.body,
              }} 
              className="text-base"
            >
              Base paragraph: Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing. The term typography is also applied to the style, arrangement, and appearance of the letters, numbers, and symbols.
            </p>
            <div className="text-xs text-muted-foreground">
              Font: {bodyFont} | Line-height: {lineHeights.body}x
            </div>
          </div>
          
          <div className="space-y-2">
            <p 
              style={{ 
                fontFamily: bodyFont,
                lineHeight: lineHeights.body,
              }} 
              className="text-sm"
            >
              Small paragraph: Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.
            </p>
            <div className="text-xs text-muted-foreground">
              Font: {bodyFont} | Line-height: {lineHeights.body}x
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="p-4 border rounded-md" style={{ fontFamily: bodyFont }}>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: headingFont, lineHeight: lineHeights.heading }}>
              Combined Example
            </h3>
            <p className="mb-4" style={{ lineHeight: lineHeights.body }}>
              This example shows how headings and body text work together with your selected fonts, sizes, and line heights. Good typography enhances readability and creates visual hierarchy.
            </p>
            <h4 className="text-lg font-bold mb-2" style={{ fontFamily: headingFont, lineHeight: lineHeights.heading }}>
              Secondary Heading
            </h4>
            <p style={{ lineHeight: lineHeights.body }}>
              The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
