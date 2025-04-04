
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ThumbsUp, ThumbsDown, MessageSquare, RefreshCcw, Lightbulb } from "lucide-react";

interface DesignOption {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  value: any;
}

interface AIDesignSuggestionCardProps {
  title: string;
  description: string;
  options: DesignOption[];
  onSelect: (option: DesignOption) => void;
  onFeedback: (feedback: { message: string, type: 'like' | 'dislike' | 'refine' }) => void;
  isLoading?: boolean;
}

const AIDesignSuggestionCard: React.FC<AIDesignSuggestionCardProps> = ({
  title,
  description,
  options,
  onSelect,
  onFeedback,
  isLoading = false
}) => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = React.useState('');
  const [showFeedback, setShowFeedback] = React.useState(false);

  const handleSelect = (option: DesignOption) => {
    setSelectedOption(option.id);
    onSelect(option);
  };

  const handleFeedbackSubmit = (type: 'like' | 'dislike' | 'refine') => {
    if (type === 'refine' && !feedbackInput.trim()) {
      return;
    }
    
    onFeedback({
      message: feedbackInput || `User ${type === 'like' ? 'liked' : 'disliked'} the suggestions`,
      type
    });
    
    setFeedbackInput('');
    setShowFeedback(false);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 border-gradient-subtle shadow-md bg-background/60 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-blue-100/20">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-full">
            <Lightbulb className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </CardHeader>
      
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((option) => (
              <div 
                key={option.id}
                className={`rounded-lg border overflow-hidden transition-all duration-200 hover:shadow-md ${
                  selectedOption === option.id 
                    ? 'ring-2 ring-purple-500 border-transparent' 
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                {option.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img 
                      src={option.imageUrl} 
                      alt={option.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-3">
                  <h3 className="font-medium">{option.title}</h3>
                  {option.description && (
                    <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                  )}
                  
                  <Button
                    size="sm"
                    variant={selectedOption === option.id ? "default" : "outline"}
                    className={`mt-3 w-full ${
                      selectedOption === option.id 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                        : ''
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {selectedOption === option.id ? (
                      <>
                        <Check className="mr-1 h-4 w-4" /> Selected
                      </>
                    ) : (
                      'Select'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3 border-t p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => handleFeedbackSubmit('like')}
            >
              <ThumbsUp className="h-4 w-4 mr-1" /> Like
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleFeedbackSubmit('dislike')}
            >
              <ThumbsDown className="h-4 w-4 mr-1" /> Dislike
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFeedback(!showFeedback)}
            >
              <MessageSquare className="h-4 w-4 mr-1" /> 
              {showFeedback ? 'Hide' : 'Comment'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 text-purple-700"
              onClick={() => onFeedback({ message: "User requested more options", type: 'refine' })}
            >
              <RefreshCcw className="h-4 w-4 mr-1" /> 
              More Options
            </Button>
          </div>
        </div>
        
        {showFeedback && (
          <div className="w-full mt-2 space-y-2">
            <textarea
              className="w-full p-2 border rounded-md resize-none min-h-[80px] text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Tell us what you think or how we can improve these suggestions..."
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
            />
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              onClick={() => handleFeedbackSubmit('refine')}
              disabled={!feedbackInput.trim()}
            >
              Submit Feedback
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AIDesignSuggestionCard;
