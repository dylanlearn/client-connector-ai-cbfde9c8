
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContentGeneration, GeneratedContent, GeneratedSectionContent } from '@/hooks/ai/use-content-generation';

interface ContentGenerationPanelProps {
  wireframe: WireframeData;
  selectedSection?: WireframeSection | null;
  onContentGenerated?: (content: GeneratedContent | GeneratedSectionContent) => void;
  onUpdate?: (updated: WireframeData) => void; // Add this prop to match DesignIntelligencePanel
}

const ContentGenerationPanel: React.FC<ContentGenerationPanelProps> = ({
  wireframe,
  selectedSection,
  onContentGenerated,
  onUpdate
}) => {
  const { generateWireframeContent, generateSectionContent, isGenerating, error } = useContentGeneration();
  const [prompt, setPrompt] = useState<string>('');
  const [tone, setTone] = useState<string>('professional');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | GeneratedSectionContent | null>(null);
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };
  
  const handleToneChange = (value: string) => {
    setTone(value);
  };
  
  const handleGenerateContent = async () => {
    try {
      let result;
      
      if (selectedSection) {
        // Generate content for the selected section
        result = await generateSectionContent(
          selectedSection,
          wireframe,
          prompt
        );
      } else {
        // Generate content for the entire wireframe
        result = await generateWireframeContent(wireframe, prompt);
      }
      
      setGeneratedContent(result);
      
      if (onContentGenerated) {
        onContentGenerated(result);
      }
    } catch (err) {
      console.error('Error generating content:', err);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Content Generation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium">
            Content Prompt
          </label>
          <Textarea
            id="prompt"
            placeholder={`Enter a prompt to generate content for ${selectedSection ? 'this section' : 'all sections'}`}
            value={prompt}
            onChange={handlePromptChange}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="tone" className="text-sm font-medium">
            Content Tone
          </label>
          <Select value={tone} onValueChange={handleToneChange}>
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
          className="w-full" 
          onClick={handleGenerateContent} 
          disabled={isGenerating || !prompt}
        >
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </Button>
        
        {error && (
          <div className="text-destructive text-sm mt-2">
            Error: {error.message}
          </div>
        )}
        
        {generatedContent && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Generated Content</h3>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(generatedContent, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentGenerationPanel;
