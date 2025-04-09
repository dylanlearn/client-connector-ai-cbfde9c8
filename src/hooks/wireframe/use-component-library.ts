
import { useState, useCallback, useEffect } from 'react';
import { WireframeSection } from '@/types/wireframe';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface ComponentCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface LibraryComponent {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  sectionData: WireframeSection;
  tags: string[];
  categoryId: string;
  createdAt: number;
  updatedAt: number;
  favorite: boolean;
}

export interface ComponentLibraryStats {
  totalComponents: number;
  totalCategories: number;
  recentlyAdded: number;
  favorites: number;
}

// Default categories
const DEFAULT_CATEGORIES: ComponentCategory[] = [
  { id: 'header', name: 'Headers', icon: 'layout-top' },
  { id: 'hero', name: 'Hero Sections', icon: 'layout' },
  { id: 'feature', name: 'Features', icon: 'blocks' },
  { id: 'content', name: 'Content', icon: 'text' },
  { id: 'gallery', name: 'Galleries', icon: 'image' },
  { id: 'form', name: 'Forms', icon: 'form-input' },
  { id: 'testimonial', name: 'Testimonials', icon: 'quote' },
  { id: 'pricing', name: 'Pricing', icon: 'tag' },
  { id: 'faq', name: 'FAQs', icon: 'help-circle' },
  { id: 'footer', name: 'Footers', icon: 'layout-bottom' },
  { id: 'custom', name: 'Custom', icon: 'sparkles' }
];

// Local storage keys
const LIBRARY_COMPONENTS_KEY = 'wireframe-component-library';
const LIBRARY_CATEGORIES_KEY = 'wireframe-component-categories';

export function useComponentLibrary() {
  const [components, setComponents] = useState<LibraryComponent[]>([]);
  const [categories, setCategories] = useState<ComponentCategory[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  
  // Load components and categories from storage
  useEffect(() => {
    const loadLibrary = () => {
      try {
        // Load components
        const storedComponents = localStorage.getItem(LIBRARY_COMPONENTS_KEY);
        if (storedComponents) {
          setComponents(JSON.parse(storedComponents));
        }
        
        // Load categories (or use defaults if none found)
        const storedCategories = localStorage.getItem(LIBRARY_CATEGORIES_KEY);
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        }
      } catch (error) {
        console.error('Error loading component library:', error);
        toast({
          title: 'Error',
          description: 'Failed to load component library',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLibrary();
  }, [toast]);
  
  // Save components to storage
  const saveComponents = useCallback((updatedComponents: LibraryComponent[]) => {
    try {
      localStorage.setItem(LIBRARY_COMPONENTS_KEY, JSON.stringify(updatedComponents));
      setComponents(updatedComponents);
    } catch (error) {
      console.error('Error saving components:', error);
      toast({
        title: 'Error',
        description: 'Failed to save components to library',
        variant: 'destructive'
      });
    }
  }, [toast]);
  
  // Save categories to storage
  const saveCategories = useCallback((updatedCategories: ComponentCategory[]) => {
    try {
      localStorage.setItem(LIBRARY_CATEGORIES_KEY, JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to save categories',
        variant: 'destructive'
      });
    }
  }, [toast]);
  
  // Add component to library
  const addComponent = useCallback((section: WireframeSection, categoryId = 'custom', tags: string[] = []) => {
    if (!section) return null;
    
    const newComponent: LibraryComponent = {
      id: uuidv4(),
      name: section.name || 'Unnamed Component',
      description: section.description || '',
      sectionData: { ...section },
      tags,
      categoryId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      favorite: false
    };
    
    const updatedComponents = [...components, newComponent];
    saveComponents(updatedComponents);
    
    toast({
      title: 'Component Added',
      description: `"${newComponent.name}" has been saved to the library`,
    });
    
    return newComponent;
  }, [components, saveComponents, toast]);
  
  // Remove component from library
  const removeComponent = useCallback((componentId: string) => {
    const updatedComponents = components.filter(c => c.id !== componentId);
    saveComponents(updatedComponents);
    
    toast({
      title: 'Component Removed',
      description: 'Component has been removed from the library',
    });
  }, [components, saveComponents, toast]);
  
  // Update existing component
  const updateComponent = useCallback((componentId: string, updates: Partial<LibraryComponent>) => {
    const componentIndex = components.findIndex(c => c.id === componentId);
    if (componentIndex === -1) return;
    
    const updatedComponents = [...components];
    updatedComponents[componentIndex] = {
      ...updatedComponents[componentIndex],
      ...updates,
      updatedAt: Date.now()
    };
    
    saveComponents(updatedComponents);
  }, [components, saveComponents]);
  
  // Toggle favorite status
  const toggleFavorite = useCallback((componentId: string) => {
    const componentIndex = components.findIndex(c => c.id === componentId);
    if (componentIndex === -1) return;
    
    const updatedComponents = [...components];
    updatedComponents[componentIndex] = {
      ...updatedComponents[componentIndex],
      favorite: !updatedComponents[componentIndex].favorite
    };
    
    saveComponents(updatedComponents);
  }, [components, saveComponents]);
  
  // Add new category
  const addCategory = useCallback((name: string, icon?: string) => {
    if (!name.trim()) return null;
    
    const newCategory: ComponentCategory = {
      id: uuidv4(),
      name,
      icon: icon || 'folder'
    };
    
    const updatedCategories = [...categories, newCategory];
    saveCategories(updatedCategories);
    
    return newCategory;
  }, [categories, saveCategories]);
  
  // Remove category
  const removeCategory = useCallback((categoryId: string) => {
    // Don't allow removing default categories
    const isDefault = DEFAULT_CATEGORIES.some(c => c.id === categoryId);
    if (isDefault) {
      toast({
        title: 'Cannot Remove',
        description: 'Default categories cannot be removed',
        variant: 'destructive'
      });
      return;
    }
    
    const updatedCategories = categories.filter(c => c.id !== categoryId);
    saveCategories(updatedCategories);
    
    // Move components from this category to 'custom'
    const updatedComponents = components.map(component => 
      component.categoryId === categoryId 
        ? { ...component, categoryId: 'custom' } 
        : component
    );
    saveComponents(updatedComponents);
    
    toast({
      title: 'Category Removed',
      description: 'Category has been removed and its components moved to Custom'
    });
  }, [categories, components, saveCategories, saveComponents, toast]);
  
  // Filter components by category
  const filteredComponents = useCallback(() => {
    if (selectedCategory === 'all') {
      return components;
    } else if (selectedCategory === 'favorites') {
      return components.filter(c => c.favorite);
    } else {
      return components.filter(c => c.categoryId === selectedCategory);
    }
  }, [components, selectedCategory]);
  
  // Get library stats
  const getStats = useCallback((): ComponentLibraryStats => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    return {
      totalComponents: components.length,
      totalCategories: categories.length,
      recentlyAdded: components.filter(c => c.createdAt > oneWeekAgo).length,
      favorites: components.filter(c => c.favorite).length
    };
  }, [components, categories]);
  
  return {
    components,
    categories,
    isLoading,
    selectedCategory,
    filteredComponents: filteredComponents(),
    stats: getStats(),
    setSelectedCategory,
    addComponent,
    removeComponent,
    updateComponent,
    toggleFavorite,
    addCategory,
    removeCategory
  };
}

export default useComponentLibrary;
