import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { AIWireframe, WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Sparkles, Layout, Star, MoreHorizontal, Trash2, Lightbulb, Eye } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { LoadingOverlay } from '@/components/export/LoadingOverlay';

interface WireframeListProps {
  projectId: string;
}

const WireframeList: React.FC<WireframeListProps> = ({ projectId }) => {
  const { 
    wireframes, 
    loadProjectWireframes, 
    isGenerating, 
    generateWireframe,
    deleteWireframe
  } = useWireframeGeneration();
  
  const [loading, setLoading] = useState(true);
  const [selectedWireframe, setSelectedWireframe] = useState<AIWireframe | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wireframeToDelete, setWireframeToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchWireframes = async () => {
      if (projectId) {
        await loadProjectWireframes(projectId);
        setLoading(false);
      }
    };

    fetchWireframes();
  }, [projectId, loadProjectWireframes]);

  const handleNewWireframe = async () => {
    if (!projectId) return;

    try {
      await generateWireframe({
        prompt: "Create a professional wireframe for a modern website with a clean layout that focuses on user experience.",
        projectId: projectId
      });

      // No need to reload - the hook should update the wireframes state
    } catch (error) {
      console.error("Error generating new wireframe:", error);
    }
  };

  const handleViewWireframe = (wireframe: AIWireframe) => {
    setSelectedWireframe(wireframe);
    setDialogOpen(true);
  };

  const handleDeleteClick = (wireframeId: string) => {
    setWireframeToDelete(wireframeId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (wireframeToDelete) {
      await deleteWireframe(wireframeToDelete);
      setDeleteDialogOpen(false);
      setWireframeToDelete(null);
    }
  };

  const getWireframeData = (wireframe: AIWireframe): WireframeData | null => {
    if (wireframe.data) {
      return wireframe.data;
    }
    
    if (wireframe.generation_params && typeof wireframe.generation_params === 'object') {
      if (wireframe.generation_params.result_data) {
        return wireframe.generation_params.result_data as WireframeData;
      }
    }
    
    return null;
  };

  const renderSections = (wireframe: AIWireframe) => {
    const wireframeData = getWireframeData(wireframe);
    if (!wireframeData || !wireframeData.sections) return null;
    
    return (
      <div className="space-y-4">
        {wireframeData.sections.slice(0, 3).map((section: any, index: number) => (
          <div key={index} className="border rounded-md p-3">
            <h4 className="text-sm font-medium capitalize">{section.name || `Section ${index + 1}`}</h4>
            <p className="text-xs text-gray-500 mt-1">{section.description || "No description"}</p>
          </div>
        ))}
        
        {wireframeData.sections.length > 3 && (
          <p className="text-xs text-gray-500">And {wireframeData.sections.length - 3} more sections...</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-32 w-full" />
            </CardContent>
            <CardFooter className="p-4">
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Project Wireframes</h2>
        <Button onClick={handleNewWireframe} disabled={isGenerating}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "New Wireframe"}
        </Button>
      </div>

      {isGenerating && (
        <Card className="mb-6 overflow-hidden relative min-h-[200px]">
          <LoadingOverlay message="Generating your wireframe..." spinnerSize="md" />
          <CardHeader>
            <CardTitle>Creating New Wireframe</CardTitle>
            <CardDescription>Please wait while we design your new wireframe...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center">
              <Sparkles className="h-16 w-16 text-primary opacity-10" />
            </div>
          </CardContent>
        </Card>
      )}

      {wireframes.length === 0 && !isGenerating ? (
        <Card className="text-center p-10">
          <Layout className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No wireframes yet</h3>
          <p className="text-gray-500 mt-2 mb-6">
            Generate your first wireframe to visualize your project design
          </p>
          <Button onClick={handleNewWireframe} className="mx-auto">
            <Sparkles className="mr-2 h-4 w-4" />
            Create First Wireframe
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {wireframes.map((wireframe) => {
            const wireframeData = getWireframeData(wireframe);
            return (
              <Card key={wireframe.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{wireframeData?.title || "Untitled Wireframe"}</CardTitle>
                      <CardDescription>
                        {wireframe.created_at && (
                          <>Created {format(new Date(wireframe.created_at), 'MMM d, yyyy')}</>
                        )}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewWireframe(wireframe)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(wireframe.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {wireframeData?.description || "No description available"}
                    </p>
                  </div>
                  
                  {wireframeData && (
                    <div className="space-y-2">
                      {wireframeData.designTokens && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {wireframeData.designTokens.colors && 
                            Object.entries(wireframeData.designTokens.colors)
                              .slice(0, 3)
                              .map(([name, color]: [string, any]) => (
                                <div 
                                  key={name} 
                                  className="w-6 h-6 rounded-full border" 
                                  title={`${name}: ${color}`}
                                  style={{ 
                                    backgroundColor: typeof color === 'string' && color.startsWith('#') 
                                      ? color 
                                      : '#' + Math.floor(Math.random()*16777215).toString(16)
                                  }}
                                />
                              ))}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {wireframeData.sections?.slice(0, 4).map((section: any, i: number) => (
                          <Badge key={i} variant="outline" className="capitalize text-xs">
                            {section.sectionType || section.name || `Section ${i+1}`}
                          </Badge>
                        ))}
                        {wireframeData.sections?.length > 4 && (
                          <Badge variant="outline" className="text-xs">+{wireframeData.sections.length - 4} more</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewWireframe(wireframe)}
                  >
                    <Eye className="mr-2 h-3 w-3" /> View
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-yellow-600">
                    <Star className="mr-2 h-3 w-3" fill="currentColor" /> Favorite
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedWireframe && (
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{getWireframeData(selectedWireframe)?.title || "Wireframe Details"}</DialogTitle>
              <DialogDescription>
                Created {selectedWireframe.created_at && format(new Date(selectedWireframe.created_at), 'MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600">
                  {getWireframeData(selectedWireframe)?.description || "No description available"}
                </p>
              </div>

              {getWireframeData(selectedWireframe)?.designTokens && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Design System</h4>
                  
                  <div className="space-y-4">
                    {getWireframeData(selectedWireframe)?.designTokens?.colors && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-500 mb-2">Colors</h5>
                        <div className="flex flex-wrap gap-3">
                          {Object.entries(getWireframeData(selectedWireframe)?.designTokens?.colors || {}).map(
                            ([name, color]: [string, any], index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div 
                                  className="w-8 h-8 rounded-full border mb-1" 
                                  style={{ 
                                    backgroundColor: typeof color === 'string' && color.startsWith('#') 
                                      ? color 
                                      : '#' + Math.floor(Math.random()*16777215).toString(16)
                                  }}
                                />
                                <span className="text-xs capitalize">{name}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    
                    {getWireframeData(selectedWireframe)?.designTokens?.typography && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-500 mb-2">Typography</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border rounded-md p-3">
                            <p className="text-xs text-gray-500">Headings</p>
                            <p className="font-medium">
                              {getWireframeData(selectedWireframe)?.designTokens?.typography?.headings || "Not specified"}
                            </p>
                          </div>
                          <div className="border rounded-md p-3">
                            <p className="text-xs text-gray-500">Body</p>
                            <p>
                              {getWireframeData(selectedWireframe)?.designTokens?.typography?.body || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2">Wireframe Sections</h4>
                <div className="space-y-4">
                  {getWireframeData(selectedWireframe)?.sections?.map((section: any, index: number) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium capitalize">{section.name}</h5>
                        <Badge>{section.sectionType}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                      
                      {section.components && section.components.length > 0 && (
                        <div className="mt-3">
                          <h6 className="text-xs font-medium text-gray-500 mb-1">Components</h6>
                          <div className="flex flex-wrap gap-2">
                            {section.components.map((component: any, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {component.type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {section.designReasoning && (
                        <div className="mt-3 flex items-start gap-2 text-xs text-gray-600">
                          <Lightbulb className="h-3 w-3 mt-0.5 text-amber-500" />
                          <p>{section.designReasoning}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {getWireframeData(selectedWireframe)?.mobileConsiderations && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Mobile Considerations</h4>
                  <p className="text-sm text-gray-600">
                    {getWireframeData(selectedWireframe)?.mobileConsiderations}
                  </p>
                </div>
              )}

              {getWireframeData(selectedWireframe)?.accessibilityNotes && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Accessibility Notes</h4>
                  <p className="text-sm text-gray-600">
                    {getWireframeData(selectedWireframe)?.accessibilityNotes}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
              <Button onClick={() => {
                if (selectedWireframe) {
                  handleDeleteClick(selectedWireframe.id);
                  setDialogOpen(false);
                }
              }} variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Wireframe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this wireframe? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WireframeList;
