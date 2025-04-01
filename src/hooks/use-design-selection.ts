
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DesignOption } from "@/components/design/VisualPicker";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type RankedDesignOption = DesignOption & {
  rank?: number | null;
  notes?: string | null;
};

export const useDesignSelection = (maxSelectionsByCategory: Record<string, number>) => {
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, RankedDesignOption>>({});
  const [selectionLimitReached, setSelectionLimitReached] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [attemptedSelection, setAttemptedSelection] = useState<DesignOption | null>(null);
  const { user } = useAuth();

  // Count selections by category
  const getSelectionsByCategory = () => {
    const countByCategory: Record<string, number> = {};
    
    Object.values(selectedDesigns).forEach(design => {
      countByCategory[design.category] = (countByCategory[design.category] || 0) + 1;
    });
    
    return countByCategory;
  };

  // Function to load saved design preferences from Supabase
  const loadSavedPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('design_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading design preferences:', error);
        return;
      }

      if (data && data.length > 0) {
        const loadedDesigns: Record<string, RankedDesignOption> = {};
        
        data.forEach(item => {
          loadedDesigns[item.id] = {
            id: item.design_option_id,
            title: item.title,
            description: "",
            imageUrl: "",
            category: item.category,
            rank: item.rank,
            notes: item.notes
          };
        });
        
        setSelectedDesigns(loadedDesigns);
        toast.info(`Loaded ${data.length} saved design preferences`);
      }
    } catch (error) {
      console.error('Error loading saved preferences:', error);
    }
  };

  // Load saved preferences when user changes
  useEffect(() => {
    loadSavedPreferences();
  }, [user?.id]);

  // Function to save design preference to Supabase
  const saveDesignPreference = async (designId: string, design: RankedDesignOption) => {
    if (!user) {
      toast.error('You must be logged in to save preferences');
      return;
    }

    try {
      const { error } = await supabase
        .from('design_preferences')
        .upsert({
          id: designId,
          user_id: user.id,
          design_option_id: design.id as string,
          category: design.category,
          title: design.title,
          rank: design.rank,
          notes: design.notes
        });

      if (error) {
        console.error('Error saving design preference:', error);
        toast.error('Failed to save design preference');
      }
    } catch (error) {
      console.error('Error in saveDesignPreference:', error);
    }
  };

  // Function to delete design preference from Supabase
  const deleteDesignPreference = async (designId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('design_preferences')
        .delete()
        .eq('id', designId);

      if (error) {
        console.error('Error removing design preference:', error);
        toast.error('Failed to remove design preference');
      }
    } catch (error) {
      console.error('Error in deleteDesignPreference:', error);
    }
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
    const newDesign = {
      ...option,
      rank: null,
      notes: ""
    };
    
    setSelectedDesigns(prev => ({
      ...prev,
      [newId]: newDesign
    }));
    
    // Save to Supabase
    saveDesignPreference(newId, newDesign);
    
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
    
    // Delete from Supabase
    deleteDesignPreference(designId);
    
    const selectionsByCategory = getSelectionsByCategory();
    const categoryCount = (selectionsByCategory[design.category] || 0) - 1;
    const maxForCategory = maxSelectionsByCategory[design.category] || 4;
    
    toast.info(`Removed ${design.category} design. You can add ${maxForCategory - categoryCount} more.`);
  };

  // Update Supabase when ranks or notes change
  useEffect(() => {
    Object.entries(selectedDesigns).forEach(([designId, design]) => {
      saveDesignPreference(designId, design);
    });
  }, [selectedDesigns]);

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
