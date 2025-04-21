
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Sparkles, 
  Check, 
  PanelRight,
  FileEdit,
  PencilRuler
} from 'lucide-react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { useContentGeneration } from '@/hooks/ai/use-content-generation';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

interface ContentGenerationPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
}

const ContentGenerationPanel: React.FC<ContentGenerationPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const { 
    isGenerating,
    generateContent,
    generateSectionContent
  } = useContentGeneration();
  
  const [activeTab, setActiveTab] = useState('page');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [contentTone, setContentTone] = useState('professional');
  const [contentStyle, setContentStyle] = useState('concise');
  const [customInstructions, setCustomInstructions] = useState('');
  
  const handleGenerateFullContent = async () => {
    const result = await generateContent({
      wireframe,
      tone: contentTone,
      style: contentStyle,
      customInstructions: customInstructions.trim() || undefined
    });
    
    if (result) {
      const updatedWireframe = {
        ...wireframe,
        sections: wireframe.sections.map(section => {
          const sectionContent = result.sections.find(s => s.sectionId === section.id);
          if (sectionContent) {
            return {
              ...section,
              ...sectionContent.content
            };
          }
          return section;
        })
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
      tone: contentTone,
      style: contentStyle,
      customInstructions: customInstructions.trim() || undefined
    });
    
    if (result) {
      const updatedWireframe = {
        ...wireframe,
        sections: wireframe.sections.map(s => {
          if (s.id === selectedSection) {
            return {
              ...s,
              ...result.content
            };
          }
          return s;
        })
      };
      
      onUpdateWireframe(updatedWireframe);
    }
  };
  
  const renderSectionSelector = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Select Section</h3>
          <Select 
            value={selectedSection || ''} 
            onValueChange={setSelectedSection}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose section to generate content" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Sections</SelectLabel>
                {wireframe.sections.map(section => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name || section.sectionType}
                    {section.title && ` - ${section.title}`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {selectedSection && (
          <Button 
            onClick={handleGenerateSectionContent} 
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
                <Sparkles className="h-4 w-4 mr-1" />
                Generate Content for Section
              </>
            )}
          </Button>
        )}
      </div>
    );
  };
  
  const renderFullPageGenerator = () => {
    return (
      <div className="space-y-4">
        <Card className="bg-slate-50">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-sm font-medium">Page Content Generator</h3>
            <p className="text-xs text-muted-foreground">
              Generate consistent content for all sections based on wireframe layout and purpose.
            </p>
          </CardContent>
        </Card>
        
        <Button 
          onClick={handleGenerateFullContent} 
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
              <FileText className="h-4 w-4 mr-1" />
              Generate Full Page Content
            </>
          )}
        </Button>
      </div>
    );
  };
  
  const renderSettings = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Tone</h3>
            <Select value={contentTone} onValueChange={setContentTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Style</h3>
            <Select value={contentStyle} onValueChange={setContentStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="informative">Informative</SelectItem>
                <SelectItem value="narrative">Narrative</SelectItem>
                <SelectItem value="descriptive">Descriptive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Custom Instructions</h3>
          <Textarea
            placeholder="Add specific instructions for content generation (optional)"
            value={customInstructions}
            onChange={e => setCustomInstructions(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>
      </div>
    );
  };
  
  if (isGenerating) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Content Generation</h3>
          <Skeleton className="h-8 w-24" />
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Content Generation</h3>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="page" className="flex-1">
            <FileText className="h-4 w-4 mr-1" />
            Page
          </TabsTrigger>
          <TabsTrigger value="section" className="flex-1">
            <PanelRight className="h-4 w-4 mr-1" />
            Section
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            <PencilRuler className="h-4 w-4 mr-1" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="page">
          {renderFullPageGenerator()}
        </TabsContent>
        
        <TabsContent value="section">
          {renderSectionSelector()}
        </TabsContent>
        
        <TabsContent value="settings">
          {renderSettings()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentGenerationPanel;
