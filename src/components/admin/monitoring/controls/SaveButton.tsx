
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface SaveButtonProps {
  onSave: () => void;
  isSaving: boolean;
}

export function SaveButton({ onSave, isSaving }: SaveButtonProps) {
  return (
    <div className="flex justify-end mt-6">
      <Button 
        onClick={onSave} 
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Configurations
          </>
        )}
      </Button>
    </div>
  );
}
