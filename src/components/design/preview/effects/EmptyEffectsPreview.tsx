
import { EyeOff } from "lucide-react";

const EmptyEffectsPreview = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <EyeOff className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
    <h3 className="text-lg font-medium text-muted-foreground">No effects selected</h3>
    <p className="text-sm text-muted-foreground max-w-md mt-2">
      Select animation or interaction elements to preview their effects here.
    </p>
  </div>
);

export default EmptyEffectsPreview;

export { EmptyEffectsPreview };
