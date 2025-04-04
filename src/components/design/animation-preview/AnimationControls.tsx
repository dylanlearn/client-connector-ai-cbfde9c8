
import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { AnimationCategory } from "@/types/animations";

interface AnimationControlsProps {
  isPlaying: boolean;
  feedbackGiven: 'positive' | 'negative' | null;
  showWebsitePreview: boolean;
  animCategory: AnimationCategory;
  onPlayToggle: () => void;
  onReset: () => void;
  onFeedback: (feedback: 'positive' | 'negative') => void;
  onPreviewToggle: () => void;
}

export const AnimationControls = memo(({
  isPlaying,
  feedbackGiven,
  showWebsitePreview,
  onPlayToggle,
  onReset,
  onFeedback,
  onPreviewToggle
}: AnimationControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onPlayToggle}
        >
          {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onReset}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Feedback buttons */}
        <div className="flex gap-1 mr-2">
          <Button
            variant={feedbackGiven === 'positive' ? 'default' : 'ghost'}
            size="sm" 
            className={feedbackGiven === 'positive' ? 'bg-green-500 hover:bg-green-600' : ''}
            onClick={() => onFeedback('positive')}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant={feedbackGiven === 'negative' ? 'default' : 'ghost'}
            size="sm"
            className={feedbackGiven === 'negative' ? 'bg-red-500 hover:bg-red-600' : ''}
            onClick={() => onFeedback('negative')}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={onPreviewToggle}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          {showWebsitePreview ? "Simple View" : "Website Preview"}
        </Button>
      </div>
    </div>
  );
});

AnimationControls.displayName = "AnimationControls";
