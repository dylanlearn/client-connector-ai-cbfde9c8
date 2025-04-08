
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
      return await wireframeApiService.updateWireframeFeedback(wireframeId, feedback);
    } catch (error) {
      console.error('Failed to submit wireframe feedback:', error);
      throw error;
    }
  }

  // Additional methods for feedback analysis, etc. can be added here
}

export const wireframeFeedbackService = new WireframeFeedbackService();
export default wireframeFeedbackService;
