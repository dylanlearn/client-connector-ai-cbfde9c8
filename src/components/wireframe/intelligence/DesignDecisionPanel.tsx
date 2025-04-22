
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, ThumbsUp, ThumbsDown } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useDesignDecisions } from '@/hooks/wireframe/use-design-decisions';

interface DesignDecisionPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
}

const DesignDecisionPanel: React.FC<DesignDecisionPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const {
    decisions,
    analyzing,
    analyze,
    provideFeedback
  } = useDesignDecisions(wireframe, onUpdateWireframe);

  return (
    <div className="space-y-4">
      <Button 
        onClick={() => analyze()} 
        disabled={analyzing}
        variant="outline"
        className="w-full"
      >
        <Brain className="w-4 h-4 mr-2" />
        {analyzing ? 'Analyzing...' : 'Analyze Design Decisions'}
      </Button>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {decisions.map((decision, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <h4 className="font-medium">{decision.title}</h4>
                <p className="text-sm text-muted-foreground">{decision.rationale}</p>
                
                <div className="mt-2 pt-2 border-t flex justify-between items-center">
                  <div className="text-sm font-medium">
                    Impact: {decision.impact}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => provideFeedback(decision.id, 'positive')}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => provideFeedback(decision.id, 'negative')}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {!analyzing && decisions.length === 0 && (
          <div className="text-center text-muted-foreground p-4">
            No design decisions to review yet
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default DesignDecisionPanel;
