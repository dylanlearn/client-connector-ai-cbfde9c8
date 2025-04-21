
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Check, FileText, AlertCircle } from 'lucide-react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { useContentGeneration } from '@/hooks/ai/use-content-generation';

// Define types for our component
export interface ContentGenerationPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

// Define valid tone and length options to fix type errors
type ContentTone = "professional" | "friendly" | "enthusiastic" | "technical" | "formal";
type ContentLength = "brief" | "moderate" | "detailed";

const ContentGenerationPanel: React.FC<ContentGenerationPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('wireframe');
  const [contentTone, setContentTone] = useState<ContentTone>("professional");
  const [contentLength, setContentLength] = useState<ContentLength>("moderate");
  
  const { 
    generateContent,
    generateSectionContent,
    generatePlaceholderText,
    isGenerating,
    generationResult,
    error,
    clearResults
  } = useContentGeneration();
  
  // Find the selected section from the wireframe
  const selectedSection = wireframe.sections.find(
    section => section.id === selectedSectionId
  );
  
  // Reset selected section if sections change
  useEffect(() => {
    if (wireframe.sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(wireframe.sections[0].id);
    } else if (!wireframe.sections.find(s => s.id === selectedSectionId)) {
      setSelectedSectionId(wireframe.sections.length > 0 ? wireframe.sections[0].id : null);
    }
  }, [wireframe.sections, selectedSectionId]);
  
  // Generate content for the entire wireframe
  const handleGenerateFullContent = useCallback(async () => {
    const result = await generateContent({
      wireframe,
      tone: contentTone,
      length: contentLength
    });
    
    if (result && !error) {
      const updatedWireframe = {
        ...wireframe,
        sections: wireframe.sections.map(section => {
          const sectionContent = result.sectionContent.find(
            content => content.sectionId === section.id
          );
          
          if (sectionContent) {
            return {
              ...section,
              components: section.components.map(component => {
                const componentContent = sectionContent.content[component.id];
                if (componentContent) {
                  return {
                    ...component,
                    content: componentContent.text || component.content,
                    // Apply other properties if available
                    ...(componentContent.props && { props: {
                      ...component.props,
                      ...componentContent.props
                    }}),
                  };
                }
                return component;
              }),
              // Apply section-level content if available
              ...(sectionContent.heading && { name: sectionContent.heading }),
              ...(sectionContent.description && { description: sectionContent.description }),
            };
          }
          return section;
        })
      };
      
      onUpdateWireframe(updatedWireframe);
    }
  }, [wireframe, contentTone, contentLength, generateContent, error, onUpdateWireframe]);
  
  // Generate content for a specific section
  const handleGenerateSectionContent = useCallback(async () => {
    if (!selectedSectionId) return;
    
    const sectionToUpdate = wireframe.sections.find(s => s.id === selectedSectionId);
    if (!sectionToUpdate) return;
    
    const result = await generateSectionContent({
      wireframe,
      section: sectionToUpdate,
      tone: contentTone,
      length: contentLength
    });
    
    if (result && !error) {
      const updatedWireframe = {
        ...wireframe,
        sections: wireframe.sections.map(section => {
          if (section.id === selectedSectionId && result.content) {
            const updatedComponents = section.components.map(component => {
              const componentContent = result.content[component.id];
              if (componentContent) {
                return {
                  ...component,
                  content: componentContent.text || component.content,
                  // Apply other properties if available
                  ...(componentContent.props && { props: {
                    ...component.props,
                    ...componentContent.props
                  }}),
                };
              }
              return component;
            });
            
            return {
              ...section,
              components: updatedComponents,
              // Apply section-level content if available
              ...(result.heading && { name: result.heading }),
              ...(result.description && { description: result.description }),
            };
          }
          return section;
        })
      };
      
      onUpdateWireframe(updatedWireframe);
    }
  }, [wireframe, selectedSectionId, contentTone, contentLength, generateSectionContent, error, onUpdateWireframe]);
  
  return (
    <div className="content-generation-panel">
      <div className="flex mb-4">
        <Select 
          value={contentTone} 
          onValueChange={(value: ContentTone) => setContentTone(value)}
        >
          <SelectTrigger className="w-[180px] mr-2">
            <SelectValue placeholder="Content Tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={contentLength} 
          onValueChange={(value: ContentLength) => setContentLength(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Content Length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brief">Brief</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="detailed">Detailed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="wireframe" className="flex-1">Full Wireframe</TabsTrigger>
          <TabsTrigger value="section" className="flex-1">Section Specific</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wireframe">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generate Content for All Sections</CardTitle>
              <CardDescription>
                Create contextually appropriate content for the entire wireframe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleGenerateFullContent} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Content for All Sections
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="section">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generate Content for Selected Section</CardTitle>
              <CardDescription>
                Create contextually appropriate content for a specific section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select 
                  value={selectedSectionId || ''} 
                  onValueChange={(value: string) => setSelectedSectionId(value)}
                  disabled={wireframe.sections.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {wireframe.sections.map(section => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name || `Section ${section.sectionType}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleGenerateSectionContent} 
                disabled={isGenerating || !selectedSectionId}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Section Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {error && (
        <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md flex items-center text-sm text-red-800">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Error: {error.message}</span>
        </div>
      )}
      
      {generationResult && !error && (
        <div className="mt-4 p-4 border border-green-200 bg-green-50 rounded-md flex items-center text-sm text-green-800">
          <Check className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Content generated successfully!</span>
        </div>
      )}
    </div>
  );
};

export default ContentGenerationPanel;
