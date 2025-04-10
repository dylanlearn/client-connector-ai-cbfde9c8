
import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useWireframeStore } from '@/stores/wireframe-store';
import WireframePreviewSystem from './preview/WireframePreviewSystem';
import { useAuth } from '@/hooks/use-auth';
import { WireframeAnalyticsService } from '@/services/analytics/wireframe-analytics-service';

interface ResponsivePreviewProps {
  className?: string;
  onSectionClick?: (sectionId: string) => void;
  projectId?: string;
  onExport?: (format: string) => void;
}

const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({ 
  className,
  onSectionClick,
  projectId,
  onExport
}) => {
  const { wireframe } = useWireframeStore();
  const { user } = useAuth();
  
  // Handle export with analytics tracking
  const handleExport = useCallback((format: string) => {
    if (onExport) {
      onExport(format);
    }
    
    // Track export event if user and wireframe are available
    if (user && wireframe && wireframe.id) {
      WireframeAnalyticsService.trackExport(
        user.id,
        wireframe.id,
        format
      );
    }
  }, [onExport, user, wireframe]);
  
  // Handle section click with analytics tracking
  const handleSectionClick = useCallback((sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
    
    // Track section view if user and wireframe are available
    if (user && wireframe && wireframe.id) {
      const section = wireframe.sections.find(s => s.id === sectionId);
      if (section) {
        WireframeAnalyticsService.trackSectionView(
          user.id,
          wireframe.id,
          sectionId,
          section.sectionType || 'unknown'
        );
      }
    }
  }, [onSectionClick, user, wireframe]);
  
  return (
    <Card className={cn("shadow-md overflow-hidden", className)}>
      {wireframe && (
        <WireframePreviewSystem
          wireframe={wireframe}
          onSectionClick={handleSectionClick}
          onExport={handleExport}
          projectId={projectId}
        />
      )}
      
      {!wireframe && (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No wireframe data available</p>
        </div>
      )}
    </Card>
  );
};

export default ResponsivePreview;
