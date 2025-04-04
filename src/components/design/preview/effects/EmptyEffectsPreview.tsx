
import { Sparkles } from "lucide-react";

const EmptyEffectsPreview = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <Sparkles className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
    <h3 className="text-lg font-medium text-muted-foreground">No animations or interactions selected</h3>
    <p className="text-sm text-muted-foreground max-w-md mt-2">
      Select animations and interactions to see them previewed here. These will add life and engagement to your website.
    </p>
  </div>
);

export default EmptyEffectsPreview;
