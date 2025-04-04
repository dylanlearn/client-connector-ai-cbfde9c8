import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Code, Laptop, Smartphone, Palette, Type, Layout, Zap } from 'lucide-react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-service';

interface WireframeResultProps {
  wireframe: WireframeData;
  onFeedback?: (isPositive: boolean) => void;
}

const WireframeResult: React.FC<WireframeResultProps> = ({ wireframe, onFeedback }) => {
  const [activeTab, setActiveTab] = React.useState('overview');

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
                {section.copySuggestions.heading && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-500">Heading:</div>
                    <div className="text-sm font-medium">{String(section.copySuggestions.heading)}</div>
                  </div>
                )}
                {section.copySuggestions.subheading && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-500">Subheading:</div>
                    <div className="text-sm">{String(section.copySuggestions.subheading)}</div>
                  </div>
                )}
                {section.copySuggestions.cta && (
                  <div>
                    <div className="text-xs text-gray-500">CTA:</div>
                    <div className="text-sm text-primary">{String(section.copySuggestions.cta)}</div>
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-500">Type:</div>
                    <div className="text-sm">{String(section.animationSuggestions.type)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Element:</div>
                    <div className="text-sm">{String(section.animationSuggestions.element)}</div>
                  </div>
                </div>
                {section.animationSuggestions.timing && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Timing:</div>
                    <div className="text-sm">{String(section.animationSuggestions.timing)}</div>
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
                <div className="text-xs text-gray-500">Structure:</div>
                <div className="text-sm mb-2">{String(section.mobileLayout.structure)}</div>
                
                {section.mobileLayout.stackOrder && section.mobileLayout.stackOrder.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500">Stack Order:</div>
                    <div className="text-sm">
                      {section.mobileLayout.stackOrder.map((item, i) => (
                        <Badge key={i} variant="outline" className="mr-1 mb-1">
                          {i+1}. {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
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

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="styles">Design Tokens</TabsTrigger>
          <TabsTrigger value="mobile">Mobile View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{wireframe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{wireframe.description}</p>
              
              {wireframe.accessibilityNotes && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Accessibility Notes</h3>
                  <p className="text-sm text-gray-600">{wireframe.accessibilityNotes}</p>
                </div>
              )}
              
              {wireframe.qualityFlags && wireframe.qualityFlags.unclearInputs && wireframe.qualityFlags.unclearInputs.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Input Clarifications Needed</h3>
                  <ul className="list-disc pl-5 text-sm text-amber-700">
                    {wireframe.qualityFlags.unclearInputs.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Layout className="h-4 w-4 mr-2 text-blue-500" />
                  Layout Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm">
                  <p className="mb-2">Sections: {wireframe.sections.length}</p>
                  <p>Layout Types:</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Array.from(new Set(wireframe.sections.map(s => s.layoutType))).map((type, i) => (
                      <Badge key={i} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Smartphone className="h-4 w-4 mr-2 text-green-500" />
                  Mobile Considerations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm">
                  {wireframe.mobileConsiderations ? (
                    <p>{wireframe.mobileConsiderations}</p>
                  ) : (
                    <p>Mobile-responsive layout with appropriate stacking order for all sections.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  Animation Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm">
                  {wireframe.sections.filter(s => s.animationSuggestions).length > 0 ? (
                    <div>
                      <p>Animation types:</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Array.from(new Set(wireframe.sections
                          .filter(s => s.animationSuggestions)
                          .map(s => s.animationSuggestions?.type)))
                          .map((type, i) => (
                            <Badge key={i} variant="outline">{type}</Badge>
                          ))
                        }
                      </div>
                    </div>
                  ) : (
                    <p>No specific animations defined.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sections" className="space-y-4 mt-4">
          <div className="space-y-6">
            {wireframe.sections.map((section, index) => renderSection(section, index))}
          </div>
        </TabsContent>
        
        <TabsContent value="styles" className="mt-4">
          {wireframe.designTokens ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Palette className="h-4 w-4 mr-2 text-purple-500" />
                    Color Scheme
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {wireframe.designTokens.colors && (
                    <div className="space-y-2">
                      {Object.entries(wireframe.designTokens.colors).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-sm font-medium capitalize">{key}:</div>
                          <div className="col-span-2 text-sm">{value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Type className="h-4 w-4 mr-2 text-blue-500" />
                    Typography
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {wireframe.designTokens.typography && (
                    <div className="space-y-2">
                      {wireframe.designTokens.typography.headings && (
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-sm font-medium">Headings:</div>
                          <div className="col-span-2 text-sm">{wireframe.designTokens.typography.headings}</div>
                        </div>
                      )}
                      {wireframe.designTokens.typography.body && (
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-sm font-medium">Body:</div>
                          <div className="col-span-2 text-sm">{wireframe.designTokens.typography.body}</div>
                        </div>
                      )}
                      {wireframe.designTokens.typography.fontPairings && wireframe.designTokens.typography.fontPairings.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm font-medium mb-1">Font Pairings:</div>
                          <div className="flex flex-wrap gap-1">
                            {wireframe.designTokens.typography.fontPairings.map((pair, index) => (
                              <Badge key={index} variant="outline">{pair}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {wireframe.designTokens.spacing && (
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Spacing & Layout</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(wireframe.designTokens.spacing).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-2 items-center">
                          <div className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</div>
                          <div className="text-sm">{value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">No design tokens available for this wireframe.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="mobile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-primary" />
                Mobile Adaptations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {wireframe.mobileConsiderations && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Overall Mobile Strategy</h3>
                  <p className="text-gray-700">{wireframe.mobileConsiderations}</p>
                </div>
              )}
              
              <div className="space-y-6">
                {wireframe.sections
                  .filter(section => section.mobileLayout)
                  .map((section, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {section.sectionType}
                        </Badge>
                        {section.name}
                      </h3>
                      
                      {section.mobileLayout && (
                        <div className="mt-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Structure</h4>
                              <p className="text-sm text-gray-700">{String(section.mobileLayout.structure)}</p>
                            </div>
                            
                            {section.mobileLayout.stackOrder && section.mobileLayout.stackOrder.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">Stack Order</h4>
                                <ol className="list-decimal list-inside text-sm text-gray-700">
                                  {section.mobileLayout.stackOrder.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                {wireframe.sections.filter(section => section.mobileLayout).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No specific mobile adaptations defined.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {onFeedback && (
        <CardFooter className="flex justify-end pt-4 space-x-2 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onFeedback(false)}
            className="text-red-500"
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Not Helpful
          </Button>
          <Button 
            variant="default"
            size="sm" 
            onClick={() => onFeedback(true)}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Helpful
          </Button>
        </CardFooter>
      )}
    </div>
  );
};

export default WireframeResult;
