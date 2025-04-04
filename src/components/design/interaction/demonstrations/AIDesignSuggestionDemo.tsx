
import React, { useState, useEffect } from 'react';
import { DesignMemoryService } from '@/services/ai/design/design-memory-service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Define the type for a suggestion
interface DesignSuggestion {
  id: string;
  title: string;
  category: string;
  description: string;
}

// This demo shows how AI design suggestions work
const AIDesignSuggestionDemo = () => {
  const [suggestions, setSuggestions] = useState<DesignSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // Fetch initial suggestions on component mount
  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Function to fetch design suggestions from memory service
  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      // Query design patterns with relevance threshold of 0.7
      const results = await DesignMemoryService.queryDesignMemory({
        relevance_threshold: 0.7, // Use underscore format to match the API
        limit: 5
      });
      
      // Map results to suggestion format
      const mappedSuggestions = results.map(result => ({
        id: result.id || 'unknown',
        title: result.title,
        category: result.category,
        description: result.description
      }));
      
      setSuggestions(mappedSuggestions);
    } catch (error) {
      console.error('Error fetching design suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle feedback on a suggestion
  const handleFeedback = async (like: boolean) => {
    if (suggestions.length === 0 || feedbackGiven) return;
    
    const currentSuggestion = suggestions[selectedIndex];
    
    try {
      // Record feedback using the design memory service
      await DesignMemoryService.recordFeedback(
        currentSuggestion.id,
        'user123', // Placeholder user ID - in a real app, use the actual user ID
        like ? 'like' : 'dislike',
        like ? 5 : 2, // Rating number based on like/dislike
        `User ${like ? 'liked' : 'disliked'} the suggestion`, // Feedback content
        { interactionType: 'demo' } // Additional context
      );
      
      setFeedbackGiven(true);
      
      // If disliked, get a new suggestion
      if (!like && selectedIndex < suggestions.length - 1) {
        setSelectedIndex(selectedIndex + 1);
        setFeedbackGiven(false);
      }
    } catch (error) {
      console.error('Error recording feedback:', error);
    }
  };

  // Function to generate a new suggestion
  const handleGenerateNew = async () => {
    await fetchSuggestions();
    setSelectedIndex(0);
    setFeedbackGiven(false);
  };

  // If there are no suggestions or still loading, show appropriate UI
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading design suggestions...</p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-sm text-muted-foreground mb-4">No design suggestions available.</p>
        <Button onClick={handleGenerateNew}>Generate Suggestions</Button>
      </div>
    );
  }

  const currentSuggestion = suggestions[selectedIndex];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">{currentSuggestion.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{currentSuggestion.category}</p>
          <p className="text-sm">{currentSuggestion.description}</p>
          
          {!feedbackGiven ? (
            <div className="flex justify-center gap-4 mt-6">
              <Button 
                variant="outline" 
                onClick={() => handleFeedback(false)}
                className="w-32"
              >
                Not helpful
              </Button>
              <Button 
                onClick={() => handleFeedback(true)}
                className="w-32"
              >
                Helpful
              </Button>
            </div>
          ) : (
            <div className="text-center mt-6">
              <p className="text-sm text-green-600 mb-2">Thanks for your feedback!</p>
              <Button onClick={handleGenerateNew}>Get New Suggestions</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {suggestions.length > 1 && (
        <div className="flex justify-between items-center px-2">
          <Button 
            variant="ghost" 
            size="sm"
            disabled={selectedIndex === 0}
            onClick={() => {
              setSelectedIndex(selectedIndex - 1);
              setFeedbackGiven(false);
            }}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            {selectedIndex + 1} of {suggestions.length}
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={selectedIndex === suggestions.length - 1}
            onClick={() => {
              setSelectedIndex(selectedIndex + 1);
              setFeedbackGiven(false);
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIDesignSuggestionDemo;
