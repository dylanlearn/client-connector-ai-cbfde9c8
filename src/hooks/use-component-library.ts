
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { componentLibraryService } from '@/services/component-library-service';
import { 
  ComponentType, 
  ComponentField, 
  ComponentStyle, 
  ComponentVariant,
  PricingComponentProps,
  TestimonialComponentProps,
  FeatureGridComponentProps
} from '@/types/component-library';

export function useComponentLibrary() {
  const [isLoading, setIsLoading] = useState(false);
  const [componentTypes, setComponentTypes] = useState<ComponentType[]>([]);
  const [selectedType, setSelectedType] = useState<ComponentType | null>(null);
  const [fields, setFields] = useState<ComponentField[]>([]);
  const [variants, setVariants] = useState<ComponentVariant[]>([]);
  const [styles, setStyles] = useState<ComponentStyle[]>([]);

  // Load all component types
  const loadComponentTypes = async () => {
    try {
      setIsLoading(true);
      const types = await componentLibraryService.getComponentTypes();
      setComponentTypes(types);
      return types;
    } catch (error) {
      console.error('Error loading component types:', error);
      toast.error('Failed to load component library');
    } finally {
      setIsLoading(false);
    }
  };

  // Select a component type and load its fields and variants
  const selectComponentType = async (typeId: string) => {
    try {
      setIsLoading(true);
      const type = await componentLibraryService.getComponentType(typeId);
      if (!type) {
        toast.error('Component type not found');
        return;
      }
      
      setSelectedType(type);
      
      // Load fields and variants for this component type
      const [typeFields, typeVariants] = await Promise.all([
        componentLibraryService.getComponentFields(typeId),
        componentLibraryService.getComponentVariants(typeId)
      ]);
      
      setFields(typeFields);
      setVariants(typeVariants);
    } catch (error) {
      console.error('Error selecting component type:', error);
      toast.error('Failed to load component details');
    } finally {
      setIsLoading(false);
    }
  };

  // Get variant details including associated styles
  const getVariantDetails = async (variantId: string) => {
    try {
      const variantStyles = await componentLibraryService.getVariantStyles(variantId);
      return variantStyles;
    } catch (error) {
      console.error('Error loading variant details:', error);
      toast.error('Failed to load variant styles');
      return [];
    }
  };

  // Initialize the component libraries
  const initializeComponentLibrary = async () => {
    try {
      setIsLoading(true);
      await componentLibraryService.initializeComponentLibrary();
      toast.success('Component library initialized successfully');
      await loadComponentTypes();
    } catch (error) {
      console.error('Error initializing component library:', error);
      toast.error('Failed to initialize component library');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize specific component libraries
  const initializeHeroComponentLibrary = async () => {
    try {
      setIsLoading(true);
      await componentLibraryService.initializeHeroComponentLibrary();
      toast.success('Hero component library initialized successfully');
      await loadComponentTypes();
    } catch (error) {
      console.error('Error initializing hero library:', error);
      toast.error('Failed to initialize hero component library');
    } finally {
      setIsLoading(false);
    }
  };

  const initializePricingComponentLibrary = async () => {
    try {
      setIsLoading(true);
      await componentLibraryService.initializePricingComponentLibrary();
      toast.success('Pricing component library initialized successfully');
      await loadComponentTypes();
    } catch (error) {
      console.error('Error initializing pricing library:', error);
      toast.error('Failed to initialize pricing component library');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeTestimonialsComponentLibrary = async () => {
    try {
      setIsLoading(true);
      await componentLibraryService.initializeTestimonialsComponentLibrary();
      toast.success('Testimonials component library initialized successfully');
      await loadComponentTypes();
    } catch (error) {
      console.error('Error initializing testimonials library:', error);
      toast.error('Failed to initialize testimonials component library');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeFeatureGridComponentLibrary = async () => {
    try {
      setIsLoading(true);
      await componentLibraryService.initializeFeatureGridComponentLibrary();
      toast.success('Feature Grid component library initialized successfully');
      await loadComponentTypes();
    } catch (error) {
      console.error('Error initializing feature grid library:', error);
      toast.error('Failed to initialize feature grid component library');
    } finally {
      setIsLoading(false);
    }
  };

  // Load component types on mount
  useEffect(() => {
    loadComponentTypes();
  }, []);

  return {
    isLoading,
    componentTypes,
    selectedType,
    fields,
    variants,
    styles,
    loadComponentTypes,
    selectComponentType,
    getVariantDetails,
    initializeComponentLibrary,
    initializeHeroComponentLibrary,
    initializePricingComponentLibrary,
    initializeTestimonialsComponentLibrary,
    initializeFeatureGridComponentLibrary
  };
}
