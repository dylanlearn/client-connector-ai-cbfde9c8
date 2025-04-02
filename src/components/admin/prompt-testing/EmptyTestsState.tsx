
import { BarChart3 } from "lucide-react";

export function EmptyTestsState() {
  return (
    <div className="rounded-lg border p-8 text-center">
      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="font-medium text-lg mb-2">No Prompt Tests Found</h3>
      <p className="text-muted-foreground">
        No A/B tests have been created yet. Create a test to start optimizing your AI prompts.
      </p>
    </div>
  );
}
