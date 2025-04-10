
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Send } from 'lucide-react';

interface WireframeAISuggestionsProps {
  onApplySuggestion?: (suggestion: string) => void;
  onRequestFeedback?: (wireframeId: string, prompt: string) => Promise<string>;
  wireframeId?: string;
}

const WireframeAISuggestions: React.FC<WireframeAISuggestionsProps> = ({
  onApplySuggestion,
  onRequestFeedback,
  wireframeId
}) => {
  const [feedbackPrompt, setFeedbackPrompt] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRequestFeedback = async () => {
    if (!wireframeId || !onRequestFeedback) return;
    
    setIsLoading(true);
    try {
      const feedback = await onRequestFeedback(wireframeId, feedbackPrompt);
      // Parse feedback into discrete suggestions
      const newSuggestions = feedback.split('\n').filter(suggestion => suggestion.trim().length > 0);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="mr-2 h-4 w-4" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Ask for design suggestions..."
            value={feedbackPrompt}
            onChange={(e) => setFeedbackPrompt(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleRequestFeedback}
            disabled={isLoading || !feedbackPrompt.trim()}
            variant="outline"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {suggestions.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Suggestions</h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md text-sm">
                  <span>{suggestion}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleApplySuggestion(suggestion)}
                  >
                    Apply
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm py-8">
            {isLoading ? 'Generating suggestions...' : 'Ask AI for suggestions on how to improve your wireframe'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WireframeAISuggestions;
