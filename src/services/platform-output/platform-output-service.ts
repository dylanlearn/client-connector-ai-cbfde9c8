
import { supabase } from "@/integrations/supabase/client";
import type { 
  PlatformConfiguration, 
  WireframePlatformOutput, 
  PlatformTransformer 
} from "@/types/platform-output";

export class PlatformOutputService {
  static async createPlatformConfig(
    platformName: string,
    platformType: string,
    configSchema: Record<string, any>,
    defaultSettings: Record<string, any>
  ): Promise<PlatformConfiguration> {
    const { data, error } = await supabase
      .from('platform_configurations')
      .insert({
        platform_name: platformName,
        platform_type: platformType,
        configuration_schema: configSchema,
        default_settings: defaultSettings,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating platform configuration:", error);
      throw error;
    }

    return data as PlatformConfiguration;
  }

  static async getPlatformConfigurations(): Promise<PlatformConfiguration[]> {
    const { data, error } = await supabase
      .from('platform_configurations')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching platform configurations:", error);
      throw error;
    }

    return data as PlatformConfiguration[];
  }

  static async generatePlatformOutput(
    wireframeId: string,
    platformId: string
  ): Promise<WireframePlatformOutput> {
    const { data: generationResult, error: generationError } = await supabase
      .rpc('generate_platform_output', { 
        p_wireframe_id: wireframeId, 
        p_platform_id: platformId 
      });

    if (generationError) {
      console.error("Error generating platform output:", generationError);
      throw generationError;
    }

    // Fetch the output details
    if (generationResult.output_id) {
      const { data, error } = await supabase
        .from('wireframe_platform_outputs')
        .select('*')
        .eq('id', generationResult.output_id)
        .single();

      if (error) {
        console.error("Error fetching platform output:", error);
        throw error;
      }

      return data as WireframePlatformOutput;
    }

    throw new Error("No output ID returned");
  }

  static async getPlatformOutputs(
    wireframeId: string
  ): Promise<WireframePlatformOutput[]> {
    const { data, error } = await supabase
      .from('wireframe_platform_outputs')
      .select('*')
      .eq('wireframe_id', wireframeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching platform outputs:", error);
      throw error;
    }

    return data as WireframePlatformOutput[];
  }

  static async createTransformer(
    platformId: string,
    componentType: string,
    transformationRules: Record<string, any>,
    platformSpecificProperties?: Record<string, any>
  ): Promise<PlatformTransformer> {
    const { data, error } = await supabase
      .from('platform_transformers')
      .insert({
        platform_id: platformId,
        component_type: componentType,
        transformation_rules: transformationRules,
        platform_specific_properties: platformSpecificProperties || null
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating transformer:", error);
      throw error;
    }

    return data as PlatformTransformer;
  }

  static async getTransformers(
    platformId: string
  ): Promise<PlatformTransformer[]> {
    const { data, error } = await supabase
      .from('platform_transformers')
      .select('*')
      .eq('platform_id', platformId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching transformers:", error);
      throw error;
    }

    return data as PlatformTransformer[];
  }
}
