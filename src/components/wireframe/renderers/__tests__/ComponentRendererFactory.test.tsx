
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComponentRendererFactory } from '../ComponentRendererFactory';

// Mock the specialized renderers
vi.mock('../specialized/ButtonComponentRenderer', () => ({
  default: () => <div data-testid="mock-button-renderer">Button Renderer</div>
}));

vi.mock('../specialized/TextComponentRenderer', () => ({
  default: () => <div data-testid="mock-text-renderer">Text Renderer</div>
}));

vi.mock('../specialized/ContainerComponentRenderer', () => ({
  default: () => <div data-testid="mock-container-renderer">Container Renderer</div>
}));

vi.mock('../specialized/ImageComponentRenderer', () => ({
  default: () => <div data-testid="mock-image-renderer">Image Renderer</div>
}));

vi.mock('../specialized/InputComponentRenderer', () => ({
  default: () => <div data-testid="mock-input-renderer">Input Renderer</div>
}));

vi.mock('../specialized/CardComponentRenderer', () => ({
  default: () => <div data-testid="mock-card-renderer">Card Renderer</div>
}));

vi.mock('../specialized/ListComponentRenderer', () => ({
  default: () => <div data-testid="mock-list-renderer">List Renderer</div>
}));

vi.mock('../specialized/IconComponentRenderer', () => ({
  default: () => <div data-testid="mock-icon-renderer">Icon Renderer</div>
}));

vi.mock('../specialized/VideoComponentRenderer', () => ({
  default: () => <div data-testid="mock-video-renderer">Video Renderer</div>
}));

vi.mock('../specialized/ChartComponentRenderer', () => ({
  default: () => <div data-testid="mock-chart-renderer">Chart Renderer</div>
}));

vi.mock('../specialized/FormComponentRenderer', () => ({
  default: () => <div data-testid="mock-form-renderer">Form Renderer</div>
}));

describe('ComponentRendererFactory', () => {
  it('renders error message when component is null', () => {
    render(<ComponentRendererFactory component={null as any} />);
    expect(screen.getByText('Invalid component data provided')).toBeInTheDocument();
  });

  it('renders error message when component has no type', () => {
    render(<ComponentRendererFactory component={{ id: 'no-type' } as any} />);
    expect(screen.getByText(/Component ID no-type has no type/)).toBeInTheDocument();
  });

  it('renders ButtonComponentRenderer for button type', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'btn-1', type: 'button' }}
      />
    );
    expect(screen.getByTestId('mock-button-renderer')).toBeInTheDocument();
  });

  it('renders TextComponentRenderer for text type', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'text-1', type: 'text' }}
      />
    );
    expect(screen.getByTestId('mock-text-renderer')).toBeInTheDocument();
  });

  it('renders TextComponentRenderer for heading type', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'heading-1', type: 'heading' }}
      />
    );
    expect(screen.getByTestId('mock-text-renderer')).toBeInTheDocument();
  });

  it('renders ImageComponentRenderer for image type', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'img-1', type: 'image' }}
      />
    );
    expect(screen.getByTestId('mock-image-renderer')).toBeInTheDocument();
  });

  it('renders InputComponentRenderer for input type', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'input-1', type: 'input' }}
      />
    );
    expect(screen.getByTestId('mock-input-renderer')).toBeInTheDocument();
  });

  it('renders CardComponentRenderer for card type', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'card-1', type: 'card' }}
      />
    );
    expect(screen.getByTestId('mock-card-renderer')).toBeInTheDocument();
  });

  it('renders ListComponentRenderer for list type', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'list-1', type: 'list' }}
      />
    );
    expect(screen.getByTestId('mock-list-renderer')).toBeInTheDocument();
  });

  it('renders IconComponentRenderer for icon type', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'icon-1', type: 'icon' }}
      />
    );
    expect(screen.getByTestId('mock-icon-renderer')).toBeInTheDocument();
  });

  it('renders VideoComponentRenderer for video type', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'video-1', type: 'video' }}
      />
    );
    expect(screen.getByTestId('mock-video-renderer')).toBeInTheDocument();
  });

  it('renders ChartComponentRenderer for chart type', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'chart-1', type: 'chart' }}
      />
    );
    expect(screen.getByTestId('mock-chart-renderer')).toBeInTheDocument();
  });

  it('renders FormComponentRenderer for form type', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'form-1', type: 'form' }}
      />
    );
    expect(screen.getByTestId('mock-form-renderer')).toBeInTheDocument();
  });

  it('uses ContainerComponentRenderer as fallback', () => {
    render(
      <ComponentRendererFactory 
        component={{ id: 'unknown-1', type: 'unknown-type' }}
      />
    );
    expect(screen.getByTestId('mock-container-renderer')).toBeInTheDocument();
  });
});
