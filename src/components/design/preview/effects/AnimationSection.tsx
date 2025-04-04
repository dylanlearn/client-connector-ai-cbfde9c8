
import { memo } from "react";
import AnimationPreview from "../../animation-preview";
import { DesignOption } from "../types";

interface AnimationSectionProps {
  animations: DesignOption[];
}

const AnimationSection = memo(({ animations }: AnimationSectionProps) => {
  if (animations.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Animations</h2>
      <div className="grid grid-cols-1 gap-6">
        {animations.map(animation => (
          <AnimationPreview key={animation.id} animation={animation} />
        ))}
      </div>
    </div>
  );
});

AnimationSection.displayName = "AnimationSection";

export default AnimationSection;
