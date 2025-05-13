
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen, fireEvent } from '../../../test/setup';
import WireframeErrorState from '../../wireframe/WireframeErrorState';

describe('WireframeErrorState', () => {
  const mockOnRetry = vi.fn();
  
  it('renders error message from string error', () => {
    render(<WireframeErrorState error="Test error message" />);
    
    expect(screen.getByText('Wireframe Generation Failed')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });
  
  it('renders error message from Error object', () => {
    const errorObj = new Error('Test error object');
    render(<WireframeErrorState error={errorObj} />);
    
    expect(screen.getByText('Wireframe Generation Failed')).toBeInTheDocument();
    expect(screen.getByText('Test error object')).toBeInTheDocument();
  });
  
  it('renders retry button when onRetry is provided', () => {
    render(<WireframeErrorState error="Test error" onRetry={mockOnRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    expect(retryButton).toBeInTheDocument();
  });
  
  it('does not render retry button when onRetry is not provided', () => {
    render(<WireframeErrorState error="Test error" />);
    
    const retryButton = screen.queryByRole('button', { name: /Try Again/i });
    expect(retryButton).not.toBeInTheDocument();
  });
  
  it('calls onRetry when retry button is clicked', () => {
    render(<WireframeErrorState error="Test error" onRetry={mockOnRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryButton);
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
  
  it('renders with appropriate styling', () => {
    render(<WireframeErrorState error="Test error" />);
    
    const card = screen.getByText('Wireframe Generation Failed').closest('.border-destructive\\/50');
    expect(card).toBeInTheDocument();
  });
});
