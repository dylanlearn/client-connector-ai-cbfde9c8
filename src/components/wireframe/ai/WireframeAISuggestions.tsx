
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Sparkles, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WireframeAISuggestionsProps {
  wireframeId?: string;
  focusedSectionId?: string;
  onClose: () => void;
  onApplySuggestion?: (suggestion: any) => void;
}

// Define the Suggestion interface
interface Suggestion {
  title: string;
  description: string;
  previewJSON?: string;
  improvement: string;
  sectionId?: string;
  changes?: any;
}

const WireframeAISuggestions: React.FC<WireframeAISuggestionsProps> = ({
  wireframeId,
  focusedSectionId,
  onClose,
  onApplySuggestion
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  // Fetch suggestions when the component mounts
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!wireframeId) {
        setError('No wireframe ID provided');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Call the Supabase edge function to get AI suggestions
        const { data, error } = await supabase.functions.invoke('generate-advanced-wireframe', {
          body: {
            action: 'generate-suggestions',
            wireframeId,
            targetSection: focusedSectionId,
          }
        });

        if (error) throw error;

        if (data && data.success && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
        } else {
          throw new Error('Invalid response from suggestions API');
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to get AI suggestions. Please try again later.');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (wireframeId) {
      fetchSuggestions();
    } else {
      // For demo purposes, provide some default suggestions if no wireframeId
      setSuggestions([
        {
          title: 'Improve Color Contrast',
          description: 'Enhance readability by increasing contrast between text and background colors.',
          improvement: 'Accessibility',
          changes: {
            colorScheme: {
              text: '#111827',
              background: '#ffffff'
            }
          }
        },
        {
          title: 'Add Clear Call-to-Action',
          description: 'Make your hero section more effective with a prominent call-to-action button.',
          improvement: 'Conversion',
          changes: {
            cta: {
              text: 'Get Started',
              style: 'primary'
            }
          }
        },
        {
          title: 'Optimize Mobile Layout',
          description: 'Adjust spacing and font sizes to improve mobile experience.',
          improvement: 'Responsiveness',
          changes: {
            mobile: {
              padding: '1rem',
              fontSize: '90%'
            }
          }
        }
      ]);
      setIsLoading(false);
    }
  }, [wireframeId, focusedSectionId]);

  // Handle applying a suggestion
  const handleApplySuggestion = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  // Handle confirmation of applying the suggestion
  const handleConfirm = async () => {
    if (!selectedSuggestion || !onApplySuggestion) return;

    setIsApplying(true);

    try {
      // Apply the suggestion
      onApplySuggestion(selectedSuggestion);

      toast({
        title: 'Suggestion Applied',
        description: 'The AI suggestion has been applied to your wireframe.',
      });

      // Close the dialog
      setSelectedSuggestion(null);
      onClose();
    } catch (err) {
      toast({
        title: 'Failed to Apply Suggestion',
        description: 'There was an error applying the suggestion.',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Design Suggestions
          </DialogTitle>
          <DialogDescription>
            Smart recommendations to improve your wireframe design
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Generating AI suggestions...</span>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && suggestions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No suggestions available at this time.</p>
          </div>
        )}

        <div className="grid gap-4">
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                <CardDescription>
                  {suggestion.improvement && (
                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mr-2">
                      {suggestion.improvement}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{suggestion.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleApplySuggestion(suggestion)}
                >
                  Apply Suggestion
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Confirmation Dialog */}
      {selectedSuggestion && (
        <Dialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply Suggestion</DialogTitle>
              <DialogDescription>
                Are you sure you want to apply this suggestion? This will modify your wireframe.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium">{selectedSuggestion.title}</h4>
              <p className="text-sm mt-1">{selectedSuggestion.description}</p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                disabled={isApplying}
                onClick={() => setSelectedSuggestion(null)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleConfirm}
                disabled={isApplying}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Apply
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default WireframeAISuggestions;
