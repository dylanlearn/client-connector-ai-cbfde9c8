
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DesignWorkflowService } from '@/services/design-workflow/design-workflow-service';
import type { DesignVersionControl, DesignDeployment } from '@/types/design-workflow';

interface DesignDeploymentsProps {
  projectId: string;
  designId?: string;
}

export function DesignDeployments({ projectId, designId }: DesignDeploymentsProps) {
  const [versions, setVersions] = useState<DesignVersionControl[]>([]);
  const [deployments, setDeployments] = useState<DesignDeployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState('development');
  const { toast } = useToast();

  useEffect(() => {
    if (designId) {
      loadVersions();
    }
  }, [designId]);

  useEffect(() => {
    if (selectedVersionId) {
      loadDeployments(selectedVersionId);
    }
  }, [selectedVersionId]);

  const loadVersions = async () => {
    if (!designId) return;

    setIsLoading(true);
    try {
      const data = await DesignWorkflowService.getDesignVersions(designId);
      setVersions(data);
      if (data.length > 0) {
        setSelectedVersionId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading versions:", error);
      toast({
        title: "Error loading versions",
        description: "Failed to load design versions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadDeployments = async (versionId: string) => {
    setIsLoading(true);
    try {
      const data = await DesignWorkflowService.getDeployments(versionId);
      setDeployments(data);
    } catch (error) {
      console.error("Error loading deployments:", error);
      toast({
        title: "Error loading deployments",
        description: "Failed to load deployment history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDeployment = async () => {
    if (!selectedVersionId || !selectedEnvironment) return;

    setIsDeploying(true);
    try {
      await DesignWorkflowService.createDeployment(selectedVersionId, selectedEnvironment);
      setShowDialog(false);
      loadDeployments(selectedVersionId);
      toast({
        title: "Deployment initiated",
        description: `Deployment to ${selectedEnvironment} has been initiated.`,
      });
    } catch (error) {
      console.error("Error creating deployment:", error);
      toast({
        title: "Error creating deployment",
        description: "Failed to initiate deployment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pending</Badge>;
    }
  };

  const getEnvironmentBadge = (env: string) => {
    switch (env) {
      case 'production':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Production</Badge>;
      case 'staging':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Staging</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Development</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Deployments</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => loadDeployments(selectedVersionId)} disabled={isLoading || !selectedVersionId}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={!selectedVersionId}>
                <Rocket className="h-4 w-4 mr-2" />
                Deploy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deploy Version</DialogTitle>
                <DialogDescription>
                  Deploy this version to a target environment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="version" className="text-sm font-medium">Version</label>
                  <Select value={selectedVersionId} onValueChange={setSelectedVersionId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a version" />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map(version => (
                        <SelectItem key={version.id} value={version.id}>
                          Version {version.version_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="environment" className="text-sm font-medium">Target Environment</label>
                  <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button 
                  onClick={createDeployment} 
                  disabled={isDeploying || !selectedVersionId || !selectedEnvironment}
                >
                  {isDeploying ? "Deploying..." : "Deploy"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="version-select" className="block text-sm font-medium mb-1">Select Version</label>
        <Select value={selectedVersionId} onValueChange={setSelectedVersionId} disabled={versions.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder="Select a version" />
          </SelectTrigger>
          <SelectContent>
            {versions.map(version => (
              <SelectItem key={version.id} value={version.id}>
                Version {version.version_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !selectedVersionId ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Select a version to view deployment history.
          </CardContent>
        </Card>
      ) : deployments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No deployments found for this version. Deploy to an environment to see history.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {deployments.map(deployment => (
            <Card key={deployment.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-4 w-4" />
                      <h3 className="font-semibold">
                        Deployment to {deployment.environment}
                      </h3>
                      {getStatusBadge(deployment.status)}
                      {getEnvironmentBadge(deployment.environment)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Deployed on {new Date(deployment.deployed_at).toLocaleString()}
                    </p>
                    {deployment.deployment_url && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={deployment.deployment_url} target="_blank" rel="noopener noreferrer">
                            View Deployment
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
