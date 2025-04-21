
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContentGeneration } from '@/hooks/ai/use-content-generation';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ContentGenerationPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updatedWireframe: WireframeData) => void;
}

type ContentTone = "professional" | "friendly" | "enthusiastic" | "technical" | "formal";

const ContentGenerationPanel: React.FC<ContentGenerationPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const [activeTab, setActiveTab] = useState<string>('full-wireframe');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [contextPrompt, setContextPrompt] = useState<string>('');
  const [tone, setTone] = useState<ContentTone>("professional");
  
  const {
    isGenerating,
    generationResult,
    error,
    generateContent,
    generateSectionContent
  } = useContentGeneration();
  
  const handleGenerateFullContent = async () => {
    const result = await generateContent({
      wireframe,
      tone: tone as ContentTone,
      context: contextPrompt
    });
    
    if (result) {
      // Apply the generated content to the wireframe
      // Note: The result doesn't have sections, it has content for the whole wireframe
      const updatedWireframe = {
        ...wireframe,
        title: result.title || wireframe.title,
        description: result.description || wireframe.description
      };
      
      onUpdateWireframe(updatedWireframe);
    }
  };
  
  const handleGenerateSectionContent = async () => {
    if (!selectedSection) return;
    
    const section = wireframe.sections.find(s => s.id === selectedSection);
    if (!section) return;
    
    const result = await generateSectionContent({
      wireframe,
      section,
      tone: tone as ContentTone,
      context: contextPrompt
    });
    
    if (result) {
      // Apply the generated content to the section
      const updatedWireframe = {
        ...wireframe,
        sections: wireframe.sections.map(s => 
          s.id === selectedSection 
            ? { 
                ...s, 
                ...result.sectionContent 
              } 
            : s
        )
      };
      
      onUpdateWireframe(updatedWireframe);
    }
  };
  
  // Find selected section if any
  const sectionData = selectedSection 
    ? wireframe.sections.find(s => s.id === selectedSection) 
    : null;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Content Generation</CardTitle>
        <CardDescription>
          Generate contextually relevant content for your wireframe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="full-wireframe">Full Wireframe</TabsTrigger>
            <TabsTrigger value="section">Single Section</TabsTrigger>
          </TabsList>
          
          <div className="mb-4">
            <Label htmlFor="context">Context/Instructions</Label>
            <Textarea 
              id="context" 
              placeholder="Add any specific direction or context for the content generation..."
              value={contextPrompt}
              onChange={(e) => setContextPrompt(e.target.value)}
              className="h-24"
            />
          </div>
          
          <div className="mb-6 flex gap-4 items-center">
            <div className="flex-1">
              <Label htmlFor="tone">Tone of Voice</Label>
              <Select value={tone} onValueChange={(value: ContentTone) => setTone(value)}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="full-wireframe">
            <Button 
              onClick={handleGenerateFullContent} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>Generate Full Wireframe Content</>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="section">
            <div className="mb-4">
              <Label htmlFor="section">Select Section</Label>
              <Select 
                value={selectedSection || ''} 
                onValueChange={setSelectedSection}
              >
                <SelectTrigger id="section">
                  <SelectValue placeholder="Choose a section" />
                </SelectTrigger>
                <SelectContent>
                  {wireframe.sections.map(section => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name || section.sectionType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleGenerateSectionContent} 
              disabled={isGenerating || !selectedSection}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Section Content...
                </>
              ) : (
                <>Generate Section Content</>
              )}
            </Button>
          </TabsContent>
        </Tabs>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        )}
        
        {generationResult && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {activeTab === 'full-wireframe' ? (
                      <>
                        <div>
                          <Badge>Title</Badge>
                          <p className="mt-1">{(generationResult as any).title || "No title generated"}</p>
                        </div>
                        <div>
                          <Badge>Description</Badge>
                          <p className="mt-1">{(generationResult as any).description || "No description generated"}</p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <Badge>{sectionData?.sectionType || "Section"} Content</Badge>
                        <p className="mt-1">{JSON.stringify((generationResult as any).sectionContent || {})}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentGenerationPanel;
