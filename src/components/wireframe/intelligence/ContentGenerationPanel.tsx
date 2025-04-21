
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  PenLine, 
  MessageSquare, 
  ListChecks,
  Sparkles,
  RotateCw
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { 
  ContextAwareContentService, 
  ContentGenerationOptions, 
  GeneratedSectionContent
} from '@/services/ai/wireframe/content/context-aware-content-service';

interface ContentGenerationPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const ContentGenerationPanel: React.FC<ContentGenerationPanelProps> = ({ 
  wireframe, 
  onUpdateWireframe 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [generatedContent, setGeneratedContent] = useState<GeneratedSectionContent[]>([]);
  const [options, setOptions] = useState<ContentGenerationOptions>({
    tone: 'professional',
    contentLength: 'moderate',
    includeCallToAction: true
  });
  
  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      let content: GeneratedSectionContent[];
      
      if (selectedSection === 'all') {
        content = await ContextAwareContentService.generateContentForWireframe(wireframe, options);
      } else {
        const section = wireframe.sections.find(s => s.id === selectedSection);
        if (section) {
          const sectionContent = await ContextAwareContentService.generateContentForSection(section, wireframe, options);
          content = [sectionContent];
        } else {
          content = [];
        }
      }
      
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleApplyContent = () => {
    if (generatedContent.length === 0) return;
    
    const updatedSections = [...wireframe.sections];
    
    generatedContent.forEach(content => {
      const sectionIndex = updatedSections.findIndex(s => s.id === content.sectionId);
      if (sectionIndex !== -1) {
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          name: content.content.title || updatedSections[sectionIndex].name,
          // Use optional chaining to safely access properties
          copySuggestions: {
            ...(updatedSections[sectionIndex].copySuggestions || {}),
            heading: content.content.heading,
            subheading: content.content.subheading,
            description: content.content.description,
            ctaText: content.content.ctaText
          }
        };
        
        // If there are components with text content, update them too
        if (updatedSections[sectionIndex].components) {
          updatedSections[sectionIndex].components = updatedSections[sectionIndex].components?.map(component => {
            if (component.type === 'heading' && content.content.heading) {
              return { ...component, content: content.content.heading };
            }
            if (component.type === 'subheading' && content.content.subheading) {
              return { ...component, content: content.content.subheading };
            }
            if ((component.type === 'paragraph' || component.type === 'text') && content.content.description) {
              return { ...component, content: content.content.description };
            }
            if ((component.type === 'button' || component.type === 'cta') && content.content.ctaText) {
              return { ...component, content: content.content.ctaText };
            }
            return component;
          });
        }
      }
    });
    
    onUpdateWireframe({
      ...wireframe,
      sections: updatedSections
    });
  };
  
  return (
    <Card className="border rounded-md">
      <div className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section-select">Select Section</Label>
              <Select 
                value={selectedSection} 
                onValueChange={setSelectedSection}
              >
                <SelectTrigger id="section-select">
                  <SelectValue placeholder="Choose a section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {wireframe.sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name || section.sectionType || `Section ${section.id.slice(0, 4)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tone-select">Content Tone</Label>
              <Select 
                value={options.tone} 
                onValueChange={(value) => setOptions({...options, tone: value})}
              >
                <SelectTrigger id="tone-select">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly & Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length-select">Content Length</Label>
              <Select 
                value={options.contentLength} 
                onValueChange={(value) => setOptions({...options, contentLength: value})}
              >
                <SelectTrigger id="length-select">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="cta-switch">Include Call to Action</Label>
              <Switch 
                id="cta-switch"
                checked={options.includeCallToAction}
                onCheckedChange={(checked) => setOptions({...options, includeCallToAction: checked})}
              />
            </div>
          </div>
          
          <Button
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </div>
        
        {generatedContent.length > 0 && (
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="text-lg font-medium">Generated Content</h3>
            
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {generatedContent.map((content) => {
                  const section = wireframe.sections.find(s => s.id === content.sectionId);
                  return (
                    <div key={content.sectionId} className="border rounded-md p-3">
                      <h4 className="font-medium mb-2">
                        {section?.name || section?.sectionType || `Section ${content.sectionId.slice(0, 4)}`}
                      </h4>
                      
                      {content.content.heading && (
                        <div className="mb-2">
                          <Label className="text-xs text-muted-foreground">Heading</Label>
                          <p className="text-sm font-medium">{content.content.heading}</p>
                        </div>
                      )}
                      
                      {content.content.subheading && (
                        <div className="mb-2">
                          <Label className="text-xs text-muted-foreground">Subheading</Label>
                          <p className="text-sm">{content.content.subheading}</p>
                        </div>
                      )}
                      
                      {content.content.description && (
                        <div className="mb-2">
                          <Label className="text-xs text-muted-foreground">Description</Label>
                          <p className="text-sm">{content.content.description}</p>
                        </div>
                      )}
                      
                      {content.content.ctaText && (
                        <div className="mb-2">
                          <Label className="text-xs text-muted-foreground">Call to Action</Label>
                          <p className="text-sm font-medium">{content.content.ctaText}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={handleGenerateContent}
                size="sm"
              >
                <RotateCw className="mr-1 h-3 w-3" />
                Regenerate
              </Button>
              <Button 
                onClick={handleApplyContent}
                size="sm"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Apply Content
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContentGenerationPanel;
