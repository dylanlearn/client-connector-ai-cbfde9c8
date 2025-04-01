
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DesignOption } from "@/components/design/VisualPicker";

export type RankedDesignOption = DesignOption & {
  rank?: number;
  notes?: string;
};

export const useDesignSelection = (maxSelections: number = 4) => {
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, RankedDesignOption>>({});
  const [selectionLimitReached, setSelectionLimitReached] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [attemptedSelection, setAttemptedSelection] = useState<DesignOption | null>(null);

  const handleSelectDesign = (option: DesignOption) => {
    if (
      Object.keys(selectedDesigns).length >= maxSelections && 
      !selectedDesigns[option.category]
    ) {
      setAttemptedSelection(option);
      setShowLimitDialog(true);
      return;
    }
    
    setSelectedDesigns(prev => ({
      ...prev,
      [option.category]: {
        ...option,
        rank: prev[option.category]?.rank || null,
        notes: prev[option.category]?.notes || ""
      }
    }));
  };

  const confirmReplaceSelection = () => {
    if (attemptedSelection) {
      const categories = Object.keys(selectedDesigns);
      if (categories.length > 0) {
        const randomCategory = categories[0];
        const newSelections = { ...selectedDesigns };
        delete newSelections[randomCategory];
        
        setSelectedDesigns({
          ...newSelections,
          [attemptedSelection.category]: attemptedSelection
        });
        
        toast.success(`Replaced ${randomCategory} design with ${attemptedSelection.category} design`);
      }
    }
    setShowLimitDialog(false);
    setAttemptedSelection(null);
  };

  const handleRemoveDesign = (category: string) => {
    const newSelections = { ...selectedDesigns };
    delete newSelections[category];
    setSelectedDesigns(newSelections);
    toast.info(`Removed ${category} design. You can add ${maxSelections - Object.keys(newSelections).length} more.`);
  };

  useEffect(() => {
    setSelectionLimitReached(Object.keys(selectedDesigns).length >= maxSelections);
  }, [selectedDesigns, maxSelections]);

  return {
    selectedDesigns,
    setSelectedDesigns,
    selectionLimitReached,
    showLimitDialog,
    setShowLimitDialog,
    attemptedSelection,
    completedCategories: Object.keys(selectedDesigns).length,
    handleSelectDesign,
    confirmReplaceSelection,
    handleRemoveDesign
  };
};
