
import { supabase } from "@/integrations/supabase/client";

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  progressive?: boolean;
}

export interface OptimizedAsset {
  id: string;
  original_url: string;
  optimized_url: string;
  asset_type: 'image' | 'font' | 'video' | 'audio' | 'other';
  original_size: number;
  optimized_size: number;
  compression_ratio: number;
  format: string;
  width?: number;
  height?: number;
}

export class AssetOptimizationService {
  static async optimizeImage(
    imageUrl: string,
    options: OptimizationOptions = {}
  ): Promise<OptimizedAsset | null> {
    try {
      // For image optimization, we'll use a serverless function
      const response = await fetch('https://bmkhbqxukiakhafqllux.functions.supabase.co/optimize-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: imageUrl,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`Image optimization failed: ${response.status}`);
      }

      const result = await response.json();

      // Store the optimization result in the database
      const { data, error } = await supabase
        .from('optimized_assets')
        .insert({
          original_url: imageUrl,
          optimized_url: result.url,
          asset_type: 'image',
          original_size: result.originalSize,
          optimized_size: result.optimizedSize,
          format: result.format,
          width: result.width,
          height: result.height,
          metadata: result.metadata,
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing optimization result:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Asset optimization error:', error);
      return null;
    }
  }

  static async optimizeFont(fontUrl: string): Promise<OptimizedAsset | null> {
    try {
      // Implement font subsetting and compression
      const response = await fetch('https://bmkhbqxukiakhafqllux.functions.supabase.co/optimize-font', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: fontUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Font optimization failed: ${response.status}`);
      }

      const result = await response.json();

      // Store the optimization result in the database
      const { data, error } = await supabase
        .from('optimized_assets')
        .insert({
          original_url: fontUrl,
          optimized_url: result.url,
          asset_type: 'font',
          original_size: result.originalSize,
          optimized_size: result.optimizedSize,
          format: result.format,
          metadata: result.metadata,
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing font optimization result:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Font optimization error:', error);
      return null;
    }
  }

  static async getOptimizedAsset(originalUrl: string): Promise<OptimizedAsset | null> {
    try {
      const { data, error } = await supabase
        .from('optimized_assets')
        .select('*')
        .eq('original_url', originalUrl)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error retrieving optimized asset:', error);
      return null;
    }
  }

  static async getOptimizationStats() {
    try {
      const { data, error } = await supabase.rpc('analyze_asset_optimization');
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting optimization stats:', error);
      return [];
    }
  }
}
