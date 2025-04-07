import { supabase } from '@/integrations/supabase/client';
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
import {
  pricingVariants,
  testimonialVariants,
  featureGridVariants
} from '@/data/component-library-variants';
import { faqVariants } from '@/data/component-library-variants-faq';
import { ctaVariants } from '@/data/component-library-variants-cta';
import { navigationVariants } from '@/data/component-library-variants-navigation';
import { footerVariants } from '@/data/component-library-variants-footer';
import { blogVariants } from '@/data/component-library-variants-blog';
import { contactVariants } from '@/data/component-library-variants-contact';

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
    
    // Fix the type conversion by properly mapping the result
    return data?.map(item => item.component_styles as unknown as ComponentStyle) || [];
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
      // For this part, we'd typically import from hero-components.ts
      // and loop through each variant to create it in the database

      console.log('Hero component library initialized successfully.');
    } catch (error) {
      console.error('Error initializing hero component library:', error);
      throw error;
    }
  },

  // Initialize Pricing Component Library
  async initializePricingComponentLibrary(): Promise<void> {
    try {
      // Check if pricing component type already exists
      const existingTypes = await this.getComponentTypes();
      const pricingType = existingTypes.find(type => type.name === 'Pricing Section');
      
      if (pricingType) {
        console.log('Pricing component type already initialized.');
        return;
      }

      // Create Pricing Component Type
      const pricingComponentType = await this.createComponentType({
        name: 'Pricing Section',
        description: 'Section displaying pricing plans and options',
        category: 'content',
        icon: 'credit-card'
      });

      // Create Pricing Component Fields
      const fields = [
        {
          component_type_id: pricingComponentType.id,
          name: 'title',
          type: 'text' as const,
          description: 'Section heading',
          default_value: 'Simple, Transparent Pricing',
          validation: { required: true }
        },
        {
          component_type_id: pricingComponentType.id,
          name: 'description',
          type: 'textarea' as const,
          description: 'Optional section subheading or description',
          default_value: 'Choose the plan that works for your needs.',
        },
        {
          component_type_id: pricingComponentType.id,
          name: 'plans',
          type: 'array' as const,
          description: 'Array of pricing plans to display',
          default_value: [],
        },
        {
          component_type_id: pricingComponentType.id,
          name: 'alignment',
          type: 'select' as const,
          description: 'Content alignment',
          default_value: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          component_type_id: pricingComponentType.id,
          name: 'backgroundStyle',
          type: 'select' as const,
          description: 'Background style',
          default_value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Image', value: 'image' },
          ],
        },
        {
          component_type_id: pricingComponentType.id,
          name: 'mediaType',
          type: 'select' as const,
          description: 'Type of media to include',
          default_value: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Icon', value: 'icon' },
            { label: 'Image', value: 'image' },
          ],
        }
      ];

      // Create all fields
      for (const field of fields) {
        await this.createComponentField(field);
      }

      // Create variants from predefined pricing variants
      for (const variant of pricingVariants) {
        await this.createComponentVariant({
          component_type_id: pricingComponentType.id,
          variant_token: variant.variant,
          name: variant.title,
          description: variant.styleNote || '',
          default_data: variant,
          thumbnail_url: null
        });
      }

      console.log('Pricing component library initialized successfully.');
    } catch (error) {
      console.error('Error initializing pricing component library:', error);
      throw error;
    }
  },

  // Initialize Testimonials Component Library
  async initializeTestimonialsComponentLibrary(): Promise<void> {
    try {
      // Check if testimonials component type already exists
      const existingTypes = await this.getComponentTypes();
      const testimonialType = existingTypes.find(type => type.name === 'Testimonials Section');
      
      if (testimonialType) {
        console.log('Testimonials component type already initialized.');
        return;
      }

      // Create Testimonials Component Type
      const testimonialComponentType = await this.createComponentType({
        name: 'Testimonials Section',
        description: 'Section displaying customer testimonials and reviews',
        category: 'content',
        icon: 'message-circle'
      });

      // Create Testimonials Component Fields
      const fields = [
        {
          component_type_id: testimonialComponentType.id,
          name: 'title',
          type: 'text' as const,
          description: 'Section heading',
          default_value: 'What Our Customers Say',
        },
        {
          component_type_id: testimonialComponentType.id,
          name: 'subtitle',
          type: 'text' as const,
          description: 'Section subheading',
          default_value: '',
        },
        {
          component_type_id: testimonialComponentType.id,
          name: 'testimonials',
          type: 'array' as const,
          description: 'Array of testimonial objects',
          default_value: [],
        },
        {
          component_type_id: testimonialComponentType.id,
          name: 'alignment',
          type: 'select' as const,
          description: 'Content alignment',
          default_value: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          component_type_id: testimonialComponentType.id,
          name: 'backgroundStyle',
          type: 'select' as const,
          description: 'Background style',
          default_value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Image', value: 'image' },
          ],
        },
        {
          component_type_id: testimonialComponentType.id,
          name: 'mediaType',
          type: 'select' as const,
          description: 'Type of media to include with testimonials',
          default_value: 'avatar',
          options: [
            { label: 'Avatar', value: 'avatar' },
            { label: 'Logo', value: 'logo' },
            { label: 'None', value: 'none' },
          ],
        }
      ];

      // Create all fields
      for (const field of fields) {
        await this.createComponentField(field);
      }

      // Create variants from predefined testimonial variants
      for (const variant of testimonialVariants) {
        await this.createComponentVariant({
          component_type_id: testimonialComponentType.id,
          variant_token: variant.variant,
          name: variant.title || 'Testimonials',
          description: variant.styleNote || '',
          default_data: variant,
          thumbnail_url: null
        });
      }

      console.log('Testimonials component library initialized successfully.');
    } catch (error) {
      console.error('Error initializing testimonials component library:', error);
      throw error;
    }
  },

  // Initialize Feature Grid Component Library
  async initializeFeatureGridComponentLibrary(): Promise<void> {
    try {
      // Check if feature grid component type already exists
      const existingTypes = await this.getComponentTypes();
      const featureGridType = existingTypes.find(type => type.name === 'Feature Grid');
      
      if (featureGridType) {
        console.log('Feature Grid component type already initialized.');
        return;
      }

      // Create Feature Grid Component Type
      const featureGridComponentType = await this.createComponentType({
        name: 'Feature Grid',
        description: 'Grid layout for showcasing product or service features',
        category: 'content',
        icon: 'grid'
      });

      // Create Feature Grid Component Fields
      const fields = [
        {
          component_type_id: featureGridComponentType.id,
          name: 'title',
          type: 'text' as const,
          description: 'Section heading',
          default_value: 'Features',
        },
        {
          component_type_id: featureGridComponentType.id,
          name: 'subtitle',
          type: 'text' as const,
          description: 'Section subheading',
          default_value: '',
        },
        {
          component_type_id: featureGridComponentType.id,
          name: 'features',
          type: 'array' as const,
          description: 'Array of feature objects',
          default_value: [],
        },
        {
          component_type_id: featureGridComponentType.id,
          name: 'columns',
          type: 'select' as const,
          description: 'Number of columns in the grid',
          default_value: 3,
          options: [
            { label: '2 Columns', value: 2 },
            { label: '3 Columns', value: 3 },
            { label: '4 Columns', value: 4 },
          ],
        },
        {
          component_type_id: featureGridComponentType.id,
          name: 'alignment',
          type: 'select' as const,
          description: 'Content alignment',
          default_value: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          component_type_id: featureGridComponentType.id,
          name: 'backgroundStyle',
          type: 'select' as const,
          description: 'Background style',
          default_value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Image', value: 'image' },
          ],
        },
        {
          component_type_id: featureGridComponentType.id,
          name: 'mediaType',
          type: 'select' as const,
          description: 'Type of media to include with features',
          default_value: 'icon',
          options: [
            { label: 'Icon', value: 'icon' },
            { label: 'Image', value: 'image' },
            { label: 'None', value: 'none' },
          ],
        }
      ];

      // Create all fields
      for (const field of fields) {
        await this.createComponentField(field);
      }

      // Create variants from predefined feature grid variants
      for (const variant of featureGridVariants) {
        await this.createComponentVariant({
          component_type_id: featureGridComponentType.id,
          variant_token: variant.variant,
          name: variant.title || 'Feature Grid',
          description: variant.styleNote || '',
          default_data: variant,
          thumbnail_url: null
        });
      }

      console.log('Feature Grid component library initialized successfully.');
    } catch (error) {
      console.error('Error initializing feature grid component library:', error);
      throw error;
    }
  },

  // Initialize FAQ Component Library
  async initializeFAQComponentLibrary(): Promise<void> {
    try {
      // Check if FAQ component type already exists
      const existingTypes = await this.getComponentTypes();
      const faqType = existingTypes.find(type => type.name === 'FAQ Section');
      
      if (faqType) {
        console.log('FAQ component type already initialized.');
        return;
      }

      // Create FAQ Component Type
      const faqComponentType = await this.createComponentType({
        name: 'FAQ Section',
        description: 'Section displaying frequently asked questions',
        category: 'content',
        icon: 'message-circle'
      });

      // Create FAQ Component Fields
      const fields = [
        {
          component_type_id: faqComponentType.id,
          name: 'title',
          type: 'text' as const,
          description: 'Section heading',
          default_value: 'Frequently Asked Questions',
        },
        {
          component_type_id: faqComponentType.id,
          name: 'subtitle',
          type: 'text' as const,
          description: 'Section subheading',
          default_value: '',
        },
        {
          component_type_id: faqComponentType.id,
          name: 'faqs',
          type: 'array' as const,
          description: 'Array of FAQ items',
          default_value: [],
        },
        {
          component_type_id: faqComponentType.id,
          name: 'faqType',
          type: 'select' as const,
          description: 'Type of FAQ display',
          default_value: 'accordion',
          options: [
            { label: 'Accordion', value: 'accordion' },
            { label: 'List', value: 'list' },
            { label: 'Grid', value: 'grid' },
          ],
        },
        {
          component_type_id: faqComponentType.id,
          name: 'animationStyle',
          type: 'select' as const,
          description: 'Animation style for FAQ items',
          default_value: 'expand',
          options: [
            { label: 'Expand', value: 'expand' },
            { label: 'Fade', value: 'fade' },
            { label: 'None', value: 'none' },
          ],
        },
        {
          component_type_id: faqComponentType.id,
          name: 'alignment',
          type: 'select' as const,
          description: 'Content alignment',
          default_value: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          component_type_id: faqComponentType.id,
          name: 'backgroundStyle',
          type: 'select' as const,
          description: 'Background style',
          default_value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Image', value: 'image' },
          ],
        }
      ];

      // Create all fields
      for (const field of fields) {
        await this.createComponentField(field);
      }

      // Create variants from predefined FAQ variants
      for (const variant of faqVariants) {
        await this.createComponentVariant({
          component_type_id: faqComponentType.id,
          variant_token: variant.variant,
          name: variant.title || 'FAQ Section',
          description: variant.styleNote || '',
          default_data: variant,
          thumbnail_url: null
        });
      }

      console.log('FAQ component library initialized successfully.');
    } catch (error) {
      console.error('Error initializing FAQ component library:', error);
      throw error;
    }
  },

  // Initialize CTA Component Library
  async initializeCTAComponentLibrary(): Promise<void> {
    try {
      // Check if CTA component type already exists
      const existingTypes = await this.getComponentTypes();
      const ctaType = existingTypes.find(type => type.name === 'CTA Section');
      
      if (ctaType) {
        console.log('CTA component type already initialized.');
        return;
      }

      // Create CTA Component Type
      const ctaComponentType = await this.createComponentType({
        name: 'CTA Section',
        description: 'Call-to-action section for conversion',
        category: 'content',
        icon: 'megaphone'
      });

      // Create CTA Component Fields
      const fields = [
        {
          component_type_id: ctaComponentType.id,
          name: 'headline',
          type: 'text' as const,
          description: 'Main headline text',
          default_value: 'Get Started Today',
          validation: { required: true }
        },
        {
          component_type_id: ctaComponentType.id,
          name: 'subheadline',
          type: 'text' as const,
          description: 'Supporting subheadline text',
          default_value: '',
        },
        {
          component_type_id: ctaComponentType.id,
          name: 'cta',
          type: 'array' as const,
          description: 'Call-to-action button details',
          default_value: { label: 'Get Started', url: '#' },
        },
        {
          component_type_id: ctaComponentType.id,
          name: 'ctaSecondary',
          type: 'array' as const,
          description: 'Secondary call-to-action button details',
          default_value: null,
        },
        {
          component_type_id: ctaComponentType.id,
          name: 'backgroundStyle',
          type: 'select' as const,
          description: 'Background style',
          default_value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Image', value: 'image' },
            { label: 'Gradient', value: 'gradient' },
          ],
        },
        {
          component_type_id: ctaComponentType.id,
          name: 'alignment',
          type: 'select' as const,
          description: 'Content alignment',
          default_value: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          component_type_id: ctaComponentType.id,
          name: 'testimonial',
          type: 'array' as const,
          description: 'Optional testimonial to include',
          default_value: null,
        }
      ];

      // Create all fields
      for (const field of fields) {
        await this.createComponentField(field);
      }

      // Create variants from predefined CTA variants
      for (const variant of ctaVariants) {
        await this.createComponentVariant({
          component_type_id: ctaComponentType.id,
          variant_token: variant.variant,
          name: variant.headline || 'CTA Section',
          description: variant.styleNote || '',
          default_data: variant,
          thumbnail_url: null
        });
      }

      console.log('CTA component library initialized successfully.');
    } catch (error) {
      console.error('Error initializing CTA component library:', error);
      throw error;
    }
  },

  // Initialize Navigation Component Library
  async initializeNavigationComponentLibrary(): Promise<void> {
    try {
      // Check if navigation component type already exists
      const existingTypes = await this.getComponentTypes();
      const navType = existingTypes.find(type => type.name === 'Navigation');
      
      if (navType) {
        console.log('Navigation component type already initialized.');
        return;
      }

      // Create Navigation Component Type
      const navigationComponentType = await this.createComponentType({
        name: 'Navigation',
        description: 'Header navigation section for website navigation',
        category: 'navigation',
        icon: 'layout-panel-top'
      });

      // Create Navigation Component Fields
      const fields = [
        {
          component_type_id: navigationComponentType.id,
          name: 'logo',
          type: 'image' as const,
          description: 'Logo image URL',
          default_value: '',
        },
        {
          component_type_id: navigationComponentType.id,
          name: 'links',
          type: 'array' as const,
          description: 'Array of navigation links',
          default_value: [],
          validation: { required: true }
        },
        {
          component_type_id: navigationComponentType.id,
          name: 'cta',
          type: 'array' as const,
          description: 'Call to action button',
          default_value: null,
        },
        {
          component_type_id: navigationComponentType.id,
          name: 'mobileMenuStyle',
          type: 'select' as const,
          description: 'Style of mobile menu',
          default_value: 'dropdown',
          options: [
            { label: 'Drawer', value: 'drawer' },
            { label: 'Dropdown', value: 'dropdown' },
            { label: 'Overlay', value: 'overlay' },
          ],
        },
        {
          component_type_id: navigationComponentType.id,
          name: 'alignment',
          type: 'select' as const,
          description: 'Alignment of navigation items',
          default_value: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          component_type_id: navigationComponentType.id,
          name: 'backgroundStyle',
          type: 'select' as const,
          description: 'Background style',
          default_value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Glass', value: 'glass' },
            { label: 'Transparent', value: 'transparent' },
            { label: 'Gradient', value: 'gradient' },
            { label: 'Image', value: 'image' },
          ],
        },
        {
          component_type_id: navigationComponentType.id,
          name: 'sticky',
          type: 'boolean' as const,
          description: 'Whether the navigation should be sticky',
          default_value: false,
        },
        {
          component_type_id: navigationComponentType.id,
          name: 'hasSearch',
          type: 'boolean' as const,
          description: 'Whether to show search functionality',
          default_value: false,
        }
      ];

      // Create all fields
      for (const field of fields) {
        await this.createComponentField(field);
      }

      // Create variants from predefined navigation variants
      for (const variant of navigationVariants) {
        await this.createComponentVariant({
          component_type_id: navigationComponentType.id,
          variant_token: variant.variant,
          name: variant.variant,
          description: variant.styleNote || '',
          default_data: variant,
          thumbnail_url: null
        });
      }

      console.log('Navigation component library initialized successfully.');
    } catch (error) {
      console.error('Error initializing navigation component library:', error);
      throw error;
    }
  },

  // Initialize Footer Component Library
  async initializeFooterComponentLibrary(): Promise<void> {
    try {
      // Check if footer component type already exists
      const existingTypes = await this.getComponentTypes();
      const footerType = existingTypes.find(type => type.name === 'Footer');
      
      if (footerType) {
        console.log('Footer component type already initialized.');
        return;
      }

      // Create Footer Component Type
      const footerComponentType = await this.createComponentType({
        name: 'Footer',
        description: 'Footer section for website footer',
        category: 'navigation',
        icon: 'layout-panel-bottom'
      });

      // Create Footer Component Fields
      const fields = [
        {
          component_type_id: footerComponentType.id,
          name: 'logo',
          type: 'image' as const,
          description: 'Logo image URL',
          default_value: '',
        },
        {
          component_type_id: footerComponentType.id,
          name: 'columns',
          type: 'array' as const,
          description: 'Array of footer columns',
          default_value: [],
          validation: { required: true }
        },
        {
          component_type_id: footerComponentType.id,
          name: 'newsletter',
          type: 'array' as const,
          description: 'Newsletter subscription form',
          default_value: null,
        },
        {
          component_type_id: footerComponentType.id,
          name: 'backgroundStyle',
          type: 'select' as const,
          description: 'Background style',
          default_value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Image', value: 'image' },
            { label: 'Gradient', value: 'gradient' },
          ],
        },
        {
          component_type_id: footerComponentType.id,
          name: 'alignment',
          type: 'select' as const,
          description: 'Content alignment',
          default_value: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          component_type_id: footerComponentType.id,
          name: 'showSocialIcons',
          type: 'boolean' as const,
          description: 'Whether to show social media icons',
          default_value: true,
        },
        {
          component_type_id: footerComponentType.id,
          name: 'showLegalLinks',
          type: 'boolean' as const,
          description: 'Whether to show legal links',
          default_value: true,
        }
      ];

      // Create all fields
      for (const field of fields) {
        await this.createComponentField(field);
      }

      // Create variants from predefined footer variants
      for (const variant of footerVariants) {
        await this.createComponentVariant({
          component_type_id: footerComponentType.id,
          variant_token: variant.variant,
          name: variant.variant,
          description: variant.styleNote || '',
          default_data: variant,
          thumbnail_url: null
        });
      }

      console.log('Footer component library initialized successfully.');
    } catch (error) {
      console.error('Error initializing footer component library:', error);
      throw error;
    }
  },

  // Initialize Blog Component Library
  async initializeBlogComponentLibrary(): Promise<void> {
    try {
      // Check if blog component type already exists
      const existingTypes = await this.getComponentTypes();
      const blogType = existingTypes.find(type => type.name === 'Blog Section');
      
      if (blogType) {
        console.log('Blog component type already initialized.');
        return;
      }

      // Create Blog Component Type
      const blogComponentType = await this.createComponentType({
        name: 'Blog Section',
        description: 'Section displaying blog posts or articles',
        category: 'content',
        icon: 'newspaper'
      });

      // Create Blog Component Fields
      const fields = [
        {
          component_type_id: blogComponentType.id,
          name: 'headline',
          type: 'text' as const,
          description: 'Section heading',
          default_value: 'Latest Articles',
        },
        {
          component_type_id: blogComponentType.id,
          name: 'description',
          type: 'textarea' as const,
          description: 'Section subheading or description',
          default_value: 'Stay up-to-date with our latest news and updates.'
        },
        {
          component_type_id: blogComponentType.id,
          name: 'posts',
          type: 'array' as const,
          description: 'Array of blog post objects',
          default_value: [],
        },
        {
          component_type_id: blogComponentType.id,
          name: 'layoutStyle',
          type: 'select' as const,
          description: 'Layout style for blog posts',
          default_value: 'grid',
          options: [
            { label: 'Grid', value: 'grid' },
            { label: 'List', value: 'list' },
            { label: 'Carousel', value: 'carousel' }
          ]
        },
        {
          component_type_id: blogComponentType.id,
          name: 'backgroundStyle',
          type: 'select' as const,
          description: 'Background style',
          default_value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Image', value: 'image' },
            { label: 'Gradient', value: 'gradient' }
          ]
        },
        {
          component_type_id: blogComponentType.id,
          name: 'alignment',
          type: 'select' as const,
          description: 'Content alignment',
          default_value: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        },
        {
          component_type_id: blogComponentType.id,
          name: 'showCategories',
          type: 'boolean' as const,
          description: 'Show post categories',
          default_value: true
        },
        {
          component_type_id: blogComponentType.id,
          name: 'showAuthors',
          type: 'boolean' as const,
          description: 'Show post authors',
          default_value: true
        }
      ];

      // Create all fields
      for (const field of fields) {
        await this.createComponentField(field);
      }

      // Create variants from predefined blog variants
      for (const variant of blogVariants) {
        await this.createComponentVariant({
          component_type_id: blogComponentType.id,
          variant_token: variant.variant,
          name: variant.headline || 'Blog Section',
          description: variant.styleNote || '',
          default_data: variant,
          thumbnail_url: null
        });
      }

      console.log('Blog component library initialized successfully.');
    } catch (error) {
      console.error('Error initializing blog component library:', error);
      throw error;
    }
  },

  // Initialize Contact Component Library
  async initializeContactComponentLibrary(): Promise<void> {
    try {
      // Check if contact component type already exists
      const existingTypes = await this.getComponentTypes();
      const contactType = existingTypes.find(type => type.name === 'Contact Section');
      
      if (contactType) {
        console.log('Contact component type already initialized.');
        return;
      }

      // Create Contact Component Type
      const contactComponentType = await this.createComponentType({
        name: 'Contact Section',
        description: 'Section with contact form and information',
        category: 'form',
        icon: 'mail'
      });

      // Create Contact Component Fields
      const fields = [
        {
          component_type_id: contactComponentType.id,
          name: 'headline',
          type: 'text' as const,
          description: 'Section heading',
          default_value: 'Contact Us'
        },
        {
          component_type_id: contactComponentType.id,
          name: 'subheadline',
          type: 'textarea' as const,
          description: 'Supporting text under heading',
          default_value: "We'd love to hear from you. Send us a message and we'll respond as soon as possible."
        },
        {
          component_type_id: contactComponentType.id,
          name: 'formFields',
          type: 'array' as const,
          description: 'Form fields configuration',
          default_value: []
        },
        {
          component_type_id: contactComponentType.id,
          name: 'ctaLabel',
          type: 'text' as const,
          description: 'Form submit button text',
          default_value: 'Send Message'
        },
        {
          component_type_id: contactComponentType.id,
          name: 'showMap',
          type: 'boolean' as const,
          description: 'Display a map',
          default_value: false
        },
        {
          component_type_id: contactComponentType.id,
          name: 'contactInfo',
          type: 'array' as const,
          description: 'Contact information details',
          default_value: {}
        },
        {
          component_type_id: contactComponentType.id,
          name: 'socialLinks',
          type: 'array' as const,
          description: 'Social media links',
          default_value: []
        },
        {
          component_type_id: contactComponentType.id,
          name: 'alignment',
          type: 'select' as const,
          description: 'Content alignment',
          default_value: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        },
        {
          component_type_id: contactComponentType.id,
          name: 'backgroundStyle',
          type: 'select' as const,
          description: 'Background style',
          default_value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Image', value: 'image' },
            { label: 'Gradient', value: 'gradient' }
          ]
        }
      ];

      // Create all fields
      for (const field of fields) {
        await this.createComponentField(field);
      }

      // Create variants from predefined contact variants
      for (const variant of contactVariants) {
        await this.createComponentVariant({
          component_type_id: contactComponentType.id,
          variant_token: variant.variant,
          name: variant.headline || 'Contact Section',
          description: variant.subheadline || '',
          default_data: variant,
          thumbnail_url: null
        });
      }

      console.log('Contact component library initialized successfully.');
    } catch (error) {
      console.error('Error initializing contact component library:', error);
      throw error;
    }
  },

  // Main initialization function
  async initializeComponentLibrary(): Promise<void> {
    try {
      console.log('Initializing component library...');
      await this.initializeHeroComponentLibrary();
      await this.initializePricingComponentLibrary();
      await this.initializeTestimonialsComponentLibrary();
      await this.initializeFeatureGridComponentLibrary();
      await this.initializeFAQComponentLibrary();
      await this.initializeCTAComponentLibrary();
      await this.initializeNavigationComponentLibrary();
      await this.initializeFooterComponentLibrary();
      await this.initializeBlogComponentLibrary();
      await this.initializeContactComponentLibrary();
      console.log('Component library initialization complete!');
    } catch (error) {
      console.error('Error during component library initialization:', error);
      throw error;
    }
  }
};
