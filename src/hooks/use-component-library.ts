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
  FeatureGridComponentProps,
  FAQComponentProps,
  CTAComponentProps,
  NavigationComponentProps,
  FooterComponentProps,
  BlogSectionProps,
  ContactComponentProps
} from '@/types/component-library';

export function useComponentLibrary() {
  const [isLoading, setIsLoading] = useState(false);
  const [componentTypes, setComponentTypes] = useState<ComponentType[]>([]);
  const [selectedType, setSelectedType] = useState<ComponentType | null>(null);
  const [fields, setFields] = useState<ComponentField[]>([]);
  const [variants, setVariants] = useState<ComponentVariant[]>([]);
  const [styles, setStyles] = useState<ComponentStyle[]>([]);

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

  const selectComponentType = async (typeId: string) => {
    try {
      setIsLoading(true);
      const type = await componentLibraryService.getComponentType(typeId);
      if (!type) {
        toast.error('Component type not found');
        return;
      }
      
      setSelectedType(type);
      
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

  const initializeFAQComponentLibrary = async () => {
    try {
      setIsLoading(true);
      await componentLibraryService.initializeFAQComponentLibrary();
      toast.success('FAQ component library initialized successfully');
      await loadComponentTypes();
    } catch (error) {
      console.error('Error initializing FAQ library:', error);
      toast.error('Failed to initialize FAQ component library');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeCTAComponentLibrary = async () => {
    try {
      setIsLoading(true);
      await componentLibraryService.initializeCTAComponentLibrary();
      toast.success('CTA component library initialized successfully');
      await loadComponentTypes();
    } catch (error) {
      console.error('Error initializing CTA library:', error);
      toast.error('Failed to initialize CTA component library');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeNavigationComponentLibrary = async () => {
    try {
      setIsLoading(true);
      await componentLibraryService.initializeNavigationComponentLibrary();
      toast.success('Navigation component library initialized successfully');
      await loadComponentTypes();
    } catch (error) {
      console.error('Error initializing Navigation library:', error);
      toast.error('Failed to initialize Navigation component library');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeFooterComponentLibrary = async () => {
    try {
      setIsLoading(true);
      await componentLibraryService.initializeFooterComponentLibrary();
      toast.success('Footer component library initialized successfully');
      await loadComponentTypes();
    } catch (error) {
      console.error('Error initializing Footer library:', error);
      toast.error('Failed to initialize Footer component library');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeBlogComponentLibrary = async () => {
    try {
      setIsLoading(true);
      await componentLibraryService.initializeBlogComponentLibrary();
      toast.success('Blog component library initialized successfully');
      await loadComponentTypes();
    } catch (error) {
      console.error('Error initializing blog library:', error);
      toast.error('Failed to initialize blog component library');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeContactComponentLibrary = async () => {
    try {
      setIsLoading(true);
      await componentLibraryService.initializeContactComponentLibrary();
      toast.success('Contact component library initialized successfully');
      await loadComponentTypes();
    } catch (error) {
      console.error('Error initializing contact library:', error);
      toast.error('Failed to initialize contact component library');
    } finally {
      setIsLoading(false);
    }
  };

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
    initializeFeatureGridComponentLibrary,
    initializeFAQComponentLibrary,
    initializeCTAComponentLibrary,
    initializeNavigationComponentLibrary,
    initializeFooterComponentLibrary,
    initializeBlogComponentLibrary,
    initializeContactComponentLibrary
  };
}
