
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WireframeAISuggestionsProps {
  wireframeId?: string;
  wireframe?: any; // Add wireframe prop
  focusedSectionId?: string;
  onApplySuggestion?: (suggestion: any) => void;
  onClose?: () => void;
}

const WireframeAISuggestions: React.FC<WireframeAISuggestionsProps> = ({
  wireframeId,
  wireframe, // Include wireframe in props
  focusedSectionId,
  onApplySuggestion,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<string>('content');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { toast } = useToast();
  
  const generateSuggestions = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate suggestions",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use wireframe or wireframeId for identification
      const targetId = wireframeId || (wireframe?.id ? wireframe.id : 'unknown');
      console.log(`Generating suggestions for wireframe: ${targetId}, section: ${focusedSectionId}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSuggestions = {
        content: [
          { id: '1', text: 'Add a compelling heading that highlights the main value proposition.' },
          { id: '2', text: 'Use more concise language in the feature descriptions.' },
          { id: '3', text: 'Add social proof elements to build credibility.' }
        ],
        style: [
          { id: '1', text: 'Use a higher contrast between text and background for better readability.' },
          { id: '2', text: 'Implement a more consistent color scheme throughout the wireframe.' },
          { id: '3', text: 'Add more whitespace around key elements for visual breathing room.' }
        ],
        layout: [
          { id: '1', text: 'Reorder sections to prioritize the most important information.' },
          { id: '2', text: 'Use a grid layout for the features section for better organization.' },
          { id: '3', text: 'Make the call-to-action more prominent in the hero section.' }
        ]
      };
      
      setSuggestions(mockSuggestions[activeTab as keyof typeof mockSuggestions]);
      
      toast({
        title: "Suggestions Generated",
        description: `Generated ${mockSuggestions[activeTab as keyof typeof mockSuggestions].length} suggestions based on your prompt.`
      });
      
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Failed to Generate Suggestions",
        description: "There was an error generating AI suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const applySuggestion = (suggestion: any) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
      
      toast({
        title: "Suggestion Applied",
        description: "The AI suggestion has been applied to your wireframe."
      });
    }
  };
  
  return (
    <div className="wireframe-ai-suggestions space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">AI-Powered Suggestions</h3>
        <p className="text-sm text-muted-foreground">
          Get AI suggestions to improve your wireframe's content, style, and layout.
          {focusedSectionId && <span> Currently focused on section: {focusedSectionId}</span>}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Input 
          placeholder="Describe what you want to improve..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow"
        />
        <Button 
          onClick={generateSuggestions}
          disabled={isLoading || !prompt.trim()}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        {['content', 'style', 'layout'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Suggestion {suggestion.id}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm">{suggestion.text}</p>
                    </CardContent>
                    <CardFooter className="py-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full"
                        onClick={() => applySuggestion(suggestion)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Apply Suggestion
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  {isLoading ? 
                    "Generating suggestions..." : 
                    "Generate suggestions to see them here"}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {onClose && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default WireframeAISuggestions;
