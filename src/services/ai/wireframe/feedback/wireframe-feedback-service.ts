
import { WireframeApiService } from '../api';

/**
 * Service focused on wireframe feedback and ratings
 */
export const WireframeFeedbackService = {
  /**
   * Update wireframe feedback and rating
   */
  updateWireframeFeedback: async (
    wireframeId: string,
    feedback: string,
    rating?: number
  ): Promise<void> => {
    try {
      await WireframeApiService.updateWireframeFeedback(wireframeId, feedback, rating);
    } catch (error) {
      console.error("Error in wireframe service updateWireframeFeedback:", error);
      throw error;
    }
  }
};
