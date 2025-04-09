
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, Check } from 'lucide-react';

export interface WireframeDataVisualizerProps {
  wireframeData: any;
  title?: string;
}

const WireframeDataVisualizer: React.FC<WireframeDataVisualizerProps> = ({ 
  wireframeData,
  title
}) => {
  const [copied, setCopied] = useState(false);

  if (!wireframeData) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-md">
        <p className="text-muted-foreground">No wireframe data available</p>
      </div>
    );
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(wireframeData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="wireframe-data-visualizer">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy} 
          className="flex items-center"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4 mr-2" />
              Copy JSON
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 rounded-md bg-muted/50 overflow-auto max-h-[600px] text-xs">
        <code>{JSON.stringify(wireframeData, null, 2)}</code>
      </pre>
    </div>
  );
};

export default WireframeDataVisualizer;
