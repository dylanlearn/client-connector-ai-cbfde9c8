
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { GeneratedSectionContent } from '@/services/ai/wireframe/content/context-aware-content-service';
import { Wand2, TextQuote, Check, RefreshCcw } from 'lucide-react';

interface ContentGenerationPanelProps {
  wireframe: WireframeData;
  generatedContent: GeneratedSectionContent[];
  isGenerating: boolean;
  onGenerateContent: () => void;
  onGenerateSectionContent: (sectionId: string) => void;
  onApplyContent: () => void;
  selectedSectionId: string | null;
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
  const [industryContext, setIndustryContext] = useState('technology');
  const [brandVoice, setBrandVoice] = useState<'formal' | 'casual' | 'technical' | 'friendly' | 'authoritative' | 'playful'>('formal');
  const [contentLength, setContentLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [activeTab, setActiveTab] = useState('settings');
  
  const selectedSection = selectedSectionId 
    ? wireframe.sections.find(s => s.id === selectedSectionId)
    : null;
    
  const selectedSectionContent = selectedSectionId
    ? generatedContent.find(c => c.sectionId === selectedSectionId)
    : null;
    
  const availableSections = wireframe.sections.map(section => ({
    id: section.id,
    name: section.title || section.sectionType || section.type || 'Unnamed Section'
  }));
  
  // Calculate how many sections have content
  const sectionsWithContent = new Set(generatedContent.map(c => c.sectionId));
  const sectionsWithContentCount = [...sectionsWithContent].length;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Content Generation</CardTitle>
            <CardDescription>AI-powered contextual content creation</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onGenerateContent}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate All Content
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="content">
              Generated Content {sectionsWithContentCount > 0 && `(${sectionsWithContentCount})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <div>
                <Label>Industry Context</Label>
                <Select value={industryContext} onValueChange={setIndustryContext}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="creative">Creative Agency</SelectItem>
                    <SelectItem value="nonprofit">Nonprofit</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Brand Voice</Label>
                <Select value={brandVoice} onValueChange={(value) => setBrandVoice(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Content Length</Label>
                <Select value={contentLength} onValueChange={(value) => setContentLength(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  These settings will be applied when generating content for all sections.
                </p>
                
                <Button 
                  className="w-full" 
                  onClick={onGenerateContent}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Content for All Sections
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            {generatedContent.length === 0 && !isGenerating && (
              <div className="text-center py-10">
                <TextQuote className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">
                  No content generated yet. Use the settings tab to start generation.
                </p>
              </div>
            )}
            
            {isGenerating && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-muted" />
                  <div className="h-4 w-40 mt-4 bg-muted rounded" />
                  <div className="h-3 w-32 mt-2 bg-muted rounded" />
                </div>
              </div>
            )}
            
            {!isGenerating && generatedContent.length > 0 && (
              <div className="space-y-6">
                {/* Content overview */}
                <div className="flex justify-between items-center">
                  <p>
                    <span className="text-sm font-medium">
                      {sectionsWithContentCount} of {wireframe.sections.length} sections
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      have generated content
                    </span>
                  </p>
                  
                  <Button 
                    onClick={onApplyContent}
                    size="sm"
                    disabled={generatedContent.length === 0}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Apply All Content
                  </Button>
                </div>
                
                <Separator />
                
                {/* Content preview for selected section */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Preview Section Content</h3>
                  
                  <Select
                    value={selectedSectionId || ''}
                    onValueChange={onGenerateSectionContent}
                  >
                    <SelectTrigger className="mb-3">
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSections.map(section => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedSection && selectedSectionContent ? (
                    <div className="border rounded-md p-4">
                      {selectedSectionContent.content.heading && (
                        <h2 className="text-lg font-bold mb-1">
                          {selectedSectionContent.content.heading}
                        </h2>
                      )}
                      
                      {selectedSectionContent.content.subheading && (
                        <p className="text-sm mb-3">
                          {selectedSectionContent.content.subheading}
                        </p>
                      )}
                      
                      {selectedSectionContent.content.body && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {selectedSectionContent.content.body}
                        </p>
                      )}
                      
                      {selectedSectionContent.content.ctaPrimary && (
                        <div className="flex gap-2 mt-3">
                          <div className="bg-primary text-xs text-primary-foreground px-3 py-1 rounded">
                            {selectedSectionContent.content.ctaPrimary}
                          </div>
                          
                          {selectedSectionContent.content.ctaSecondary && (
                            <div className="bg-secondary text-xs text-secondary-foreground px-3 py-1 rounded">
                              {selectedSectionContent.content.ctaSecondary}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {selectedSectionContent.content.listItems && selectedSectionContent.content.listItems.length > 0 && (
                        <div className="mt-3">
                          <h3 className="text-xs font-medium mb-1">List Items:</h3>
                          <ul className="list-disc list-inside text-xs space-y-1 pl-2">
                            {selectedSectionContent.content.listItems.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onGenerateSectionContent(selectedSectionId!)}
                        >
                          <RefreshCcw className="w-3 h-3 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  ) : selectedSectionId ? (
                    <div className="border border-dashed rounded-md p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No content generated for this section yet.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onGenerateSectionContent(selectedSectionId)}
                        className="mt-2"
                      >
                        Generate Content
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-md p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        Select a section to preview or generate content
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-3">
        <p className="text-xs text-muted-foreground">
          Contextual content generation powered by AI
        </p>
        <p className="text-xs font-medium">
          AI Content Generator v1.0
        </p>
      </CardFooter>
    </Card>
  );
}
