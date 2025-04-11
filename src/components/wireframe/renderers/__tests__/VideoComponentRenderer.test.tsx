
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import VideoComponentRenderer from '../specialized/VideoComponentRenderer';

describe('VideoComponentRenderer', () => {
  const mockComponent = {
    id: 'test-video-1',
    type: 'video',
    props: {
      src: 'https://example.com/video.mp4',
      thumbnail: 'https://example.com/thumbnail.jpg',
      title: 'Test Video'
    },
    style: {
      borderRadius: '8px',
      aspectRatio: '16/9',
      width: '100%',
      height: 'auto'
    }
  };

  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the video component with thumbnail', () => {
    render(<VideoComponentRenderer component={mockComponent} />);
    
    const videoElement = screen.getByTestId(`video-${mockComponent.id}`);
    expect(videoElement).toBeInTheDocument();
    
    const thumbnailImage = videoElement.querySelector('img');
    expect(thumbnailImage).toHaveAttribute('src', mockComponent.props.thumbnail);
  });

  it('renders the video component with title', () => {
    render(<VideoComponentRenderer component={mockComponent} />);
    
    const titleElement = screen.getByText(mockComponent.props.title);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders play button overlay', () => {
    render(<VideoComponentRenderer component={mockComponent} />);
    
    const playButton = document.querySelector('.absolute.inset-0.flex.items-center.justify-center');
    expect(playButton).toBeInTheDocument();
  });

  it('handles click event when interactive', () => {
    render(
      <VideoComponentRenderer 
        component={mockComponent}
        interactive={true}
        onClick={mockOnClick}
      />
    );
    
    const videoElement = screen.getByTestId(`video-${mockComponent.id}`);
    videoElement.click();
    
    expect(mockOnClick).toHaveBeenCalledWith(mockComponent.id);
  });

  it('does not trigger click event when not interactive', () => {
    render(
      <VideoComponentRenderer 
        component={mockComponent}
        interactive={false}
        onClick={mockOnClick}
      />
    );
    
    const videoElement = screen.getByTestId(`video-${mockComponent.id}`);
    videoElement.click();
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('renders fallback when no thumbnail is provided', () => {
    const noThumbnailComponent = {
      ...mockComponent,
      props: {
        ...mockComponent.props,
        thumbnail: ''
      }
    };
    
    render(<VideoComponentRenderer component={noThumbnailComponent} />);
    
    const filmIcon = document.querySelector('.flex.items-center.justify-center svg');
    expect(filmIcon).toBeInTheDocument();
  });

  it('shows selected state when isSelected is true', () => {
    render(
      <VideoComponentRenderer 
        component={mockComponent}
        isSelected={true}
      />
    );
    
    const videoElement = screen.getByTestId(`video-${mockComponent.id}`);
    expect(videoElement).toHaveClass('ring-2');
    expect(videoElement).toHaveClass('ring-primary');
  });
});
