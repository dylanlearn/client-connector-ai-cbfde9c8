
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WireframeAISuggestionsProps {
  onClose: () => void;
}

const WireframeAISuggestions: React.FC<WireframeAISuggestionsProps> = ({ onClose }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>AI Suggestions</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          AI suggestions for improving your wireframe will appear here.
        </p>
      </CardContent>
    </Card>
  );
};

export default WireframeAISuggestions;
