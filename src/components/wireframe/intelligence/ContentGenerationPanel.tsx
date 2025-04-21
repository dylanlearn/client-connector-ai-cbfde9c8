import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { GeneratedSectionContent } from '@/services/ai/wireframe/content/context-aware-content-service';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Type, Check } from 'lucide-react';

interface ContentGenerationPanelProps {
  wireframe: WireframeData;
  generatedContent: GeneratedSectionContent[];
  isGenerating: boolean;
  onGenerateContent: () => void;
  onGenerateSectionContent: (sectionId: string) => void;
  onApplyContent: () => void;
  selectedSectionId?: string | null;
}

export default function ContentGenerationPanel({
  wireframe,
  generatedContent,
  isGenerating,
  onGenerateContent,
  onGenerateSectionContent,
  onApplyContent,
  selectedSectionId
}: ContentGenerationPanelProps) {
  const [brandVoice, setBrandVoice] = useState<string>('conversational');
  const [selectedSection, setSelectedSection] = useState<string | null>(selectedSectionId || null);
  
  // When selectedSectionId prop changes, update the internal state
  React.useEffect(() => {
    if (selectedSectionId) {
      setSelectedSection(selectedSectionId);
    }
  }, [selectedSectionId]);
  
  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId);
  };
  
  const handleGenerateForSection = () => {
    if (selectedSection) {
      onGenerateSectionContent(selectedSection);
    }
  };
  
  // Find the content for the selected section
  const selectedSectionContent = selectedSection ? 
    generatedContent.find(content => content.sectionId === selectedSection) : null;
  
  // Find the section object from the wireframe
  const sectionObject = selectedSection ?
    wireframe.sections.find(section => section.id === selectedSection) : null;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Content Generation Settings</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Brand Voice</label>
            <Select value={brandVoice} onValueChange={setBrandVoice}>
              <SelectTrigger>
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conversational">Conversational</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Section</label>
            <Select 
              value={selectedSection || ''} 
              onValueChange={handleSectionSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {wireframe.sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name || section.sectionType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onGenerateContent} 
            disabled={isGenerating} 
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                Generate for All Sections
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleGenerateForSection} 
            disabled={isGenerating || !selectedSection}
            className="flex-1"
          >
            <Type className="h-4 w-4 mr-1" />
            Generate for Section
          </Button>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {isGenerating ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : generatedContent.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Generated Content</h3>
            <Button size="sm" onClick={onApplyContent} variant="default">
              <Check className="h-3 w-3 mr-1" />
              Apply All Content
            </Button>
          </div>
          
          <ScrollArea className="h-[300px] rounded-md border p-2">
            {selectedSection && selectedSectionContent ? (
              <Card>
                <CardHeader className="px-4 py-2">
                  <CardTitle className="text-sm">
                    {sectionObject?.name || sectionObject?.sectionType || 'Section Content'}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    AI generated content for {sectionObject?.sectionType} section
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-2 space-y-2 text-sm">
                  {renderContentPreview(selectedSectionContent.content)}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {generatedContent.map((content) => {
                  const section = wireframe.sections.find(s => s.id === content.sectionId);
                  return (
                    <Card key={content.sectionId} className="cursor-pointer hover:border-primary"
                      onClick={() => setSelectedSection(content.sectionId)}>
                      <CardHeader className="px-4 py-2">
                        <CardTitle className="text-sm">{section?.name || section?.sectionType}</CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 py-2">
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {content.content.heading || content.content.body?.substring(0, 50) + '...'}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground text-sm">
          <Type className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>No content generated yet. Click the generate button to create content for your wireframe.</p>
        </div>
      )}
    </div>
  );
}

// Helper function to render content preview based on content type
function renderContentPreview(content: any) {
  return (
    <div className="space-y-2">
      {content.heading && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Heading:</div>
          <div className="font-medium">{content.heading}</div>
        </div>
      )}
      
      {content.subheading && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Subheading:</div>
          <div>{content.subheading}</div>
        </div>
      )}
      
      {content.body && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Body:</div>
          <div className="text-xs">{content.body}</div>
        </div>
      )}
      
      {content.ctaPrimary && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Primary CTA:</div>
          <div className="text-xs font-medium">{content.ctaPrimary}</div>
        </div>
      )}
      
      {content.ctaSecondary && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Secondary CTA:</div>
          <div className="text-xs">{content.ctaSecondary}</div>
        </div>
      )}
      
      {content.features && content.features.length > 0 && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Features:</div>
          <ul className="text-xs list-disc pl-4">
            {content.features.map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      
      {content.stats && content.stats.length > 0 && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Stats:</div>
          <div className="grid grid-cols-2 gap-1">
            {content.stats.map((stat: any, index: number) => (
              <div key={index} className="text-xs">
                <span className="font-bold">{stat.value}</span> {stat.label}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {content.testimonials && content.testimonials.length > 0 && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Testimonials:</div>
          {content.testimonials.map((testimonial: any, index: number) => (
            <div key={index} className="text-xs italic mb-1">
              "{testimonial.quote}" - {testimonial.author}
              {testimonial.position && <span>, {testimonial.position}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
