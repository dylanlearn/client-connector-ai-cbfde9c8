
import React, { useEffect } from 'react';
import ProgressiveWireframe from './ProgressiveWireframe';
import { WireframeData, WireframeSection } from '@/types/wireframe';
import { useFpsMonitor } from '@/hooks/useFpsMonitor';
import { PerformanceMonitoringService } from '@/services/PerformanceMonitoringService';

interface EnhancedPerformanceWireframeProps {
  wireframe: WireframeData;
}

const EnhancedPerformanceWireframe: React.FC<EnhancedPerformanceWireframeProps> = ({ wireframe }) => {
  // Monitor FPS while rendering this wireframe
  const fps = useFpsMonitor({ 
    wireframeId: wireframe.id,
    reportInterval: 2000,
    enabled: true
  });
  
  useEffect(() => {
    const startTime = performance.now();
    
    // Record render time when component mounts
    return () => {
      const renderTime = performance.now() - startTime;
      PerformanceMonitoringService.recordRenderTime(wireframe.id, renderTime);
    };
  }, [wireframe.id]);

  // Render a section
  const renderSection = (section: WireframeSection, index: number) => {
    return (
      <div 
        className="p-4 mb-4 border rounded-lg bg-white shadow-sm" 
        key={section.id || `section-${index}`}
      >
        <h3 className="text-lg font-semibold mb-2">{section.name}</h3>
        <p className="text-gray-600 mb-4">{section.description}</p>
        <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">
            {section.sectionType.toUpperCase()} Section Content
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="bg-gray-100 p-2 mb-4 text-sm">
        <span className="font-medium">Performance:</span> {fps !== null ? `${fps} FPS` : 'Measuring...'}
      </div>
      
      <ProgressiveWireframe
        wireframe={wireframe}
        className="px-4 py-2"
        renderSection={renderSection}
      />
    </div>
  );
};

export default EnhancedPerformanceWireframe;
