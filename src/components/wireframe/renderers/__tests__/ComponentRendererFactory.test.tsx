
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentRendererFactory from '../ComponentRendererFactory';

// Mock the specialized renderers
vi.mock('../specialized/ButtonComponentRenderer', () => ({
  default: ({ component, onClick }) => (
    <button data-testid={`mocked-button-${component.id}`} onClick={() => onClick && onClick(component.id)}>
      Mocked Button: {component.content}
    </button>
  )
}));

vi.mock('../specialized/TextComponentRenderer', () => ({
  default: ({ component }) => (
    <div data-testid={`mocked-text-${component.id}`}>Mocked Text: {component.content}</div>
  )
}));

vi.mock('../specialized/ContainerComponentRenderer', () => ({
  default: ({ component }) => (
    <div data-testid={`mocked-container-${component.id}`}>Mocked Container: {component.content}</div>
  )
}));

// Mock other renderers as needed...

describe('ComponentRendererFactory', () => {
  it('renders button component correctly', () => {
    const mockButtonComponent = {
      id: 'btn-1',
      type: 'button',
      content: 'Click me'
    };
    
    render(<ComponentRendererFactory component={mockButtonComponent} />);
    
    expect(screen.getByTestId('mocked-button-btn-1')).toBeInTheDocument();
    expect(screen.getByText(/Mocked Button: Click me/)).toBeInTheDocument();
  });
  
  it('renders text component correctly', () => {
    const mockTextComponent = {
      id: 'text-1',
      type: 'text',
      content: 'Hello World'
    };
    
    render(<ComponentRendererFactory component={mockTextComponent} />);
    
    expect(screen.getByTestId('mocked-text-text-1')).toBeInTheDocument();
    expect(screen.getByText(/Mocked Text: Hello World/)).toBeInTheDocument();
  });
  
  it('falls back to container for unknown component types', () => {
    const mockUnknownComponent = {
      id: 'unknown-1',
      type: 'unknown-type',
      content: 'Unknown component'
    };
    
    render(<ComponentRendererFactory component={mockUnknownComponent} />);
    
    expect(screen.getByTestId('mocked-container-unknown-1')).toBeInTheDocument();
  });
  
  it('handles component click events', async () => {
    const mockComponent = {
      id: 'btn-2',
      type: 'button',
      content: 'Click me'
    };
    
    const handleClick = vi.fn();
    
    render(<ComponentRendererFactory component={mockComponent} onClick={handleClick} />);
    
    await userEvent.click(screen.getByTestId('mocked-button-btn-2'));
    
    expect(handleClick).toHaveBeenCalledWith('btn-2');
  });
  
  it('renders error state for invalid components', () => {
    render(<ComponentRendererFactory component={null as any} />);
    
    expect(screen.getByText(/Rendering Error/)).toBeInTheDocument();
  });
});
