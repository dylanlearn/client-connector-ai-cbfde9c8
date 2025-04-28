
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, GitPullRequest, Tag, Code, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DesignWorkflowService } from '@/services/design-workflow/design-workflow-service';
import type { DesignVersionControl } from '@/types/design-workflow';

interface DesignVersionManagerProps {
  projectId: string;
  designId?: string;
}

export function DesignVersionManager({ projectId, designId }: DesignVersionManagerProps) {
  const [versions, setVersions] = useState<DesignVersionControl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [versionNumber, setVersionNumber] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (designId) {
      loadVersions();
    }
  }, [designId]);

  const loadVersions = async () => {
    if (!designId) return;

    setIsLoading(true);
    try {
      const data = await DesignWorkflowService.getDesignVersions(designId);
      setVersions(data);
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

  const createVersion = async () => {
    if (!designId || !versionNumber || !commitMessage) return;

    setIsCreating(true);
    try {
      await DesignWorkflowService.createDesignVersion(designId, versionNumber, commitMessage);
      setShowDialog(false);
      setVersionNumber('');
      setCommitMessage('');
      loadVersions();
      toast({
        title: "Version created",
        description: `Design version ${versionNumber} has been created successfully.`,
      });
    } catch (error) {
      console.error("Error creating version:", error);
      toast({
        title: "Error creating version",
        description: "Failed to create design version. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'committed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Committed</Badge>;
      case 'deployed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Deployed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Design Versions</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={loadVersions} disabled={isLoading || !designId}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={!designId}>Create Version</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Version</DialogTitle>
                <DialogDescription>
                  Create a new version of your design to track changes and deployments.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="version">Version Number</Label>
                  <Input 
                    id="version" 
                    value={versionNumber} 
                    onChange={(e) => setVersionNumber(e.target.value)}
                    placeholder="e.g., 1.0.0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Commit Message</Label>
                  <Input 
                    id="message" 
                    value={commitMessage} 
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Describe your changes"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button onClick={createVersion} disabled={isCreating || !versionNumber || !commitMessage}>
                  {isCreating ? "Creating..." : "Create Version"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !designId ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Select a design to view version history.
          </CardContent>
        </Card>
      ) : versions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No versions found for this design. Create a new version to track changes.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {versions.map(version => (
            <Card key={version.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <h3 className="font-semibold">Version {version.version_number}</h3>
                      {getStatusBadge(version.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {version.commit_message || 'No commit message provided'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created on {new Date(version.created_at).toLocaleString()}
                    </p>
                    {version.commit_hash && (
                      <div className="flex items-center gap-2 mt-1">
                        <Code className="h-3 w-3 text-muted-foreground" />
                        <code className="text-xs bg-slate-100 p-1 rounded">
                          {version.commit_hash.substring(0, 7)}
                        </code>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-x-2">
                    {version.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        <GitPullRequest className="h-4 w-4 mr-2" />
                        Create PR
                      </Button>
                    )}
                    {version.pull_request_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={version.pull_request_url} target="_blank" rel="noopener noreferrer">
                          <GitPullRequest className="h-4 w-4 mr-2" />
                          View PR
                        </a>
                      </Button>
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
