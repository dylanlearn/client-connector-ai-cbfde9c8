
import { 
  generateWireframeFromPrompt, 
  generateWireframeVariation,
  generateWireframeFromTemplate 
} from './wireframe-generator';
import wireframeApiService from './wireframe-api-service';

export { 
  generateWireframeFromPrompt,
  generateWireframeVariation,
  generateWireframeFromTemplate,
  wireframeApiService 
};

export default wireframeApiService;

// Export a named wireframeGenerator object for compatibility with existing code
export const wireframeGenerator = {
  generateWireframeFromPrompt,
  generateWireframeVariation,
  generateWireframeFromTemplate
};
