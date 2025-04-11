
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChartComponentRenderer from '../specialized/ChartComponentRenderer';

describe('ChartComponentRenderer', () => {
  const mockComponent = {
    id: 'test-chart-1',
    type: 'chart',
    props: {
      chartType: 'bar',
      title: 'Sales Data'
    },
    style: {
      width: '500px',
      height: '300px',
      borderRadius: '8px',
      padding: '16px'
    }
  };

  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the chart component with title', () => {
    render(<ChartComponentRenderer component={mockComponent} />);
    
    const chartElement = screen.getByTestId(`chart-${mockComponent.id}`);
    expect(chartElement).toBeInTheDocument();
    
    const titleElement = screen.getByText(mockComponent.props.title);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders correct chart icon based on chartType', () => {
    render(<ChartComponentRenderer component={mockComponent} />);
    
    const chartTypeText = screen.getByText('Bar Chart');
    expect(chartTypeText).toBeInTheDocument();
  });

  it('renders pie chart icon for pie chartType', () => {
    const pieChartComponent = {
      ...mockComponent,
      props: {
        ...mockComponent.props,
        chartType: 'pie'
      }
    };
    
    render(<ChartComponentRenderer component={pieChartComponent} />);
    
    const chartTypeText = screen.getByText('Pie Chart');
    expect(chartTypeText).toBeInTheDocument();
  });

  it('renders line chart icon for line chartType', () => {
    const lineChartComponent = {
      ...mockComponent,
      props: {
        ...mockComponent.props,
        chartType: 'line'
      }
    };
    
    render(<ChartComponentRenderer component={lineChartComponent} />);
    
    const chartTypeText = screen.getByText('Line Chart');
    expect(chartTypeText).toBeInTheDocument();
  });

  it('handles click event when interactive', () => {
    render(
      <ChartComponentRenderer 
        component={mockComponent}
        interactive={true}
        onClick={mockOnClick}
      />
    );
    
    const chartElement = screen.getByTestId(`chart-${mockComponent.id}`);
    chartElement.click();
    
    expect(mockOnClick).toHaveBeenCalledWith(mockComponent.id);
  });

  it('does not trigger click event when not interactive', () => {
    render(
      <ChartComponentRenderer 
        component={mockComponent}
        interactive={false}
        onClick={mockOnClick}
      />
    );
    
    const chartElement = screen.getByTestId(`chart-${mockComponent.id}`);
    chartElement.click();
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('applies dark mode styles when darkMode is true', () => {
    render(
      <ChartComponentRenderer 
        component={mockComponent}
        darkMode={true}
      />
    );
    
    const chartElement = screen.getByTestId(`chart-${mockComponent.id}`);
    expect(chartElement).toHaveStyle({ backgroundColor: '#1F2937' });
  });

  it('shows selected state when isSelected is true', () => {
    render(
      <ChartComponentRenderer 
        component={mockComponent}
        isSelected={true}
      />
    );
    
    const chartElement = screen.getByTestId(`chart-${mockComponent.id}`);
    expect(chartElement).toHaveClass('ring-2');
    expect(chartElement).toHaveClass('ring-primary');
  });
});
