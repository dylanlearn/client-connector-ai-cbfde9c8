
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText } from 'lucide-react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { useContentGeneration, GeneratedContent, GeneratedSectionContent } from '@/hooks/ai/use-content-generation';

export interface ContentGenerationPanelProps {
  wireframe: WireframeData;
  onUpdate: (updated: WireframeData) => void;
}

const ContentGenerationPanel: React.FC<ContentGenerationPanelProps> = ({ wireframe, onUpdate }) => {
  const [selectedSection, setSelectedSection] = useState<WireframeSection | null>(null);
  const [generationType, setGenerationType] = useState<'entire' | 'section'>('entire');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'enthusiastic' | 'technical' | 'formal'>('professional');
  const [isPreview, setIsPreview] = useState(false);
  
  const { 
    isGenerating, 
    generationResult, 
    error, 
    generateContent, 
    generateSectionContent 
  } = useContentGeneration();

  const handleGenerateContent = async () => {
    if (generationType === 'entire') {
      // Generate content for the entire wireframe
      const params = {
        wireframe,
        context: {
          tone: tone,
          siteType: wireframe.metadata?.siteType || 'business',
        }
      };
      
      const result = await generateContent(params);
      
      if (result) {
        // Apply the generated content to the wireframe
        const updatedWireframe = { ...wireframe };
        
        // Update page title and description
        if (result.pageTitle) updatedWireframe.title = result.pageTitle;
        if (result.pageDescription) updatedWireframe.description = result.pageDescription;
        
        // Update sections with generated content
        if (result.contentSections && Array.isArray(result.contentSections)) {
          updatedWireframe.sections = updatedWireframe.sections.map(section => {
            const sectionContent = result.contentSections.find(
              sc => sc.sectionId === section.id
            );
            
            if (sectionContent) {
              return {
                ...section,
                name: sectionContent.name || section.name,
                description: sectionContent.content || section.description,
              };
            }
            return section;
          });
        }
        
        setIsPreview(true);
        onUpdate(updatedWireframe);
      }
    } else if (selectedSection) {
      // Generate content for a specific section
      const params = {
        wireframe,
        section: selectedSection,
        context: {
          tone: tone,
          siteType: wireframe.metadata?.siteType || 'business',
        }
      };
      
      const result = await generateSectionContent(params);
      
      if (result) {
        // Apply the generated content to the section
        const updatedWireframe = { ...wireframe };
        
        updatedWireframe.sections = updatedWireframe.sections.map(section => {
          if (section.id === selectedSection.id) {
            return {
              ...section,
              name: result.name || section.name,
              description: result.content || section.description,
            };
          }
          return section;
        });
        
        setIsPreview(true);
        onUpdate(updatedWireframe);
      }
    }
  };
  
  const renderSectionSelector = () => {
    if (generationType !== 'section') return null;
    
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Select Section</label>
        <Select
          value={selectedSection?.id || ''}
          onValueChange={(value) => {
            const section = wireframe.sections.find(s => s.id === value);
            if (section) setSelectedSection(section);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            {wireframe.sections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                {section.name || `${section.sectionType} Section`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          AI Content Generation
        </h2>
      </div>
      
      {error && (
        <div className="p-4 border rounded-md bg-red-50 text-red-700">
          <h3 className="font-medium">Error generating content</h3>
          <p className="text-sm">{error.message}</p>
        </div>
      )}
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Generate For</label>
              <Select
                value={generationType}
                onValueChange={(value: 'entire' | 'section') => setGenerationType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entire">Entire Wireframe</SelectItem>
                  <SelectItem value="section">Specific Section</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {renderSectionSelector()}
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Content Tone</label>
              <Select
                value={tone}
                onValueChange={(value: 'professional' | 'friendly' | 'enthusiastic' | 'technical' | 'formal') => setTone(value)}
              >
                <SelectTrigger>
                  <SelectValue />
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
              onClick={handleGenerateContent}
              disabled={isGenerating || (generationType === 'section' && !selectedSection)}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Content'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isPreview && generationResult && (
        <div className="space-y-4">
          <h3 className="font-medium">Generated Content Preview</h3>
          <div className="border rounded-md p-4 bg-muted/50 space-y-2 text-sm">
            <p className="font-medium">{wireframe.title}</p>
            <p className="text-muted-foreground">{wireframe.description}</p>
            <div className="pt-2 border-t mt-2">
              <p className="text-xs text-muted-foreground">Apply the content to see it in the wireframe preview.</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreview(false)}
            >
              Close Preview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerationPanel;
