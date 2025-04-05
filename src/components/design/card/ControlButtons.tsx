
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ControlButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  showRestartButton: boolean;
  onRestart: () => void;
}

const ControlButtons = ({ 
  onLike, 
  onDislike, 
  showRestartButton,
  onRestart
}: ControlButtonsProps) => {
  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-red-100 hover:bg-red-200 border-red-200"
          onClick={onDislike}
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-green-100 hover:bg-green-200 border-green-200"
          onClick={onLike}
        >
          <Check className="h-6 w-6 text-green-500" />
        </Button>
      </div>
      
      {showRestartButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRestart}
          className="mt-4"
        >
          See options again
        </Button>
      )}
    </>
  );
};

export default ControlButtons;
