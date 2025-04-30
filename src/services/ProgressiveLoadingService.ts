
import { supabase } from "@/integrations/supabase/client";

export interface LoadingStrategy {
  strategy: 'lazy' | 'progressive' | 'critical-path';
  viewportThreshold: number;
  chunkSize: number;
}

export interface ProgressiveLoadingConfig {
  id: string;
  wireframe_id: string;
  priority_elements: string[];
  loading_strategy: string;
  viewport_threshold: number;
  chunk_size: number;
  enabled: boolean;
  configs: Record<string, any>;
}

export class ProgressiveLoadingService {
  static async getConfig(wireframeId: string): Promise<ProgressiveLoadingConfig | null> {
    try {
      const { data, error } = await supabase
        .from('progressive_loading_configs')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error retrieving progressive loading config:', error);
      return null;
    }
  }

  static async saveConfig(config: Omit<ProgressiveLoadingConfig, 'id'>): Promise<ProgressiveLoadingConfig | null> {
    try {
      const { data, error } = await supabase
        .from('progressive_loading_configs')
        .upsert({
          wireframe_id: config.wireframe_id,
          priority_elements: config.priority_elements,
          loading_strategy: config.loading_strategy,
          viewport_threshold: config.viewport_threshold,
          chunk_size: config.chunk_size,
          enabled: config.enabled,
          configs: config.configs,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error saving progressive loading config:', error);
      return null;
    }
  }

  static determinePriorityElements(wireframeData: any): string[] {
    // Logic to determine which elements should load first
    // This is a simplified implementation - in a real app this would be more complex
    
    const priorityElements: string[] = [];
    
    // Check if wireframeData has sections
    if (wireframeData?.sections && Array.isArray(wireframeData.sections)) {
      // Add first 2 sections as priority (typically header and hero)
      wireframeData.sections.slice(0, 2).forEach(section => {
        if (section.id) {
          priorityElements.push(section.id);
        }
      });
      
      // Look for important components like navigation, hero, call-to-action
      wireframeData.sections.forEach(section => {
        if (
          section.sectionType === 'navigation' || 
          section.sectionType === 'hero' || 
          section.sectionType === 'cta'
        ) {
          if (section.id && !priorityElements.includes(section.id)) {
            priorityElements.push(section.id);
          }
        }
      });
    }
    
    return priorityElements;
  }
}
