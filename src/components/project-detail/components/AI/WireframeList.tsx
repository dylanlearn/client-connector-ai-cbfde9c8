
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, History, Star, Trash2 } from 'lucide-react';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { AIWireframe, WireframeData } from '@/services/ai/wireframe/wireframe-service';
import WireframeResult from './WireframeResult';
import WireframeGenerator from './WireframeGenerator';

interface WireframeListProps {
  projectId: string;
}

const WireframeList: React.FC<WireframeListProps> = ({ projectId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedWireframe, setSelectedWireframe] = useState<AIWireframe | null>(null);
  const [wireframeData, setWireframeData] = useState<WireframeData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { 
    wireframes, 
    loadProjectWireframes, 
    deleteWireframe,
    provideFeedback
  } = useWireframeGeneration();

  useEffect(() => {
    const fetchWireframes = async () => {
      await loadProjectWireframes(projectId);
      setIsLoading(false);
    };
    
    fetchWireframes();
  }, [projectId, loadProjectWireframes]);

  const handleSelectWireframe = (wireframe: AIWireframe) => {
    setSelectedWireframe(wireframe);
    
    try {
      // Parse the wireframe data from generation_params
      if (wireframe.generation_params && wireframe.generation_params.result_data) {
        setWireframeData(wireframe.generation_params.result_data as WireframeData);
      } else {
        setWireframeData(null);
      }
    } catch (error) {
      console.error("Error parsing wireframe data:", error);
      setWireframeData(null);
    }
    
    setDialogOpen(true);
  };

  const handleDeleteWireframe = async (wireframeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this wireframe?")) {
      await deleteWireframe(wireframeId);
    }
  };
  
  const handleProvideFeedback = async (wireframeId: string, isPositive: boolean) => {
    await provideFeedback(
      wireframeId, 
      isPositive ? "Positive feedback" : "Negative feedback", 
      isPositive ? 5 : 2
    );
  };

  const handleWireframeGenerated = () => {
    loadProjectWireframes(projectId);
    setActiveTab('history');
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="generate">
            <Plus className="h-4 w-4 mr-2" />
            Generate New
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Wireframe History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="mt-4">
          <WireframeGenerator 
            projectId={projectId} 
            onWireframeGenerated={handleWireframeGenerated} 
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Wireframes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : wireframes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No wireframes have been generated yet</p>
                  <Button onClick={() => setActiveTab('generate')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Your First Wireframe
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {wireframes.map((wireframe) => (
                      <div
                        key={wireframe.id}
                        onClick={() => handleSelectWireframe(wireframe)}
                        className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium line-clamp-1">
                              {wireframe.prompt}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {wireframe.description || "No description"}
                            </p>
                            <div className="flex items-center text-xs text-gray-400 mt-2">
                              <span>
                                Created: {new Date(wireframe.created_at as string).toLocaleDateString()}
                              </span>
                              {wireframe.rating && (
                                <div className="flex items-center ml-4">
                                  <Star className="h-3 w-3 mr-1 text-yellow-400" />
                                  <span>{wireframe.rating}/5</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            onClick={(e) => handleDeleteWireframe(wireframe.id, e)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Wireframe Details</DialogTitle>
          </DialogHeader>
          
          {selectedWireframe && wireframeData ? (
            <WireframeResult 
              wireframe={wireframeData} 
              onFeedback={(isPositive) => {
                handleProvideFeedback(selectedWireframe.id, isPositive);
                setDialogOpen(false);
              }}
            />
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">Wireframe data is not available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WireframeList;
