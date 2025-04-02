
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isCreating: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const FormActions = ({ isCreating, onCancel, onSubmit }: FormActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onSubmit} 
        disabled={isCreating}
        className="flex-1"
      >
        {isCreating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Test...
          </>
        ) : "Create A/B Test"}
      </Button>
      <Button 
        onClick={onCancel}
        variant="outline"
        disabled={isCreating}
        className="flex-shrink-0"
      >
        Cancel
      </Button>
    </div>
  );
};
