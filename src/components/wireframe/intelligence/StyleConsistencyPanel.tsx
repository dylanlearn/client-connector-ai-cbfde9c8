
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Wand2 } from 'lucide-react';
import { useStyleConsistency } from '@/hooks/wireframe/use-style-consistency';

interface StyleConsistencyPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
}

const StyleConsistencyPanel: React.FC<StyleConsistencyPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const {
    inconsistencies,
    analyzing,
    analyze,
    autoFix
  } = useStyleConsistency(wireframe, onUpdateWireframe);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          onClick={() => analyze()} 
          disabled={analyzing}
          variant="outline"
          className="w-full"
        >
          <Shield className="w-4 h-4 mr-2" />
          {analyzing ? 'Analyzing...' : 'Analyze Style Consistency'}
        </Button>
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {inconsistencies.map((issue, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="pt-4">
              <Alert>
                <AlertDescription className="flex justify-between items-center">
                  <span>{issue.description}</span>
                  <Button
                    size="sm"
                    onClick={() => autoFix(issue.id)}
                    className="ml-2"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Auto-fix
                  </Button>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ))}
        
        {!analyzing && inconsistencies.length === 0 && (
          <div className="text-center text-muted-foreground p-4">
            No style inconsistencies detected
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default StyleConsistencyPanel;
