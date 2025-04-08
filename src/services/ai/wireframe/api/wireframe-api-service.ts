
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Service class for interacting with the Wireframe API.
 */
export class WireframeAPIService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  constructor() {
    // Add a response interceptor to handle errors
    this.api.interceptors.response.use(
      response => response,
      error => {
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
   * @param prompt The wireframe generation prompt.
   * @returns A promise that resolves with the generated wireframe result.
   */
  async generateWireframe(prompt: any) {
    try {
      const response = await this.api.post('/api/wireframe/generate', prompt);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate wireframe');
    }
  }

  /**
   * Generates a section based on the provided type and data.
   * @param type The type of the section to generate.
   * @param data The data to use for generating the section.
   * @returns A promise that resolves with the generated wireframe section.
   */
  async generateSection(type: string, data: any) {
    try {
      const response = await this.api.post(`/api/wireframe/section/generate`, {
        type,
        data
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate section');
    }
  }

  /**
   * Enhances a wireframe based on the provided wireframe and prompt.
   * @param wireframe The wireframe to enhance.
   * @param prompt The prompt to use for enhancing the wireframe.
   * @returns A promise that resolves with the enhanced wireframe result.
   */
  async enhanceWireframe(wireframe: any, prompt: string) {
    try {
      const response = await this.api.post('/api/wireframe/enhance', {
        wireframe,
        prompt
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to enhance wireframe');
    }
  }

  /**
   * Generates variations of a section based on the provided section and count.
   * @param section The section to generate variations for.
   * @param count The number of variations to generate.
   * @returns A promise that resolves with an array of generated wireframe sections.
   */
  async generateVariations(section: any, count: number) {
    try {
      const response = await this.api.post('/api/wireframe/section/variations', {
        section,
        count
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate variations');
    }
  }

  /**
   * Analyzes a wireframe for layout patterns and optimization opportunities.
   * @param wireframeData The wireframe data to analyze.
   * @returns A promise that resolves with the layout analysis result.
   */
  async analyzeLayout(wireframeData: any) {
    try {
      const response = await this.api.post('/api/wireframe/analyze/layout', {
        wireframeData
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to analyze layout');
    }
  }

  /**
   * Updates wireframe feedback
   * @param wireframeId The ID of the wireframe to update
   * @param feedback The feedback data
   * @returns A promise that resolves with the updated wireframe
   */
  async updateWireframeFeedback(wireframeId: string, feedback: any) {
    try {
      const response = await this.api.post(`/api/wireframe/${wireframeId}/feedback`, {
        feedback
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update wireframe feedback');
    }
  }

  /**
   * Updates wireframe data
   * @param wireframeId The ID of the wireframe to update
   * @param data The updated data
   * @returns A promise that resolves with the updated wireframe
   */
  async updateWireframeData(wireframeId: string, data: any) {
    try {
      const response = await this.api.put(`/api/wireframe/${wireframeId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update wireframe data');
    }
  }
}

/**
 * Helper function to process layout information.
 * @param layoutInfo The layout information to process.
 * @returns The processed layout information.
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
    alignment: layoutInfo.alignment || 'center',
    tabletGrid: layoutInfo.tabletGrid || '' // Keep other properties with default
  };
};

export default new WireframeAPIService();
