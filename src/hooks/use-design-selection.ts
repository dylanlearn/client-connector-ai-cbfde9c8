
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DesignOption } from "@/components/design/VisualPicker";

export type RankedDesignOption = DesignOption & {
  rank?: number;
  notes?: string;
};

export const useDesignSelection = (maxSelectionsByCategory: Record<string, number>) => {
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, RankedDesignOption>>({});
  const [selectionLimitReached, setSelectionLimitReached] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [attemptedSelection, setAttemptedSelection] = useState<DesignOption | null>(null);

  // Count selections by category
  const getSelectionsByCategory = () => {
    const countByCategory: Record<string, number> = {};
    
    Object.values(selectedDesigns).forEach(design => {
      countByCategory[design.category] = (countByCategory[design.category] || 0) + 1;
    });
    
    return countByCategory;
  };

  const handleSelectDesign = (option: DesignOption) => {
    const selectionsByCategory = getSelectionsByCategory();
    const currentCategoryCount = selectionsByCategory[option.category] || 0;
    const maxForCategory = maxSelectionsByCategory[option.category] || 4;

    // Check if this specific item is already selected
    const isAlreadySelected = Object.values(selectedDesigns).some(
      design => design.id === option.id
    );

    if (isAlreadySelected) {
      toast.info(`You've already selected this ${option.category} design`);
      return;
    }
    
    // Check if we've reached the maximum selections for this category
    if (currentCategoryCount >= maxForCategory) {
      setAttemptedSelection(option);
      setShowLimitDialog(true);
      return;
    }
    
    // Add the new selection
    const newId = `${option.category}-${Date.now()}`;
    setSelectedDesigns(prev => ({
      ...prev,
      [newId]: {
        ...option,
        rank: null,
        notes: ""
      }
    }));
    
    toast.success(`Added ${option.category} design. ${maxForCategory - currentCategoryCount - 1} more ${option.category} selections available.`);
  };

  const confirmReplaceSelection = () => {
    setShowLimitDialog(false);
    setAttemptedSelection(null);
  };

  const handleRemoveDesign = (designId: string) => {
    const design = selectedDesigns[designId];
    if (!design) return;
    
    const newSelections = { ...selectedDesigns };
    delete newSelections[designId];
    setSelectedDesigns(newSelections);
    
    const selectionsByCategory = getSelectionsByCategory();
    const categoryCount = (selectionsByCategory[design.category] || 0) - 1;
    const maxForCategory = maxSelectionsByCategory[design.category] || 4;
    
    toast.info(`Removed ${design.category} design. You can add ${maxForCategory - categoryCount} more.`);
  };

  // Calculate total completeness across all categories
  const calculateCompleteness = () => {
    const selectionsByCategory = getSelectionsByCategory();
    let totalSelected = 0;
    let totalPossible = 0;
    
    Object.keys(maxSelectionsByCategory).forEach(category => {
      totalSelected += selectionsByCategory[category] || 0;
      totalPossible += maxSelectionsByCategory[category];
    });
    
    return {
      completedCategories: totalSelected,
      maxSelections: totalPossible
    };
  };

  useEffect(() => {
    const { completedCategories, maxSelections } = calculateCompleteness();
    setSelectionLimitReached(completedCategories >= maxSelections);
  }, [selectedDesigns, maxSelectionsByCategory]);

  return {
    selectedDesigns,
    setSelectedDesigns,
    selectionLimitReached,
    showLimitDialog,
    setShowLimitDialog,
    attemptedSelection,
    ...calculateCompleteness(),
    getSelectionsByCategory,
    handleSelectDesign,
    confirmReplaceSelection,
    handleRemoveDesign
  };
};
