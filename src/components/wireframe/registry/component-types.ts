
export interface ComponentField {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'number' | 'color' | 'image' | 'array' | 'object' | 'richtext';
  description: string;
  options?: Array<{ label: string; value: string | number | boolean }>;
  id: string;
  defaultValue?: any;
  [key: string]: any;
}

export interface ComponentVariant {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  [key: string]: any;
}

export interface ComponentDefinition {
  type: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  variants: ComponentVariant[];
  fields: ComponentField[];
  defaultData: any;
  [key: string]: any;
}

export interface ComponentLibrary {
  [key: string]: ComponentDefinition;
}
