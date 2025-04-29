
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandGuideline } from "@/types/compliance";
import { Button } from "@/components/ui/button";
import { PlusCircle, Paintbrush } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface BrandGuidelinesViewProps {
  guidelines: BrandGuideline[];
  workspaceId: string;
}

export function BrandGuidelinesView({ guidelines, workspaceId }: BrandGuidelinesViewProps) {
  const renderColorPalette = (colors: any[] | null) => {
    if (!colors || colors.length === 0) {
      return (
        <div className="text-muted-foreground">No colors defined</div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {colors.map((color, i) => (
          <div key={i} className="flex flex-col items-center">
            <div 
              className="w-10 h-10 rounded-md border" 
              style={{ backgroundColor: color.value || color.hex || color }}
            />
            <span className="text-xs mt-1">{color.name || `Color ${i+1}`}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Brand Guidelines</CardTitle>
          <CardDescription>
            Enforce consistent branding across designs
          </CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Brand Guide
        </Button>
      </CardHeader>
      <CardContent>
        {guidelines.length > 0 ? (
          <div className="space-y-6">
            {guidelines.map((guideline) => (
              <Card key={guideline.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{guideline.name}</CardTitle>
                    <Badge variant="outline">v{guideline.version}</Badge>
                  </div>
                  <CardDescription>{guideline.description || 'No description'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="colors">
                    <TabsList>
                      <TabsTrigger value="colors">Colors</TabsTrigger>
                      <TabsTrigger value="typography">Typography</TabsTrigger>
                      <TabsTrigger value="logos">Logos</TabsTrigger>
                      <TabsTrigger value="voice">Voice & Tone</TabsTrigger>
                    </TabsList>
                    <TabsContent value="colors" className="mt-4">
                      <div className="space-y-4">
                        <h3 className="font-medium">Color Palette</h3>
                        {renderColorPalette(guideline.color_palette)}
                      </div>
                    </TabsContent>
                    <TabsContent value="typography" className="mt-4">
                      <div className="space-y-4">
                        <h3 className="font-medium">Typography</h3>
                        {Object.keys(guideline.typography || {}).length > 0 ? (
                          <div className="space-y-4">
                            {Object.entries(guideline.typography).map(([key, value]) => (
                              <div key={key}>
                                <h4 className="text-sm font-medium capitalize">{key}</h4>
                                <div className="text-muted-foreground">
                                  {typeof value === 'string' ? value : JSON.stringify(value)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted-foreground">No typography defined</div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="logos" className="mt-4">
                      <div className="space-y-4">
                        <h3 className="font-medium">Logos</h3>
                        {guideline.logos && guideline.logos.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {guideline.logos.map((logo: any, i: number) => (
                              <div key={i} className="border rounded-md p-4 flex items-center justify-center">
                                {logo.url ? (
                                  <img 
                                    src={logo.url} 
                                    alt={logo.name || `Logo ${i+1}`} 
                                    className="max-h-24"
                                  />
                                ) : (
                                  <div className="h-24 w-full bg-muted flex items-center justify-center">
                                    {logo.name || `Logo ${i+1}`}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted-foreground">No logos defined</div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="voice" className="mt-4">
                      <div className="space-y-4">
                        <h3 className="font-medium">Voice & Tone Guidelines</h3>
                        {guideline.voice_tone_guidelines ? (
                          <div className="p-4 bg-muted rounded-md">
                            {guideline.voice_tone_guidelines}
                          </div>
                        ) : (
                          <div className="text-muted-foreground">No voice and tone guidelines defined</div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Paintbrush className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No Brand Guidelines</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Create brand guidelines to ensure consistent application of your visual identity.
            </p>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Brand Guide
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
