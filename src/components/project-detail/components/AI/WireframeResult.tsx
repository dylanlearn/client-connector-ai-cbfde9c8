
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Download, ThumbsUp, ThumbsDown, Copy, Palette, Type, Layers } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-service';
import { toast } from 'sonner';

interface WireframeResultProps {
  wireframe: WireframeData;
  onSave?: () => void;
  onFeedback?: (isPositive: boolean) => void;
}

const WireframeResult: React.FC<WireframeResultProps> = ({ 
  wireframe,
  onSave,
  onFeedback
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{wireframe.title}</CardTitle>
            <CardDescription className="mt-1">{wireframe.description}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onFeedback && onFeedback(true)}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onFeedback && onFeedback(false)}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <Layers className="h-4 w-4 mr-2 text-primary" />
                <h3 className="font-medium">Layout Structure</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto h-7 w-7 p-0"
                  onClick={() => copyToClipboard(wireframe.layout)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-700">{wireframe.layout}</p>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center mb-2">
                <Palette className="h-4 w-4 mr-2 text-primary" />
                <h3 className="font-medium">Color Scheme</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto h-7 w-7 p-0"
                  onClick={() => copyToClipboard(wireframe.colorScheme)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-700">{wireframe.colorScheme}</p>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center mb-2">
                <Type className="h-4 w-4 mr-2 text-primary" />
                <h3 className="font-medium">Typography</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto h-7 w-7 p-0"
                  onClick={() => copyToClipboard(wireframe.typography)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-700">{wireframe.typography}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-6">
              <h3 className="font-medium">Sections</h3>
              
              {wireframe.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{section.name}</h4>
                    <Badge variant="outline">{`Section ${sectionIndex + 1}`}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{section.description}</p>
                  
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-600">Components</h5>
                    {section.components.map((component, componentIndex) => (
                      <div key={componentIndex} className="pl-3 border-l-2 border-gray-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-sm font-medium">{component.type}</span>
                            <p className="text-sm text-gray-700">{component.content}</p>
                            {component.style && (
                              <p className="text-xs text-gray-500 mt-1">Style: {component.style}</p>
                            )}
                            {component.position && (
                              <p className="text-xs text-gray-500">Position: {component.position}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline"
          onClick={() => copyToClipboard(JSON.stringify(wireframe, null, 2))}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy All
        </Button>
        
        {onSave && (
          <Button onClick={onSave}>
            <Download className="h-4 w-4 mr-2" />
            Save Wireframe
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WireframeResult;
