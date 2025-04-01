
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useClientAccess } from '../use-client-access';
import { validateClientToken } from '@/utils/client-service';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useLocation: () => ({
    search: '?clientToken=test-token&designerId=test-designer',
  }),
}));

vi.mock('@/utils/client-service', () => ({
  validateClientToken: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('useClientAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useClientAccess());
    expect(result.current.isValidatingAccess).toBe(true);
    expect(result.current.accessDenied).toBe(false);
  });

  it('should extract client token and designer ID from URL', async () => {
    (validateClientToken as any).mockResolvedValue(true);
    
    const { result, waitForNextUpdate } = renderHook(() => useClientAccess());
    
    await waitForNextUpdate();
    
    expect(result.current.clientToken).toBe('test-token');
    expect(result.current.designerId).toBe('test-designer');
    expect(result.current.isValidatingAccess).toBe(false);
    expect(result.current.accessDenied).toBe(false);
  });

  it('should handle invalid token', async () => {
    (validateClientToken as any).mockResolvedValue(false);
    
    const { result, waitForNextUpdate } = renderHook(() => useClientAccess());
    
    await waitForNextUpdate();
    
    expect(result.current.accessDenied).toBe(true);
    expect(result.current.isValidatingAccess).toBe(false);
  });

  it('should handle validation error', async () => {
    (validateClientToken as any).mockRejectedValue(new Error('Validation error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useClientAccess());
    
    await waitForNextUpdate();
    
    expect(result.current.accessDenied).toBe(true);
    expect(result.current.error).not.toBeNull();
  });
});
