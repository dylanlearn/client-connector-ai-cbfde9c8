
import React from 'react';
import { useDesignDecisions } from '@/hooks/use-design-decisions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import NewDecisionDialog from './NewDecisionDialog';

interface DesignDecisionPanelProps {
  wireframeId: string;
}

const DesignDecisionPanel: React.FC<DesignDecisionPanelProps> = ({ wireframeId }) => {
  const [showNewDialog, setShowNewDialog] = React.useState(false);
  const { decisions, isLoading, createDecision } = useDesignDecisions(wireframeId);
  const { user } = useAuth();

  const handleCreateDecision = async (data: any) => {
    if (!user?.id) return;
    
    await createDecision({
      ...data,
      wireframe_id: wireframeId,
      created_by: user.id
    });
    
    setShowNewDialog(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Design Decisions
        </CardTitle>
        <Button onClick={() => setShowNewDialog(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Record Decision
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {decisions.map((decision) => (
            <Card key={decision.id} className="mb-4">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{decision.title}</h3>
                  <Badge variant={
                    decision.impact === 'High' ? 'destructive' :
                    decision.impact === 'Medium' ? 'default' :
                    'secondary'
                  }>
                    {decision.impact} Impact
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{decision.description}</p>
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-1">Rationale</h4>
                  <p className="text-sm">{decision.rationale}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </CardContent>
      <NewDecisionDialog 
        open={showNewDialog} 
        onOpenChange={setShowNewDialog}
        onSubmit={handleCreateDecision}
      />
    </Card>
  );
};

export default DesignDecisionPanel;
