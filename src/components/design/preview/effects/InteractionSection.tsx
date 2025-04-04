
import { memo } from "react";
import { InteractionPreview } from "../../interaction";
import { DesignOption } from "../types";

interface InteractionSectionProps {
  interactions: DesignOption[];
}

const InteractionSection = memo(({ interactions }: InteractionSectionProps) => {
  if (interactions.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Interactions</h2>
      <div className="grid grid-cols-1 gap-6">
        {interactions.map(interaction => (
          <InteractionPreview key={interaction.id} interaction={interaction} />
        ))}
      </div>
    </div>
  );
});

InteractionSection.displayName = "InteractionSection";

export default InteractionSection;
