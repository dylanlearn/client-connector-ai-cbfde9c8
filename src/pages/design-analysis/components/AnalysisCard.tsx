
import { WebsiteAnalysisResult } from '@/hooks/ai-design/website-analysis/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisCardProps {
  result: WebsiteAnalysisResult;
}

export default function AnalysisCard({ result }: AnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{result.url || 'Website Analysis'}</CardTitle>
        <CardDescription>
          {result.timestamp ? new Date(result.timestamp).toLocaleString() : 'Analysis Results'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Design Patterns Section */}
          <div>
            <h3 className="font-medium mb-2">Design Patterns</h3>
            <div className="text-sm space-y-2">
              <p>{result.designPatterns}</p>
            </div>
          </div>
          
          {/* Implementation Section */}
          {result.implementation && (
            <div>
              <h3 className="font-medium mb-2">Implementation</h3>
              <div className="text-sm space-y-2">
                <p>{result.implementation}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Color Scheme Section */}
        {result.colorScheme && Object.keys(result.colorScheme).length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Color Scheme</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(result.colorScheme).map(([name, color]) => (
                <div key={name} className="flex flex-col items-center">
                  <div 
                    className="w-full h-12 rounded-md border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs mt-1">{color}</span>
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Components Section */}
        {result.components && result.components.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Components</h3>
            <ul className="list-disc pl-5">
              {result.components.map((component, index) => (
                <li key={index} className="mb-1">{component}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Section Type if available */}
        {result.section && (
          <div>
            <h3 className="font-medium mb-2">Section Type</h3>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
              {result.section}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
