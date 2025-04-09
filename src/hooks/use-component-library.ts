
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';

export interface LibraryComponent {
  id: string;
  name: string;
  category: string;
  tags: string[];
  previewUrl?: string;
  jsonData: string; // Fabric.js JSON representation
  created: Date;
  modified: Date;
}

export interface ComponentCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface UseComponentLibraryOptions {
  fabricCanvas: fabric.Canvas | null;
  initialCategories?: ComponentCategory[];
  onComponentsChange?: (components: LibraryComponent[]) => void;
  autosave?: boolean;
}

/**
 * Hook to manage component library storage and operations
 */
export function useComponentLibrary(options: UseComponentLibraryOptions) {
  const { fabricCanvas, initialCategories = [], onComponentsChange, autosave = true } = options;
  
  const [components, setComponents] = useState<LibraryComponent[]>([]);
  const [categories, setCategories] = useState<ComponentCategory[]>(initialCategories);
  const [selectedComponent, setSelectedComponent] = useState<LibraryComponent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Load components from local storage on initialization
  useEffect(() => {
    const loadComponents = () => {
      try {
        const savedComponents = localStorage.getItem('component-library');
        const savedCategories = localStorage.getItem('component-categories');
        
        if (savedComponents) {
          setComponents(JSON.parse(savedComponents));
        }
        
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        } else if (initialCategories.length > 0) {
          setCategories(initialCategories);
        }
      } catch (error) {
        console.error('Error loading component library:', error);
        toast({
          title: 'Error',
          description: 'Could not load component library',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComponents();
  }, [toast, initialCategories]);
  
  // Save components to local storage whenever they change
  useEffect(() => {
    if (!autosave || isLoading) return;
    
    try {
      localStorage.setItem('component-library', JSON.stringify(components));
      
      if (onComponentsChange) {
        onComponentsChange(components);
      }
    } catch (error) {
      console.error('Error saving component library:', error);
      toast({
        title: 'Error',
        description: 'Could not save component library',
        variant: 'destructive'
      });
    }
  }, [components, autosave, isLoading, onComponentsChange, toast]);
  
  // Save categories to local storage whenever they change
  useEffect(() => {
    if (!autosave || isLoading) return;
    
    try {
      localStorage.setItem('component-categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving component categories:', error);
    }
  }, [categories, autosave, isLoading, toast]);
  
  // Add a component to the library
  const addComponent = useCallback((component: Omit<LibraryComponent, 'id' | 'created' | 'modified'>) => {
    if (!component.name || !component.jsonData) {
      toast({
        title: 'Error',
        description: 'Component name and data are required',
        variant: 'destructive'
      });
      return;
    }
    
    const newComponent: LibraryComponent = {
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      created: new Date(),
      modified: new Date()
    };
    
    setComponents(prevComponents => [...prevComponents, newComponent]);
    
    toast({
      title: 'Success',
      description: `Component "${component.name}" added to library`,
      variant: 'default'
    });
    
    return newComponent;
  }, [toast]);
  
  // Save current selection as component
  const saveSelectionAsComponent = useCallback((name: string, category: string, tags: string[] = []) => {
    if (!fabricCanvas) {
      toast({
        title: 'Error',
        description: 'Canvas not available',
        variant: 'destructive'
      });
      return;
    }
    
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) {
      toast({
        title: 'Error',
        description: 'No selection to save',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // If multiple objects are selected, create a temporary group
      let objectToSave = activeObject;
      let needsUngroup = false;
      
      if (activeObject.type === 'activeSelection') {
        objectToSave = (activeObject as fabric.ActiveSelection).toGroup();
        needsUngroup = true;
      }
      
      // Convert to JSON
      const jsonData = JSON.stringify(objectToSave.toJSON());
      
      // Create thumbnail
      let previewUrl: string | undefined;
      try {
        // Create a temporary canvas for thumbnail
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 100;
        tempCanvas.height = 100;
        const tempFabricCanvas = new fabric.Canvas(tempCanvas);
        
        // Clone object and scale to fit thumbnail
        objectToSave.clone((clone: fabric.Object) => {
          // Scale and center
          const scale = Math.min(80 / clone.width!, 80 / clone.height!);
          clone.scale(scale);
          clone.left = 50 - (clone.width! * scale) / 2;
          clone.top = 50 - (clone.height! * scale) / 2;
          
          tempFabricCanvas.add(clone);
          tempFabricCanvas.renderAll();
          
          previewUrl = tempCanvas.toDataURL('image/png');
          tempFabricCanvas.dispose();
        });
      } catch (e) {
        console.warn('Could not generate thumbnail:', e);
      }
      
      // Ungroup if needed
      if (needsUngroup && fabricCanvas) {
        (objectToSave as fabric.Group).toActiveSelection(fabricCanvas);
        fabricCanvas.renderAll();
      }
      
      // Add to library
      const newComponent = addComponent({
        name,
        category,
        tags,
        jsonData,
        previewUrl
      });
      
      return newComponent;
    } catch (error) {
      console.error('Error saving component:', error);
      toast({
        title: 'Error',
        description: 'Could not save component',
        variant: 'destructive'
      });
    }
  }, [fabricCanvas, addComponent, toast]);
  
  // Update an existing component
  const updateComponent = useCallback((id: string, updates: Partial<Omit<LibraryComponent, 'id' | 'created'>>) => {
    setComponents(prevComponents => {
      const index = prevComponents.findIndex(c => c.id === id);
      if (index === -1) return prevComponents;
      
      const updatedComponents = [...prevComponents];
      updatedComponents[index] = {
        ...updatedComponents[index],
        ...updates,
        modified: new Date()
      };
      
      return updatedComponents;
    });
    
    toast({
      title: 'Success',
      description: 'Component updated',
      variant: 'default'
    });
  }, [toast]);
  
  // Delete a component
  const deleteComponent = useCallback((id: string) => {
    setComponents(prevComponents => prevComponents.filter(c => c.id !== id));
    
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
    
    toast({
      title: 'Success',
      description: 'Component deleted',
      variant: 'default'
    });
  }, [selectedComponent, toast]);
  
  // Add component to canvas
  const addComponentToCanvas = useCallback((component: LibraryComponent) => {
    if (!fabricCanvas) {
      toast({
        title: 'Error',
        description: 'Canvas not available',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Parse JSON data
      const componentData = JSON.parse(component.jsonData);
      
      // Load into canvas
      fabricCanvas.loadFromJSON(componentData, () => {
        const objects = fabricCanvas.getObjects();
        const addedObject = objects[objects.length - 1];
        
        if (addedObject) {
          // Position in center of viewport if not already positioned
          if (!componentData.left || !componentData.top) {
            const vpt = fabricCanvas.viewportTransform || [1, 0, 0, 1, 0, 0];
            const zoom = fabricCanvas.getZoom();
            
            addedObject.set({
              left: (-vpt[4] + fabricCanvas.width! / 2) / zoom - addedObject.width! / 2,
              top: (-vpt[5] + fabricCanvas.height! / 2) / zoom - addedObject.height! / 2
            });
          }
          
          // Select the added object
          fabricCanvas.setActiveObject(addedObject);
        }
        
        fabricCanvas.renderAll();
        
        toast({
          title: 'Success',
          description: `Component "${component.name}" added to canvas`,
          variant: 'default'
        });
      });
    } catch (error) {
      console.error('Error adding component to canvas:', error);
      toast({
        title: 'Error',
        description: 'Could not add component to canvas',
        variant: 'destructive'
      });
    }
  }, [fabricCanvas, toast]);
  
  // Add category
  const addCategory = useCallback((name: string, description?: string, icon?: string) => {
    const newCategory: ComponentCategory = {
      id: `category-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      description,
      icon
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
    return newCategory;
  }, []);
  
  // Update category
  const updateCategory = useCallback((id: string, updates: Partial<Omit<ComponentCategory, 'id'>>) => {
    setCategories(prevCategories => {
      const index = prevCategories.findIndex(c => c.id === id);
      if (index === -1) return prevCategories;
      
      const updatedCategories = [...prevCategories];
      updatedCategories[index] = {
        ...updatedCategories[index],
        ...updates
      };
      
      return updatedCategories;
    });
  }, []);
  
  // Delete category
  const deleteCategory = useCallback((id: string) => {
    setCategories(prevCategories => prevCategories.filter(c => c.id !== id));
    
    // Update components in this category to "uncategorized"
    setComponents(prevComponents => 
      prevComponents.map(component => 
        component.category === id 
          ? { ...component, category: 'uncategorized', modified: new Date() } 
          : component
      )
    );
  }, []);
  
  // Import component library
  const importLibrary = useCallback((libraryData: string) => {
    try {
      const data = JSON.parse(libraryData);
      
      if (data.components) {
        // Validate components
        const validComponents = data.components.filter((c: any) => 
          c.id && c.name && c.jsonData
        );
        
        setComponents(prevComponents => {
          // Merge with existing, avoid duplicates by ID
          const existingIds = new Set(prevComponents.map(c => c.id));
          const newComponents = validComponents.filter((c: LibraryComponent) => !existingIds.has(c.id));
          
          return [...prevComponents, ...newComponents];
        });
      }
      
      if (data.categories) {
        // Validate categories
        const validCategories = data.categories.filter((c: any) => c.id && c.name);
        
        setCategories(prevCategories => {
          // Merge with existing, avoid duplicates by ID
          const existingIds = new Set(prevCategories.map(c => c.id));
          const newCategories = validCategories.filter((c: ComponentCategory) => !existingIds.has(c.id));
          
          return [...prevCategories, ...newCategories];
        });
      }
      
      toast({
        title: 'Success',
        description: 'Component library imported',
        variant: 'default'
      });
      
      return true;
    } catch (error) {
      console.error('Error importing library:', error);
      toast({
        title: 'Error',
        description: 'Invalid library file format',
        variant: 'destructive'
      });
      
      return false;
    }
  }, [toast]);
  
  // Export component library
  const exportLibrary = useCallback(() => {
    try {
      const libraryData = JSON.stringify({
        components,
        categories
      }, null, 2);
      
      return libraryData;
    } catch (error) {
      console.error('Error exporting library:', error);
      toast({
        title: 'Error',
        description: 'Could not export library',
        variant: 'destructive'
      });
      
      return null;
    }
  }, [components, categories, toast]);

  return {
    components,
    categories,
    selectedComponent,
    setSelectedComponent,
    isLoading,
    // Component operations
    addComponent,
    saveSelectionAsComponent,
    updateComponent,
    deleteComponent,
    addComponentToCanvas,
    // Category operations
    addCategory,
    updateCategory,
    deleteCategory,
    // Import/Export
    importLibrary,
    exportLibrary
  };
}
