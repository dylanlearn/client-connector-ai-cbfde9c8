
import { memo } from "react";
import { DesignOption } from "./types";
import AnimationSection from "./effects/AnimationSection";
import InteractionSection from "./effects/InteractionSection";
import { EmptyEffectsPreview } from "./effects/EmptyEffectsPreview";

interface EffectsPreviewProps {
  hasAnimation: boolean;
  hasInteraction: boolean;
  selectedAnimations: DesignOption[];
  selectedInteractions: DesignOption[];
  isFullscreen: boolean;
}

const EffectsPreview = memo(({
  hasAnimation,
  hasInteraction,
  selectedAnimations,
  selectedInteractions,
  isFullscreen
}: EffectsPreviewProps) => {
  if (!hasAnimation && !hasInteraction) {
    return <EmptyEffectsPreview />;
  }

  return (
    <div 
      className="overflow-auto p-4" 
      style={{ height: isFullscreen ? "calc(100vh - 150px)" : "500px" }}
    >
      {hasAnimation && <AnimationSection animations={selectedAnimations} />}
      {hasInteraction && <InteractionSection interactions={selectedInteractions} />}
    </div>
  );
});

EffectsPreview.displayName = "EffectsPreview";

export default EffectsPreview;
