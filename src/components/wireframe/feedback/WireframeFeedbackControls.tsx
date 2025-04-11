
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSuggestion } from '../renderers/utilities';

interface WireframeFeedbackControlsProps {
  onFeedback?: (type: string, details?: string) => void;
  feedbackSent?: boolean;
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  copyText?: {
    likeButtonLabel?: string;
    dislikeButtonLabel?: string;
    commentButtonLabel?: string;
  };
  wireframeId?: string; // Add missing wireframeId prop
  compact?: boolean; // Add missing compact prop
}

const WireframeFeedbackControls: React.FC<WireframeFeedbackControlsProps> = ({
  onFeedback,
  feedbackSent = false,
  className = '',
  showLabels = true,
  size = 'sm',
  variant = 'outline',
  copyText,
  compact = false
}) => {
  const handleFeedback = (type: string) => {
    if (onFeedback && !feedbackSent) {
      onFeedback(type);
    }
  };

  return (
    <div className={cn('flex gap-2 items-center', className)}>
      <Button
        variant={variant}
        size={size}
        onClick={() => handleFeedback('like')}
        disabled={feedbackSent}
        className={cn(feedbackSent && 'opacity-50')}
      >
        <ThumbsUp className="h-4 w-4 mr-1" />
        {showLabels && !compact && getSuggestion(copyText, 'likeButtonLabel', 'Like')}
      </Button>
      
      <Button
        variant={variant}
        size={size}
        onClick={() => handleFeedback('dislike')}
        disabled={feedbackSent}
        className={cn(feedbackSent && 'opacity-50')}
      >
        <ThumbsDown className="h-4 w-4 mr-1" />
        {showLabels && !compact && getSuggestion(copyText, 'dislikeButtonLabel', 'Dislike')}
      </Button>
      
      <Button
        variant={variant}
        size={size}
        onClick={() => handleFeedback('comment')}
        disabled={feedbackSent}
        className={cn(feedbackSent && 'opacity-50')}
      >
        <MessageSquare className="h-4 w-4 mr-1" />
        {showLabels && !compact && getSuggestion(copyText, 'commentButtonLabel', 'Comment')}
      </Button>
    </div>
  );
};

export default WireframeFeedbackControls;
