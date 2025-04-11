
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppErrorBoundary } from '../../error-handling/AppErrorBoundary';
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

vi.mock('@/utils/monitoring/api-usage', () => ({
  recordClientError: vi.fn().mockResolvedValue(undefined)
}));

// Mock error-causing component
const ErrorThrowingComponent = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Working Component</div>;
};

describe('AppErrorBoundary', () => {
  const originalConsoleError = console.error;
  const mockOnError = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console errors in tests
    console.error = vi.fn();
  });
  
  afterEach(() => {
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  it('renders children when no error is thrown', () => {
    render(
      <AppErrorBoundary>
        <div data-testid="child-component">Child Content</div>
      </AppErrorBoundary>
    );
    
    expect(screen.getByTestId('child-component')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
  
  it('renders error UI when child component throws', () => {
    render(
      <AppErrorBoundary userId="test-user-123" onError={mockOnError}>
        <ErrorThrowingComponent shouldThrow={true} />
      </AppErrorBoundary>
    );
    
    // Check error message is displayed
    expect(screen.getByText(/The application encountered an error/i)).toBeInTheDocument();
    
    // Verify error handler was called
    expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    expect(toast.error).toHaveBeenCalledWith("An error occurred", expect.any(Object));
    expect(console.error).toHaveBeenCalled();
    expect(recordClientError).toHaveBeenCalled();
  });
  
  it('includes userId in error reporting when provided', () => {
    render(
      <AppErrorBoundary userId="test-user-123">
        <ErrorThrowingComponent shouldThrow={true} />
      </AppErrorBoundary>
    );
    
    // The error should have been reported with the user ID
    expect(recordClientError).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      "AppErrorBoundary",
      { userId: "test-user-123" }
    );
  });
});
