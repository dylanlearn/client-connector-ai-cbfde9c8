
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeGeneratorPrompt, 
  WireframeResult,
  WireframeSection,
  WireframeComponent,
  WireframeData
} from '../wireframe-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Service class for interacting with the Wireframe API.
 */
export class WireframeAPIService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  constructor() {
    // Add a response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        
        // Conditionally log the request and response data
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Generates a wireframe based on the provided prompt.
   */
  async generateWireframe(prompt: WireframeGeneratorPrompt): Promise<WireframeResult> {
    try {
      const response = await this.api.post<WireframeResult>('/api/wireframe/generate', prompt);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate wireframe');
    }
  }

  /**
   * Generates a section based on the provided type and data.
   */
  async generateSection(type: string, data?: any): Promise<WireframeSection> {
    try {
      const response = await this.api.post<WireframeSection>(`/api/wireframe/section/generate`, { type, data });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate section');
    }
  }

  /**
   * Enhances a wireframe based on the provided wireframe and prompt.
   */
  async enhanceWireframe(wireframe: WireframeResult, prompt?: string): Promise<WireframeResult> {
    try {
      const response = await this.api.post<WireframeResult>('/api/wireframe/enhance', { wireframe, prompt });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to enhance wireframe');
    }
  }

  /**
   * Generates variations of a section based on the provided section and count.
   */
  async generateVariations(section: WireframeSection, count?: number): Promise<WireframeSection[]> {
    try {
      const response = await this.api.post<WireframeSection[]>('/api/wireframe/section/variations', { section, count });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate variations');
    }
  }
  
  /**
   * Analyzes a wireframe for layout patterns and optimization opportunities.
   */
  async analyzeLayout(wireframeData: WireframeData): Promise<any> {
    try {
      const response = await this.api.post<any>('/api/wireframe/analyze/layout', { wireframeData });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to analyze layout');
    }
  }

  /**
   * Fetches a single wireframe by ID
   */
  async getWireframe(id: string): Promise<any> {
    try {
      const response = await this.api.get<any>(`/api/wireframe/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch wireframe');
    }
  }

  /**
   * Saves a wireframe to the server
   */
  async saveWireframe(
    projectId: string,
    prompt: string,
    wireframeData: WireframeData,
    params: any,
    model?: string
  ): Promise<any> {
    try {
      const response = await this.api.post<any>('/api/wireframe/save', {
        projectId,
        prompt,
        wireframeData,
        params,
        model
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to save wireframe');
    }
  }

  /**
   * Updates wireframe data
   */
  async updateWireframeData(
    wireframeId: string,
    wireframeData: WireframeData
  ): Promise<any> {
    try {
      const response = await this.api.put<any>(`/api/wireframe/${wireframeId}`, {
        wireframeData
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update wireframe data');
    }
  }

  /**
   * Gets the latest wireframe for a project
   */
  async getLatestWireframe(projectId: string): Promise<any> {
    try {
      const response = await this.api.get<any>(`/api/wireframe/latest/${projectId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch latest wireframe');
    }
  }
}

/**
 * Helper function to process layout information.
 */
const processLayout = (layoutInfo: any) => {
  // Make sure to have a default alignment property
  if (layoutInfo.type === 'grid') {
    return {
      type: layoutInfo.type,
      tabletGrid: layoutInfo.tabletGrid || '1fr 1fr',
      alignment: layoutInfo.alignment || 'center' // Add default alignment
    };
  }
  
  return {
    type: layoutInfo.type || 'flex',
    alignment: layoutInfo.alignment || 'center', // Add default alignment
    tabletGrid: layoutInfo.tabletGrid // Keep other properties
  };
};

// Create and export a default instance of the service
const wireframeApiService = new WireframeAPIService();
export default wireframeApiService;
