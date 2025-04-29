
import React from 'react';
import { ContentStrategy } from '@/services/testing/ContentAdherenceService';
import { Separator } from '@/components/ui/separator';

interface ContentStrategyDetailsProps {
  strategy: ContentStrategy;
}

const ContentStrategyDetails: React.FC<ContentStrategyDetailsProps> = ({ strategy }) => {
  return (
    <div className="space-y-4">
      {strategy.toneGuidelines && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">TONE GUIDELINES</h3>
          <p className="text-sm">{strategy.toneGuidelines}</p>
        </div>
      )}
      
      <Separator />
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">REQUIRED CONTENT</h3>
        {strategy.contentRequirements.required_sections && (
          <div className="grid grid-cols-2 gap-2">
            {strategy.contentRequirements.required_sections.map((section: string) => (
              <div key={section} className="px-3 py-1 rounded-md bg-primary/5 text-sm">
                {section}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {strategy.contentRequirements.word_count && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">WORD COUNT GUIDELINES</h3>
            <div className="space-y-2">
              {Object.entries(strategy.contentRequirements.word_count).map(([section, limits]: [string, any]) => (
                <div key={section} className="flex justify-between items-center py-1 px-3 bg-primary/5 rounded-md">
                  <div className="capitalize">{section.replace(/_/g, ' ')}</div>
                  <div className="text-sm">
                    {limits.min && limits.max ? (
                      <span>{limits.min} - {limits.max} words</span>
                    ) : limits.min ? (
                      <span>Min: {limits.min} words</span>
                    ) : limits.max ? (
                      <span>Max: {limits.max} words</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {strategy.informationArchitecture && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">INFORMATION ARCHITECTURE</h3>
            {strategy.informationArchitecture.hierarchy && (
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1 px-3 bg-primary/5 rounded-md">
                  <div>Hierarchy Depth</div>
                  <div className="text-sm">{strategy.informationArchitecture.hierarchy.depth} levels</div>
                </div>
                {strategy.informationArchitecture.hierarchy.main_categories && (
                  <div className="py-1 px-3 bg-primary/5 rounded-md">
                    <div className="mb-1">Main Categories:</div>
                    <div className="flex flex-wrap gap-2">
                      {strategy.informationArchitecture.hierarchy.main_categories.map((category: string) => (
                        <span key={category} className="text-sm px-2 py-1 bg-background rounded">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ContentStrategyDetails;
