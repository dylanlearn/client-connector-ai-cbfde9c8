
import React from 'react';
import { FunctionSquare } from 'lucide-react';

interface EdgeFunctionsSectionProps {
  functionsData: {
    status: 'ok' | 'error' | 'degraded';
    message: string;
    availableFunctions: string[];
  };
}

export function EdgeFunctionsSection({ functionsData }: EdgeFunctionsSectionProps) {
  if (!functionsData) return null;
  
  const functions = functionsData.availableFunctions || [];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Edge Functions</h3>
      <div className="p-3 border rounded-md bg-gray-50 h-[160px] overflow-y-auto">
        {functions.length > 0 ? (
          <ul className="space-y-2">
            {functions.map((fn: string) => (
              <li key={fn} className="flex items-center text-sm">
                <FunctionSquare className="h-3 w-3 mr-2 text-blue-500" />
                {fn}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No edge functions detected</p>
        )}
      </div>
    </div>
  );
}
