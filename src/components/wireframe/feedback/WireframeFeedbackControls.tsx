
import React from 'react';
import { Button } from '@/components/ui/button';
import { IconThumbUp, IconThumbDown, IconMessage } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { getSuggestion } from '../renderers/utilities';

interface WireframeFeedbackControlsProps {
  onFeedback?: (type: string, details?: string) => void;
  feedbackSent?: boolean;
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  copyText?: {
    likeButtonLabel?: string;
    dislikeButtonLabel?: string;
    commentButtonLabel?: string;
  };
}

const WireframeFeedbackControls: React.FC<WireframeFeedbackControlsProps> = ({
  onFeedback,
  feedbackSent = false,
  className = '',
  showLabels = true,
  size = 'sm',
  variant = 'outline',
  copyText
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
        <IconThumbUp className="h-4 w-4 mr-1" />
        {showLabels && getSuggestion(copyText, 'likeButtonLabel', 'Like')}
      </Button>
      
      <Button
        variant={variant}
        size={size}
        onClick={() => handleFeedback('dislike')}
        disabled={feedbackSent}
        className={cn(feedbackSent && 'opacity-50')}
      >
        <IconThumbDown className="h-4 w-4 mr-1" />
        {showLabels && getSuggestion(copyText, 'dislikeButtonLabel', 'Dislike')}
      </Button>
      
      <Button
        variant={variant}
        size={size}
        onClick={() => handleFeedback('comment')}
        disabled={feedbackSent}
        className={cn(feedbackSent && 'opacity-50')}
      >
        <IconMessage className="h-4 w-4 mr-1" />
        {showLabels && getSuggestion(copyText, 'commentButtonLabel', 'Comment')}
      </Button>
    </div>
  );
};

export default WireframeFeedbackControls;
