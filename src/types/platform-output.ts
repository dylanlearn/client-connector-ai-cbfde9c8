
export interface PlatformConfiguration {
  id: string;
  platform_name: string;
  platform_type: 'web' | 'ios' | 'android' | 'react-native' | 'flutter' | 'desktop';
  configuration_schema: Record<string, any>;
  default_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface WireframePlatformOutput {
  id: string;
  wireframe_id: string;
  platform_id: string;
  output_data: Record<string, any> | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  generated_by: string | null;
  validation_result: Record<string, any> | null;
  output_url: string | null;
}

export interface PlatformTransformer {
  id: string;
  platform_id: string;
  component_type: string;
  transformation_rules: Record<string, any>;
  platform_specific_properties: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}
