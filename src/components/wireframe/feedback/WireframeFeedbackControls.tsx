import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Sparkles, 
  X,
  Check,
  Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useWireframeFeedback } from '@/hooks/wireframe/use-wireframe-feedback';
import { useToast } from '@/hooks/use-toast';
import { Rating } from '@/components/ui/rating';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

interface WireframeFeedbackControlsProps {
  wireframeId: string;
  onFeedbackSubmitted?: (feedback: string, rating: number) => void;
  className?: string;
  compact?: boolean;
}

const WireframeFeedbackControls: React.FC<WireframeFeedbackControlsProps> = ({
  wireframeId,
  onFeedbackSubmitted,
  className,
  compact = false
}) => {
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { provideFeedback } = useWireframeFeedback([], () => {}, toast);

  const handleSubmitFeedback = async () => {
    if (!wireframeId) return;
    
    setIsSubmitting(true);
    
    try {
      await provideFeedback(wireframeId, feedbackText, rating);
      
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(feedbackText, rating);
      }
      
      // Reset form
      setFeedbackType(null);
      setFeedbackText('');
      setIsExpanded(false);
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback"
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExpandFeedback = (type: 'positive' | 'negative') => {
    setFeedbackType(type);
    setIsExpanded(true);
  };
  
  const handleCancelFeedback = () => {
    setFeedbackType(null);
    setFeedbackText('');
    setIsExpanded(false);
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleExpandFeedback('positive')}
          className="flex items-center gap-1"
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline">Feedback</span>
        </Button>
      </div>
    );
  }

  if (isExpanded) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {feedbackType === 'positive' ? 'What did you like?' : 'What could be improved?'}
            </h3>
            <Button variant="ghost" size="sm" onClick={handleCancelFeedback}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Rating 
              value={rating} 
              onChange={setRating} 
              count={5} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Your feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Share your thoughts on this wireframe..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelFeedback}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitFeedback} 
              disabled={!feedbackText.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleExpandFeedback('positive')}
        className="flex items-center gap-1"
      >
        <ThumbsUp className="h-4 w-4" />
        <span>Helpful</span>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleExpandFeedback('negative')}
        className="flex items-center gap-1"
      >
        <ThumbsDown className="h-4 w-4" />
        <span>Needs Improvement</span>
      </Button>
    </div>
  );
};

export default WireframeFeedbackControls;
