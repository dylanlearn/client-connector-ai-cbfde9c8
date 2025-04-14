
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import WireframeAISuggestions from '../ai/WireframeAISuggestions';

interface AISuggestionsPanelProps {
  wireframeId: string;
  wireframe: any;
  focusedSectionId: string | null;
  onApplySuggestion: (wireframe: any) => void;
  onClose: () => void;
}

const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  wireframeId,
  wireframe,
  focusedSectionId,
  onApplySuggestion,
  onClose
}) => {
  return (
    <div className="ai-suggestions-panel mt-4">
      <Card>
        <CardContent className="p-4">
          <WireframeAISuggestions
            wireframeId={wireframeId}
            wireframe={wireframe}
            focusedSectionId={focusedSectionId}
            onApplySuggestion={onApplySuggestion}
            onClose={onClose}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AISuggestionsPanel;
