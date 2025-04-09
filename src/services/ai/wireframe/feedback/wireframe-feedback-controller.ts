
import { FeedbackInterpreterService, FeedbackProcessingOptions } from './feedback-interpreter-service';
import { WireframeModifierService } from './wireframe-modifier-service';
import { wireframeApiService } from '../api/wireframe-api-service';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

/**
 * Interface for feedback-driven wireframe update options
 */
export interface FeedbackUpdateOptions extends FeedbackProcessingOptions {
  createNewVersion?: boolean;
  saveChanges?: boolean;
  applyThreshold?: number; // Confidence threshold for applying changes (0-1)
}

/**
 * Interface for feedback update result
 */
export interface FeedbackUpdateResult {
  success: boolean;
  wireframe: WireframeData;
  changes: {
    description: string;
    modifiedSections: string[];
    addedSections: string[];
    removedSections: string[];
  };
  message?: string;
  error?: string;
  newVersionId?: string;
}

/**
 * Controller service that processes feedback and applies appropriate wireframe updates
 */
export class WireframeFeedbackController {
  /**
   * Process user feedback and update the wireframe accordingly
   */
  static async processWireframeFeedback(
    wireframeId: string,
    feedbackText: string,
    options: FeedbackUpdateOptions = {}
  ): Promise<FeedbackUpdateResult> {
    try {
      console.log(`Processing feedback for wireframe ${wireframeId}:`, feedbackText);
      
      // Retrieve the current wireframe
      let wireframe: WireframeData;
      
      try {
        const retrievedWireframe = await wireframeApiService.getWireframe(wireframeId);
        
        if (!retrievedWireframe) {
          throw new Error(`Wireframe with ID ${wireframeId} not found`);
        }
        
        wireframe = {
          id: retrievedWireframe.id,
          title: retrievedWireframe.title || '',
          description: retrievedWireframe.description || '',
          sections: retrievedWireframe.sections || []
        };
      } catch (err) {
        console.error('Error retrieving wireframe:', err);
        return {
          success: false,
          wireframe: { id: wireframeId, title: '', description: '', sections: [] },
          changes: { description: '', modifiedSections: [], addedSections: [], removedSections: [] },
          error: `Failed to retrieve wireframe: ${err instanceof Error ? err.message : String(err)}`
        };
      }
      
      // Step 1: Interpret the feedback
      const interpretationOptions: FeedbackProcessingOptions = {
        wireframeId,
        contextualSections: wireframe.sections,
        userId: options.userId,
        detailedAnalysis: true
      };
      
      const interpretation = await FeedbackInterpreterService.interpretFeedback(
        feedbackText, 
        interpretationOptions
      );
      
      // Apply confidence threshold if specified
      const applyThreshold = options.applyThreshold || 0.6;
      const eligibleChanges = interpretation.suggestedChanges.filter(
        change => change.confidence >= applyThreshold
      );
      
      if (eligibleChanges.length === 0) {
        return {
          success: false,
          wireframe,
          changes: { description: 'No high-confidence changes identified', modifiedSections: [], addedSections: [], removedSections: [] },
          message: 'The feedback was processed, but no changes were made due to low confidence in interpretation.'
        };
      }
      
      // Step 2: Apply the interpretation to modify the wireframe
      const modificationResult = WireframeModifierService.applyFeedbackToWireframe(
        wireframe,
        { ...interpretation, suggestedChanges: eligibleChanges }
      );
      
      // If no changes were made, return early
      if (!modificationResult.modified) {
        return {
          success: false,
          wireframe,
          changes: { 
            description: 'No changes were made to the wireframe', 
            modifiedSections: [], 
            addedSections: [], 
            removedSections: [] 
          },
          message: 'The feedback was processed, but no meaningful changes could be applied to the wireframe.'
        };
      }
      
      // Step 3: Save the changes if requested
      let newVersionId: string | undefined;
      
      if (options.saveChanges) {
        try {
          // If creating a new version
          if (options.createNewVersion) {
            const versionResult = await wireframeApiService.createWireframeVersion(
              wireframeId,
              modificationResult.wireframe,
              {
                description: `Applied feedback: ${modificationResult.changeDescription}`,
                userId: options.userId
              }
            );
            
            newVersionId = versionResult.version_id;
            console.log('Created new wireframe version:', newVersionId);
          } else {
            // Direct update
            await wireframeApiService.updateWireframeData(
              wireframeId,
              modificationResult.wireframe
            );
            console.log('Updated wireframe directly');
          }
        } catch (err) {
          console.error('Error saving wireframe changes:', err);
          // Continue with the result even if saving failed
        }
      }
      
      return {
        success: true,
        wireframe: modificationResult.wireframe,
        changes: {
          description: modificationResult.changeDescription,
          modifiedSections: modificationResult.modifiedSections,
          addedSections: modificationResult.addedSections,
          removedSections: modificationResult.removedSections
        },
        message: `Successfully applied feedback: ${modificationResult.changeDescription}`,
        newVersionId
      };
    } catch (error) {
      console.error('Error in processWireframeFeedback:', error);
      
      return {
        success: false,
        wireframe: { id: wireframeId, title: '', description: '', sections: [] },
        changes: { description: '', modifiedSections: [], addedSections: [], removedSections: [] },
        error: `Failed to process feedback: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
}
