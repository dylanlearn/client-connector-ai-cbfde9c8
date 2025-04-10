
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WireframeAISuggestionsProps } from './types';
import { X, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const WireframeAISuggestions: React.FC<WireframeAISuggestionsProps> = ({
  wireframe,
  onClose,
  onApplySuggestion,
  sectionId
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (wireframe) {
      generateSuggestions();
    }
  }, [wireframe, sectionId]);

  const generateSuggestions = async () => {
    if (!wireframe) return;

    setIsLoading(true);
    try {
      const sectionsToAnalyze = sectionId 
        ? wireframe.sections.filter(s => s.id === sectionId)
        : wireframe.sections;
      
      const { data, error } = await supabase.functions.invoke('generate-advanced-wireframe', {
        body: {
          action: 'generate-suggestions',
          wireframe: wireframe,
          sections: sectionsToAnalyze,
          targetSection: sectionId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
        toast({
          title: "No suggestions available",
          description: "Our AI couldn't generate any meaningful suggestions for this wireframe.",
          variant: "default"
        });
      }
    } catch (err) {
      console.error("Error generating suggestions:", err);
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again later.",
        variant: "destructive"
      });
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: any) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    }
    onClose();
  };

  return (
    <Card className="w-full max-w-4xl h-[80vh] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
          AI Design Suggestions
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="h-[calc(100%-70px)] overflow-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Analyzing design and generating suggestions...</p>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => (
              <div 
                key={`suggestion-${index}`}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedSuggestion === index ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedSuggestion(index)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{suggestion.title}</h3>
                  {selectedSuggestion === index && (
                    <Button 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleApplySuggestion(suggestion)}
                    >
                      <CheckCircle className="h-3 w-3" />
                      Apply
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                {suggestion.preview && (
                  <div className="bg-muted rounded-md p-3 text-xs">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(suggestion.preview, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-muted-foreground">No suggestions available. Try analyzing a different section.</p>
            <Button className="mt-4" onClick={generateSuggestions}>
              Generate New Suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WireframeAISuggestions;
