
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserFlowTestingService, UserFlowPath, FlowPathStep, FlowValidation } from '@/services/testing/UserFlowTestingService';
import { ChevronRight, Play, Plus, Route } from 'lucide-react';
import { toast } from 'sonner';
import UserFlowPathsList from './UserFlowPathsList';
import UserFlowStepsList from './UserFlowStepsList';
import UserFlowValidationResults from './UserFlowValidationResults';

interface UserFlowTestingPanelProps {
  wireframeId: string;
}

const UserFlowTestingPanel: React.FC<UserFlowTestingPanelProps> = ({ wireframeId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [flowPaths, setFlowPaths] = useState<UserFlowPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<UserFlowPath | null>(null);
  const [flowSteps, setFlowSteps] = useState<FlowPathStep[]>([]);
  const [validationResult, setValidationResult] = useState<FlowValidation | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newFlowName, setNewFlowName] = useState<string>('');
  const [newFlowDescription, setNewFlowDescription] = useState<string>('');

  useEffect(() => {
    loadFlowPaths();
  }, [wireframeId]);

  useEffect(() => {
    if (selectedPath) {
      loadFlowSteps(selectedPath.id);
    } else {
      setFlowSteps([]);
      setValidationResult(null);
    }
  }, [selectedPath]);

  const loadFlowPaths = async () => {
    setIsLoading(true);
    try {
      const paths = await UserFlowTestingService.getFlowPaths(wireframeId);
      setFlowPaths(paths);
      if (paths.length > 0 && !selectedPath) {
        setSelectedPath(paths[0]);
      }
    } catch (error) {
      console.error('Error loading user flow paths:', error);
      toast.error('Failed to load user flow paths');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFlowSteps = async (pathId: string) => {
    try {
      const steps = await UserFlowTestingService.getFlowPathSteps(pathId);
      setFlowSteps(steps);
    } catch (error) {
      console.error('Error loading flow steps:', error);
      toast.error('Failed to load flow steps');
    }
  };

  const createNewFlow = async () => {
    if (!newFlowName.trim()) {
      toast.error('Flow name is required');
      return;
    }

    try {
      const newFlow = await UserFlowTestingService.createUserFlowPath(
        wireframeId,
        newFlowName,
        newFlowDescription
      );
      
      setFlowPaths([...flowPaths, newFlow]);
      setSelectedPath(newFlow);
      setIsDialogOpen(false);
      setNewFlowName('');
      setNewFlowDescription('');
      toast.success('User flow path created successfully');
    } catch (error) {
      console.error('Error creating flow path:', error);
      toast.error('Failed to create flow path');
    }
  };

  const validateFlow = async () => {
    if (!selectedPath) return;

    setIsValidating(true);
    try {
      const result = await UserFlowTestingService.validateUserFlow(selectedPath.id);
      setValidationResult(result);
      toast.success('Flow validation completed');
    } catch (error) {
      console.error('Error validating flow:', error);
      toast.error('Flow validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSelectPath = (path: UserFlowPath) => {
    setSelectedPath(path);
    setValidationResult(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Flow Testing</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>New Flow Path</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create User Flow Path</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="flow-name" className="text-sm font-medium">Flow Name</label>
                <Input 
                  id="flow-name" 
                  value={newFlowName} 
                  onChange={(e) => setNewFlowName(e.target.value)} 
                  placeholder="e.g., Sign Up Flow"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="flow-description" className="text-sm font-medium">Description</label>
                <Textarea 
                  id="flow-description" 
                  value={newFlowDescription} 
                  onChange={(e) => setNewFlowDescription(e.target.value)} 
                  placeholder="Describe the purpose of this flow"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={createNewFlow}>Create Flow</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading user flow paths...</p>
        </div>
      ) : flowPaths.length === 0 ? (
        <Alert>
          <Route className="h-4 w-4" />
          <AlertTitle>No user flow paths</AlertTitle>
          <AlertDescription>
            No user flow paths have been defined for this wireframe. Create a new flow path to start testing.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Flow Paths</CardTitle>
              <CardDescription>Select a user flow path to analyze</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <UserFlowPathsList 
                paths={flowPaths} 
                selectedPath={selectedPath} 
                onSelectPath={handleSelectPath} 
              />
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {selectedPath && (
              <>
                <Card>
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <CardTitle>{selectedPath.name}</CardTitle>
                      <CardDescription>{selectedPath.description}</CardDescription>
                    </div>
                    <Button 
                      onClick={validateFlow} 
                      disabled={isValidating || flowSteps.length === 0}
                      className="flex items-center gap-2"
                    >
                      {isValidating ? (
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Play size={16} />
                      )}
                      <span>Validate Flow</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="steps">
                      <TabsList className="mb-4">
                        <TabsTrigger value="steps">Flow Steps</TabsTrigger>
                        <TabsTrigger value="criteria">Success Criteria</TabsTrigger>
                        {validationResult && <TabsTrigger value="validation">Validation Results</TabsTrigger>}
                      </TabsList>
                      <TabsContent value="steps">
                        <UserFlowStepsList steps={flowSteps} />
                      </TabsContent>
                      <TabsContent value="criteria">
                        <div className="p-4 border rounded-md">
                          {Object.keys(selectedPath.successCriteria).length > 0 ? (
                            <div className="space-y-4">
                              {Object.entries(selectedPath.successCriteria).map(([key, value]) => (
                                <div key={key} className="flex gap-2 items-start">
                                  <ChevronRight className="h-4 w-4 mt-1 text-primary" />
                                  <div>
                                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                                    <span className="text-muted-foreground">
                                      {Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No success criteria defined for this flow path.</p>
                          )}
                        </div>
                      </TabsContent>
                      {validationResult && (
                        <TabsContent value="validation">
                          <UserFlowValidationResults validation={validationResult} />
                        </TabsContent>
                      )}
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFlowTestingPanel;
