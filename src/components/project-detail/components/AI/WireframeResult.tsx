import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Code, Laptop, Smartphone, Palette, Type, Layout, Zap } from 'lucide-react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

interface WireframeResultProps {
  wireframe: WireframeData;
  onFeedback?: (isPositive: boolean) => void;
}

const WireframeResult: React.FC<WireframeResultProps> = ({ wireframe, onFeedback }) => {
  const [activeTab, setActiveTab] = React.useState('overview');

  const isAnimationSuggestionsObject = (suggestions: any): suggestions is {
    type?: string;
    element?: string;
    timing?: string;
    effect?: string[];
  } => {
    return suggestions && !Array.isArray(suggestions);
  };

  const renderComponent = (component: any, index: number) => (
    <div key={index} className="mb-2 border rounded-md p-2 bg-gray-50">
      <div className="text-sm font-medium">{component.type}</div>
      <div className="text-sm text-gray-700 mt-1">{component.content}</div>
      {component.style && <div className="text-xs text-gray-500 mt-1">Style: {component.style}</div>}
      {component.position && <div className="text-xs text-gray-500">Position: {component.position}</div>}
    </div>
  );

  const renderSection = (section: WireframeSection, index: number) => (
    <Card key={index} className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">
              {section.sectionType}
            </Badge>
            <CardTitle className="text-lg">{section.name}</CardTitle>
          </div>
          <Badge>{section.layoutType}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-4">{section.description}</p>
        
        <div className="space-y-4">
          {section.components && section.components.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Components</h4>
              <div className="space-y-2">
                {section.components.map((component, compIndex) => renderComponent(component, compIndex))}
              </div>
            </div>
          )}

          {section.copySuggestions && (
            <div>
              <h4 className="text-sm font-medium mb-2">Copy Suggestions</h4>
              <div className="border rounded-md p-3 bg-gray-50">
                {typeof section.copySuggestions === 'object' && !Array.isArray(section.copySuggestions) && section.copySuggestions.heading && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-500">Heading:</div>
                    <div className="text-sm font-medium">{String(section.copySuggestions.heading)}</div>
                  </div>
                )}
                {typeof section.copySuggestions === 'object' && !Array.isArray(section.copySuggestions) && section.copySuggestions.subheading && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-500">Subheading:</div>
                    <div className="text-sm">{String(section.copySuggestions.subheading)}</div>
                  </div>
                )}
                {typeof section.copySuggestions === 'object' && !Array.isArray(section.copySuggestions) && section.copySuggestions.cta && (
                  <div>
                    <div className="text-xs text-gray-500">CTA:</div>
                    <div className="text-sm text-primary">{String(section.copySuggestions.cta)}</div>
                  </div>
                )}
                {Array.isArray(section.copySuggestions) && section.copySuggestions.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500">Suggestions:</div>
                    <ul className="text-sm list-disc pl-4 mt-1">
                      {section.copySuggestions.map((suggestion, i) => (
                        <li key={i}>{String(suggestion)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {section.animationSuggestions && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                Animation Suggestions
              </h4>
              <div className="border rounded-md p-3 bg-gray-50">
                {section.animationSuggestions && isAnimationSuggestionsObject(section.animationSuggestions) && (
                  <div className="grid grid-cols-2 gap-2">
                    {section.animationSuggestions.type && (
                      <div>
                        <div className="text-xs text-gray-500">Type:</div>
                        <div className="text-sm">{String(section.animationSuggestions.type)}</div>
                      </div>
                    )}
                    {section.animationSuggestions.element && (
                      <div>
                        <div className="text-xs text-gray-500">Element:</div>
                        <div className="text-sm">{String(section.animationSuggestions.element)}</div>
                      </div>
                    )}
                  </div>
                )}
                {section.animationSuggestions && isAnimationSuggestionsObject(section.animationSuggestions) && section.animationSuggestions.timing && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Timing:</div>
                    <div className="text-sm">{String(section.animationSuggestions.timing)}</div>
                  </div>
                )}
                {section.animationSuggestions && 
                  isAnimationSuggestionsObject(section.animationSuggestions) && 
                  section.animationSuggestions.effect && 
                  Array.isArray(section.animationSuggestions.effect) && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Effects:</div>
                    <div className="text-sm flex flex-wrap gap-1">
                      {section.animationSuggestions.effect.map((effect, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{effect}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(section.animationSuggestions) && section.animationSuggestions.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500">Animation Suggestions:</div>
                    <ul className="text-sm list-disc pl-4 mt-1">
                      {section.animationSuggestions.map((suggestion, i) => (
                        <li key={i}>{typeof suggestion === 'string' ? suggestion : JSON.stringify(suggestion)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {section.mobileLayout && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Smartphone className="h-4 w-4 mr-1 text-blue-500" />
                Mobile Layout
              </h4>
              <div className="border rounded-md p-3 bg-gray-50">
                {getMobileLayoutInfo(section)}
              </div>
            </div>
          )}

          {section.designReasoning && (
            <div>
              <h4 className="text-sm font-medium mb-2">Design Reasoning</h4>
              <div className="text-sm text-gray-700 italic border-l-2 border-primary pl-3 py-1">
                {section.designReasoning}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const getMobileLayoutInfo = (section: WireframeSection): React.ReactNode => {
    if (!section.mobileLayout && !section.layout) {
      return <p className="text-sm text-gray-500">No mobile-specific layout defined.</p>;
    }
    
    const layoutInfo = section.mobileLayout || section.layout;
    
    return (
      <div className="text-sm">
        {layoutInfo && typeof layoutInfo === 'object' ? (
          <div className="space-y-1">
            {layoutInfo.type && <p>Type: {layoutInfo.type}</p>}
            {layoutInfo.columns && <p>Columns: {layoutInfo.columns}</p>}
            {layoutInfo.direction && <p>Direction: {layoutInfo.direction}</p>}
          </div>
        ) : (
          <p>{typeof layoutInfo === 'string' ? layoutInfo : 'Complex layout configuration'}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {wireframe.sections.map(renderSection)}
    </div>
  );
};

export default WireframeResult;
