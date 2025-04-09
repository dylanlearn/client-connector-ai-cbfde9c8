
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { WireframeSection } from '@/types/wireframe';

export interface ComponentLibraryItem {
  id: string;
  name: string;
  description?: string;
  sectionData: WireframeSection;
  tags: string[];
  category: string;
  thumbnail?: string;
  dateCreated: string;
  dateModified: string;
  favorite: boolean;
  metadata?: Record<string, any>;
}

export interface ComponentCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

const DEFAULT_CATEGORIES: ComponentCategory[] = [
  { id: 'navigation', name: 'Navigation', color: '#3b82f6' },
  { id: 'content', name: 'Content Blocks', color: '#10b981' },
  { id: 'form', name: 'Forms & Inputs', color: '#8b5cf6' },
  { id: 'media', name: 'Media', color: '#ef4444' },
  { id: 'layout', name: 'Layout', color: '#f59e0b' },
  { id: 'custom', name: 'Custom', color: '#6b7280' }
];

// Local storage keys
const STORAGE_KEY_COMPONENTS = 'wireframe-component-library-items';
const STORAGE_KEY_CATEGORIES = 'wireframe-component-library-categories';

export function useComponentStorage() {
  const [components, setComponents] = useState<ComponentLibraryItem[]>([]);
  const [categories, setCategories] = useState<ComponentCategory[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  // Load components from storage
  useEffect(() => {
    try {
      const storedComponents = localStorage.getItem(STORAGE_KEY_COMPONENTS);
      if (storedComponents) {
        setComponents(JSON.parse(storedComponents));
      }
      
      const storedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      }
    } catch (error) {
      console.error('Error loading component library:', error);
      toast({
        title: 'Error',
        description: 'Failed to load component library from storage',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Save components to storage
  const saveComponents = useCallback((newComponents: ComponentLibraryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPONENTS, JSON.stringify(newComponents));
      setComponents(newComponents);
    } catch (error) {
      console.error('Error saving components:', error);
      toast({
        title: 'Error',
        description: 'Failed to save components to storage',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // Save categories to storage
  const saveCategories = useCallback((newCategories: ComponentCategory[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(newCategories));
      setCategories(newCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to save categories to storage',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // Add a component to the library
  const addComponent = useCallback((
    section: WireframeSection, 
    name?: string, 
    category: string = 'custom',
    tags: string[] = []
  ) => {
    if (!section) {
      toast({
        title: 'Error',
        description: 'Cannot save an empty section',
        variant: 'destructive'
      });
      return null;
    }
    
    const newComponent: ComponentLibraryItem = {
      id: uuidv4(),
      name: name || section.name || 'Unnamed Component',
      sectionData: { ...section },
      tags,
      category,
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      favorite: false
    };
    
    const newComponents = [...components, newComponent];
    saveComponents(newComponents);
    
    toast({
      title: 'Component Saved',
      description: `"${newComponent.name}" has been added to your component library`
    });
    
    return newComponent;
  }, [components, saveComponents, toast]);

  // Update an existing component
  const updateComponent = useCallback((id: string, updates: Partial<ComponentLibraryItem>) => {
    const componentIndex = components.findIndex(c => c.id === id);
    if (componentIndex === -1) {
      toast({
        title: 'Error',
        description: 'Component not found',
        variant: 'destructive'
      });
      return;
    }
    
    const newComponents = [...components];
    newComponents[componentIndex] = {
      ...newComponents[componentIndex],
      ...updates,
      dateModified: new Date().toISOString()
    };
    
    saveComponents(newComponents);
    
    toast({
      title: 'Component Updated',
      description: `"${newComponents[componentIndex].name}" has been updated`
    });
  }, [components, saveComponents, toast]);

  // Remove a component
  const removeComponent = useCallback((id: string) => {
    const component = components.find(c => c.id === id);
    if (!component) {
      toast({
        title: 'Error',
        description: 'Component not found',
        variant: 'destructive'
      });
      return;
    }
    
    const newComponents = components.filter(c => c.id !== id);
    saveComponents(newComponents);
    
    toast({
      title: 'Component Removed',
      description: `"${component.name}" has been removed from the library`
    });
  }, [components, saveComponents, toast]);

  // Toggle favorite status
  const toggleFavorite = useCallback((id: string) => {
    const componentIndex = components.findIndex(c => c.id === id);
    if (componentIndex === -1) return;
    
    const newComponents = [...components];
    newComponents[componentIndex] = {
      ...newComponents[componentIndex],
      favorite: !newComponents[componentIndex].favorite
    };
    
    saveComponents(newComponents);
  }, [components, saveComponents]);

  // Add a category
  const addCategory = useCallback((name: string, color?: string, description?: string) => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Category name cannot be empty',
        variant: 'destructive'
      });
      return null;
    }
    
    // Check for duplicates
    const existingCategory = categories.find(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingCategory) {
      toast({
        title: 'Error',
        description: 'A category with this name already exists',
        variant: 'destructive'
      });
      return null;
    }
    
    const newCategory: ComponentCategory = {
      id: uuidv4(),
      name,
      color: color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
      description
    };
    
    const newCategories = [...categories, newCategory];
    saveCategories(newCategories);
    
    toast({
      title: 'Category Created',
      description: `"${name}" category has been added`
    });
    
    return newCategory;
  }, [categories, saveCategories, toast]);

  // Remove a category
  const removeCategory = useCallback((id: string) => {
    // Check if it's a default category
    const isDefault = DEFAULT_CATEGORIES.some(c => c.id === id);
    if (isDefault) {
      toast({
        title: 'Cannot Remove',
        description: 'Default categories cannot be removed',
        variant: 'destructive'
      });
      return;
    }
    
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    const newCategories = categories.filter(c => c.id !== id);
    saveCategories(newCategories);
    
    // Move all components in this category to 'custom'
    const componentsToUpdate = components.filter(c => c.category === id);
    if (componentsToUpdate.length > 0) {
      const newComponents = components.map(component =>
        component.category === id ? { ...component, category: 'custom' } : component
      );
      
      saveComponents(newComponents);
    }
    
    toast({
      title: 'Category Removed',
      description: `"${category.name}" category has been removed`
    });
  }, [categories, components, saveCategories, saveComponents, toast]);

  // Get filtered components
  const filteredComponents = useCallback(() => {
    let result = components;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(component => 
        component.name.toLowerCase().includes(query) || 
        component.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (component.description && component.description.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory) {
      if (selectedCategory === 'favorites') {
        result = result.filter(component => component.favorite);
      } else {
        result = result.filter(component => component.category === selectedCategory);
      }
    }
    
    return result;
  }, [components, searchQuery, selectedCategory]);

  // Generate a thumbnail from a section
  const generateThumbnail = useCallback((section: WireframeSection): string => {
    // In a real implementation, this would render a small preview of the component
    // For now, we'll return a placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxODAiIGhlaWdodD0iODAiIHN0cm9rZT0iIzMzMyIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjEwMCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29tcG9uZW50IFByZXZpZXc8L3RleHQ+PC9zdmc+';
  }, []);

  return {
    components,
    categories,
    loading,
    searchQuery,
    selectedCategory,
    filteredComponents: filteredComponents(),
    setSearchQuery,
    setSelectedCategory,
    addComponent,
    updateComponent,
    removeComponent,
    toggleFavorite,
    addCategory,
    removeCategory,
    generateThumbnail
  };
}
