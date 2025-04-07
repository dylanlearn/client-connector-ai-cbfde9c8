
import { supabase } from '@/integrations/supabase/client';
import { 
  ComponentType, 
  ComponentField, 
  ComponentStyle, 
  ComponentVariant 
} from '@/types/component-library';

/**
 * Service for interacting with the component library database tables
 */
export const componentLibraryService = {
  // Component Types
  async getComponentTypes(): Promise<ComponentType[]> {
    const { data, error } = await supabase
      .from('component_types')
      .select('*')
      .order('name');
    
    if (error) throw new Error(`Error fetching component types: ${error.message}`);
    return data || [];
  },

  async getComponentType(id: string): Promise<ComponentType | null> {
    const { data, error } = await supabase
      .from('component_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(`Error fetching component type: ${error.message}`);
    return data;
  },

  async createComponentType(componentType: Omit<ComponentType, 'id' | 'created_at' | 'updated_at'>): Promise<ComponentType> {
    const { data, error } = await supabase
      .from('component_types')
      .insert(componentType)
      .select()
      .single();
    
    if (error) throw new Error(`Error creating component type: ${error.message}`);
    return data;
  },

  // Component Fields
  async getComponentFields(componentTypeId: string): Promise<ComponentField[]> {
    const { data, error } = await supabase
      .from('component_fields')
      .select('*')
      .eq('component_type_id', componentTypeId);
    
    if (error) throw new Error(`Error fetching component fields: ${error.message}`);
    return data || [];
  },

  async createComponentField(field: Omit<ComponentField, 'id' | 'created_at' | 'updated_at'>): Promise<ComponentField> {
    const { data, error } = await supabase
      .from('component_fields')
      .insert(field)
      .select()
      .single();
    
    if (error) throw new Error(`Error creating component field: ${error.message}`);
    return data;
  },

  // Component Variants
  async getComponentVariants(componentTypeId: string): Promise<ComponentVariant[]> {
    const { data, error } = await supabase
      .from('component_variants')
      .select('*')
      .eq('component_type_id', componentTypeId);
    
    if (error) throw new Error(`Error fetching component variants: ${error.message}`);
    return data || [];
  },

  async getVariant(variantToken: string): Promise<ComponentVariant | null> {
    const { data, error } = await supabase
      .from('component_variants')
      .select('*')
      .eq('variant_token', variantToken)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching component variant: ${error.message}`);
    }
    return data;
  },

  async createComponentVariant(variant: Omit<ComponentVariant, 'id' | 'created_at' | 'updated_at'>): Promise<ComponentVariant> {
    const { data, error } = await supabase
      .from('component_variants')
      .insert(variant)
      .select()
      .single();
    
    if (error) throw new Error(`Error creating component variant: ${error.message}`);
    return data;
  },

  // Component Styles
  async getComponentStyles(category?: string): Promise<ComponentStyle[]> {
    let query = supabase
      .from('component_styles')
      .select('*');
    
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    
    if (error) throw new Error(`Error fetching component styles: ${error.message}`);
    return data || [];
  },

  async createComponentStyle(style: Omit<ComponentStyle, 'id' | 'created_at' | 'updated_at'>): Promise<ComponentStyle> {
    const { data, error } = await supabase
      .from('component_styles')
      .insert(style)
      .select()
      .single();
    
    if (error) throw new Error(`Error creating component style: ${error.message}`);
    return data;
  },

  // Variant-Style Relations
  async assignStyleToVariant(variantId: string, styleId: string, priority: number = 0): Promise<void> {
    const { error } = await supabase
      .from('variant_styles')
      .insert({
        variant_id: variantId,
        style_id: styleId,
        priority
      });
    
    if (error) throw new Error(`Error assigning style to variant: ${error.message}`);
  },

  async getVariantStyles(variantId: string): Promise<ComponentStyle[]> {
    const { data, error } = await supabase
      .from('variant_styles')
      .select('style_id, priority, component_styles(*)')
      .eq('variant_id', variantId)
      .order('priority');
    
    if (error) throw new Error(`Error fetching variant styles: ${error.message}`);
    return data?.map(item => item.component_styles) || [];
  },

  // Initialize Hero Component Library
  async initializeHeroComponentLibrary(): Promise<void> {
    try {
      // Check if hero component type already exists
      const existingTypes = await this.getComponentTypes();
      const heroType = existingTypes.find(type => type.name === 'Hero Section');
      
      if (heroType) {
        console.log('Hero component type already initialized.');
        return;
      }

      // Create Hero Component Type
      const heroComponentType = await this.createComponentType({
        name: 'Hero Section',
        description: 'Main banner section typically at the top of a page',
        category: 'content',
        icon: 'layout-dashboard'
      });

      // Create Hero Component Fields
      const fields = [
        {
          component_type_id: heroComponentType.id,
          name: 'headline',
          type: 'text' as const,
          description: 'Primary heading text',
          default_value: 'Main Headline Goes Here',
          validation: { required: true }
        },
        {
          component_type_id: heroComponentType.id,
          name: 'subheadline',
          type: 'textarea' as const,
          description: 'Supporting text that appears below headline',
          default_value: 'This is a supporting text that provides more context to the headline above.',
        },
        {
          component_type_id: heroComponentType.id,
          name: 'ctaText',
          type: 'text' as const,
          description: 'Call to action button text',
          default_value: 'Get Started',
        },
        {
          component_type_id: heroComponentType.id,
          name: 'ctaUrl',
          type: 'text' as const,
          description: 'Call to action button link',
          default_value: '#',
        },
        {
          component_type_id: heroComponentType.id,
          name: 'ctaSecondaryText',
          type: 'text' as const,
          description: 'Text for the secondary button',
          default_value: 'Learn More',
        },
        {
          component_type_id: heroComponentType.id,
          name: 'ctaSecondaryUrl',
          type: 'text' as const,
          description: 'Link for the secondary button',
          default_value: '#',
        },
        {
          component_type_id: heroComponentType.id,
          name: 'backgroundType',
          type: 'select' as const,
          description: 'Type of background for the hero section',
          default_value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Image', value: 'image' },
          ],
        },
        {
          component_type_id: heroComponentType.id,
          name: 'alignment',
          type: 'select' as const,
          description: 'Alignment of the hero content',
          default_value: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          component_type_id: heroComponentType.id,
          name: 'imageUrl',
          type: 'image' as const,
          description: 'URL for the hero image',
          default_value: '',
        },
        {
          component_type_id: heroComponentType.id,
          name: 'mediaType',
          type: 'select' as const,
          description: 'Type of media to display in the hero',
          default_value: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
            { label: 'Illustration', value: 'illustration' },
          ],
        },
        {
          component_type_id: heroComponentType.id,
          name: 'badge',
          type: 'text' as const,
          description: 'Optional badge text to display (e.g., "New", "Featured")',
          default_value: '',
        },
      ];

      // Create all the fields
      for (const field of fields) {
        await this.createComponentField(field);
      }

      // Create Hero Variants from existing heroVariants
      // For this part, we'll need to create variants - we'd typically import from hero-components.ts
      // and loop through each variant to create it in the database

      console.log('Hero component library initialized successfully.');
    } catch (error) {
      console.error('Error initializing hero component library:', error);
      throw error;
    }
  }
};
