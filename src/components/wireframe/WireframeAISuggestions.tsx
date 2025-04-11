
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

interface WireframeAISuggestionsProps {
  wireframeId?: string;
  sectionId?: string;
  onApplySuggestion?: (suggestion: any) => void;
  onClose?: () => void;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  preview: any;
  justification: string;
  type: 'layout' | 'content' | 'style' | 'structure';
  applied?: boolean;
}

const WireframeAISuggestions: React.FC<WireframeAISuggestionsProps> = ({
  wireframeId,
  sectionId,
  onApplySuggestion,
  onClose
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [wireframeData, setWireframeData] = useState<any>(null);

  // Function to generate AI suggestions
  const generateSuggestions = async () => {
    if (!wireframeData) {
      toast({
        title: "No wireframe data",
        description: "Please provide wireframe data to generate suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call the generate-suggestions function
      const { data, error } = await supabase.functions.invoke('generate-advanced-wireframe', {
        body: {
          action: 'generate-suggestions',
          wireframe: wireframeData,
          targetSection: sectionId,
        }
      });

      if (error) {
        throw new Error(`Failed to generate suggestions: ${error.message}`);
      }

      if (data && data.suggestions && Array.isArray(data.suggestions)) {
        // Add unique IDs and default values to suggestions
        const processedSuggestions: Suggestion[] = data.suggestions.map((suggestion: any, index: number) => ({
          id: `suggestion-${index}`,
          title: suggestion.title || `Suggestion ${index + 1}`,
          description: suggestion.description || 'No description provided',
          preview: suggestion.preview || {},
          justification: suggestion.justification || 'No justification provided',
          type: suggestion.type || 'style',
          applied: false,
        }));
        
        setSuggestions(processedSuggestions);
        
        // Show success toast
        toast({
          title: "Suggestions Generated",
          description: `Generated ${processedSuggestions.length} suggestions for your wireframe.`,
        });
      } else {
        setSuggestions([]);
        toast({
          title: "No Suggestions",
          description: "Couldn't generate any suggestions for this wireframe.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        title: "Failed to Generate Suggestions",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to apply a suggestion
  const applySuggestion = (suggestion: Suggestion) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion.preview);
      
      // Mark this suggestion as applied
      setSuggestions(prev => 
        prev.map(s => s.id === suggestion.id ? { ...s, applied: true } : s)
      );
      
      // Show success toast
      toast({
        title: "Suggestion Applied",
        description: `Applied "${suggestion.title}" to your wireframe.`,
      });
    }
  };

  // Generate dummy suggestions for development and demo purposes
  const generateDummySuggestions = () => {
    const dummySuggestions: Suggestion[] = [
      {
        id: "suggestion-1",
        title: "Improve Hero Section Contrast",
        description: "The contrast between text and background in the hero section could be improved for better readability.",
        preview: {
          style: {
            backgroundColor: "#1E293B",
            color: "#F8FAFC"
          }
        },
        justification: "Increasing the contrast helps with accessibility and makes the call to action stand out more.",
        type: "style"
      },
      {
        id: "suggestion-2",
        title: "Restructure Features Section",
        description: "Change the features section layout from vertical list to card grid for better visual balance.",
        preview: {
          layout: {
            type: "grid",
            columns: 3,
            gap: 24
          }
        },
        justification: "A grid layout presents feature comparisons more effectively and uses screen space more efficiently.",
        type: "layout"
      },
      {
        id: "suggestion-3",
        title: "Add Testimonial Section",
        description: "Adding social proof through testimonials would strengthen credibility.",
        preview: {
          sectionType: "testimonials",
          name: "Customer Testimonials",
          copySuggestions: {
            heading: "What Our Customers Say",
            subheading: "Don't just take our word for it"
          }
        },
        justification: "Social proof is one of the most effective persuasion techniques in marketing.",
        type: "structure"
      }
    ];
    
    setSuggestions(dummySuggestions);
  };

  // Show suggestion details when selected
  const showSuggestionDetails = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  useEffect(() => {
    // If we have wireframe data, generate suggestions automatically
    if (wireframeData) {
      // For production, call the generateSuggestions function
      // For development/demo, use the dummy suggestions
      generateDummySuggestions();
    }
  }, [wireframeData]);

  return (
    <div className="wireframe-ai-suggestions">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Design Suggestions
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={generateDummySuggestions}
              disabled={isLoading}
            >
              Generate Demo Suggestions
            </Button>
            
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Analyzing wireframe and generating suggestions...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="suggestions-list space-y-2">
                {suggestions.map(suggestion => (
                  <div
                    key={suggestion.id}
                    className={`suggestion-item p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedSuggestion?.id === suggestion.id ? 'bg-muted border-primary' : 'hover:bg-muted/50'
                    } ${suggestion.applied ? 'border-green-500/30 bg-green-50 dark:bg-green-950/10' : ''}`}
                    onClick={() => showSuggestionDetails(suggestion)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        {suggestion.title}
                        {suggestion.applied && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </h4>
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {suggestion.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                ))}
              </div>
              
              {selectedSuggestion && (
                <div className="suggestion-details border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">{selectedSuggestion.title}</h3>
                  <p className="text-sm mb-4">
                    {selectedSuggestion.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Why this matters:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedSuggestion.justification}
                    </p>
                  </div>
                  
                  <div className="preview-section mb-4">
                    <h4 className="text-sm font-medium mb-1">Preview:</h4>
                    <div className="bg-muted/50 rounded-md p-3 text-xs overflow-auto max-h-40">
                      <pre>{JSON.stringify(selectedSuggestion.preview, null, 2)}</pre>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => applySuggestion(selectedSuggestion)}
                      disabled={selectedSuggestion.applied}
                      className="w-full"
                    >
                      {selectedSuggestion.applied ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Applied
                        </span>
                      ) : (
                        'Apply Suggestion'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <h3 className="text-lg font-medium">No Suggestions Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-1 mb-4">
                AI can analyze your wireframe and provide suggestions to improve layout, content, and style.
              </p>
              <Button
                onClick={generateSuggestions}
                disabled={isLoading || !wireframeData}
              >
                Generate Suggestions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WireframeAISuggestions;
