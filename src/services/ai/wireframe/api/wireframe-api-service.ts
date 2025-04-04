
import { wireframeGenerator } from './wireframe-generator';
import { wireframeStorage } from './wireframe-storage';
import { wireframeSections } from './wireframe-sections';
import { wireframeFeedback } from './wireframe-feedback';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  AIWireframe,
  WireframeData
} from '../wireframe-types';

/**
 * Service for interfacing with wireframe API functions and database
 */
export const WireframeApiService = {
  /**
   * Generate wireframe by calling the Edge Function
   */
  generateWireframe: wireframeGenerator.generateWireframe,
  
  /**
   * Save wireframe to database
   */
  saveWireframe: wireframeStorage.saveWireframe,
  
  /**
   * Get all wireframes for a project
   */
  getProjectWireframes: wireframeStorage.getProjectWireframes,
  
  /**
   * Get the latest wireframe for a project
   */
  getLatestWireframe: wireframeStorage.getLatestWireframe,
  
  /**
   * Get a specific wireframe by ID with its sections
   */
  getWireframe: wireframeStorage.getWireframe,
  
  /**
   * Update wireframe data
   */
  updateWireframeData: wireframeStorage.updateWireframeData,
  
  /**
   * Update wireframe feedback and rating
   */
  updateWireframeFeedback: wireframeFeedback.updateWireframeFeedback,
  
  /**
   * Delete a wireframe
   */
  deleteWireframe: wireframeStorage.deleteWireframe
};
