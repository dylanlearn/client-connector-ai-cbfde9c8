
import { 
  generateWireframe,
  generateWireframeFromPrompt,
  generateWireframeVariation,
  generateWireframeFromTemplate 
} from './wireframe-generator';
import wireframeApiService from './wireframe-api-service';

export { 
  generateWireframe,
  generateWireframeFromPrompt,
  generateWireframeVariation,
  generateWireframeFromTemplate,
  wireframeApiService 
};

export default wireframeApiService;

// Export a named wireframeGenerator object for compatibility with existing code
export const wireframeGenerator = {
  generateWireframe,
  generateWireframeFromPrompt,
  generateWireframeVariation,
  generateWireframeFromTemplate
};
