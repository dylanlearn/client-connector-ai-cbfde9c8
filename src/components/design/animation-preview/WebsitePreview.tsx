
import { memo } from "react";
import {
  WebsiteFadeSlideDemo,
  WebsiteScrollRevealDemo,
  WebsiteParallaxDemo,
  Website3DDemo,
  WebsiteMicrointeractionsDemo,
  WebsiteTextAnimationDemo,
  WebsiteStaggeredRevealDemo,
  WebsiteFloatingElementsDemo,
  WebsiteElasticMotionDemo
} from "../animations/demos";

interface WebsitePreviewProps {
  animationType: string;
  isPlaying: boolean;
  onClose: () => void;
}

export const WebsitePreview = memo(({ 
  animationType, 
  isPlaying, 
  onClose 
}: WebsitePreviewProps) => {
  const demoProps = { isPlaying };
  
  const renderPreview = () => {
    switch (animationType) {
      case "animation-1": return <WebsiteFadeSlideDemo {...demoProps} />;
      case "animation-2": return <WebsiteScrollRevealDemo {...demoProps} />;
      case "animation-3": return <WebsiteParallaxDemo {...demoProps} />;
      case "animation-4": return <Website3DDemo {...demoProps} />;
      case "animation-5": return <WebsiteMicrointeractionsDemo {...demoProps} />;
      case "animation-6": return <WebsiteTextAnimationDemo {...demoProps} />;
      case "animation-7": return <WebsiteStaggeredRevealDemo {...demoProps} />;
      case "animation-8": return <WebsiteFloatingElementsDemo {...demoProps} />;
      case "animation-9": return <WebsiteElasticMotionDemo {...demoProps} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No preview available</p>
          </div>
        );
    }
  };

  return (
    <div className="relative h-64 bg-gradient-to-r from-gray-50 to-blue-50 rounded-md flex items-center justify-center mb-4 overflow-hidden">
      {renderPreview()}
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
      >
        <span className="sr-only">Close</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  );
});

WebsitePreview.displayName = "WebsitePreview";
