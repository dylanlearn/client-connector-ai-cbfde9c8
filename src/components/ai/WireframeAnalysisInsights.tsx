
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  BarChart, 
  Settings2, 
  Layers,
  LayoutDashboard
} from 'lucide-react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

// Don't import non-existent function
// import { aiWireframeToWireframeData } from '@/services/ai/wireframe/wireframe-types';

interface WireframeAnalysisInsightsProps {
  wireframe: WireframeData;
}

const WireframeAnalysisInsights: React.FC<WireframeAnalysisInsightsProps> = ({ wireframe }) => {
  if (!wireframe) {
    return <div>No wireframe data to analyze</div>;
  }
  
  const sectionCount = wireframe.sections?.length || 0;
  const sectionTypes = new Set(wireframe.sections?.map(s => s.sectionType));
  
  // Analyze the wireframe sections complexity
  const calculateComplexity = (section: WireframeSection): 'Simple' | 'Moderate' | 'Complex' => {
    const componentCount = section.components?.length || 0;
    if (componentCount > 10) return 'Complex';
    if (componentCount > 5) return 'Moderate';
    return 'Simple';
  };
  
  // Count sections by complexity
  const complexityStats = {
    simple: 0,
    moderate: 0,
    complex: 0
  };
  
  wireframe.sections?.forEach(section => {
    const complexity = calculateComplexity(section);
    if (complexity === 'Simple') complexityStats.simple++;
    if (complexity === 'Moderate') complexityStats.moderate++;
    if (complexity === 'Complex') complexityStats.complex++;
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Wireframe Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col p-3 bg-muted/30 rounded-md">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Layers className="h-4 w-4" />
                <span className="text-sm">Sections</span>
              </div>
              <p className="text-2xl font-semibold">{sectionCount}</p>
            </div>
            
            <div className="flex flex-col p-3 bg-muted/30 rounded-md">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <BarChart className="h-4 w-4" />
                <span className="text-sm">Section Types</span>
              </div>
              <p className="text-2xl font-semibold">{sectionTypes.size}</p>
            </div>
            
            <div className="flex flex-col p-3 bg-muted/30 rounded-md">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <LineChart className="h-4 w-4" />
                <span className="text-sm">Complexity</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-100">Simple: {complexityStats.simple}</Badge>
                <Badge variant="outline" className="bg-orange-100">Moderate: {complexityStats.moderate}</Badge>
                <Badge variant="outline" className="bg-red-100">Complex: {complexityStats.complex}</Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Design Recommendations
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Consider adding a testimonial section to increase trust</li>
              <li>The navigation section could benefit from more contrast</li>
              <li>Mobile layout might need adjustment for better usability</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WireframeAnalysisInsights;
