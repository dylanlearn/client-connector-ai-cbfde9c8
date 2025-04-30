
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { WireframeData } from '@/types/wireframe';
import { AssetOptimizationService } from '@/services/AssetOptimizationService';
import { usePerformanceMonitoring } from '@/components/performance/PerformanceMonitoringProvider';
import { useFpsMonitor } from '@/hooks/useFpsMonitor';
import ProgressiveWireframe from './ProgressiveWireframe';
import WireframeSectionRenderer from './WireframeSectionRenderer';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';

interface EnhancedPerformanceWireframeProps {
  wireframe: WireframeData;
  className?: string;
}

export const EnhancedPerformanceWireframe: React.FC<EnhancedPerformanceWireframeProps> = ({
  wireframe,
  className
}) => {
  const { recordRenderTime } = usePerformanceMonitoring();
  const renderStartTimeRef = useRef<number>(0);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);
  const [optimizationStats, setOptimizationStats] = useState<any>(null);
  const fps = useFpsMonitor({ wireframeId: wireframe.id });
  
  // Measure render time
  useEffect(() => {
    renderStartTimeRef.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartTimeRef.current;
      recordRenderTime(wireframe.id, renderTime);
    };
  }, [wireframe.id, recordRenderTime]);
  
  // Optimize images in sections
  useEffect(() => {
    const optimizeAssets = async () => {
      if (!wireframe?.sections || isOptimized) return;
      
      // Find all image URLs in the wireframe sections
      const imageUrls = new Set<string>();
      
      wireframe.sections.forEach(section => {
        // Check for background images in the section
        if (section.style?.backgroundImage) {
          const url = extractUrlFromBackgroundImage(section.style.backgroundImage);
          if (url) imageUrls.add(url);
        }
        
        // Check for images in components
        if (section.components) {
          section.components.forEach(component => {
            if (component.type === 'image' && component.src) {
              imageUrls.add(component.src);
            }
            
            // Check for background images in component styles
            if (component.style?.backgroundImage) {
              const url = extractUrlFromBackgroundImage(component.style.backgroundImage);
              if (url) imageUrls.add(url);
            }
          });
        }
      });
      
      // Optimize each image
      const optimizationPromises = Array.from(imageUrls).map(url => 
        AssetOptimizationService.optimizeImage(url, {
          maxWidth: 1200,
          quality: 80,
          format: 'webp'
        })
      );
      
      await Promise.all(optimizationPromises);
      setIsOptimized(true);
      
      // Get optimization statistics
      const stats = await AssetOptimizationService.getOptimizationStats();
      setOptimizationStats(stats);
      
      // Show toast notification
      if (stats.length > 0) {
        const totalSaved = stats.reduce((acc, stat) => 
          acc + (stat.total_original_size - stat.total_optimized_size), 0);
        
        toast({
          title: "Asset optimization complete",
          description: `Optimized ${stats.reduce((acc, stat) => acc + stat.total_count, 0)} assets, saved ${formatBytes(totalSaved)}`
        });
      }
    };
    
    optimizeAssets();
  }, [wireframe, isOptimized]);
  
  // Helper to extract URL from background-image CSS
  const extractUrlFromBackgroundImage = (backgroundImage: string) => {
    const match = /url\(['"]?(.*?)['"]?\)/.exec(backgroundImage);
    return match ? match[1] : null;
  };
  
  // Helper to format bytes
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  // Performance alerts
  const renderPerformanceAlert = () => {
    if (fps !== null && fps < 30) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Low Performance Detected</AlertTitle>
          <AlertDescription>
            Current FPS: {fps} - The wireframe is rendering slowly. Consider optimizing assets or reducing complexity.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className={cn("enhanced-performance-wireframe", className)}>
      {renderPerformanceAlert()}
      
      <ProgressiveWireframe
        wireframe={wireframe}
        renderSection={(section, index) => (
          <WireframeSectionRenderer
            key={section.id || `section-${index}`}
            section={section}
            viewMode="preview"
            darkMode={false}
            deviceType="desktop"
            sectionIndex={index}
          />
        )}
      />
      
      {fps !== null && (
        <div className="fixed bottom-4 right-4 px-2 py-1 bg-black/50 text-white rounded text-xs">
          FPS: {fps}
        </div>
      )}
    </div>
  );
};

export default EnhancedPerformanceWireframe;
