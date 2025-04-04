
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import WebsiteFadeSlideDemo from "../animations/demos/WebsiteFadeSlideDemo";
import WebsiteScrollRevealDemo from "../animations/demos/WebsiteScrollRevealDemo";
import WebsiteParallaxDemo from "../animations/demos/WebsiteParallaxDemo";
import Website3DDemo from "../animations/demos/Website3DDemo";
import WebsiteMicrointeractionsDemo from "../animations/demos/WebsiteMicrointeractionsDemo";
import WebsiteTextAnimationDemo from "../animations/demos/WebsiteTextAnimationDemo";
import WebsiteStaggeredRevealDemo from "../animations/demos/WebsiteStaggeredRevealDemo";
import WebsiteFloatingElementsDemo from "../animations/demos/WebsiteFloatingElementsDemo";
import WebsiteElasticMotionDemo from "../animations/demos/WebsiteElasticMotionDemo";

interface WebsitePreviewProps {
  animationType: string;
  isPlaying: boolean;
  onClose: () => void;
}

export const WebsitePreview = ({ 
  animationType, 
  isPlaying, 
  onClose 
}: WebsitePreviewProps) => {
  const [key, setKey] = useState(0);

  // Reset animation when play state changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [isPlaying]);

  // Render the appropriate demo based on animation type
  const renderDemo = () => {
    switch(animationType) {
      case "animation-1":
        return <WebsiteFadeSlideDemo isPlaying={isPlaying} />;
      case "animation-2":
        return <WebsiteScrollRevealDemo isPlaying={isPlaying} />;
      case "animation-3":
        return <WebsiteParallaxDemo isPlaying={isPlaying} />;
      case "animation-4":
        return <Website3DDemo isPlaying={isPlaying} />;
      case "animation-5":
        return <WebsiteMicrointeractionsDemo isPlaying={isPlaying} />;
      case "animation-6":
        return <WebsiteTextAnimationDemo isPlaying={isPlaying} />;
      case "animation-7":
        return <WebsiteStaggeredRevealDemo isPlaying={isPlaying} />;
      case "animation-8":
        return <WebsiteFloatingElementsDemo isPlaying={isPlaying} />;
      case "animation-9":
        return <WebsiteElasticMotionDemo isPlaying={isPlaying} />;
      default:
        return <div className="flex items-center justify-center h-full">No preview available</div>;
    }
  };

  return (
    <div className="relative h-64 bg-white rounded-md shadow-md overflow-hidden" key={key}>
      {renderDemo()}
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm text-gray-600 hover:text-gray-900"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
