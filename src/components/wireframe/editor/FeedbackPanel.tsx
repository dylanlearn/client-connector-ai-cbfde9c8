
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FeedbackPanelProps {
  isGenerating: boolean;
  onApplyFeedback: (feedback: string) => void;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ 
  isGenerating, 
  onApplyFeedback 
}) => {
  const [feedback, setFeedback] = useState<string>('');

  const handleApplyFeedback = () => {
    if (feedback.trim()) {
      onApplyFeedback(feedback);
      setFeedback('');
    }
  };

  return (
    <div className="p-4 border-t mt-4">
      <h3 className="text-lg font-medium mb-2">Feedback</h3>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Provide feedback to improve the wireframe..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <Button 
          onClick={handleApplyFeedback} 
          disabled={!feedback.trim() || isGenerating}
        >
          {isGenerating ? 'Applying...' : 'Apply Feedback'}
        </Button>
      </div>
    </div>
  );
};

export default FeedbackPanel;
