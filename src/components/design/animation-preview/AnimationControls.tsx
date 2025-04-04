
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";

interface AnimationControlsProps {
  isPlaying: boolean;
  feedbackGiven: 'positive' | 'negative' | null;
  showWebsitePreview: boolean;
  animCategory: string;
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
      
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFeedback('positive')}
          disabled={feedbackGiven !== null}
          className={feedbackGiven === 'positive' ? 'bg-green-100' : ''}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFeedback('negative')}
          disabled={feedbackGiven !== null}
          className={feedbackGiven === 'negative' ? 'bg-red-100' : ''}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        
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
