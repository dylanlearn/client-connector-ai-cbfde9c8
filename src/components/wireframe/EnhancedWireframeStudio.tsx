import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import AIWireframeRenderer from './AIWireframeRenderer';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useWireframeStore, WireframeState } from '@/stores/wireframe-store';
import { Button } from '@/components/ui/button';
import { Download, Copy, Edit3, Code2 } from 'lucide-react';
import { exportToHTML } from '@/utils/wireframe/export-utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { v4 as uuidv4 } from 'uuid';

interface EnhancedWireframeStudioProps {
  projectId: string;
  standalone?: boolean;
  initialData?: WireframeData | null;
}

const EnhancedWireframeStudio: React.FC<EnhancedWireframeStudioProps> = ({ 
  projectId,
  standalone = false,
  initialData = null
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('preview');
  const { wireframe, setWireframe, setActiveSection } = useWireframeStore();
  
  // Handle section click
  const handleSectionClick = (sectionId: string, section: any) => {
    setActiveSection(sectionId);
    toast({
      title: `Selected: ${section.name || section.sectionType || 'Section'}`,
      description: "Click the Edit button to modify this section",
      duration: 3000
    });
  };
  
  // Export wireframe to HTML
  const handleExportHTML = async () => {
    const currentWireframe = wireframe || initialData;
    if (!currentWireframe) return;
    
    try {
      // Cast wireframeData to required type with required id property
      const wireframeData: WireframeData = {
        id: currentWireframe.id || '',
        title: currentWireframe.title || '',
        sections: currentWireframe.sections || [],
        // Include other required properties from WireframeData
        ...currentWireframe
      };
      
      const html = await exportToHTML(wireframeData);
      
      // Create a blob and download link
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${wireframeData.title || 'wireframe'}-export.html`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "HTML Export Complete",
        description: "Your wireframe has been exported as HTML"
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export wireframe to HTML",
        variant: "destructive"
      });
    }
  };
  
  // Copy wireframe JSON
  const handleCopyJSON = () => {
    const currentWireframe = wireframe || initialData;
    if (!currentWireframe) return;
    
    try {
      const json = JSON.stringify(currentWireframe, null, 2);
      navigator.clipboard.writeText(json);
      
      toast({
        title: "JSON Copied",
        description: "Wireframe JSON has been copied to clipboard"
      });
    } catch (error) {
      console.error("Copy error:", error);
      toast({
        title: "Copy Failed",
        description: "Could not copy wireframe JSON",
        variant: "destructive"
      });
    }
  };
  
  // Update wireframe when initialData changes
  useEffect(() => {
    if (initialData) {
      // Convert the wireframe data to the appropriate format
      const { id, title, sections, description, colorScheme, typography, style, styleToken, designTokens } = initialData;
      
      // Prepare properly shaped data for the wireframe store
      const wireframeData: Partial<WireframeData> = {
        id: id || uuidv4(),
        title: title || 'New Wireframe',
        description: description,
        // Ensure sections have the right properties
        sections: (sections || []).map(section => ({
          ...section,
          // Ensure copySuggestions has the right format
          copySuggestions: Array.isArray(section.copySuggestions) 
            ? section.copySuggestions
            : section.copySuggestions ? [section.copySuggestions] : [],
          // Ensure animationSuggestions is an array
          animationSuggestions: Array.isArray(section.animationSuggestions)
            ? section.animationSuggestions
            : section.animationSuggestions ? [section.animationSuggestions] : []
        })),
        // Ensure colorScheme has the right shape
        colorScheme: {
          primary: colorScheme?.primary || '#3b82f6',
          secondary: colorScheme?.secondary || '#10b981',
          accent: colorScheme?.accent || '#f59e0b',
          background: colorScheme?.background || '#ffffff',
          text: colorScheme?.text || '#111827'
        },
        // Ensure typography has the right shape
        typography: {
          headings: typography?.headings || 'Inter',
          body: typography?.body || 'Inter',
          fontPairings: typography?.fontPairings || []
        },
        style: style || styleToken,
        styleToken: styleToken || style,
        designTokens: designTokens || {}
      };
      
      setWireframe(wireframeData);
    }
  }, [initialData, setWireframe]);
  
  // Get the effective wireframe data
  const effectiveWireframe = wireframe || initialData;
  
  // Cast the effective wireframe to ensure it has required properties for WireframeData
  const safeWireframe: WireframeData | null = effectiveWireframe ? {
    id: effectiveWireframe.id || '',
    title: effectiveWireframe.title || '',
    sections: effectiveWireframe.sections || [],
    // Include other required properties
    ...effectiveWireframe
  } : null;
  
  return (
    <TooltipProvider>
      <div className="enhanced-wireframe-studio">
        <div className="flex items-center justify-between mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleExportHTML}>
                  <Download className="h-4 w-4 mr-1" />
                  Export HTML
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyJSON}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy JSON
                </Button>
                {standalone && (
                  <Button variant="outline" size="sm" className="gap-1">
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
            
            <TabsContent value="preview" className="mt-0">
              <AIWireframeRenderer 
                wireframe={safeWireframe} 
                onSectionClick={handleSectionClick}
                className="w-full"
              />
            </TabsContent>
            
            <TabsContent value="code" className="mt-0">
              <Card className="overflow-hidden">
                <div className="p-4 bg-muted flex items-center justify-between">
                  <div className="flex items-center">
                    <Code2 className="h-4 w-4 mr-2" />
                    <span className="font-medium">Generated Code</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleExportHTML}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                <div className="p-4 max-h-[600px] overflow-auto bg-black text-gray-300 font-mono text-sm">
                  {safeWireframe ? (
                    <pre>{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeWireframe.title || 'Wireframe'}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
  <!-- Generated wireframe HTML would appear here -->
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold my-4">${safeWireframe.title || 'Wireframe'}</h1>
    
    ${safeWireframe.sections.map(section => `
    <!-- ${section.name || section.sectionType || 'Section'} -->
    <section class="my-8">
      <h2 class="text-xl font-semibold mb-4">${section.name || ''}</h2>
      <!-- Section content would be here -->
    </section>
    `).join('')}
  </div>
</body>
</html>`}</pre>
                  ) : (
                    <p>No wireframe data available</p>
                  )}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="data" className="mt-0">
              <Card className="overflow-hidden">
                <div className="p-4 bg-muted flex items-center justify-between">
                  <div className="flex items-center">
                    <Code2 className="h-4 w-4 mr-2" />
                    <span className="font-medium">Wireframe Data</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCopyJSON}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy JSON
                  </Button>
                </div>
                <div className="p-4 max-h-[600px] overflow-auto bg-black text-gray-300 font-mono text-sm">
                  {safeWireframe ? (
                    <pre>{JSON.stringify(safeWireframe, null, 2)}</pre>
                  ) : (
                    <p>No wireframe data available</p>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EnhancedWireframeStudio;
