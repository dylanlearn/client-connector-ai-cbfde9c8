
import React from 'react';
import { cn } from '@/lib/utils';
import Wireframe from './Wireframe';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import LoadingStateWrapper from '@/components/ui/LoadingStateWrapper';

interface AIWireframeRendererProps {
  wireframe?: WireframeData | null;
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string, section: any) => void;
  activeSection?: string | null;
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * A wrapper component for rendering wireframes with loading and error states
 */
const AIWireframeRenderer: React.FC<AIWireframeRendererProps> = ({
  wireframe,
  darkMode = false,
  deviceType = 'desktop',
  onSectionClick,
  activeSection,
  className,
  isLoading = false,
  error = null
}) => {
  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick && wireframe) {
      const section = wireframe.sections.find(s => s.id === sectionId);
      if (section) {
        onSectionClick(sectionId, section);
      }
    }
  };
  
  return (
    <div className={cn(
      'wireframe-renderer',
      className,
      darkMode ? 'bg-gray-900' : 'bg-white'
    )}>
      <LoadingStateWrapper
        isLoading={isLoading}
        error={error}
        isEmpty={!wireframe}
        loadingMessage="Rendering wireframe..."
        emptyState={
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            No wireframe data available
          </div>
        }
      >
        {wireframe && (
          <div className="relative">
            <Wireframe
              wireframe={wireframe}
              viewMode="preview"
              darkMode={darkMode}
              deviceType={deviceType}
              onSectionClick={handleSectionClick}
              activeSection={activeSection}
            />
          </div>
        )}
      </LoadingStateWrapper>
    </div>
  );
};

export default AIWireframeRenderer;
