
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Presentation, Users, MessageSquare, User } from 'lucide-react';
import { usePresentationSession } from '@/hooks/use-presentation-session';
import { usePresentationParticipants } from '@/hooks/use-presentation-participants';

interface PresentationControlProps {
  sessionId: string;
}

export const PresentationControl: React.FC<PresentationControlProps> = ({ sessionId }) => {
  const { user } = useAuth();
  const { session, updateSession } = usePresentationSession(sessionId);
  const { participants } = usePresentationParticipants(sessionId);

  const isPresenter = session?.presenter_id === user?.id;
  const isActive = session?.status === 'active';

  const handleStartPresentation = () => {
    if (!session || !isPresenter) return;
    updateSession({
      status: 'active',
      started_at: new Date().toISOString()
    });
  };

  const handleEndPresentation = () => {
    if (!session || !isPresenter) return;
    updateSession({
      status: 'completed',
      ended_at: new Date().toISOString()
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Presentation className="h-5 w-5" />
          Presentation Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{participants.length} Participants</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Live Feedback</span>
          </div>
        </div>

        {isPresenter && (
          <div className="flex justify-end gap-2">
            {!isActive ? (
              <Button onClick={handleStartPresentation}>
                Start Presentation
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleEndPresentation}>
                End Presentation
              </Button>
            )}
          </div>
        )}

        <div className="border rounded p-2">
          <h4 className="font-medium mb-2">Participants</h4>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{participant.name || participant.email}</span>
                <span className="text-xs text-muted-foreground">
                  ({participant.role})
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
