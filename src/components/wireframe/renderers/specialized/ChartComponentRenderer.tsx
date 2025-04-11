
import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import { BarChart, PieChart, LineChart, TrendingUp } from 'lucide-react';
import { ErrorBoundary, useErrorHandler } from '@/components/ui/error-boundary';
import { ErrorMessage } from '@/components/admin/monitoring/controls/ErrorMessage';

/**
 * Specialized renderer for chart components
 */
const ChartComponentRenderer: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  const handleError = useErrorHandler('ChartComponentRenderer');

  const handleClick = () => {
    if (interactive && onClick && component.id) {
      onClick(component.id);
    }
  };

  try {
    // Extract chart styles
    const {
      width = '100%',
      height = '200px',
      borderRadius = '0.375rem',
      padding = '1rem',
      backgroundColor = darkMode ? '#1F2937' : '#F9FAFB',
    } = component.style || {};

    // Get chart type
    const chartType = component.props?.chartType || 'bar';
    
    // Define chart placeholder icon based on type
    const renderChartIcon = () => {
      switch(chartType.toLowerCase()) {
        case 'pie':
        case 'donut':
          return <PieChart className={cn("w-12 h-12", darkMode ? "text-gray-500" : "text-gray-400")} />;
        case 'line':
        case 'area':
          return <LineChart className={cn("w-12 h-12", darkMode ? "text-gray-500" : "text-gray-400")} />;
        case 'trending':
        case 'sparkline':
          return <TrendingUp className={cn("w-12 h-12", darkMode ? "text-gray-500" : "text-gray-400")} />;
        case 'bar':
        case 'column':
        default:
          return <BarChart className={cn("w-12 h-12", darkMode ? "text-gray-500" : "text-gray-400")} />;
      }
    };

    return (
      <ErrorBoundary fallback={
        <div className="wireframe-chart-error p-4 bg-red-50 border border-red-200 rounded">
          <ErrorMessage title="Chart Error" message={`Failed to render ${chartType} chart`} />
        </div>
      }>
        <div 
          className={cn(
            "wireframe-chart-component",
            isSelected && "ring-2 ring-primary",
            interactive && "cursor-pointer"
          )}
          style={{
            width,
            height,
            borderRadius,
            backgroundColor,
            padding,
            border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB'
          }}
          onClick={handleClick}
          data-component-id={component.id}
          data-component-type="chart"
          data-testid={`chart-${component.id}`}
        >
          {/* Chart Title */}
          {component.props?.title && (
            <div className="mb-4">
              <h4 className={cn(
                "text-sm font-medium",
                darkMode ? "text-gray-200" : "text-gray-700"
              )}>
                {component.props.title}
              </h4>
            </div>
          )}
          
          {/* Chart Placeholder */}
          <div className="flex flex-col items-center justify-center h-full">
            {renderChartIcon()}
            <span className={cn(
              "mt-2 text-sm",
              darkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
            </span>
          </div>
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    handleError(error instanceof Error ? error : new Error(`Chart rendering error: ${error}`));
    return (
      <div className="wireframe-chart-error p-4 bg-red-50 border border-red-200 rounded">
        <ErrorMessage title="Chart Error" message={`Failed to render ${component.props?.chartType || 'bar'} chart`} />
      </div>
    );
  }
};

export default ChartComponentRenderer;
