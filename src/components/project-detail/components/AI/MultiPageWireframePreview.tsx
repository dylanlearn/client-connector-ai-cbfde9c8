
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WireframeData, WireframePage } from '@/services/ai/wireframe/wireframe-types';
import { FileText, Home, Info, Phone, Settings, ShoppingBag, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import WireframeSectionPreview from './WireframeSectionPreview';

interface MultiPageWireframePreviewProps {
  wireframe: WireframeData;
  className?: string;
}

const pageIcons: Record<string, React.ReactNode> = {
  home: <Home className="h-4 w-4" />,
  about: <Info className="h-4 w-4" />,
  services: <Settings className="h-4 w-4" />,
  contact: <Phone className="h-4 w-4" />,
  products: <ShoppingBag className="h-4 w-4" />,
  team: <Users className="h-4 w-4" />,
  blog: <FileText className="h-4 w-4" />
};

const getPageIcon = (page: WireframePage) => {
  const pageType = page.pageType?.toLowerCase() || page.name?.toLowerCase();
  
  for (const [key, icon] of Object.entries(pageIcons)) {
    if (pageType.includes(key)) {
      return icon;
    }
  }
  
  return <FileText className="h-4 w-4" />;
};

const MultiPageWireframePreview: React.FC<MultiPageWireframePreviewProps> = ({ wireframe, className }) => {
  const [activePage, setActivePage] = useState<string>(
    wireframe.pages?.[0]?.id || 'main'
  );
  
  // If no pages defined, or not a multi-page wireframe, show sections directly
  if (!wireframe.pages || wireframe.pages.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle>{wireframe.title || "Wireframe Preview"}</CardTitle>
          <CardDescription>
            {wireframe.description || "A wireframe generated by AI"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {wireframe.sections.map((section, index) => (
                <WireframeSectionPreview key={index} section={section} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={className}>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{wireframe.title || "Multi-page Wireframe"}</CardTitle>
            <Badge variant="outline" className="ml-2">
              {wireframe.pages.length} Pages
            </Badge>
          </div>
          <CardDescription>
            {wireframe.description || "A multi-page wireframe generated by AI"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activePage} onValueChange={setActivePage} className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="w-full justify-start h-auto p-1">
                {wireframe.pages.map((page) => (
                  <TabsTrigger
                    key={page.id}
                    value={page.id}
                    className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {getPageIcon(page)}
                    <span className="ml-2">{page.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <Separator className="my-4" />
            
            {wireframe.pages.map((page) => (
              <TabsContent key={page.id} value={page.id} className="pt-2">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{page.name}</h3>
                  {page.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {page.description}
                    </p>
                  )}
                </div>
                
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    {page.sections.map((section, index) => (
                      <WireframeSectionPreview key={index} section={section} />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        
        <CardFooter className="pt-2 border-t flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Generated with {wireframe.style?.colorScheme ? 'custom color scheme' : 'default styling'}
          </div>
          <Button variant="outline" size="sm">
            View Full Wireframe
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MultiPageWireframePreview;
