
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
    // Check if this category is already selected
    if (selectedDesigns[option.category]) {
      // Update the existing selection with the new option
      setSelectedDesigns(prev => ({
        ...prev,
        [option.category]: {
          ...option,
          rank: prev[option.category]?.rank || null,
          notes: prev[option.category]?.notes || ""
        }
      }));
      toast.success(`Updated ${option.category} selection`);
      return;
    }
    
    // Check if we've reached the maximum selections
    if (Object.keys(selectedDesigns).length >= maxSelections) {
      setAttemptedSelection(option);
      setShowLimitDialog(true);
      return;
    }
    
    // Add the new selection
    setSelectedDesigns(prev => ({
      ...prev,
      [option.category]: {
        ...option,
        rank: null,
        notes: ""
      }
    }));
    
    toast.success(`Added ${option.category} design. ${maxSelections - Object.keys(selectedDesigns).length - 1} selections remaining.`);
  };

  const confirmReplaceSelection = () => {
    if (attemptedSelection) {
      // We need to replace a selection with the attempted one
      // Instead of removing a random one, let the user choose which one to replace
      // For now, we'll just add it if there's room, otherwise we don't do anything
      if (Object.keys(selectedDesigns).length < maxSelections) {
        setSelectedDesigns(prev => ({
          ...prev,
          [attemptedSelection.category]: {
            ...attemptedSelection,
            rank: null,
            notes: ""
          }
        }));
        toast.success(`Added ${attemptedSelection.category} design`);
      } else {
        toast.info(`Please remove a selection first before adding ${attemptedSelection.category}`);
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
