
import { generateWireframe, generateWireframeFromTemplate } from './wireframe-generator';
import wireframeApiService from './wireframe-api-service';

export { 
  generateWireframe,
  generateWireframeFromTemplate,
  wireframeApiService 
};

export default wireframeApiService;

// Export a named wireframeGenerator object for compatibility with existing code
export const wireframeGenerator = {
  generateWireframe,
  generateWireframeFromTemplate
};
