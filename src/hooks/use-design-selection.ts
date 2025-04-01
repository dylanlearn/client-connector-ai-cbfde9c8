import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DesignOption } from "@/components/design/VisualPicker";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { UserPreference } from "./use-analytics";
import { useNavigate } from "react-router-dom";

const VALID_CATEGORIES = ['hero', 'navbar', 'about', 'footer', 'font'];
const CLIENT_ALLOWED_ROUTES = ['/intake', '/design-picker', '/templates', '/'];

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
  const [clientAccessMode, setClientAccessMode] = useState(false);
  const [viewOnlyMode, setViewOnlyMode] = useState(false);
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [designerId, setDesignerId] = useState<string | null>(null);
  const navigate = useNavigate();

  const getSelectionsByCategory = () => {
    const countByCategory: Record<string, number> = {};
    
    Object.values(selectedDesigns).forEach(design => {
      countByCategory[design.category] = (countByCategory[design.category] || 0) + 1;
    });
    
    return countByCategory;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('clientToken');
    const dId = urlParams.get('designerId');
    
    if (token && dId) {
      setClientToken(token);
      setDesignerId(dId);
      setClientAccessMode(true);
      setViewOnlyMode(true);
      loadSharedPreferences(dId);
      
      const currentPath = window.location.pathname;
      if (!CLIENT_ALLOWED_ROUTES.includes(currentPath) && currentPath !== '/client-hub') {
        toast.warning("This area is restricted. Redirecting to your hub.");
        navigate('/client-hub');
      }
    } else {
      loadSavedPreferences();
    }
  }, [user?.id, navigate]);

  const loadSharedPreferences = async (designerId: string) => {
    try {
      const { data, error } = await supabase
        .from('design_preferences')
        .select('*')
        .eq('user_id', designerId);

      if (error) {
        console.error('Error loading shared design preferences:', error);
        return;
      }

      if (data && data.length > 0) {
        const loadedDesigns: Record<string, RankedDesignOption> = {};
        
        data.forEach((item: UserPreference) => {
          if (VALID_CATEGORIES.includes(item.category)) {
            loadedDesigns[item.id] = {
              id: item.design_option_id,
              title: item.title,
              description: "",
              imageUrl: "",
              category: item.category as DesignOption["category"],
              rank: item.rank,
              notes: item.notes
            };
          } else {
            console.warn(`Skipping invalid category: ${item.category}`);
          }
        });
        
        setSelectedDesigns(loadedDesigns);
        toast.info(`Viewing designer's ${Object.keys(loadedDesigns).length} design selections`);
      }
    } catch (error) {
      console.error('Error loading shared preferences:', error);
    }
  };

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
        
        data.forEach((item: UserPreference) => {
          if (VALID_CATEGORIES.includes(item.category)) {
            loadedDesigns[item.id] = {
              id: item.design_option_id,
              title: item.title,
              description: "",
              imageUrl: "",
              category: item.category as DesignOption["category"],
              rank: item.rank,
              notes: item.notes
            };
          } else {
            console.warn(`Skipping invalid category: ${item.category}`);
          }
        });
        
        setSelectedDesigns(loadedDesigns);
        toast.info(`Loaded ${Object.keys(loadedDesigns).length} saved design preferences`);
      }
    } catch (error) {
      console.error('Error loading saved preferences:', error);
    }
  };

  const saveDesignPreference = async (designId: string, design: RankedDesignOption) => {
    if (!user) {
      toast.error('You must be logged in to save preferences');
      return;
    }

    if (viewOnlyMode) {
      toast.error('You are in view-only mode and cannot save changes');
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

  const deleteDesignPreference = async (designId: string) => {
    if (!user) return;
    
    if (viewOnlyMode) {
      toast.error('You are in view-only mode and cannot delete preferences');
      return;
    }

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

  const generateClientShareLink = async () => {
    if (!user) {
      toast.error('You must be logged in to generate a share link');
      return null;
    }
    
    try {
      const token = Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const baseUrl = window.location.origin;
      const shareLink = `${baseUrl}/client-hub?clientToken=${token}&designerId=${user.id}`;
      
      return shareLink;
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Failed to generate share link');
      return null;
    }
  };

  const handleSelectDesign = (option: DesignOption) => {
    const selectionsByCategory = getSelectionsByCategory();
    const currentCategoryCount = selectionsByCategory[option.category] || 0;
    const maxForCategory = maxSelectionsByCategory[option.category] || 4;

    const isAlreadySelected = Object.values(selectedDesigns).some(
      design => design.id === option.id
    );

    if (isAlreadySelected) {
      toast.info(`You've already selected this ${option.category} design`);
      return;
    }
    
    if (currentCategoryCount >= maxForCategory) {
      setAttemptedSelection(option);
      setShowLimitDialog(true);
      return;
    }
    
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
    
    deleteDesignPreference(designId);
    
    const selectionsByCategory = getSelectionsByCategory();
    const categoryCount = (selectionsByCategory[design.category] || 0) - 1;
    const maxForCategory = maxSelectionsByCategory[design.category] || 4;
    
    toast.info(`Removed ${design.category} design. You can add ${maxForCategory - categoryCount} more.`);
  };

  useEffect(() => {
    Object.entries(selectedDesigns).forEach(([designId, design]) => {
      saveDesignPreference(designId, design);
    });
  }, [selectedDesigns]);

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
    viewOnlyMode,
    clientAccessMode,
    clientToken,
    designerId,
    ...calculateCompleteness(),
    getSelectionsByCategory,
    handleSelectDesign,
    confirmReplaceSelection,
    handleRemoveDesign,
    generateClientShareLink
  };
};
