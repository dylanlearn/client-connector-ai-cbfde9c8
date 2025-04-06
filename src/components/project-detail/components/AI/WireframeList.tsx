import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { Button } from '@/components/ui/button';
import { Eye, Download, Star, Wand2, Layers, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import WireframeGenerator from './WireframeGenerator';
import MultiPageWireframePreview from './MultiPageWireframePreview';
import { AIWireframe } from '@/services/ai/wireframe/wireframe-types';

interface WireframeListProps {
  projectId: string;
}

const WireframeCard = ({ wireframe }: { wireframe: AIWireframe }) => {
  const isMultiPage = wireframe.data?.pages && wireframe.data.pages.length > 0;
  const pageCount = wireframe.data?.pages?.length || 1;
  const sectionCount = isMultiPage
    ? wireframe.data?.pages?.reduce((total, page) => total + (page.sections?.length || 0), 0)
    : wireframe.data?.sections?.length || 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            {wireframe.data?.title || "Wireframe Design"}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isMultiPage && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                {pageCount} pages
              </Badge>
            )}
            <Badge variant="outline">
              {sectionCount} sections
            </Badge>
          </div>
        </div>
        <CardDescription className="line-clamp-1">
          {wireframe.data?.description || wireframe.description || "AI-generated wireframe"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-md overflow-hidden p-4 min-h-[200px]">
          {isMultiPage ? (
            <div className="grid grid-cols-3 gap-2">
              {wireframe.data?.pages?.slice(0, 3).map((page, index) => (
                <div key={index} className="bg-white rounded border border-gray-200 p-2 relative">
                  <div className="text-xs font-medium mb-1 truncate">{page.name}</div>
                  <div className="space-y-1">
                    {Array.from({ length: Math.min(page.sections?.length || 0, 3) }).map((_, i) => (
                      <div key={i} className="h-2 bg-gray-100 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {Array.from({ length: Math.min(wireframe.data?.sections?.length || 0, 4) }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-2 bg-gray-100 rounded w-full"></div>
                  <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {wireframe.created_at && format(new Date(wireframe.created_at), 'MMM d, yyyy')}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button size="sm" variant="default">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const WireframeList: React.FC<WireframeListProps> = ({ projectId }) => {
  const { wireframes, isGenerating } = useWireframeGeneration();
  const [showGenerator, setShowGenerator] = useState(false);

  if (isGenerating) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3 mt-2 opacity-70"></div>
            </CardHeader>
            <CardContent className="h-[200px] bg-muted rounded-md"></CardContent>
            <CardFooter className="flex justify-between">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-9 bg-muted rounded w-24"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (wireframes.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed border-2 bg-muted/50">
          <CardHeader className="text-center">
            <CardTitle>No Wireframes Yet</CardTitle>
            <CardDescription>
              Generate your first wireframe to get started with your design process.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button 
              onClick={() => setShowGenerator(true)}
              className="flex items-center"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Wireframe
            </Button>
          </CardContent>
        </Card>
        
        {showGenerator && (
          <WireframeGenerator 
            projectId={projectId}
            onWireframeGenerated={() => setShowGenerator(false)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {wireframes.map(wireframe => (
          <WireframeCard key={wireframe.id} wireframe={wireframe} />
        ))}
        
        <Card className="border-dashed border-2 bg-muted/50 flex flex-col items-center justify-center">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full">
            <Wand2 className="h-10 w-10 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-center mb-2">Generate New Wireframe</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create another wireframe design variant
            </p>
            <Button 
              onClick={() => setShowGenerator(true)}
              className="flex items-center"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Wireframe
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {showGenerator && (
        <div className="mt-8">
          <WireframeGenerator 
            projectId={projectId} 
            onWireframeGenerated={() => setShowGenerator(false)} 
          />
        </div>
      )}
      
      {wireframes.length > 0 && wireframes[0]?.data && (
        <div className="mt-8 border-t pt-8">
          <h2 className="text-xl font-semibold mb-6">Latest Wireframe Preview</h2>
          <MultiPageWireframePreview wireframe={wireframes[0].data} />
        </div>
      )}
    </div>
  );
};

export default WireframeList;
