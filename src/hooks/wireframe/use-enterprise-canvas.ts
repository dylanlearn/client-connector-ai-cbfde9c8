import { useState, useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';
import { 
  EnterpriseGridConfig, 
  SmartGuideConfiguration,
  GuideDefinition,
  GridPreset,
  GuidePreset
} from '@/components/wireframe/types/canvas-types';
import { DEFAULT_ENTERPRISE_GRID_CONFIG } from '@/components/wireframe/grid/EnterpriseGridSystem';
import { DEFAULT_SMART_GUIDE_CONFIG } from '@/components/wireframe/guides/SmartGuideSystem';

export interface UseEnterpriseCanvasOptions {
  canvasId?: string;
  width?: number;
  height?: number;
  initialGridConfig?: Partial<EnterpriseGridConfig>;
  initialGuideConfig?: Partial<SmartGuideConfiguration>;
  persistSettings?: boolean;
}

/**
 * Hook to manage enterprise canvas features including grid system, smart guides, and canvas performance
 */
export function useEnterpriseCanvas({
  canvasId = 'enterprise-canvas',
  width = 1200,
  height = 800,
  initialGridConfig = {},
  initialGuideConfig = {},
  persistSettings = true
}: UseEnterpriseCanvasOptions = {}) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Grid configuration state
  const [gridConfig, setGridConfig] = useState<EnterpriseGridConfig>(() => {
    const defaultConfig = { ...DEFAULT_ENTERPRISE_GRID_CONFIG, ...initialGridConfig };
    
    if (persistSettings) {
      try {
        const savedConfig = localStorage.getItem('enterprise-grid-config');
        if (savedConfig) {
          return { ...defaultConfig, ...JSON.parse(savedConfig) };
        }
      } catch (err) {
        console.error('Failed to load grid configuration from localStorage:', err);
      }
    }
    
    return defaultConfig;
  });
  
  // Smart guide configuration state
  const [guideConfig, setGuideConfig] = useState<SmartGuideConfiguration>(() => {
    const defaultConfig = { ...DEFAULT_SMART_GUIDE_CONFIG, ...initialGuideConfig };
    
    if (persistSettings) {
      try {
        const savedConfig = localStorage.getItem('smart-guide-config');
        if (savedConfig) {
          return { ...defaultConfig, ...JSON.parse(savedConfig) };
        }
      } catch (err) {
        console.error('Failed to load guide configuration from localStorage:', err);
      }
    }
    
    return defaultConfig;
  });
  
  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 0,
    objectCount: 0,
    renderTime: 0,
    memoryUsage: 0,
    lastUpdate: Date.now()
  });
  
  // Reference to saved guides
  const [persistentGuides, setPersistentGuides] = useState<GuideDefinition[]>([]);
  
  // Grid and guide presets
  const [gridPresets, setGridPresets] = useState<GridPreset[]>([]);
  const [guidePresets, setGuidePresets] = useState<GuidePreset[]>([]);
  
  // Canvas interaction state
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [activeTool, setActiveTool] = useState<string>('select');
  
  /**
   * Initialize the canvas
   */
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) {
      setError(new Error('Canvas element not found'));
      setLoading(false);
      return;
    }
    
    try {
      // Create fabric canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
        selection: true,
        renderOnAddRemove: true
      });
      
      setFabricCanvas(canvas);
      
      // Set up event listeners
      canvas.on('selection:created', (e: fabric.IEvent) => {
        setSelectedObjects(e.selected || []);
      });
      
      canvas.on('selection:updated', (e: fabric.IEvent) => {
        setSelectedObjects(e.selected || []);
      });
      
      canvas.on('selection:cleared', () => {
        setSelectedObjects([]);
      });
      
      // Performance monitoring
      const perfMonitoringInterval = setInterval(() => {
        const now = Date.now();
        const objectCount = canvas.getObjects().length;
        
        setPerformanceMetrics(prev => {
          // Calculate FPS
          const elapsed = now - prev.lastUpdate;
          const fps = elapsed > 0 ? 1000 / elapsed : 0;
          
          return {
            fps,
            objectCount,
            renderTime: performance.now() - now, // Approximate render time
            memoryUsage: self.performance?.memory?.usedJSHeapSize ? 
              self.performance.memory.usedJSHeapSize / (1024 * 1024) : 0,
            lastUpdate: now
          };
        });
      }, 1000); // Update once per second
      
      // Load persistent guides
      if (persistSettings) {
        try {
          const savedGuides = localStorage.getItem('persistent-guides');
          if (savedGuides) {
            setPersistentGuides(JSON.parse(savedGuides));
          }
        } catch (err) {
          console.error('Failed to load persistent guides:', err);
        }
      }
      
      setLoading(false);
      
      return () => {
        clearInterval(perfMonitoringInterval);
        canvas.dispose();
      };
    } catch (err) {
      console.error('Error initializing canvas:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize canvas'));
      setLoading(false);
    }
  }, [width, height, persistSettings]);

  /**
   * Update grid configuration
   */
  const updateGridConfig = useCallback((config: Partial<EnterpriseGridConfig>) => {
    setGridConfig(prev => {
      const newConfig = { ...prev, ...config };
      
      if (persistSettings) {
        try {
          localStorage.setItem('enterprise-grid-config', JSON.stringify(newConfig));
        } catch (err) {
          console.error('Failed to save grid configuration to localStorage:', err);
        }
      }
      
      return newConfig;
    });
  }, [persistSettings]);

  /**
   * Update guide configuration
   */
  const updateGuideConfig = useCallback((config: Partial<SmartGuideConfiguration>) => {
    setGuideConfig(prev => {
      const newConfig = { ...prev, ...config };
      
      if (persistSettings) {
        try {
          localStorage.setItem('smart-guide-config', JSON.stringify(newConfig));
        } catch (err) {
          console.error('Failed to save guide configuration to localStorage:', err);
        }
      }
      
      return newConfig;
    });
  }, [persistSettings]);

  /**
   * Toggle grid visibility
   */
  const toggleGridVisibility = useCallback(() => {
    updateGridConfig({ visible: !gridConfig.visible });
    
    toast({
      title: gridConfig.visible ? "Grid Hidden" : "Grid Visible",
      description: `Grid is now ${gridConfig.visible ? "hidden" : "visible"}`
    });
  }, [gridConfig.visible, updateGridConfig, toast]);

  /**
   * Toggle snap to grid
   */
  const toggleSnapToGrid = useCallback(() => {
    updateGridConfig({ snapToGrid: !gridConfig.snapToGrid });
    
    toast({
      title: gridConfig.snapToGrid ? "Snap to Grid Disabled" : "Snap to Grid Enabled",
      description: `Snap to grid is now ${gridConfig.snapToGrid ? "disabled" : "enabled"}`
    });
  }, [gridConfig.snapToGrid, updateGridConfig, toast]);

  /**
   * Toggle smart guides
   */
  const toggleSmartGuides = useCallback(() => {
    updateGuideConfig({ enabled: !guideConfig.enabled });
    
    toast({
      title: guideConfig.enabled ? "Smart Guides Disabled" : "Smart Guides Enabled",
      description: `Smart guides are now ${guideConfig.enabled ? "disabled" : "enabled"}`
    });
  }, [guideConfig.enabled, updateGuideConfig, toast]);

  /**
   * Save current grid configuration as preset
   */
  const saveGridPreset = useCallback((name: string, category: string = 'Custom') => {
    const newPreset: GridPreset = {
      id: `preset-${Date.now()}`,
      name,
      category,
      description: `Custom grid preset (${gridConfig.type})`,
      config: { ...gridConfig },
      tags: [gridConfig.type, `${gridConfig.size}px`, `${gridConfig.columns}-columns`],
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString()
    };
    
    setGridPresets(prev => {
      const updatedPresets = [...prev, newPreset];
      
      if (persistSettings) {
        try {
          localStorage.setItem('grid-presets', JSON.stringify(updatedPresets));
        } catch (err) {
          console.error('Failed to save grid presets to localStorage:', err);
        }
      }
      
      return updatedPresets;
    });
    
    toast({
      title: "Grid Preset Saved",
      description: `Saved "${name}" to your grid presets`
    });
    
    return newPreset;
  }, [gridConfig, persistSettings, toast]);

  /**
   * Apply a grid preset
   */
  const applyGridPreset = useCallback((presetId: string) => {
    const preset = gridPresets.find(p => p.id === presetId);
    
    if (preset) {
      updateGridConfig(preset.config);
      
      toast({
        title: "Grid Preset Applied",
        description: `Applied "${preset.name}" grid preset`
      });
    } else {
      toast({
        title: "Preset Not Found",
        description: "Could not find the specified grid preset",
        variant: "destructive"
      });
    }
  }, [gridPresets, updateGridConfig, toast]);

  /**
   * Add a persistent guide
   */
  const addPersistentGuide = useCallback((guide: GuideDefinition) => {
    setPersistentGuides(prev => {
      const updatedGuides = [...prev, { ...guide, persistent: true }];
      
      if (persistSettings) {
        try {
          localStorage.setItem('persistent-guides', JSON.stringify(updatedGuides));
        } catch (err) {
          console.error('Failed to save persistent guides to localStorage:', err);
        }
      }
      
      return updatedGuides;
    });
    
    toast({
      title: "Guide Added",
      description: `Added persistent ${guide.orientation} guide at ${guide.position}px`
    });
  }, [persistSettings, toast]);

  /**
   * Remove a persistent guide
   */
  const removePersistentGuide = useCallback((guideId: string) => {
    setPersistentGuides(prev => {
      const updatedGuides = prev.filter(g => g.id !== guideId);
      
      if (persistSettings) {
        try {
          localStorage.setItem('persistent-guides', JSON.stringify(updatedGuides));
        } catch (err) {
          console.error('Failed to save persistent guides to localStorage:', err);
        }
      }
      
      return updatedGuides;
    });
    
    toast({
      title: "Guide Removed",
      description: "Removed persistent guide"
    });
  }, [persistSettings, toast]);

  /**
   * Export canvas configuration
   */
  const exportCanvasConfig = useCallback(() => {
    const exportData = {
      gridConfig,
      guideConfig,
      persistentGuides,
      gridPresets,
      guidePresets,
      version: '1.0.0',
      exportDate: new Date().toISOString()
    };
    
    try {
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportName = `canvas-config-${new Date().getTime()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
      
      toast({
        title: "Configuration Exported",
        description: `Exported to ${exportName}`
      });
      
      return true;
    } catch (err) {
      console.error('Failed to export canvas configuration:', err);
      
      toast({
        title: "Export Failed",
        description: "Failed to export canvas configuration",
        variant: "destructive"
      });
      
      return false;
    }
  }, [gridConfig, guideConfig, persistentGuides, gridPresets, guidePresets, toast]);

  /**
   * Import canvas configuration
   */
  const importCanvasConfig = useCallback((configData: any) => {
    try {
      // Validate import data structure
      if (!configData || typeof configData !== 'object') {
        throw new Error('Invalid configuration data');
      }
      
      // Import grid config
      if (configData.gridConfig) {
        updateGridConfig(configData.gridConfig);
      }
      
      // Import guide config
      if (configData.guideConfig) {
        updateGuideConfig(configData.guideConfig);
      }
      
      // Import persistent guides
      if (configData.persistentGuides && Array.isArray(configData.persistentGuides)) {
        setPersistentGuides(configData.persistentGuides);
        
        if (persistSettings) {
          try {
            localStorage.setItem('persistent-guides', JSON.stringify(configData.persistentGuides));
          } catch (err) {
            console.error('Failed to save imported guides to localStorage:', err);
          }
        }
      }
      
      // Import grid presets
      if (configData.gridPresets && Array.isArray(configData.gridPresets)) {
        setGridPresets(prev => {
          // Keep system presets, add imported ones
          const systemPresets = prev.filter(p => p.isSystem);
          const importedPresets = configData.gridPresets.filter((p: GridPreset) => !p.isSystem);
          
          const mergedPresets = [...systemPresets, ...importedPresets];
          
          if (persistSettings) {
            try {
              localStorage.setItem('grid-presets', JSON.stringify(mergedPresets));
            } catch (err) {
              console.error('Failed to save imported grid presets to localStorage:', err);
            }
          }
          
          return mergedPresets;
        });
      }
      
      // Import guide presets
      if (configData.guidePresets && Array.isArray(configData.guidePresets)) {
        setGuidePresets(configData.guidePresets);
        
        if (persistSettings) {
          try {
            localStorage.setItem('guide-presets', JSON.stringify(configData.guidePresets));
          } catch (err) {
            console.error('Failed to save imported guide presets to localStorage:', err);
          }
        }
      }
      
      toast({
        title: "Configuration Imported",
        description: "Successfully imported canvas configuration"
      });
      
      return true;
    } catch (err) {
      console.error('Failed to import canvas configuration:', err);
      
      toast({
        title: "Import Failed",
        description: err instanceof Error ? err.message : "Invalid configuration data",
        variant: "destructive"
      });
      
      return false;
    }
  }, [updateGridConfig, updateGuideConfig, persistSettings, toast]);

  // Initialize canvas on mount
  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  return {
    canvasRef,
    fabricCanvas,
    loading,
    error,
    gridConfig,
    guideConfig,
    persistentGuides,
    gridPresets,
    guidePresets,
    performanceMetrics,
    selectedObjects,
    activeTool,
    updateGridConfig,
    updateGuideConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    toggleSmartGuides,
    saveGridPreset,
    applyGridPreset,
    addPersistentGuide,
    removePersistentGuide,
    exportCanvasConfig,
    importCanvasConfig,
    setActiveTool
  };
}

export default useEnterpriseCanvas;
