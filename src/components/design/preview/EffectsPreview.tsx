
import { Sparkles } from "lucide-react";
import AnimationPreview from "../AnimationPreview";
import InteractionPreview from "../InteractionPreview";
import { DesignOption } from "../DesignPreview";

interface EffectsPreviewProps {
  hasAnimation: boolean;
  hasInteraction: boolean;
  selectedAnimations: DesignOption[];
  selectedInteractions: DesignOption[];
  isFullscreen: boolean;
}

const EffectsPreview = ({
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
    <div className="overflow-auto p-4" style={{ height: isFullscreen ? "calc(100vh - 150px)" : "500px" }}>
      {hasAnimation && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Animations</h2>
          <div className="grid grid-cols-1 gap-6">
            {selectedAnimations.map(animation => (
              <AnimationPreview key={animation.id} animation={animation} />
            ))}
          </div>
        </div>
      )}

      {hasInteraction && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Interactions</h2>
          <div className="grid grid-cols-1 gap-6">
            {selectedInteractions.map(interaction => (
              <InteractionPreview key={interaction.id} interaction={interaction} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyEffectsPreview = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <Sparkles className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
    <h3 className="text-lg font-medium text-muted-foreground">No animations or interactions selected</h3>
    <p className="text-sm text-muted-foreground max-w-md mt-2">
      Select animations and interactions to see them previewed here. These will add life and engagement to your website.
    </p>
  </div>
);

export default EffectsPreview;
