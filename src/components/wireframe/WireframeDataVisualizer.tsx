
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Code, Copy, Layout as LayoutIcon, Navigation, Image, Users, MessageCircle, CreditCard, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WireframeDataVisualizerProps {
  wireframeData: any;
  title?: string;
  description?: string;
  viewMode?: 'preview' | 'flowchart' | string;
  deviceType?: 'desktop' | 'mobile' | 'tablet' | string;
  darkMode?: boolean;
  showGrid?: boolean;
  highlightSections?: boolean;
  activeSection?: string | null;
}

const WireframeDataVisualizer: React.FC<WireframeDataVisualizerProps> = ({
  wireframeData,
  title = 'Wireframe Data',
  description = 'JSON representation of the wireframe structure',
  viewMode = 'preview',
  deviceType = 'desktop',
  darkMode = false,
  showGrid = false,
  highlightSections = false,
  activeSection = null
}) => {
  const [activeTab, setActiveTab] = useState('preview');

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(wireframeData, null, 2));
  };

  // Apply dark mode class if enabled
  const containerClass = darkMode ? 'bg-gray-900 text-gray-100' : '';
  
  // Apply grid overlay if showGrid is enabled
  const gridClass = showGrid ? 'bg-grid-pattern' : '';
  
  // Apply highlight style for sections if highlightSections is enabled
  const sectionClass = highlightSections ? 'border-2 border-blue-400' : 'border';

  // Helper function to get icon for section type
  const getSectionIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'hero':
        return <LayoutIcon className="h-4 w-4" />;
      case 'navigation':
      case 'navbar':
      case 'header':
        return <Navigation className="h-4 w-4" />;
      case 'features':
        return <CheckSquare className="h-4 w-4" />;
      case 'testimonials':
        return <Users className="h-4 w-4" />;
      case 'gallery':
      case 'portfolio':
        return <Image className="h-4 w-4" />;
      case 'faq':
        return <MessageCircle className="h-4 w-4" />;
      case 'pricing':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <LayoutIcon className="h-4 w-4" />;
    }
  };

  // Render a visual representation of the section based on its type
  const renderSectionVisual = (section: any) => {
    const type = section.sectionType || section.type || 'default';
    
    switch (type.toLowerCase()) {
      case 'hero':
        return (
          <div className="space-y-2">
            <div className="h-10 bg-primary/10 rounded-md flex items-center justify-center">
              <span className="font-bold text-lg">{section.name || 'Hero Title'}</span>
            </div>
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex gap-2 mt-2">
              <div className="h-8 w-24 bg-primary rounded-md flex items-center justify-center">
                <span className="text-xs text-white">Primary CTA</span>
              </div>
              <div className="h-8 w-24 bg-secondary/20 rounded-md flex items-center justify-center">
                <span className="text-xs">Secondary</span>
              </div>
            </div>
          </div>
        );
      
      case 'navigation':
      case 'navbar':
      case 'header':
        return (
          <div className="h-10 bg-muted rounded-md flex items-center justify-between px-3">
            <div className="w-24 h-5 bg-primary/20 rounded"></div>
            <div className="flex gap-3">
              <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="w-20 h-6 bg-primary/20 rounded-md"></div>
          </div>
        );
      
      case 'features':
        return (
          <div className="space-y-2">
            <div className="h-8 w-2/3 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <span className="font-medium text-sm">{section.name || 'Features'}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-4/5 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'testimonials':
        return (
          <div className="space-y-2">
            <div className="h-8 w-1/2 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <span className="font-medium text-sm">{section.name || 'Testimonials'}</span>
            </div>
            <div className="flex gap-4 mt-2">
              {[1, 2].map(i => (
                <div key={i} className="flex-1 border rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    <div className="space-y-1">
                      <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-16 h-2 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'pricing':
        return (
          <div className="space-y-2">
            <div className="h-8 w-1/2 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <span className="font-medium text-sm">{section.name || 'Pricing'}</span>
            </div>
            <div className="flex gap-4 mt-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={cn(
                  "flex-1 border rounded-md p-3", 
                  i === 2 ? "border-primary/50 ring-1 ring-primary/30" : ""
                )}>
                  <div className="space-y-2">
                    <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex items-end gap-1">
                      <div className="h-6 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="pt-2 border-t mt-2">
                      <div className="space-y-1 mb-4">
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                      <div className="h-7 bg-primary rounded-md flex items-center justify-center">
                        <span className="text-xs text-white">Select Plan</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'faq':
        return (
          <div className="space-y-2">
            <div className="h-8 w-1/2 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center mb-2">
              <span className="font-medium text-sm">{section.name || 'FAQs'}</span>
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div className="w-3/4 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">+</div>
                </div>
                {i === 1 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-4/5 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'cta':
      case 'call to action':
        return (
          <div className="bg-primary/10 p-4 rounded-lg flex flex-col items-center">
            <div className="w-3/4 h-5 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
            <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-8 w-32 bg-primary rounded-md flex items-center justify-center">
              <span className="text-xs text-white">Call to Action</span>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="border rounded p-3">
            <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="space-y-1">
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
              <div className="w-3/4 h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className={containerClass}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="json">
              <Code className="h-4 w-4 mr-2" />
              JSON Data
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview">
            <div className={`space-y-6 ${gridClass}`}>
              {/* Header/Title Section */}
              {wireframeData.title && (
                <div className="text-center py-4">
                  <h2 className="text-2xl font-bold mb-2">{wireframeData.title}</h2>
                  {wireframeData.description && (
                    <p className="text-muted-foreground max-w-2xl mx-auto">{wireframeData.description}</p>
                  )}
                </div>
              )}
              
              {/* Sections Visual Rendering */}
              {wireframeData.sections && wireframeData.sections.length > 0 && (
                <div className="space-y-8 pb-4">
                  {wireframeData.sections.map((section: any, index: number) => (
                    <div 
                      key={section.id || index} 
                      className={cn(
                        "rounded-lg p-4",
                        sectionClass,
                        activeSection === section.id ? "ring-2 ring-primary" : ""
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {getSectionIcon(section.sectionType || section.type)}
                          <h4 className="font-medium">{section.name || `Section ${index + 1}`}</h4>
                        </div>
                        {section.sectionType && (
                          <Badge variant="outline">{section.sectionType}</Badge>
                        )}
                      </div>
                      
                      {/* Visual representation of the section */}
                      <div className="mt-3">
                        {renderSectionVisual(section)}
                      </div>
                      
                      {section.description && (
                        <p className="text-sm text-muted-foreground mt-4 pt-3 border-t">
                          {section.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Components Visual Rendering */}
              {wireframeData.components && wireframeData.components.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-sm mb-2">Components</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {wireframeData.components.map((component: any, index: number) => (
                      <div key={component.id || index} className={`rounded-md p-3 ${sectionClass}`}>
                        <h4 className="font-medium flex items-center gap-2">
                          {getSectionIcon(component.type)}
                          {component.name || `Component ${index + 1}`}
                        </h4>
                        {component.type && (
                          <Badge variant="secondary" className="mt-1">{component.type}</Badge>
                        )}
                        <div className="mt-2 h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Component Preview</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="json">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] text-xs">
                {JSON.stringify(wireframeData, null, 2)}
              </pre>
              <Button 
                size="sm" 
                variant="ghost" 
                className="absolute top-2 right-2" 
                onClick={handleCopyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WireframeDataVisualizer;
