
import { AlertCircle } from "lucide-react";

interface SelectionProgressProps {
  completedCategories: number;
  maxSelections: number;
  selectionLimitReached: boolean;
}

const SelectionProgress = ({ 
  completedCategories, 
  maxSelections, 
  selectionLimitReached 
}: SelectionProgressProps) => {
  const progress = (completedCategories / maxSelections) * 100;

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-2">Design Your Website</h1>
      <p className="text-muted-foreground mb-4">
        Swipe to select your preferred design elements (up to 4 per category, 2 for fonts)
      </p>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-muted-foreground">
        {completedCategories} of {maxSelections} total selections completed
      </p>
      
      {selectionLimitReached && (
        <div className="mt-2 p-2 bg-amber-100 text-amber-800 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Overall selection limit reached. You can continue or replace existing choices.</span>
        </div>
      )}
    </div>
  );
};

export default SelectionProgress;
