
import { wireframeApiService } from '../api/wireframe-api-service';

/**
 * Service class for handling wireframe feedback.
 */
export class WireframeFeedbackService {
  /**
   * Submits feedback for a wireframe.
   * @param wireframeId The ID of the wireframe to provide feedback for.
   * @param feedback The feedback to submit.
   * @returns A promise that resolves when the feedback has been submitted.
   */
  async submitFeedback(wireframeId: string, feedback: any) {
    try {
      // Use saveWireframe with an updated feedback property
      const wireframe = await wireframeApiService.getWireframe(wireframeId);
      if (wireframe) {
        // Clone the wireframe to avoid modifying the original
        const updatedWireframe = { ...wireframe };
        
        // Add the feedback as metadata instead of directly on the wireframe object
        if (!updatedWireframe.metadata) {
          updatedWireframe.metadata = {};
        }
        
        // Store feedback in metadata
        (updatedWireframe.metadata as any).feedback = {
          ...((updatedWireframe.metadata as any)?.feedback || {}),
          ...feedback,
          updatedAt: new Date().toISOString()
        };
        
        return await wireframeApiService.saveWireframe(updatedWireframe);
      }
      throw new Error(`Wireframe with ID ${wireframeId} not found`);
    } catch (error) {
      console.error('Failed to submit wireframe feedback:', error);
      throw error;
    }
  }

  // Additional methods for feedback analysis, etc. can be added here
}

export const wireframeFeedbackService = new WireframeFeedbackService();
export default wireframeFeedbackService;
