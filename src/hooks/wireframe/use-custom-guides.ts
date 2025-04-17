
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export interface Guide {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;
  color: string;
  locked: boolean;
  name?: string;
  fabricObject?: fabric.Line;
}

export interface GuidePreset {
  id: string;
  name: string;
  guides: Omit<Guide, 'fabricObject'>[];
}

export interface UseCustomGuidesOptions {
  canvas: fabric.Canvas | null;
  canvasWidth?: number;
  canvasHeight?: number;
  showToasts?: boolean;
  persistPresets?: boolean;
  presetStorageKey?: string;
}

export function useCustomGuides({
  canvas,
  canvasWidth = 1200,
  canvasHeight = 800,
  showToasts = true,
  persistPresets = true,
  presetStorageKey = 'wireframe-guide-presets'
}: UseCustomGuidesOptions) {
  const { toast } = useToast();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [guidesVisible, setGuidesVisible] = useState(true);
  const [presets, setPresets] = useState<GuidePreset[]>(() => {
    if (persistPresets) {
      try {
        const storedPresets = localStorage.getItem(presetStorageKey);
        if (storedPresets) {
          return JSON.parse(storedPresets);
        }
      } catch (e) {
        console.error('Failed to load guide presets from storage', e);
      }
    }
    return [];
  });

  // Create a fabric guide line
  const createGuideLine = useCallback((guide: Guide): fabric.Line => {
    const line = new fabric.Line(
      guide.type === 'horizontal' 
        ? [0, guide.position, canvasWidth, guide.position]
        : [guide.position, 0, guide.position, canvasHeight],
      {
        stroke: guide.color,
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: !guide.locked,
        evented: !guide.locked,
        excludeFromExport: true,
        data: { 
          isGuide: true, 
          guideId: guide.id,
          guideName: guide.name,
          guideType: guide.type 
        }
      }
    );
    
    // Set constraints based on guide type
    if (guide.type === 'horizontal') {
      line.setControlsVisibility({
        mt: false, mb: false, ml: false, mr: false,
        bl: false, br: false, tl: false, tr: false,
        mtr: false
      });
    } else {
      line.setControlsVisibility({
        mt: false, mb: false, ml: false, mr: false,
        bl: false, br: false, tl: false, tr: false,
        mtr: false
      });
    }
    
    return line;
  }, [canvasWidth, canvasHeight]);
  
  // Initialize guides on canvas change
  useEffect(() => {
    if (!canvas) return;
    
    const renderGuides = () => {
      if (guidesVisible) {
        guides.forEach(guide => {
          if (!guide.fabricObject) {
            const line = createGuideLine(guide);
            canvas.add(line);
            setGuides(prev => prev.map(g => 
              g.id === guide.id ? { ...g, fabricObject: line } : g
            ));
          }
        });
      }
    };
    
    renderGuides();
    
    return () => {
      // Clean up guides when component unmounts or canvas changes
      guides.forEach(guide => {
        if (guide.fabricObject && canvas) {
          canvas.remove(guide.fabricObject);
        }
      });
    };
  }, [canvas, guides, guidesVisible, createGuideLine]);
  
  // Save presets to local storage when they change
  useEffect(() => {
    if (persistPresets) {
      try {
        localStorage.setItem(presetStorageKey, JSON.stringify(presets));
      } catch (e) {
        console.error('Failed to save guide presets to storage', e);
      }
    }
  }, [presets, persistPresets, presetStorageKey]);
  
  // Add a new guide
  const addGuide = useCallback((guideData: Omit<Guide, 'id' | 'fabricObject'>) => {
    const id = uuid();
    const guide: Guide = { ...guideData, id };
    
    setGuides(prev => [...prev, guide]);
    
    if (canvas && guidesVisible) {
      const line = createGuideLine(guide);
      canvas.add(line);
      setGuides(prev => prev.map(g => 
        g.id === id ? { ...g, fabricObject: line } : g
      ));
      
      if (showToasts) {
        toast({ 
          title: "Guide Added",
          description: `${guide.type.charAt(0).toUpperCase() + guide.type.slice(1)} guide at ${guide.position}px`
        });
      }
    }
  }, [canvas, createGuideLine, guidesVisible, showToasts, toast]);
  
  // Remove a guide
  const removeGuide = useCallback((id: string) => {
    const guideToRemove = guides.find(g => g.id === id);
    
    if (guideToRemove && guideToRemove.fabricObject && canvas) {
      canvas.remove(guideToRemove.fabricObject);
    }
    
    setGuides(prev => prev.filter(g => g.id !== id));
    
    if (showToasts) {
      toast({ 
        title: "Guide Removed",
        description: "The guide has been removed"
      });
    }
  }, [canvas, guides, showToasts, toast]);
  
  // Update a guide
  const updateGuide = useCallback((id: string, updates: Partial<Guide>) => {
    const guideToUpdate = guides.find(g => g.id === id);
    
    if (!guideToUpdate) return;
    
    if (canvas && guideToUpdate.fabricObject) {
      // Remove old guide line
      canvas.remove(guideToUpdate.fabricObject);
      
      // Create a new guide line with updated properties
      const updatedGuide = { ...guideToUpdate, ...updates };
      const newLine = createGuideLine(updatedGuide);
      
      if (guidesVisible) {
        canvas.add(newLine);
      }
      
      setGuides(prev => prev.map(g => 
        g.id === id ? { ...g, ...updates, fabricObject: guidesVisible ? newLine : undefined } : g
      ));
    } else {
      setGuides(prev => prev.map(g => 
        g.id === id ? { ...g, ...updates } : g
      ));
    }
  }, [canvas, createGuideLine, guides, guidesVisible]);
  
  // Toggle guides visibility
  const toggleGuidesVisibility = useCallback(() => {
    if (canvas) {
      if (guidesVisible) {
        // Hide all guides
        guides.forEach(guide => {
          if (guide.fabricObject) {
            canvas.remove(guide.fabricObject);
          }
        });
        
        setGuides(prev => prev.map(g => ({ ...g, fabricObject: undefined })));
      } else {
        // Show all guides
        guides.forEach(guide => {
          const line = createGuideLine(guide);
          canvas.add(line);
          setGuides(prev => prev.map(g => 
            g.id === guide.id ? { ...g, fabricObject: line } : g
          ));
        });
      }
      
      canvas.requestRenderAll();
    }
    
    setGuidesVisible(!guidesVisible);
    
    if (showToasts) {
      toast({ 
        title: guidesVisible ? "Guides Hidden" : "Guides Shown",
        description: guidesVisible ? "All guides are now hidden" : "All guides are now visible"
      });
    }
  }, [canvas, createGuideLine, guides, guidesVisible, showToasts, toast]);
  
  // Add a preset
  const addPreset = useCallback((presetData: Omit<GuidePreset, 'id'>) => {
    const preset: GuidePreset = { 
      ...presetData, 
      id: uuid(),
      guides: presetData.guides.map(g => {
        const { fabricObject, ...rest } = g as Guide;
        return rest;
      })
    };
    
    setPresets(prev => [...prev, preset]);
    
    if (showToasts) {
      toast({ 
        title: "Preset Saved",
        description: `Guide preset "${preset.name}" has been saved`
      });
    }
  }, [showToasts, toast]);
  
  // Remove a preset
  const removePreset = useCallback((id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
    
    if (showToasts) {
      toast({ 
        title: "Preset Removed",
        description: "The guide preset has been removed"
      });
    }
  }, [showToasts, toast]);
  
  // Apply a preset
  const applyPreset = useCallback((preset: GuidePreset) => {
    if (canvas) {
      // Remove all current guides
      guides.forEach(guide => {
        if (guide.fabricObject) {
          canvas.remove(guide.fabricObject);
        }
      });
      
      // Add new guides from preset
      const newGuides = preset.guides.map(g => ({
        ...g,
        id: uuid(), // Generate new IDs for the guides
        fabricObject: undefined
      }));
      
      setGuides(newGuides);
      
      if (guidesVisible) {
        // Create and add guide lines
        newGuides.forEach(guide => {
          const line = createGuideLine(guide);
          canvas.add(line);
          
          // Update the fabricObject reference
          setGuides(prev => prev.map(g => 
            g.id === guide.id ? { ...g, fabricObject: line } : g
          ));
        });
        
        canvas.requestRenderAll();
      }
      
      if (showToasts) {
        toast({ 
          title: "Preset Applied",
          description: `Guide preset "${preset.name}" has been applied`
        });
      }
    }
  }, [canvas, createGuideLine, guides, guidesVisible, showToasts, toast]);
  
  // Clear all guides
  const clearGuides = useCallback(() => {
    if (canvas) {
      guides.forEach(guide => {
        if (guide.fabricObject) {
          canvas.remove(guide.fabricObject);
        }
      });
      
      setGuides([]);
      
      if (showToasts) {
        toast({ 
          title: "Guides Cleared",
          description: "All guides have been removed"
        });
      }
    }
  }, [canvas, guides, showToasts, toast]);

  return {
    guides,
    guidesVisible,
    presets,
    addGuide,
    removeGuide,
    updateGuide,
    toggleGuidesVisibility,
    addPreset,
    removePreset,
    applyPreset,
    clearGuides
  };
}
