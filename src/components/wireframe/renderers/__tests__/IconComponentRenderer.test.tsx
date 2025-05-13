
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '../../../../test/setup';
import IconComponentRenderer from '../specialized/IconComponentRenderer';

describe('IconComponentRenderer', () => {
  const mockComponent = {
    id: 'test-icon-1',
    type: 'icon',
    props: {
      icon: 'circle',
      className: 'test-class'
    },
    style: {
      size: '32px',
      color: '#FF0000',
      stroke: '2'
    }
  };

  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the correct icon', () => {
    render(<IconComponentRenderer component={mockComponent} />);
    
    // Check if the icon is rendered
    const iconElement = screen.getByTestId(`icon-${mockComponent.id}`);
    expect(iconElement).toBeInTheDocument();
  });

  it('applies correct styles', () => {
    render(<IconComponentRenderer component={mockComponent} />);
    
    const iconContainer = screen.getByTestId(`icon-${mockComponent.id}`);
    expect(iconContainer).toHaveClass('wireframe-icon-component');
  });

  it('handles click event when interactive', () => {
    render(
      <IconComponentRenderer 
        component={mockComponent}
        interactive={true}
        onClick={mockOnClick}
      />
    );
    
    const iconContainer = screen.getByTestId(`icon-${mockComponent.id}`);
    iconContainer.click();
    
    expect(mockOnClick).toHaveBeenCalledWith(mockComponent.id);
  });

  it('does not trigger click event when not interactive', () => {
    render(
      <IconComponentRenderer 
        component={mockComponent}
        interactive={false}
        onClick={mockOnClick}
      />
    );
    
    const iconContainer = screen.getByTestId(`icon-${mockComponent.id}`);
    iconContainer.click();
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('handles invalid icon gracefully', () => {
    const invalidComponent = {
      ...mockComponent,
      props: {
        icon: 'non-existent-icon'
      }
    };
    
    render(<IconComponentRenderer component={invalidComponent} />);
    
    // Still renders without crashing - falls back to Circle icon
    const iconElement = screen.getByTestId(`icon-${mockComponent.id}`);
    expect(iconElement).toBeInTheDocument();
  });

  it('shows selected state when isSelected is true', () => {
    render(
      <IconComponentRenderer 
        component={mockComponent}
        isSelected={true}
      />
    );
    
    const iconContainer = screen.getByTestId(`icon-${mockComponent.id}`);
    expect(iconContainer).toHaveClass('ring-2');
    expect(iconContainer).toHaveClass('ring-primary');
  });
});
