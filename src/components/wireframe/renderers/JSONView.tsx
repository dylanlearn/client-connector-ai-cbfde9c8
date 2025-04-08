
import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JSONViewProps {
  data: any;
  darkMode?: boolean;
}

export const JSONView: React.FC<JSONViewProps> = ({ data, darkMode = false }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const jsonString = JSON.stringify(data, null, 2);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "JSON data has been copied to your clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative">
      <button
        onClick={copyToClipboard}
        className={`absolute top-2 right-2 p-1 rounded-md ${
          darkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        } transition-colors`}
        aria-label="Copy JSON"
      >
        <Copy className="h-4 w-4" />
      </button>
      <pre 
        className={`p-4 rounded-md text-xs font-mono overflow-auto max-h-[500px] whitespace-pre ${
          darkMode 
            ? 'bg-gray-800 text-gray-300 border border-gray-700' 
            : 'bg-gray-50 text-gray-800 border border-gray-200'
        }`}
      >
        {jsonString}
      </pre>
    </div>
  );
};
