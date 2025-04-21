
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useContentGeneration } from '@/hooks/ai/use-content-generation';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { GeneratedContent, GeneratedSectionContent } from '@/services/ai/wireframe/content/context-aware-content-service';

interface ContentGenerationPanelProps {
  wireframe: WireframeData;
  onApplyContent: (updatedWireframe: WireframeData) => void;
}

// Define allowed tone values to match those expected by the service
type ContentTone = 'professional' | 'friendly' | 'enthusiastic' | 'technical' | 'formal';

const ContentGenerationPanel: React.FC<ContentGenerationPanelProps> = ({ wireframe, onApplyContent }) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [promptText, setPromptText] = useState<string>('');
  const [tone, setTone] = useState<ContentTone>('professional');
  const [activeTab, setActiveTab] = useState<string>('full-wireframe');
  const { generateContent, generateSectionContent, isGenerating, generationResult, error } = useContentGeneration();

  const handleGenerateFullContent = async () => {
    if (!wireframe) return;

    const contentParams = {
      wireframe,
      prompt: promptText,
      options: {
        tone: tone as ContentTone,
        // Using correct type for options
        additionalContext: {} as Record<string, any>
      }
    };

    await generateContent(contentParams);
  };

  const handleApplyFullContent = () => {
    if (!generationResult || !wireframe) return;
    
    // Check if the generationResult is GeneratedContent type (for full wireframe)
    if ('contentSections' in generationResult) {
      const typedResult = generationResult as GeneratedContent;
      
      // Create an updated wireframe with the generated content
      const updatedWireframe = {
        ...wireframe,
        title: typedResult.pageTitle || wireframe.title,
        description: typedResult.pageDescription || wireframe.description,
        sections: wireframe.sections.map(section => {
          const generatedSection = typedResult.contentSections.find(s => s.sectionId === section.id);
          if (generatedSection) {
            return {
              ...section,
              name: generatedSection.name || section.name,
              description: generatedSection.content || section.description
            };
          }
          return section;
        })
      };

      onApplyContent(updatedWireframe);
    }
  };

  const handleGenerateSectionContent = async () => {
    if (!wireframe || !selectedSection) return;
    
    const section = wireframe.sections.find(s => s.id === selectedSection);
    if (!section) return;

    const sectionParams = {
      wireframe,
      section,
      prompt: promptText,
      options: {
        tone: tone as ContentTone,
        // Using correct type for options
        additionalContext: {} as Record<string, any>
      }
    };

    await generateSectionContent(sectionParams);
  };

  const handleApplySectionContent = () => {
    if (!generationResult || !wireframe || !selectedSection) return;
    
    // Check if the generationResult is GeneratedSectionContent type
    if ('content' in generationResult) {
      const typedResult = generationResult as GeneratedSectionContent;
      
      const updatedWireframe = {
        ...wireframe,
        sections: wireframe.sections.map(section => {
          if (section.id === selectedSection) {
            return {
              ...section,
              name: typedResult.name || section.name,
              description: typedResult.content || section.description
            };
          }
          return section;
        })
      };

      onApplyContent(updatedWireframe);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Content Generation</CardTitle>
        <CardDescription>Generate professional content for your wireframe</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="full-wireframe">Full Wireframe</TabsTrigger>
            <TabsTrigger value="specific-section">Specific Section</TabsTrigger>
          </TabsList>

          <TabsContent value="full-wireframe">
            <div className="space-y-4">
              <div>
                <Label htmlFor="full-prompt">Content Prompt</Label>
                <Textarea
                  id="full-prompt"
                  placeholder="Describe the content you want to generate..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="tone-select">Content Tone</Label>
                <Select value={tone} onValueChange={(value) => setTone(value as ContentTone)}>
                  <SelectTrigger>
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

              <Button 
                onClick={handleGenerateFullContent}
                disabled={isGenerating || !promptText}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : 'Generate Content'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="specific-section">
            <div className="space-y-4">
              <div>
                <Label htmlFor="section-select">Select Section</Label>
                <Select value={selectedSection || ''} onValueChange={setSelectedSection}>
                  <SelectTrigger>
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

              <div>
                <Label htmlFor="section-prompt">Content Prompt</Label>
                <Textarea
                  id="section-prompt"
                  placeholder="Describe the content you want for this section..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="section-tone">Content Tone</Label>
                <Select value={tone} onValueChange={(value) => setTone(value as ContentTone)}>
                  <SelectTrigger>
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

              <Button 
                onClick={handleGenerateSectionContent}
                disabled={isGenerating || !promptText || !selectedSection}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : 'Generate Section Content'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {generationResult && !error && (
          <div className="mt-4">
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>Content generated successfully!</AlertDescription>
            </Alert>
            
            <Button 
              onClick={activeTab === 'full-wireframe' ? handleApplyFullContent : handleApplySectionContent}
              className="mt-4 w-full"
            >
              Apply Generated Content
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t bg-muted/50 px-6 py-4">
        <p className="text-xs text-muted-foreground">
          The content generator uses your wireframe's structure and your prompt to create contextually relevant content.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ContentGenerationPanel;
