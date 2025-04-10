
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { WireframeAISuggestionsProps } from './types';

const WireframeAISuggestions: React.FC<WireframeAISuggestionsProps> = ({
  wireframe,
  onClose,
  onApplySuggestion
}) => {
  const suggestions = [
    {
      id: 1,
      title: 'Improve Layout Balance',
      description: 'Adjust section spacing for better visual hierarchy',
      changes: {}
    },
    {
      id: 2,
      title: 'Enhance Readability',
      description: 'Modify typography to improve reading experience',
      changes: {}
    },
    {
      id: 3,
      title: 'Optimize for Mobile',
      description: 'Adjust layout for better mobile experience',
      changes: {}
    }
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Design Suggestions</CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="p-4 border rounded-md hover:bg-accent/50 cursor-pointer">
            <h3 className="font-medium">{suggestion.title}</h3>
            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </CardFooter>
    </Card>
  );
};

export default WireframeAISuggestions;
