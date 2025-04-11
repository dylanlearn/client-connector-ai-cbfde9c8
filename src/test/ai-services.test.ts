
import { describe, it, expect } from 'vitest';
// Importing the correct named exports
import { generateWireframe, generateWireframeFromTemplate } from '@/services/ai/wireframe/api/wireframe-generator';
import { optimizeWireframeForDevice } from '@/services/ai/wireframe/api/wireframe-optimization-service';
import { generateImagePreview } from '@/services/ai/wireframe/api/wireframe-preview-service';

describe('AI Wireframe Services', () => {
  it('wireframe generator functions should be defined', () => {
    expect(generateWireframe).toBeDefined();
    expect(generateWireframeFromTemplate).toBeDefined();
    expect(optimizeWireframeForDevice).toBeDefined();
    expect(generateImagePreview).toBeDefined();
  });
});
