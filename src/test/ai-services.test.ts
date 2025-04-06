
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CreativeEnhancementService } from '@/services/ai/creative-enhancement-service';
import { wireframeGenerator } from '@/services/ai/wireframe/api/wireframe-generator';
import { mockFetch, createMockSupabaseClient } from './utils/test-helpers';
import { supabase } from '@/integrations/supabase/client';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: createMockSupabaseClient(),
}));

// Mock the performance API
global.performance = {
  now: vi.fn().mockReturnValueOnce(0).mockReturnValueOnce(2000)
} as any;

describe('CreativeEnhancementService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('enhances prompt with the correct style profile', () => {
    const originalPrompt = 'Create a landing page wireframe';
    const profile = 'wireframing';
    
    const enhancedPrompt = CreativeEnhancementService.enhancePrompt(
      originalPrompt, 
      profile, 
      { industry: 'technology' }
    );
    
    expect(enhancedPrompt).toContain(originalPrompt);
    expect(enhancedPrompt.length).toBeGreaterThan(originalPrompt.length);
  });
  
  it('handles missing profile gracefully', () => {
    const originalPrompt = 'Create a landing page wireframe';
    const profile = 'non-existent-profile';
    
    const enhancedPrompt = CreativeEnhancementService.enhancePrompt(
      originalPrompt, 
      profile
    );
    
    expect(enhancedPrompt).toBe(originalPrompt);
  });
});

describe('wireframeGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('generates wireframe with success response', async () => {
    // Mock successful edge function response
    (supabase.functions.invoke as any).mockResolvedValue({
      data: {
        wireframe: { sections: [], style: 'modern' },
        model: 'gpt-4o',
        usage: { total_tokens: 100 }
      },
      error: null
    });
    
    const result = await wireframeGenerator.generateWireframe({
      description: 'Create a tech landing page',
      style: 'modern'
    });
    
    expect(result.success).toBe(true);
    expect(result.wireframe).toBeDefined();
    expect(result.generationTime).toBeGreaterThan(0);
    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      'generate-wireframe',
      expect.objectContaining({
        body: expect.objectContaining({
          description: expect.any(String),
          style: 'modern'
        })
      })
    );
  });
  
  it('handles errors gracefully', async () => {
    // Mock error response
    (supabase.functions.invoke as any).mockResolvedValue({
      data: null,
      error: new Error('Edge function error')
    });
    
    await expect(wireframeGenerator.generateWireframe({
      description: 'Create a tech landing page'
    })).rejects.toThrow('Edge function error');
  });
});
