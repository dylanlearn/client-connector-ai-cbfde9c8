
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GenerateWireframePanelProps {
  isGenerating: boolean;
  error: Error | null;
  onGenerateWireframe: (prompt: string) => void;
}

const GenerateWireframePanel: React.FC<GenerateWireframePanelProps> = ({ 
  isGenerating, 
  error, 
  onGenerateWireframe 
}) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onGenerateWireframe(prompt);
    }
  };

  return (
    <div className="p-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Create Wireframe</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Describe your wireframe..."
            className="w-full p-2 border rounded"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button 
          variant="default" 
          onClick={() => onGenerateWireframe("Create a landing page with hero section, features, and contact form")}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Example Wireframe'}
        </Button>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </Card>
    </div>
  );
};

export default GenerateWireframePanel;
