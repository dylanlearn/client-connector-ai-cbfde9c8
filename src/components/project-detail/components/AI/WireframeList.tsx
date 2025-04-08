
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { Button } from '@/components/ui/button';
import { Eye, Download, Star, Wand2, Layers, FileText, Trash2, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import WireframeGenerator from './WireframeGenerator';
import MultiPageWireframePreview from './MultiPageWireframePreview';
import { AIWireframe } from '@/services/ai/wireframe/wireframe-types';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface WireframeListProps {
  projectId: string;
}

const WireframeCard = ({ wireframe, onDelete }: { wireframe: AIWireframe; onDelete: (id: string) => Promise<void> }) => {
  const isMultiPage = wireframe.data?.pages && wireframe.data.pages.length > 0;
  const pageCount = wireframe.data?.pages?.length || 1;
  const sectionCount = isMultiPage
    ? wireframe.data?.pages?.reduce((total, page) => total + (page.sections?.length || 0), 0)
    : wireframe.data?.sections?.length || 0;
  
  const { toast } = useToast();
  const [isViewActive, setIsViewActive] = useState(false);
  
  const handleExport = () => {
    toast({
      title: "Wireframe exported",
      description: "Your wireframe has been downloaded as JSON"
    });
    
    // Create blob and download
    const dataStr = JSON.stringify(wireframe.data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wireframe.data?.title || 'wireframe'}-${wireframe.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleCopyId = () => {
    navigator.clipboard.writeText(wireframe.id);
    toast({
      title: "Copied to clipboard",
      description: "Wireframe ID has been copied"
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-all duration-300 border-opacity-70 hover:border-primary/50">
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
          <div className="bg-muted rounded-md overflow-hidden p-4 min-h-[200px] cursor-pointer hover:bg-muted/80 transition-colors" 
               onClick={() => setIsViewActive(true)}>
            {isMultiPage ? (
              <div className="grid grid-cols-3 gap-2">
                {wireframe.data?.pages?.slice(0, 3).map((page, index) => (
                  <div key={index} className="bg-white rounded border border-gray-200 p-2 relative hover:border-primary/50 transition-colors">
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
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {wireframe.createdAt && format(new Date(wireframe.createdAt), 'MMM d, yyyy')}
            <button onClick={handleCopyId} className="p-1 hover:bg-muted rounded">
              <Copy className="h-3 w-3" />
            </button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsViewActive(true)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="default" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" 
                    onClick={() => onDelete(wireframe.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
        
        {isViewActive && wireframe.data && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
               onClick={() => setIsViewActive(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">{wireframe.data.title || "Wireframe Preview"}</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsViewActive(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </Button>
                </div>
                <MultiPageWireframePreview wireframe={wireframe.data} />
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" className="mr-2" onClick={() => setIsViewActive(false)}>
                    Close
                  </Button>
                  <Button onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

const WireframeList: React.FC<WireframeListProps> = ({ projectId }) => {
  const { wireframes, isGenerating, loadProjectWireframes, deleteWireframe } = useWireframeGeneration();
  const [showGenerator, setShowGenerator] = useState(false);
  const { toast } = useToast();
  
  // Load wireframes when component mounts
  React.useEffect(() => {
    loadProjectWireframes(projectId);
  }, [projectId]);
  
  const handleDeleteWireframe = async (id: string) => {
    if (confirm("Are you sure you want to delete this wireframe?")) {
      await deleteWireframe(id);
      toast({
        title: "Wireframe deleted",
        description: "The wireframe has been successfully removed"
      });
    }
  };

  const handleWireframeGenerated = () => {
    setShowGenerator(false);
    loadProjectWireframes(projectId);
  };

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
        <Card className="border-dashed border-2 bg-muted/50 transition-all hover:bg-muted/70">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WireframeGenerator 
              projectId={projectId}
              onWireframeGenerated={handleWireframeGenerated} 
            />
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {wireframes.map(wireframe => (
            <WireframeCard 
              key={wireframe.id} 
              wireframe={wireframe} 
              onDelete={handleDeleteWireframe} 
            />
          ))}
        </AnimatePresence>
        
        <Card className="border-dashed border-2 bg-muted/50 hover:bg-muted/70 transition-all flex flex-col items-center justify-center">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          <WireframeGenerator 
            projectId={projectId} 
            onWireframeGenerated={handleWireframeGenerated} 
          />
        </motion.div>
      )}
      
      {wireframes.length > 0 && wireframes[0]?.data && (
        <div className="mt-8 border-t pt-8">
          <h2 className="text-xl font-semibold mb-6">Latest Wireframe Preview</h2>
          <div className="border rounded-lg p-4 bg-muted/30">
            <MultiPageWireframePreview wireframe={wireframes[0].data} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WireframeList;
