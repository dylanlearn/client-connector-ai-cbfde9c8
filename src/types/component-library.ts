
// TypeScript types for the component library database schema

export interface ComponentType {
  id: string;
  name: string;
  description?: string;
  category: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface ComponentField {
  id: string;
  component_type_id: string;
  name: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'color' | 'image' | 'array';
  description?: string;
  default_value?: any;
  options?: { label: string; value: any }[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ComponentStyle {
  id: string;
  name: string;
  style_token: string;
  category: string;
  properties: Record<string, any>;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ComponentVariant {
  id: string;
  component_type_id: string;
  variant_token: string;
  name: string;
  description?: string;
  default_data: Record<string, any>;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface VariantStyle {
  variant_id: string;
  style_id: string;
  priority: number;
  created_at: string;
}

// Pricing Component Types
export interface PricingComponentProps {
  variant: string;
  title: string;
  description?: string;
  plans: Array<{
    name: string;
    price: string;
    description?: string;
    features: string[];
    cta: {
      label: string;
      url: string;
    };
    badge?: string;
  }>;
  alignment?: 'left' | 'center' | 'right';
  backgroundStyle?: 'light' | 'dark' | 'image';
  styleNote?: string;
  mediaType?: 'none' | 'icon' | 'image';
}

// Testimonial Component Types
export interface TestimonialComponentProps {
  variant: string;
  title?: string;
  subtitle?: string;
  testimonials: Array<{
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
    brandLogo?: string;
  }>;
  alignment?: 'left' | 'center' | 'right';
  backgroundStyle?: 'light' | 'dark' | 'image';
  styleNote?: string;
  mediaType?: 'avatar' | 'logo' | 'none';
}

// Feature Grid Component Types
export interface FeatureGridComponentProps {
  variant: string;
  title?: string;
  subtitle?: string;
  features: Array<{
    title: string;
    description?: string;
    icon?: string;
    image?: string;
    badge?: string;
  }>;
  columns?: 2 | 3 | 4;
  alignment?: 'left' | 'center' | 'right';
  backgroundStyle?: 'light' | 'dark' | 'image';
  styleNote?: string;
  mediaType?: 'icon' | 'image' | 'none';
}
