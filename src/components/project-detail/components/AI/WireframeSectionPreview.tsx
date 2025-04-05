
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WireframeSectionPreviewProps {
  section: WireframeSection;
  className?: string;
}

const WireframeSectionPreview: React.FC<WireframeSectionPreviewProps> = ({ section, className }) => {
  // Helper function to render a component representation based on type
  const renderComponent = (component: any, index: number) => {
    switch (component.type) {
      case 'heading':
      case 'h1':
      case 'h2':
      case 'h3':
        return (
          <div key={index} className="py-2">
            <div className="h-7 bg-gray-300 rounded-md w-3/4 max-w-md"></div>
          </div>
        );
        
      case 'paragraph':
      case 'text':
        return (
          <div key={index} className="py-2">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded-md w-full"></div>
              <div className="h-3 bg-gray-200 rounded-md w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded-md w-4/6"></div>
            </div>
          </div>
        );
        
      case 'image':
      case 'img':
        return (
          <div key={index} className="py-2">
            <div className="h-32 bg-gray-200 rounded-md w-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          </div>
        );
        
      case 'button':
      case 'cta':
        return (
          <div key={index} className="py-2">
            <div className="h-10 bg-gray-400 rounded-md w-32 flex items-center justify-center">
              <div className="h-3 bg-white rounded-md w-16"></div>
            </div>
          </div>
        );
        
      case 'form':
        return (
          <div key={index} className="py-2 space-y-2">
            <div className="h-10 bg-gray-100 border border-gray-300 rounded-md w-full"></div>
            <div className="h-10 bg-gray-100 border border-gray-300 rounded-md w-full"></div>
            <div className="h-10 bg-gray-400 rounded-md w-32"></div>
          </div>
        );
        
      case 'grid':
      case 'features':
        return (
          <div key={index} className="py-2">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-2 items-center">
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div className="h-3 bg-gray-200 rounded-md w-16"></div>
                  <div className="h-2 bg-gray-200 rounded-md w-full"></div>
                  <div className="h-2 bg-gray-200 rounded-md w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return (
          <div key={index} className="py-1">
            <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          </div>
        );
    }
  };

  const layoutClass = section.layout?.type === 'centered' 
    ? 'items-center text-center' 
    : section.layout?.type === 'right' 
      ? 'items-end text-right' 
      : 'items-start';

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{section.name}</CardTitle>
          <Badge variant="outline">{section.sectionType || 'Section'}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("flex flex-col", layoutClass)}>
          {section.components?.map(renderComponent)}
        </div>
      </CardContent>
    </Card>
  );
};

export default WireframeSectionPreview;
