
import { describe, it, expect } from 'vitest';
import { generateHtmlFromWireframe, handleExportError } from '../export-utils';

describe('Export Utils', () => {
  it('should export HTML from wireframe', () => {
    const wireframe = {
      id: 'test-wireframe',
      title: 'Test Wireframe',
      sections: []
    };
    
    const result = generateHtmlFromWireframe(wireframe);
    expect(result).toBeDefined();
  });
  
  it('should handle export errors', () => {
    const errorMessage = 'Test error message';
    const result = handleExportError(errorMessage);
    expect(result).toContain(errorMessage);
  });
});
