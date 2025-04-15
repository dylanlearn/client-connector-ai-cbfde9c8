
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult, 
  WireframeData 
} from './wireframe-types';
import { CoreWireframeService } from './core-wireframe-service';
import { DebugLogger } from '@/utils/monitoring/debug-logger';

export class EnhancedWireframeGenerator {
  /**
   * Generate a wireframe with enhanced features
   */
  static async generateWireframe(
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> {
    DebugLogger.startTimer('enhanced-wireframe-generation');
    
    try {
      // Use the core service for the actual generation
      const result = await CoreWireframeService.generateWireframe(params);
      
      // Add enhanced data
      if (result.success && result.wireframe) {
        result.intentData = {
          primary: 'landing-page',
          confidence: 0.9,
          primaryGoal: 'conversion'
        };
        
        result.blueprint = {
          layout: 'responsive',
          sections: ['header', 'hero', 'features', 'testimonials', 'footer'],
          layoutStrategy: 'mobile-first'
        };
      }
      
      DebugLogger.endTimer('enhanced-wireframe-generation');
      return result;
    } catch (error) {
      DebugLogger.error('Error in enhanced wireframe generation', {
        context: 'enhanced-wireframe-generator',
        metadata: { error, params }
      });
      
      return {
        wireframe: null,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error in enhanced generation'
      };
    }
  }
}
